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

    const prompt = `You are a professional resume consultant. Given a candidate's resume data and a target opportunity, rewrite the resume sections to maximize compatibility.

CANDIDATE RESUME:
Name: ${resume.name}
Skills: ${resume.skills?.join(", ") || "None listed"}
Projects: ${resume.projects?.join("; ") || "None listed"}
Raw Text: ${resume.rawText?.substring(0, 2000) || "N/A"}

TARGET OPPORTUNITY:
Title: ${opportunity.title}
Company: ${opportunity.company}
Type: ${opportunity.type}
Description: ${opportunity.description}
Required Skills: ${opportunity.skills?.join(", ") || "Not specified"}

FORMAT THE OUTPUT LIKE A PROFESSIONAL RESUME with these sections:

1. SUMMARY: Write a 2-3 sentence professional summary tailored to this specific role, highlighting relevant experience and skills.

2. TECHNICAL SKILLS: Organize into 2-3 categories (e.g., "Product & UX", "AI & Technical Literacy", "Languages & Frameworks"). Each category should list relevant skills, prioritizing those matching the opportunity.

3. PROJECTS: Reframe each project with bullet-point descriptions emphasizing transferable experience relevant to the target role. Use action verbs and quantify impact where possible.

4. TIPS: Brief explanation of what you changed and why.

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
              description: "Return the tailored resume data",
              parameters: {
                type: "object",
                properties: {
                  summary: { type: "string", description: "Tailored professional summary (2-3 sentences)" },
                  technicalSkills: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        category: { type: "string", description: "Skill category name like 'Product & UX' or 'Languages & Frameworks'" },
                        skills: {
                          type: "array",
                          items: { type: "string" },
                          description: "Skills in this category",
                        },
                      },
                      required: ["category", "skills"],
                      additionalProperties: false,
                    },
                    description: "Categorized technical skills",
                  },
                  projects: {
                    type: "array",
                    items: { type: "string" },
                    description: "Reframed project descriptions with action verbs and quantified impact",
                  },
                  tips: { type: "string", description: "Explanation of changes made and why" },
                },
                required: ["summary", "technicalSkills", "projects", "tips"],
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
    console.error("tailor-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
