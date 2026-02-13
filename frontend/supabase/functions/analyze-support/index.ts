import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalysisRequest {
  message: string;
  customerContext?: {
    name?: string;
    previousInteractions?: number;
    lifetimeValue?: number;
  };
}

interface AnalysisResponse {
  intent: string;
  sentiment: "positive" | "neutral" | "negative" | "frustrated";
  sentimentScore: number;
  priority: "low" | "medium" | "high" | "urgent";
  suggestedResponse: string;
  suggestedActions: string[];
  churnRisk: "low" | "medium" | "high";
  summary: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, customerContext }: AnalysisRequest = await req.json();

    if (!message) {
      throw new Error("Message is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing support message:", message.substring(0, 100) + "...");

    const systemPrompt = `You are an AI Customer Support Analyst (2035 Edition). Your job is to analyze customer messages and provide structured insights.

Analyze the customer message and return a JSON object with the following fields:
- intent: The primary intent of the customer (e.g., "Order Tracking", "Refund Request", "Billing Query", "Product Inquiry", "Complaint", "Account Help", "Cancellation", "Upgrade Request", "Technical Support", "Feedback")
- sentiment: One of "positive", "neutral", "negative", or "frustrated"
- sentimentScore: A number from 0 to 100 representing sentiment intensity (100 = very positive, 0 = very negative)
- priority: One of "low", "medium", "high", or "urgent" based on issue severity and customer emotion
- suggestedResponse: A helpful, empathetic response to send to the customer (2-3 sentences)
- suggestedActions: An array of 2-3 actions the agent should take (e.g., "Process refund", "Send tracking link", "Escalate to manager")
- churnRisk: One of "low", "medium", or "high" based on customer satisfaction indicators
- summary: A brief 1-sentence summary of the customer's issue

${customerContext ? `
Customer Context:
- Name: ${customerContext.name || "Unknown"}
- Previous Interactions: ${customerContext.previousInteractions || 0}
- Lifetime Value: ${customerContext.lifetimeValue ? "₹" + customerContext.lifetimeValue : "Unknown"}
` : ""}

Respond ONLY with the JSON object, no additional text or markdown.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    console.log("AI Response received:", aiResponse?.substring(0, 200));

    // Parse the JSON response from the AI
    let analysis: AnalysisResponse;
    try {
      // Clean the response in case it has markdown code blocks
      const cleanedResponse = aiResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      analysis = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Return a fallback analysis
      analysis = {
        intent: "General Inquiry",
        sentiment: "neutral",
        sentimentScore: 50,
        priority: "medium",
        suggestedResponse: "Thank you for reaching out. Let me look into this for you right away.",
        suggestedActions: ["Review customer message", "Provide appropriate response"],
        churnRisk: "low",
        summary: "Customer has a general inquiry that needs attention."
      };
    }

    console.log("Analysis complete:", analysis.intent, analysis.sentiment);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-support function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
