import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  leadContext?: {
    name: string;
    company?: string;
    status?: string;
    score?: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [], leadContext }: ChatRequest = await req.json();
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a helpful WhatsApp sales assistant for a business. You help with:
- Answering customer inquiries about products and services
- Qualifying leads and understanding their needs
- Scheduling meetings and demos
- Providing pricing information
- Following up on leads
- Handling objections professionally

${leadContext ? `Current lead context:
- Name: ${leadContext.name}
- Company: ${leadContext.company || 'Unknown'}
- Status: ${leadContext.status || 'New Lead'}
- Lead Score: ${leadContext.score || 0}/100` : ''}

Guidelines:
- Be friendly, professional, and conversational
- Keep responses concise (WhatsApp style)
- Use emojis sparingly but appropriately
- Ask clarifying questions when needed
- Always try to move the conversation toward a conversion (meeting, demo, purchase)
- If you don't know something, be honest and offer to connect them with a human agent`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    console.log('Sending request to Lovable AI Gateway...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add funds to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    console.log('AI response received successfully');

    // Generate suggested quick actions based on the conversation
    const actionsResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'Based on the conversation, suggest 2-3 quick action buttons. Return ONLY a JSON array of strings with short action labels (max 3 words each). Example: ["Schedule Demo", "Send Pricing", "Add to CRM"]'
          },
          {
            role: 'user',
            content: `Customer message: ${message}\nAI response: ${aiResponse}`
          }
        ],
      }),
    });

    let suggestedActions: string[] = [];
    if (actionsResponse.ok) {
      const actionsData = await actionsResponse.json();
      const actionsContent = actionsData.choices?.[0]?.message?.content;
      try {
        const cleanedContent = actionsContent.replace(/```json\n?|```\n?/g, '').trim();
        suggestedActions = JSON.parse(cleanedContent);
      } catch (e) {
        console.log('Could not parse actions:', e);
        suggestedActions = ['Send Proposal', 'Schedule Call', 'Add Note'];
      }
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      suggestedActions 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in whatsapp-ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
