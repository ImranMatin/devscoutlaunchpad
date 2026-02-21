import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function validateResume(resume: any): boolean {
  return resume && typeof resume === "object" && typeof resume.name === "string";
}

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
    const { resume, opportunity } = body;
    if (!validateResume(resume)) {
      return new Response(JSON.stringify({ error: "Invalid input: resume must include name" }), { status: 400, headers: corsHeaders });
    }
    if (!validateOpportunity(opportunity)) {
      return new Response(JSON.stringify({ error: "Invalid input: opportunity must include title, company, and description" }), { status: 400, headers: corsHeaders });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const experienceText = (resume.experience || [])
      .map((e: any) => `${e.role} at ${e.company} (${e.dates}): ${e.bullets?.join("; ")}`)
      .join("\n");
    const educationText = (resume.education || [])
      .map((e: any) => `${e.institution} - ${e.degree} (${e.dates})`)
      .join("\n");
    const hackathonText = (resume.hackathons || [])
      .map((h: any) => `${h.name} - ${h.achievement}: ${h.description}`)
      .join("\n");

    const prompt = `You are a professional resume consultant. Given a candidate's REAL resume data and a target opportunity, tailor ONLY the summary and technical skills to match the role. PRESERVE all other sections EXACTLY as they are.

CANDIDATE RESUME:
Name: ${String(resume.name).substring(0, 200)}
Contact: ${String(resume.contactInfo?.email || "").substring(0, 200)} | ${String(resume.contactInfo?.phone || "").substring(0, 50)} | ${String(resume.contactInfo?.location || "").substring(0, 200)}
Links: Portfolio: ${String(resume.links?.portfolio || "N/A").substring(0, 500)} | LinkedIn: ${String(resume.links?.linkedin || "N/A").substring(0, 500)} | GitHub: ${String(resume.links?.github || "N/A").substring(0, 500)}
Skills: ${(resume.skills || []).map(String).join(", ").substring(0, 2000)}
Experience:
${experienceText.substring(0, 5000) || "None"}
Education:
${educationText.substring(0, 2000) || "None"}
Hackathons:
${hackathonText.substring(0, 2000) || "None"}
Projects: ${(resume.projects || []).map(String).join("; ").substring(0, 3000)}
Raw Text: ${String(resume.rawText || "N/A").substring(0, 2000)}

TARGET OPPORTUNITY:
Title: ${String(opportunity.title).substring(0, 200)}
Company: ${String(opportunity.company).substring(0, 200)}
Type: ${String(opportunity.type || "").substring(0, 100)}
Description: ${String(opportunity.description).substring(0, 3000)}
Required Skills: ${(opportunity.skills || []).map(String).join(", ").substring(0, 2000)}

INSTRUCTIONS:
1. SUMMARY: Write a tailored 2-3 sentence professional summary for this specific role.
2. TECHNICAL SKILLS: Reorganize the candidate's EXISTING skills into 2-3 categories, prioritizing those matching the opportunity. Do NOT invent new skills.
3. EXPERIENCE: Rewrite ONLY the bullet points for each experience entry using Google's X,Y,Z method: "Accomplished [X] as measured by [Y], by doing [Z]." Start each bullet with a strong action verb. Include quantifiable metrics where appropriate. PRESERVE the company, role, and dates EXACTLY. Do NOT add or remove any experience entries.
4. PROJECTS: Return the candidate's projects EXACTLY as provided.
5. HACKATHONS: Return the candidate's hackathon entries EXACTLY as provided.
6. EDUCATION: Return the candidate's education EXACTLY as provided.
7. CONTACT INFO & LINKS: Pass through exactly as provided.
8. TIPS: Brief explanation of what you tailored and why.

CRITICAL: Do NOT fabricate any projects, experience, hackathons, or education.

You MUST respond using the tailor_resume tool.`;

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
              name: "tailor_resume",
              description: "Return the tailored resume data preserving all original sections",
              parameters: {
                type: "object",
                properties: {
                  summary: { type: "string" },
                  technicalSkills: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        category: { type: "string" },
                        skills: { type: "array", items: { type: "string" } },
                      },
                      required: ["category", "skills"],
                      additionalProperties: false,
                    },
                  },
                  experience: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        company: { type: "string" },
                        role: { type: "string" },
                        dates: { type: "string" },
                        bullets: { type: "array", items: { type: "string" } },
                      },
                      required: ["company", "role", "dates", "bullets"],
                      additionalProperties: false,
                    },
                  },
                  projects: { type: "array", items: { type: "string" } },
                  hackathons: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        achievement: { type: "string" },
                        description: { type: "string" },
                      },
                      required: ["name", "achievement", "description"],
                      additionalProperties: false,
                    },
                  },
                  education: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        institution: { type: "string" },
                        degree: { type: "string" },
                        dates: { type: "string" },
                      },
                      required: ["institution", "degree", "dates"],
                      additionalProperties: false,
                    },
                  },
                  contactInfo: {
                    type: "object",
                    properties: {
                      email: { type: "string" },
                      phone: { type: "string" },
                      location: { type: "string" },
                    },
                    additionalProperties: false,
                  },
                  links: {
                    type: "object",
                    properties: {
                      portfolio: { type: "string" },
                      linkedin: { type: "string" },
                      github: { type: "string" },
                    },
                    additionalProperties: false,
                  },
                  tips: { type: "string" },
                },
                required: ["summary", "technicalSkills", "experience", "projects", "hackathons", "education", "contactInfo", "links", "tips"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "tailor_resume" } },
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
    console.error("tailor-resume error:", e);
    return new Response(JSON.stringify({ error: "Request failed. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
