
# Add "Auto-Tailor Resume" Feature and Verify Smart Match Flow

## Overview
The Resume Improvement Tips already exist in the AI Command Center -- they appear after you click an opportunity card, then click "Analyze Compatibility" (requires a resume uploaded first). The tips show below the Skill Gap section.

This plan adds a new **"Tailor My Resume"** button that uses AI to automatically rewrite your resume summary, skills, and project descriptions to better match a specific opportunity.

## What You'll Get
- A "Tailor My Resume" button that appears after Smart Match analysis completes
- AI-generated tailored resume text optimized for the selected opportunity
- Ability to copy the tailored resume or save it to your profile
- The tailored version highlights relevant skills and reframes projects to match the job description

---

## Technical Details

### 1. New Edge Function: `tailor-resume`

Create `supabase/functions/tailor-resume/index.ts` that:
- Accepts `resume` (ResumeData) and `opportunity` (Opportunity) in the request body
- Calls the AI gateway with a prompt instructing it to rewrite the resume summary, reorder/emphasize skills, and reframe project descriptions to align with the opportunity
- Returns a structured `TailoredResume` object containing:
  - `summary` -- a rewritten professional summary
  - `skills` -- reordered/augmented skills list highlighting relevant ones
  - `projects` -- reframed project descriptions emphasizing transferable experience
  - `tips` -- short explanation of what was changed and why

### 2. New Type: `TailoredResume`

Add to `src/lib/types.ts`:
```
interface TailoredResume {
  summary: string;
  skills: string[];
  projects: string[];
  tips: string;
}
```

### 3. Update `AICommandCenter.tsx`

- Add state for `tailoredResume` and `loadingTailor`
- After the Resume Improvement Tips section, add a "Tailor My Resume" button
- When clicked, call `supabase.functions.invoke("tailor-resume", ...)`
- Display the result in an expandable section with:
  - Tailored summary text with copy button
  - Updated skills list
  - Reframed project bullets
  - A "Save to Profile" button that updates the user's profile with the tailored data
  - A "Copy All" button to copy the full tailored resume text

### 4. File Changes Summary

| File | Action |
|------|--------|
| `supabase/functions/tailor-resume/index.ts` | New -- AI edge function for resume tailoring |
| `src/lib/types.ts` | Add `TailoredResume` interface |
| `src/components/AICommandCenter.tsx` | Add tailor button, display tailored results, save/copy actions |
| `supabase/config.toml` | Add `tailor-resume` function config with `verify_jwt = false` |
