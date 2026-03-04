import type { BlockContent, BlockType } from "./types";

export type AIReportStatus = "draft" | "in-review" | "published";
export type ConfidenceLevel = "high" | "medium" | "low";
export type ReviewStatusValue = "pending" | "approved" | "changes-requested";
export type DataSourceType =
  | "dataset"
  | "survey"
  | "recording"
  | "notebook"
  | "other";
export type RelationshipType =
  | "prior-research"
  | "follow-up"
  | "related"
  | "supersedes";
export type FindingSeverity = "critical" | "major" | "minor" | "positive";

export interface Author {
  name: string;
  role: string;
  avatar_url?: string;
  profile_url?: string;
}

export interface AIContributor {
  model_name: string;
  model_id: string;
  role: string;
  description: string;
}

export interface PromptEntry {
  id: string;
  label: string;
  prompt_text: string;
  context?: string;
  agent: string;
  output_summary?: string;
}

export interface ReasoningSummary {
  id: string;
  finding_id: string;
  summary: string;
  confidence: ConfidenceLevel;
  reasoning_steps: string[];
}

export interface Methodology {
  overview: string;
  prompts: PromptEntry[];
  reasoning_summaries: ReasoningSummary[];
}

export interface SuggestedPerson {
  name: string;
  role: string;
  reason: string;
  expertise: string[];
  avatar_url?: string;
  profile_url?: string;
}

export interface Review {
  reviewer: string;
  status: ReviewStatusValue;
  comment?: string;
  reviewed_at?: string;
}

export interface RepoLink {
  url: string;
  label: string;
  description?: string;
}

export interface DataSource {
  label: string;
  url?: string;
  type: DataSourceType;
  description?: string;
}

export interface RelatedReport {
  id: string;
  title: string;
  relationship: RelationshipType;
}

export interface FindingContent {
  title: string;
  description: string;
  severity: FindingSeverity;
  recommendation?: string;
  prototype_repo?: string;
}

export type AIReportSectionType = BlockType | "finding";
export type AIReportSectionContent = BlockContent | FindingContent;

export interface AIReportSection {
  id: string;
  type: AIReportSectionType;
  position: number;
  content: AIReportSectionContent;
  reasoning?: ReasoningSummary;
  confidence?: ConfidenceLevel;
}

export interface AIReport {
  id: string;
  title: string;
  summary: string;
  status: AIReportStatus;
  created_at: string;
  updated_at: string;
  version: number;

  authors: Author[];
  ai_contributors: AIContributor[];

  sections: AIReportSection[];
  methodology: Methodology;

  suggested_reviewers: SuggestedPerson[];
  suggested_collaborators: SuggestedPerson[];
  reviews: Review[];

  repo_links: RepoLink[];
  data_sources: DataSource[];

  related_reports: RelatedReport[];
  tags: string[];

  human_hours_estimate?: number;
  ai_minutes_actual?: number;
}
