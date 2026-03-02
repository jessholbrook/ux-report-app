export type BlockType = "text" | "heading" | "image" | "comparison" | "divider";

export type AnnotationType = "finding" | "implication" | "change";

export type ImageKey = "default" | "before" | "after";

export type ComparisonMode = "slider" | "side-by-side";

export interface TextContent {
  html: string;
}

export interface HeadingContent {
  level: 1 | 2 | 3;
  text: string;
}

export interface ImageContent {
  url: string;
  caption: string;
  alt: string;
}

export interface ComparisonContent {
  before_url: string;
  after_url: string;
  before_label: string;
  after_label: string;
  default_mode: ComparisonMode;
}

export interface DividerContent {}

export type BlockContent =
  | TextContent
  | HeadingContent
  | ImageContent
  | ComparisonContent
  | DividerContent;

export interface Block {
  id: string;
  report_id: string;
  type: BlockType;
  position: number;
  content: BlockContent;
  created_at?: string;
}

export interface Annotation {
  id: string;
  block_id: string;
  image_key: ImageKey;
  x_pct: number;
  y_pct: number;
  label: number;
  type: AnnotationType;
  text: string;
  created_at?: string;
}

export interface Report {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  share_token: string;
  created_at: string;
  updated_at: string;
}
