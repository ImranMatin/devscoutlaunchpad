import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
    const { resumeText, fileName } = body;
    if (typeof resumeText !== "string" || resumeText.length === 0 || resumeText.length > 50000) {
      return new Response(JSON.stringify({ error: "Invalid input: resumeText must be a string up to 50000 characters" }), { status: 400, headers: corsHeaders });
    }
    if (typeof fileName !== "string" || fileName.length === 0 || fileName.length > 255) {
      return new Response(JSON.stringify({ error: "Invalid input: fileName must be a string up to 255 characters" }), { status: 400, headers: corsHeaders });
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
            content: `You are a resume parser. Extract ALL structured information from the resume exactly as written. Do NOT invent or fabricate any information. Only extract what is explicitly stated in the resume text.

Extract these fields:
- name: full name
- contactInfo: { email, phone, location } - extract exactly as written
- links: { portfolio, linkedin, github } - extract URLs or labels exactly as written
- skills: array of ALL technical skills mentioned (preserve exact wording)
- projects: array of project names/titles with their descriptions (preserve exact text)
- experience: array of { company, role, dates, bullets } - preserve all bullet points exactly
- education: array of { institution, degree, dates }
- hackathons: array of { name, achievement, description } - preserve hackathon names and achievements exactly
- rawText: brief 2-sentence summary of the candidate

CRITICAL: Do NOT add any information that is not in the resume. Preserve all text exactly as written.`
          },
          { role: "user", content: `Parse this resume (file: ${fileName}):\n\n${resumeText.substring(0, 8000)}` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "parse_resume",
            description: "Return structured resume data with all sections preserved exactly",
            parameters: {
              type: "object",
              properties: {
                name: { type: "string" },
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
                skills: { type: "array", items: { type: "string" } },
                projects: { type: "array", items: { type: "string" } },
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
                rawText: { type: "string" },
              },
              required: ["name", "contactInfo", "links", "skills", "projects", "experience", "education", "hackathons", "rawText"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "parse_resume" } },
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
    console.error("analyze-resume error:", e);
    return new Response(JSON.stringify({ error: "Request failed. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
