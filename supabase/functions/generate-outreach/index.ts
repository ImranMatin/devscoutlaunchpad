import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resume, opportunity } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const hasResume = resume && resume.name;
    const candidateInfo = hasResume
      ? `Candidate: ${resume.name}, Skills: ${resume.skills.join(", ")}, Projects: ${resume.projects.join(", ")}`
      : "No resume provided - write generic but compelling outreach.";

    const toneGuide = opportunity.type === "hackathon"
      ? "Use an energetic, creative tone. Show passion for building and hacking."
      : "Use a professional, concise tone. Emphasize value and results.";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert career coach who writes compelling outreach. ${toneGuide} Avoid "AI-speak" - no "leveraging", "synergies", "passionate about". Be human, specific, and memorable. Use a hook from the candidate's background when available.`
          },
          {
            role: "user",
            content: `${candidateInfo}

Opportunity: ${opportunity.title} at ${opportunity.company}
Type: ${opportunity.type}
Description: ${opportunity.description}

Generate outreach materials.`
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "outreach_draft",
            description: "Return outreach materials",
            parameters: {
              type: "object",
              properties: {
                pitch: { type: "string", description: "3-sentence high-impact intro pitch with a hook" },
                linkedinMessage: { type: "string", description: "200-character LinkedIn connection request" },
                email: {
                  type: "object",
                  properties: {
                    subject: { type: "string" },
                    body: { type: "string", description: "Professional cold email body, 3-4 paragraphs" },
                  },
                  required: ["subject", "body"],
                  additionalProperties: false,
                },
              },
              required: ["pitch", "linkedinMessage", "email"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "outreach_draft" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI error:", response.status, errText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const parsed = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-outreach error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
