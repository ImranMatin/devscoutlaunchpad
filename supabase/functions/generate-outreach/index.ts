import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function validateOpportunity(opp: any): boolean {
  return opp && typeof opp === "object" && typeof opp.title === "string" && typeof opp.company === "string" && typeof opp.description === "string";
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
    if (!validateOpportunity(opportunity)) {
      return new Response(JSON.stringify({ error: "Invalid input: opportunity must include title, company, and description" }), { status: 400, headers: corsHeaders });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const hasResume = resume && typeof resume === "object" && typeof resume.name === "string";
    const candidateInfo = hasResume
      ? `Candidate: ${String(resume.name).substring(0, 200)}, Skills: ${(resume.skills || []).map(String).join(", ").substring(0, 2000)}, Projects: ${(resume.projects || []).map(String).join(", ").substring(0, 2000)}`
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

Opportunity: ${String(opportunity.title).substring(0, 200)} at ${String(opportunity.company).substring(0, 200)}
Type: ${String(opportunity.type || "").substring(0, 100)}
Description: ${String(opportunity.description).substring(0, 3000)}

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
    console.error("generate-outreach error:", e);
    return new Response(JSON.stringify({ error: "Request failed. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
