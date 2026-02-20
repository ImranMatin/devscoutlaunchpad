export type OpportunityType = "hackathon" | "internship" | "job";

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: OpportunityType;
  deadline: string; // ISO date
  description: string;
  skills: string[];
  url: string;
  isLatest?: boolean;
  matchScore?: number;
}

export interface ResumeData {
  name: string;
  skills: string[];
  projects: string[];
  rawText: string;
}

export interface SmartMatchResult {
  score: number;
  highlights: string[];
  skillGap: string;
}

export interface OutreachDraft {
  pitch: string;
  linkedinMessage: string;
  email: { subject: string; body: string };
}
