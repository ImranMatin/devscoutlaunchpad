import { Opportunity } from "./types";

export const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "AI for Good Hackathon 2026",
    company: "Devpost",
    type: "hackathon",
    location: "remote",
    deadline: "2026-03-15T23:59:00Z",
    description:
      "Build AI solutions addressing social challenges like healthcare access, climate change, and education equity. Open to all skill levels with mentorship from industry leaders. Teams of up to 4. Prizes worth $50,000 including cloud credits and incubator access.",
    skills: ["Python", "Machine Learning", "TensorFlow", "NLP"],
    url: "https://devpost.com",
    isLatest: true,
  },
  {
    id: "2",
    title: "Software Engineering Intern",
    company: "Stripe",
    type: "internship",
    location: "hybrid",
    deadline: "2026-03-01T23:59:00Z",
    description:
      "Join Stripe's payments infrastructure team for a 12-week summer internship. You'll work on distributed systems serving millions of API requests per day, contribute to production codebases in Go and TypeScript, and collaborate with senior engineers on latency-critical services. Includes housing stipend and relocation support.",
    skills: ["TypeScript", "Go", "Distributed Systems", "APIs"],
    url: "https://stripe.com/jobs",
    isLatest: true,
  },
  {
    id: "3",
    title: "MLH Global Hack Week",
    company: "MLH",
    type: "hackathon",
    location: "remote",
    deadline: "2026-02-28T23:59:00Z",
    description:
      "Week-long hacking event featuring daily coding challenges, live workshops on emerging tech, and mini-hackathons with themed tracks. Earn points on a global leaderboard and win swag. Great for beginners looking to build portfolio projects.",
    skills: ["Any Language", "Web Dev", "Mobile", "Data Science"],
    url: "https://mlh.io",
    isLatest: true,
  },
  {
    id: "4",
    title: "Full-Stack Developer",
    company: "Vercel",
    type: "job",
    location: "remote",
    deadline: "2026-04-01T23:59:00Z",
    description:
      "Build the future of web deployment as a full-stack developer at Vercel. You'll work on the Next.js framework, Edge Functions, and serverless infrastructure used by millions of developers. Requires strong experience with React, TypeScript, and Node.js. Competitive salary ($150K-$220K) with equity and full benefits.",
    skills: ["React", "Next.js", "TypeScript", "Node.js"],
    url: "https://vercel.com/careers",
  },
  {
    id: "5",
    title: "Data Science Intern",
    company: "Spotify",
    type: "internship",
    location: "onsite",
    deadline: "2026-03-20T23:59:00Z",
    description:
      "Work on recommendation algorithms and audio ML models powering Spotify's 600M+ users. You'll analyze large-scale listening data, build A/B testing frameworks, and present findings to product teams. Located at Spotify's Stockholm or New York office. Requires coursework in statistics and ML.",
    skills: ["Python", "SQL", "Machine Learning", "Statistics"],
    url: "https://lifeatspotify.com",
  },
  {
    id: "6",
    title: "Unstop Innovation Challenge",
    company: "Unstop",
    type: "hackathon",
    location: "hybrid",
    deadline: "2026-03-10T23:59:00Z",
    description:
      "India's largest innovation challenge sponsored by top enterprises. Solve real-world industry problems in fintech, supply chain, or sustainability. Shortlisted teams present to CXOs. Winners receive cash prizes up to ₹10 lakh plus pre-placement interview opportunities.",
    skills: ["Problem Solving", "Full Stack", "Cloud", "AI/ML"],
    url: "https://unstop.com",
    isLatest: true,
  },
];
