import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, type, platform, time } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating script for:", { title, type, platform });

    const systemPrompt = `You are an expert social media content creator and copywriter. Generate engaging, viral-worthy content scripts for influencers.

Your scripts should include:
- A compelling hook (first 3 seconds)
- Main content with clear talking points
- Call-to-action
- Relevant hashtag suggestions
- Best practices for the specific platform

Format the output clearly with sections. Be creative, trendy, and authentic.`;

    const userPrompt = `Create a complete ${type} script for ${platform} with the following details:

Title/Topic: "${title}"
Scheduled Time: ${time}
Content Type: ${type}

Generate a full production-ready script including:
1. HOOK (attention-grabbing opening)
2. MAIN CONTENT (detailed talking points/script)
3. CALL TO ACTION (engagement prompt)
4. CAPTION (for posting)
5. HASHTAGS (10 relevant hashtags)
6. TIPS (platform-specific tips for this content)`;

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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate script");
    }

    const data = await response.json();
    const script = data.choices?.[0]?.message?.content;

    console.log("Script generated successfully");

    return new Response(JSON.stringify({ script }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating script:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
