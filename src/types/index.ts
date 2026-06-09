export interface PersonalInfo {
  name: string;
  nameShort: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  github: string;
  githubUser: string;
  linkedin: string;
  location: string;
  locationShort: string;
  availability: boolean;
  currentRole: string;
  currentCompany: string;
  resumeUrl: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface Skill {
  name: string;
  icon: string;
  proficiency: number;
  description?: string;
  experience?: string;
  domain?: 'OFFENSIVE' | 'CLOUD' | 'AUTOMATION' | 'COMPLIANCE';
}

export interface SkillCategory {
  category: string;
  color: 'cyan' | 'amber' | 'green' | 'violet';
  skills: Skill[];
}

export interface ExperienceSubsection {
  id: string;
  label: string;
  color: 'cyan' | 'amber' | 'green' | 'violet';
  bullets: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  period: string;
  periodShort: string;
  type: string;
  tags: string[];
  awards: string[];
  subsections: ExperienceSubsection[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'automation' | 'cloud' | 'security' | 'vapt';
  tags: string[];
  imageUrl: string;
  imageAlt: string;
  githubUrl: string;
  featured: boolean;
  year: number;
  impact: string;
  methodology?: string;
  terminalOutput?: { command: string, output: string[] }[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: number;
  color: 'cyan' | 'amber' | 'green' | 'violet';
  status: 'active' | 'expired' | 'in-progress';
  verifyUrl: string;
  expiry?: string;
  logo?: string;
  logoInvert?: boolean;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  grade: string;
}

// ── CTF / War Games ────────────────────────────────────────────
export interface CTFCompetition {
  name: string;
  year: number;
  placement: string;
  solved: number;
  tags: string[];
}

export interface CTFProfile {
  htbUsername: string;
  htbRank: string;
  htbPoints: number;
  htbUserOwns: number;
  htbRootOwns: number;
  htbChallengesSolved: number;
  globalPercentile: number; // e.g. top 10 = 10
  competitions: CTFCompetition[];
  attackCategories: { label: string; level: number }[]; // level 0-100
  recentActivity: { title: string; type: 'machine' | 'challenge'; difficulty: string; date: string }[];
}
