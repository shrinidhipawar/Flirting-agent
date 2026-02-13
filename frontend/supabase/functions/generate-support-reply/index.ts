import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReplyRequest {
  customerMessage: string;
  customerName?: string;
  intent?: string;
  sentiment?: string;
  businessContext?: {
    companyName?: string;
    industry?: string;
    tone?: "professional" | "friendly" | "empathetic" | "casual";
  };
  conversationHistory?: Array<{ role: "customer" | "agent"; content: string }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      customerMessage, 
      customerName, 
      intent, 
      sentiment,
      businessContext,
      conversationHistory 
    }: ReplyRequest = await req.json();

    if (!customerMessage) {
      throw new Error("Customer message is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating support reply for:", customerMessage.substring(0, 100));

    const tone = businessContext?.tone || "professional";
    const companyName = businessContext?.companyName || "our company";

    const systemPrompt = `You are an AI Customer Support Agent (2035 Edition) for ${companyName}. 
Your role is to provide helpful, accurate, and empathetic responses to customer inquiries.

Guidelines:
- Tone: ${tone} and always empathetic
- Personalize responses when customer name is available
- Acknowledge the customer's feelings if they are frustrated or upset
- Provide clear, actionable solutions
- Keep responses concise but thorough (2-4 sentences typically)
- Never make promises you can't keep
- If unsure, offer to escalate to a human agent
- Use natural language, avoid robotic phrases

${intent ? `Detected Intent: ${intent}` : ""}
${sentiment ? `Customer Sentiment: ${sentiment}` : ""}
${customerName ? `Customer Name: ${customerName}` : ""}

Generate a professional, helpful response that addresses the customer's needs.`;

    const messages = [
      { role: "system", content: systemPrompt }
    ];

    // Add conversation history if available
    if (conversationHistory && conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        messages.push({
          role: msg.role === "customer" ? "user" : "assistant",
          content: msg.content
        });
      }
    }

    // Add the current customer message
    messages.push({ role: "user", content: customerMessage });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
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
    const generatedReply = data.choices[0]?.message?.content;

    console.log("Generated reply:", generatedReply?.substring(0, 100));

    // Also generate quick action suggestions
    const actionsPrompt = `Based on this customer support conversation, suggest 3 quick action buttons that would be helpful.
Customer message: "${customerMessage}"
${intent ? `Intent: ${intent}` : ""}

Return ONLY a JSON array of 3 short action labels (3-4 words each), like:
["Send tracking link", "Process refund", "Escalate to manager"]`;

    const actionsResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: "You are a helpful assistant that returns only JSON arrays." },
          { role: "user", content: actionsPrompt }
        ],
      }),
    });

    let suggestedActions = ["Mark as resolved", "Send follow-up", "Escalate"];
    
    if (actionsResponse.ok) {
      const actionsData = await actionsResponse.json();
      const actionsContent = actionsData.choices[0]?.message?.content;
      try {
        const cleanedActions = actionsContent
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        suggestedActions = JSON.parse(cleanedActions);
      } catch {
        console.log("Using default actions");
      }
    }

    return new Response(
      JSON.stringify({ 
        reply: generatedReply,
        suggestedActions 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-support-reply function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
