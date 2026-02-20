import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume, opportunity } = await req.json();
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
Name: ${resume.name}
Contact: ${resume.contactInfo?.email || ""} | ${resume.contactInfo?.phone || ""} | ${resume.contactInfo?.location || ""}
Links: Portfolio: ${resume.links?.portfolio || "N/A"} | LinkedIn: ${resume.links?.linkedin || "N/A"} | GitHub: ${resume.links?.github || "N/A"}
Skills: ${resume.skills?.join(", ") || "None listed"}
Experience:
${experienceText || "None"}
Education:
${educationText || "None"}
Hackathons:
${hackathonText || "None"}
Projects: ${resume.projects?.join("; ") || "None listed"}
Raw Text: ${resume.rawText?.substring(0, 2000) || "N/A"}

TARGET OPPORTUNITY:
Title: ${opportunity.title}
Company: ${opportunity.company}
Type: ${opportunity.type}
Description: ${opportunity.description}
Required Skills: ${opportunity.skills?.join(", ") || "Not specified"}

INSTRUCTIONS:
1. SUMMARY: Write a tailored 2-3 sentence professional summary for this specific role.
2. TECHNICAL SKILLS: Reorganize the candidate's EXISTING skills into 2-3 categories, prioritizing those matching the opportunity. Do NOT invent new skills.
3. EXPERIENCE: Rewrite ONLY the bullet points for each experience entry using Google's X,Y,Z method: "Accomplished [X] as measured by [Y], by doing [Z]." Start each bullet with a strong action verb (e.g., Engineered, Spearheaded, Optimized, Architected, Delivered, Automated, Reduced, Increased). Include quantifiable metrics where appropriate (percentages, numbers, time saved, users impacted). PRESERVE the company, role, and dates EXACTLY. Do NOT add or remove any experience entries.
4. PROJECTS: Return the candidate's projects EXACTLY as provided. Do NOT modify, add, or remove any projects.
5. HACKATHONS: Return the candidate's hackathon entries EXACTLY as provided.
6. EDUCATION: Return the candidate's education EXACTLY as provided.
7. CONTACT INFO & LINKS: Pass through exactly as provided.
8. TIPS: Brief explanation of what you tailored and why.

CRITICAL: Do NOT fabricate any projects, experience, hackathons, or education. Only tailor the summary, skill categorization, and rewrite experience bullets using the X,Y,Z format with real information from the candidate's resume.

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
                  summary: { type: "string", description: "Tailored professional summary (2-3 sentences)" },
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
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
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
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
