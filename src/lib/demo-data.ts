import type { Report, Block, Annotation } from "./types";

const REPORT_ID = "demo-report-001";

export const demoReport: Report = {
  id: REPORT_ID,
  owner_id: "demo-user",
  title: "Checkout Flow Redesign — Usability Study",
  description:
    "Findings from our moderated usability study comparing the original and redesigned checkout flow. 8 participants, task completion rate improved from 62% to 94%.",
  is_public: true,
  share_token: "demo-share-token",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const demoBlocks: Block[] = [
  {
    id: "block-1",
    report_id: REPORT_ID,
    type: "heading",
    position: 0,
    content: { level: 1, text: "Key Findings" },
  },
  {
    id: "block-2",
    report_id: REPORT_ID,
    type: "text",
    position: 1,
    content: {
      html: "<p>The redesigned checkout flow significantly reduced friction at two critical points: the address entry step and the payment confirmation. Participants completed the checkout 32% faster on average.</p>",
    },
  },
  {
    id: "block-3",
    report_id: REPORT_ID,
    type: "heading",
    position: 2,
    content: { level: 2, text: "Address Entry Comparison" },
  },
  {
    id: "block-4",
    report_id: REPORT_ID,
    type: "comparison",
    position: 3,
    content: {
      before_url: "https://placehold.co/800x500/e2e8f0/475569?text=Before%3A+Address+Form",
      after_url: "https://placehold.co/800x500/dcfce7/166534?text=After%3A+Address+Form",
      before_label: "Original",
      after_label: "Redesigned",
      default_mode: "slider",
    },
  },
  {
    id: "block-5",
    report_id: REPORT_ID,
    type: "divider",
    position: 4,
    content: {},
  },
  {
    id: "block-6",
    report_id: REPORT_ID,
    type: "heading",
    position: 5,
    content: { level: 2, text: "Payment Screen" },
  },
  {
    id: "block-7",
    report_id: REPORT_ID,
    type: "image",
    position: 6,
    content: {
      url: "https://placehold.co/800x400/f0f9ff/1e40af?text=Payment+Screen+Heatmap",
      caption: "Eye-tracking heatmap showing focus areas on the payment confirmation screen",
      alt: "Payment screen heatmap",
    },
  },
  {
    id: "block-8",
    report_id: REPORT_ID,
    type: "text",
    position: 7,
    content: {
      html: "<p>The redesigned payment screen groups related information together, reducing the average time-to-confirm from 45s to 18s. The most significant improvement was moving the order summary above the fold.</p>",
    },
  },
];

export const demoAnnotations: Annotation[] = [
  {
    id: "ann-1",
    block_id: "block-4",
    image_key: "before",
    x_pct: 30,
    y_pct: 25,
    label: 1,
    type: "finding",
    text: "Users struggled with the multi-field address layout. 6/8 participants made errors here.",
  },
  {
    id: "ann-2",
    block_id: "block-4",
    image_key: "before",
    x_pct: 70,
    y_pct: 60,
    label: 2,
    type: "implication",
    text: "The 'Continue' button is below the fold on most screens, causing 3 participants to think the form was broken.",
  },
  {
    id: "ann-3",
    block_id: "block-4",
    image_key: "after",
    x_pct: 50,
    y_pct: 30,
    label: 3,
    type: "change",
    text: "Single-line address input with autocomplete. Reduced form fields from 6 to 1.",
  },
  {
    id: "ann-4",
    block_id: "block-7",
    image_key: "default",
    x_pct: 25,
    y_pct: 40,
    label: 1,
    type: "finding",
    text: "High fixation on the total price area. Users spend 3x longer here than expected.",
  },
];
