export type JobSource = "greenhouse" | "lever" | "remoteok" | "adzuna" | "manual";
export type JobStatus = "new" | "saved" | "applied" | "interviewing" | "rejected" | "offer" | "dismissed";
export type DraftType = "cover_letter" | "outreach";

export interface JobDraft {
  id: string;
  type: DraftType;
  text: string;
  cvVersion: string;
  createdAt: string;
}

export interface Job {
  id: string;
  externalId: string;
  source: JobSource;
  title: string;
  company: string;
  description: string;
  location: string | null;
  remote: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string | null;
  employmentType: string | null;
  publishedAt: string | null;
  discoveredAt: string;
  applicationUrl: string;
  deadline: string | null;
  status: JobStatus;
  savedReason: string;
  priority: "low" | "medium" | "high";
  missingRequirements: string;
  nextAction: string;
  appliedAt: string | null;
  cvVersion: string;
  cvText: string;
  contactPerson: string;
  contactContext: string;
  followUpAt: string | null;
  interviewNotes: string;
  response: string;
  rejectionReason: string;
  compensationDiscussed: string;
  drafts: JobDraft[];
}

export const JOB_STATUSES: JobStatus[] = [
  "new", "saved", "applied", "interviewing", "rejected", "offer", "dismissed",
];

export const createEmptyJob = (): Job => ({
  id: crypto.randomUUID(),
  externalId: "",
  source: "manual",
  title: "",
  company: "",
  description: "",
  location: null,
  remote: false,
  salaryMin: null,
  salaryMax: null,
  currency: "USD",
  employmentType: null,
  publishedAt: null,
  discoveredAt: new Date().toISOString(),
  applicationUrl: "",
  deadline: null,
  status: "new",
  savedReason: "",
  priority: "medium",
  missingRequirements: "",
  nextAction: "Review the role and decide whether to apply",
  appliedAt: null,
  cvVersion: "",
  cvText: "",
  contactPerson: "",
  contactContext: "",
  followUpAt: null,
  interviewNotes: "",
  response: "",
  rejectionReason: "",
  compensationDiscussed: "",
  drafts: [],
});
