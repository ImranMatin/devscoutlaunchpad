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

export interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
}

export interface ResumeLinks {
  portfolio?: string;
  linkedin?: string;
  github?: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  dates: string;
  bullets: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  dates: string;
}

export interface HackathonEntry {
  name: string;
  achievement: string;
  description: string;
}

export interface ResumeData {
  name: string;
  contactInfo: ContactInfo;
  links: ResumeLinks;
  skills: string[];
  projects: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  hackathons: HackathonEntry[];
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
  technicalSkills: {
    category: string;
    skills: string[];
  }[];
  experience: ExperienceEntry[];
  projects: string[];
  hackathons: HackathonEntry[];
  education: EducationEntry[];
  contactInfo: ContactInfo;
  links: ResumeLinks;
  tips: string;
}

export interface CoverLetterData {
  coverLetter: string;
  subject: string;
}
