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
    const { resume, opportunity, tailoredResume } = await req.json();
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
Name: ${resume?.name || "Candidate"}
Summary: ${summaryInfo}
Skills: ${skillsInfo}
Projects/Achievements: ${projectsInfo}

TARGET OPPORTUNITY:
Title: ${opportunity.title}
Company: ${opportunity.company}
Type: ${opportunity.type}
Description: ${opportunity.description}
Required Skills: ${opportunity.skills?.join(", ") || "Not specified"}

INSTRUCTIONS:
- Write a professional cover letter (3-4 paragraphs)
- Opening: Hook with a specific achievement or passion relevant to the role
- Body: Connect candidate's skills and projects to the job requirements
- Closing: Express enthusiasm and call to action
- Tone: Professional but authentic, no clichés
- Do NOT use "Dear Hiring Manager" - use "Dear ${opportunity.company} Team"
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
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
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
    console.error("generate-cover-letter error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
