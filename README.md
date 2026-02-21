# DevScoutLaunchPad

> **AI-Powered Opportunity Discovery & Resume Intelligence Engine for Developers**

DevScoutLaunchPad is an AI-driven platform that helps developers, students, and early-career professionals discover relevant opportunities—hackathons, internships, and jobs—and prepare tailored application materials using intelligent resume analysis and Google's X,Y,Z methodology.

---

## The Problem

Developers and students waste hours manually searching across dozens of platforms for hackathons, internships, and job openings. When they find a match, they spend even more time customizing resumes and writing outreach messages for each opportunity. There's no unified tool that combines opportunity discovery with AI-powered application preparation.

## What We Built

DevScoutLaunchPad solves this by combining:

- **Smart Opportunity Feed** — A curated, filterable feed of hackathons, internships, and jobs.
- **Resume Brain** — An AI-powered resume parser that extracts and retains your exact resume data (education, experience, projects, hackathons, contact info, and social links) without fabrication.
- **AI Tailoring Engine** — Generates tailored resumes using Google's X,Y,Z bullet method ("Accomplished [X] as measured by [Y], by doing [Z]") with strong action verbs and quantifiable metrics.
- **Outreach Suite** — AI-generated cold emails, LinkedIn messages, and elevator pitches customized per opportunity.
- **Smart Match Scoring** — Calculates a fit score between your profile and each opportunity, highlighting skill gaps and resume tips.

---

## Table of Contents

- [Definitions](#definitions)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Backend Architecture](#backend-architecture)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Key Bug Fixes & Improvements](#key-bug-fixes--improvements)
- [Performance Optimizations](#performance-optimizations)
- [Design System](#design-system)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgement](#acknowledgement)
- [Support](#support)
- [Project Info](#project-info)

---

## Definitions

| Term | Description |
|------|-------------|
| **Resume Brain** | The AI module that parses uploaded PDF resumes and extracts structured data (skills, experience, education, projects, hackathons, contact info). |
| **Smart Match** | An AI scoring system that evaluates how well a candidate's profile matches a specific opportunity, returning a percentage score with highlights and skill gap analysis. |
| **X,Y,Z Method** | Google's recommended resume bullet format: "Accomplished [X] as measured by [Y], by doing [Z]." Used to rewrite experience bullets during tailoring. |
| **Outreach Suite** | AI-generated communication drafts including cold emails, LinkedIn messages, and elevator pitches tailored to specific opportunities. |
| **Tailored Resume** | A version of your resume with an optimized summary, reorganized skills, and X,Y,Z-formatted experience bullets—without fabricating any information. |
| **Cover Letter Generator** | Produces role-specific cover letters using your real resume data and the opportunity description. |

---

## Features

- **🔍 Opportunity Feed** — Browse and filter hackathons, internships, and jobs by type, location, and skills.
- **🧠 Resume Brain** — Upload your PDF resume; AI extracts and displays your name, contact info, LinkedIn/GitHub/portfolio links, skills, experience, education, projects, and hackathon achievements.
- **🎯 Smart Match** — One-click AI match scoring between your profile and any opportunity with actionable tips.
- **📝 Resume Tailoring** — AI rewrites your experience bullets using the X,Y,Z method with strong action verbs and metrics while preserving all other sections exactly.
- **✉️ Cover Letter Generation** — AI-crafted cover letters specific to each opportunity.
- **📨 Outreach Suite** — Generate personalized cold emails, LinkedIn messages, and elevator pitches.
- **📄 Export** — Download tailored resumes and cover letters as PDF or Word documents.
- **🔐 Authentication** — Secure email/password sign-up and sign-in with email verification.
- **🌐 Hackathons & Jobs Resource Hub** — External links to popular hackathon and job platforms.
- **📱 Responsive Sidebar Navigation** — Clean, intuitive navigation across all features.
- **🏠 Landing Page** — Public home page with hero section, feature grid, FAQ, and footer with company/connect links.
- **📞 Contact Page** — Public contact form with email and community links for user inquiries.
- **ℹ️ About Page** — Public page showcasing the platform's vision, mission, and feature offerings.
- **🦶 Global Footer** — Consistent footer across public pages with Company links (About, Contact, Privacy, Terms, License) and Connect links (GitHub, LinkedIn), branded for CodeMaster Academy.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui, Framer Motion |
| **State Management** | TanStack React Query, React Context |
| **Routing** | React Router v6 |
| **Backend** | Lovable Cloud (Edge Functions) |
| **Database** | PostgreSQL (via Lovable Cloud) |
| **AI Models** | Google Gemini (via Lovable AI gateway) |
| **PDF Parsing** | pdfjs-dist (client-side) |
| **PDF Export** | jsPDF |
| **Authentication** | Lovable Cloud Auth (email/password) |

---

## Project Structure

```
├── public/                          # Static assets
├── src/
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── AboutPage.tsx            # About page content
│   │   ├── AICommandCenter.tsx      # AI features panel (match, tailor, cover letter, outreach)
│   │   ├── AppSidebar.tsx           # Main sidebar navigation
│   │   ├── Footer.tsx               # Global footer (Company links, Connect links, CodeMaster Academy branding)
│   │   ├── NavLink.tsx              # Navigation link component
│   │   ├── OpportunityCard.tsx      # Opportunity display card
│   │   ├── ProtectedRoute.tsx       # Auth guard wrapper
│   │   ├── ResourcesPage.tsx        # Hackathons & jobs resource hub
│   │   └── ResumeUpload.tsx         # Resume upload & parsed data display
│   ├── hooks/
│   │   ├── useAuth.tsx              # Auth context provider & hook
│   │   ├── use-mobile.tsx           # Mobile detection hook
│   │   └── use-toast.ts             # Toast notification hook
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts            # Auto-generated client
│   │       └── types.ts             # Auto-generated DB types
│   ├── lib/
│   │   ├── opportunities.ts         # Opportunity data & helpers
│   │   ├── pdfExtract.ts            # PDF text extraction utility
│   │   ├── resumeDownload.ts        # PDF & Word export functions
│   │   ├── types.ts                 # TypeScript interfaces
│   │   └── utils.ts                 # Utility functions
│   ├── pages/
│   │   ├── About.tsx                # Public about page (wraps AboutPage component)
│   │   ├── Auth.tsx                 # Sign-in / Sign-up page
│   │   ├── Contact.tsx              # Public contact page with form
│   │   ├── HomePage.tsx             # Public landing page (hero, features, FAQ, footer)
│   │   ├── Index.tsx                # Main dashboard page
│   │   └── NotFound.tsx             # 404 page
│   ├── App.tsx                      # Root app with routes
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles & design tokens
├── supabase/
│   ├── functions/
│   │   ├── analyze-resume/          # Resume parsing edge function
│   │   ├── generate-cover-letter/   # Cover letter generation
│   │   ├── generate-outreach/       # Outreach drafts generation
│   │   ├── smart-match/             # Match scoring engine
│   │   └── tailor-resume/           # Resume tailoring with X,Y,Z method
│   └── config.toml                  # Backend configuration
├── tailwind.config.ts               # Tailwind configuration
├── vite.config.ts                   # Vite build configuration
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or Bun)

### Local Development

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Using Lovable

Visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting. Changes are committed automatically.

---

## Backend Architecture

DevScoutLaunchPad uses **Lovable Cloud** for all backend services. The architecture consists of:

### Edge Functions

| Function | Purpose |
|----------|---------|
| `analyze-resume` | Parses uploaded resume text using AI to extract structured data (name, contact, skills, experience, education, projects, hackathons, links). Strictly avoids fabrication. |
| `tailor-resume` | Generates a tailored resume: optimizes summary, reorganizes skills, and rewrites experience bullets using Google's X,Y,Z method. Preserves education, projects, hackathons, and contact info exactly. |
| `smart-match` | Calculates a match score (0-100) between a candidate's profile and an opportunity. Returns highlights, skill gaps, and actionable resume tips. |
| `generate-cover-letter` | Produces a professional cover letter and email subject line tailored to a specific opportunity using the candidate's real resume data. |
| `generate-outreach` | Generates three outreach formats: elevator pitch, LinkedIn connection message, and cold email—all personalized to the opportunity. |

### Data Flow

```
User uploads PDF → pdfjs-dist extracts text (client) → analyze-resume (edge function)
→ AI parses structured data → stored in profiles table → displayed in Resume Brain

User clicks opportunity → smart-match / tailor-resume / generate-cover-letter / generate-outreach
→ AI processes with real resume data → results displayed in AI Command Center
→ User can download as PDF or Word
```

---

## Database Schema

### `profiles` Table

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | UUID (PK) | References authenticated user |
| `name` | TEXT | Candidate's full name |
| `skills` | JSONB | Array of skill strings |
| `projects` | JSONB | Array of project descriptions |
| `raw_text` | TEXT | Original extracted resume text |
| `contact_info` | JSONB | Email, phone, location |
| `education` | JSONB | Array of education entries (institution, degree, dates) |
| `experience` | JSONB | Array of experience entries (company, role, dates, bullets) |
| `hackathons` | JSONB | Array of hackathon entries (name, achievement, description) |
| `links` | JSONB | Portfolio, LinkedIn, GitHub URLs |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

### `match_history` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Unique match record ID |
| `user_id` | UUID (FK) | References profiles.user_id |
| `opportunity_id` | TEXT | Matched opportunity identifier |
| `opportunity_title` | TEXT | Opportunity title for display |
| `score` | INTEGER | Match score (0-100) |
| `highlights` | JSONB | Array of match highlight strings |
| `skill_gap` | TEXT | Identified skill gaps |
| `created_at` | TIMESTAMPTZ | When the match was performed |

---

## Security Features

- **Row Level Security (RLS)** — All database tables have RLS enabled. Users can only read and write their own data.
- **Email Verification** — Users must verify their email address before signing in (auto-confirm is disabled).
- **Protected Routes** — All application routes (except `/auth`) are wrapped in `ProtectedRoute`, redirecting unauthenticated users to sign in.
- **No Direct API Key Exposure** — AI model calls are made through backend edge functions; no API keys are exposed to the client.
- **Input Validation** — Resume parsing includes safeguards against empty or malformed uploads.

---

## Key Bug Fixes & Improvements

| Issue | Fix |
|-------|-----|
| PDF files returned garbled text when using `file.text()` | Replaced with `pdfjs-dist` binary PDF parsing via `extractTextFromPDF()` |
| Resume data was not retained after upload | Fixed extraction pipeline to properly store structured data in the profiles table |
| Tailored resume contained fabricated projects | Updated AI prompts with strict "no fabrication" guardrails; projects, education, hackathons pass through unchanged |
| Experience bullets lacked impact | Implemented Google's X,Y,Z bullet method with strong action verbs and quantifiable metrics |
| Auth page showed old branding ("ScholarScout") | Updated to "DevScoutLaunchPad" |
| Missing contact info, education, and hackathons in tailored output | Extended the tailor-resume function to include all resume sections in output |

---

## Performance Optimizations

- **Client-Side PDF Parsing** — Resume text extraction happens in the browser using `pdfjs-dist`, reducing backend payload size and latency.
- **React Query Caching** — Profile data is fetched once and cached, avoiding redundant database calls across tab switches.
- **Lazy Component Loading** — The AI Command Center only renders when an opportunity is selected.
- **Framer Motion AnimatePresence** — Smooth transitions without layout thrashing.
- **Efficient Re-renders** — State is colocated near usage; the sidebar, feed, and AI panel update independently.

---

## Design System

DevScoutLaunchPad uses a dark-first design system with HSL-based semantic tokens defined in `src/index.css`:

| Token | Usage |
|-------|-------|
| `--background` | Page background |
| `--foreground` | Primary text |
| `--primary` | Brand accent (buttons, highlights) |
| `--secondary` | Secondary surfaces |
| `--muted` | Subdued backgrounds |
| `--muted-foreground` | Secondary text |
| `--accent` | Hover states, badges |
| `--card` | Card surfaces |
| `--border` | Borders and dividers |
| `--destructive` | Error states |

All components use Tailwind classes referencing these tokens (e.g., `bg-primary`, `text-foreground`). Custom `.glass-panel` and `.sidebar-gradient` utility classes provide consistent glassmorphism and gradient effects.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Backend API endpoint (auto-configured) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public client key (auto-configured) |
| `VITE_SUPABASE_PROJECT_ID` | Project identifier (auto-configured) |

> All environment variables are auto-managed by Lovable Cloud. No manual `.env` configuration is required.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "Add your feature"`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a Pull Request.

Please ensure your code follows the existing design system and uses semantic Tailwind tokens.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgement

- [Lovable](https://lovable.dev) — AI-powered development platform
- [shadcn/ui](https://ui.shadcn.com) — Accessible component library
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) — Animation library for React
- [pdfjs-dist](https://mozilla.github.io/pdf.js/) — Mozilla's PDF parsing library
- [jsPDF](https://github.com/parallax/jsPDF) — Client-side PDF generation
- [Google Gemini](https://deepmind.google/technologies/gemini/) — AI models powering resume analysis and tailoring

---

## Support

- **Issues:** Open an issue on the GitHub repository.
- **Questions:** Start a discussion in the repository's Discussions tab.
- **Lovable Help:** Visit [Lovable Documentation](https://docs.lovable.dev) for platform-specific guidance.

---

## Project Info

**Live URL:** [devscoutlaunchpad.lovable.app](https://devscoutlaunchpad.lovable.app)

Built with ❤️ using [Lovable](https://lovable.dev).
