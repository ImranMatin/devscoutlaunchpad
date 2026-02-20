export type OpportunityType = "hackathon" | "internship" | "job";
export type LocationType = "remote" | "hybrid" | "onsite";

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: OpportunityType;
  location: LocationType;
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
  resumeTips: string[];
}

export interface OutreachDraft {
  pitch: string;
  linkedinMessage: string;
  email: { subject: string; body: string };
}

export interface TailoredResume {
  summary: string;
  skills: string[];
  projects: string[];
  tips: string;
}
