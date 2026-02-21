import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function validateOpportunity(opp: any): boolean {
  return opp && typeof opp === "object" && typeof opp.title === "string" && typeof opp.company === "string" && typeof opp.description === "string";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

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
    const { resume, opportunity, tailoredResume } = body;
    if (!validateOpportunity(opportunity)) {
      return new Response(JSON.stringify({ error: "Invalid input: opportunity must include title, company, and description" }), { status: 400, headers: corsHeaders });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const skillsInfo = tailoredResume?.technicalSkills
      ? tailoredResume.technicalSkills.map((cat: any) => `${cat.category}: ${cat.skills.join(", ")}`).join("\n")
      : resume?.skills?.join(", ") || "Not provided";

    const projectsInfo = tailoredResume?.projects
      ? tailoredResume.projects.join("\n")
      : resume?.projects?.join(", ") || "Not provided";

    const summaryInfo = tailoredResume?.summary || resume?.rawText || "Not provided";

    const prompt = `You are a professional career coach. Write a compelling, personalized cover letter for the following candidate and job opportunity.

CANDIDATE INFO:
Name: ${String(resume?.name || "Candidate").substring(0, 200)}
Summary: ${String(summaryInfo).substring(0, 3000)}
Skills: ${String(skillsInfo).substring(0, 2000)}
Projects/Achievements: ${String(projectsInfo).substring(0, 2000)}

TARGET OPPORTUNITY:
Title: ${String(opportunity.title).substring(0, 200)}
Company: ${String(opportunity.company).substring(0, 200)}
Type: ${String(opportunity.type || "").substring(0, 100)}
Description: ${String(opportunity.description).substring(0, 3000)}
Required Skills: ${(opportunity.skills || []).map(String).join(", ").substring(0, 2000)}

INSTRUCTIONS:
- Write a professional cover letter (3-4 paragraphs)
- Opening: Hook with a specific achievement or passion relevant to the role
- Body: Connect candidate's skills and projects to the job requirements
- Closing: Express enthusiasm and call to action
- Tone: Professional but authentic, no clichés
- Do NOT use "Dear Hiring Manager" - use "Dear ${String(opportunity.company).substring(0, 200)} Team"
- Keep it under 400 words

You MUST respond using the generate_cover_letter tool.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_cover_letter",
              description: "Return the generated cover letter",
              parameters: {
                type: "object",
                properties: {
                  coverLetter: { type: "string", description: "The full cover letter text" },
                  subject: { type: "string", description: "Suggested email subject line for submitting this cover letter" },
                },
                required: ["coverLetter", "subject"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_cover_letter" } },
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status);
      throw new Error("AI gateway error");
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-cover-letter error:", e);
    return new Response(JSON.stringify({ error: "Request failed. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
