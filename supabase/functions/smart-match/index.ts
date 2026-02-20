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
            content: `You are a career matching expert. Compare a candidate's resume profile against an opportunity and provide a compatibility analysis. Be specific and actionable. Adapt tone: more creative for hackathons, more professional for corporate roles. Also provide concrete, actionable tips for how the candidate can tailor their resume to improve their match score for this specific opportunity.`
          },
          {
            role: "user",
            content: `CANDIDATE PROFILE:
Name: ${resume.name}
Skills: ${resume.skills.join(", ")}
Projects: ${resume.projects.join(", ")}
Summary: ${resume.rawText}

OPPORTUNITY:
Title: ${opportunity.title}
Company: ${opportunity.company}
Type: ${opportunity.type}
Location: ${opportunity.location}
Description: ${opportunity.description}
Required Skills: ${opportunity.skills.join(", ")}

Analyze the match. Provide a compatibility score, top highlights, a specific skill gap to bridge, and 3 actionable resume tips to improve the match score for this role.`
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "match_result",
            description: "Return compatibility analysis",
            parameters: {
              type: "object",
              properties: {
                score: { type: "number", description: "Compatibility score 0-100" },
                highlights: { type: "array", items: { type: "string" }, description: "Top 3 reasons they match" },
                skillGap: { type: "string", description: "One specific area to bridge" },
                resumeTips: { type: "array", items: { type: "string" }, description: "3 actionable tips to tailor the resume and improve the match score for this specific role" },
              },
              required: ["score", "highlights", "skillGap", "resumeTips"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "match_result" } },
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
    console.error("smart-match error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
