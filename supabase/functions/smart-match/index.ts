import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function validateResume(resume: any): boolean {
  return resume && typeof resume === "object" && typeof resume.name === "string" && Array.isArray(resume.skills) && Array.isArray(resume.projects);
}

function validateOpportunity(opp: any): boolean {
  return opp && typeof opp === "object" && typeof opp.title === "string" && typeof opp.company === "string" && typeof opp.description === "string" && Array.isArray(opp.skills);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    // Input validation
    const body = await req.json();
    const { resume, opportunity } = body;
    if (!validateResume(resume)) {
      return new Response(JSON.stringify({ error: "Invalid input: resume must include name, skills, and projects" }), { status: 400, headers: corsHeaders });
    }
    if (!validateOpportunity(opportunity)) {
      return new Response(JSON.stringify({ error: "Invalid input: opportunity must include title, company, description, and skills" }), { status: 400, headers: corsHeaders });
    }

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
Name: ${String(resume.name).substring(0, 200)}
Skills: ${resume.skills.map(String).join(", ").substring(0, 2000)}
Projects: ${resume.projects.map(String).join(", ").substring(0, 2000)}
Summary: ${String(resume.rawText || "").substring(0, 3000)}

OPPORTUNITY:
Title: ${String(opportunity.title).substring(0, 200)}
Company: ${String(opportunity.company).substring(0, 200)}
Type: ${String(opportunity.type || "").substring(0, 100)}
Location: ${String(opportunity.location || "").substring(0, 200)}
Description: ${String(opportunity.description).substring(0, 3000)}
Required Skills: ${opportunity.skills.map(String).join(", ").substring(0, 2000)}

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
      console.error("AI error:", response.status);
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
    return new Response(JSON.stringify({ error: "Request failed. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
