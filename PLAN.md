# AI-Native UX Research Reports — Implementation Plan

## Overview

Add a new `/ai-reports` section to the site, separate from the existing traditional
report system. This section showcases AI-native UX research reports that emphasize
transparency, interactivity, collaboration, and reproducibility.

The existing report infrastructure (block system, annotations, export) stays untouched.
The AI reports section gets its own routes, types, components, and data layer.

---

## New Data Model

### `AIReport` (extends base report concept)

```
AIReport {
  id: string
  title: string
  summary: string                    // Executive summary
  status: "draft" | "in-review" | "published"
  created_at: string
  updated_at: string
  version: number                    // Report version for living docs

  // Authorship
  authors: Author[]                  // Human authors
  ai_contributors: AIContributor[]  // AI agents involved

  // Content (block-based, extends existing system)
  sections: AIReportSection[]

  // AI Methodology
  methodology: Methodology

  // People
  suggested_reviewers: SuggestedPerson[]
  suggested_collaborators: SuggestedPerson[]
  reviews: Review[]

  // Provenance
  repo_links: RepoLink[]
  data_sources: DataSource[]

  // Connections
  related_reports: RelatedReport[]
  tags: string[]
}
```

### Supporting Types

```
Author {
  name: string
  role: string                       // "Lead Researcher", "Designer", etc.
  avatar_url?: string
  profile_url?: string
}

AIContributor {
  model_name: string                 // "Claude Opus 4", "Claude Haiku", etc.
  model_id: string                   // "claude-opus-4-6"
  role: string                       // "Primary analysis", "Data classification"
  description: string                // What this agent did
}

Methodology {
  overview: string                   // How the research was conducted
  prompts: PromptEntry[]             // Disclosed prompts
  reasoning_summaries: ReasoningSummary[]
}

PromptEntry {
  id: string
  label: string                      // "Initial Analysis Prompt", "Follow-up"
  prompt_text: string                // The actual prompt
  context?: string                   // Why this prompt was used
  agent: string                      // Which AI agent received this
  output_summary?: string            // Brief summary of what it produced
}

ReasoningSummary {
  id: string
  finding_id: string                 // Links to a finding/section
  summary: string                    // Human-readable reasoning summary
  confidence: "high" | "medium" | "low"
  reasoning_steps: string[]          // Chain of thought steps
}

SuggestedPerson {
  name: string
  role: string
  reason: string                     // Why they should review/collaborate
  expertise: string[]                // Relevant expertise tags
  avatar_url?: string
  profile_url?: string
}

Review {
  reviewer: string
  status: "pending" | "approved" | "changes-requested"
  comment?: string
  reviewed_at?: string
}

RepoLink {
  url: string
  label: string                      // "Analysis Notebook", "Data Pipeline"
  description?: string
}

DataSource {
  label: string
  url?: string
  type: "dataset" | "survey" | "recording" | "notebook" | "other"
  description?: string
}

AIReportSection {
  id: string
  type: "finding" | "text" | "heading" | "image" | "comparison" | "divider"
  position: number
  content: SectionContent            // Varies by type
  reasoning?: ReasoningSummary       // Optional linked reasoning
  confidence?: "high" | "medium" | "low"
}

RelatedReport {
  id: string
  title: string
  relationship: "prior-research" | "follow-up" | "related" | "supersedes"
}
```

---

## New Routes

```
/ai-reports                          → AI Reports landing/index page
/ai-reports/demo                     → Demo AI-native report (pre-populated)
/ai-reports/[id]                     → View an AI-native report (read-only)
/ai-reports/[id]/edit                → Edit an AI-native report
```

---

## New Components

### Layout & Navigation
- **`ai-reports-layout.tsx`** — Sub-layout for the AI reports section with distinct navigation
- **Update `header.tsx`** — Add "AI Reports" nav link alongside existing nav

### Report Viewer (`/ai-reports/[id]`)
- **`ai-report-viewer.tsx`** — Main read-only view, orchestrates all sub-sections
- **`report-hero.tsx`** — Title, summary, status badge, author/AI contributor chips, metadata bar
- **`methodology-panel.tsx`** — Expandable section showing prompts, agents, reasoning
  - **`prompt-card.tsx`** — Collapsible card showing a single disclosed prompt
  - **`agent-card.tsx`** — Card showing AI contributor info (model, role, description)
  - **`reasoning-trace.tsx`** — Expandable chain-of-thought for a finding
  - **`confidence-badge.tsx`** — Visual indicator for confidence level (high/med/low)
- **`people-panel.tsx`** — Suggested reviewers, collaborators, review status
  - **`person-card.tsx`** — Avatar, name, role, expertise tags, reason for suggestion
  - **`review-status.tsx`** — Review tracker with approval states
- **`provenance-panel.tsx`** — Repo links, data sources, model versions
  - **`repo-card.tsx`** — Repo link with icon, label, description
  - **`data-source-card.tsx`** — Data source with type icon and link
- **`chat-panel.tsx`** — Slide-out or inline chat interface for querying the report
- **`connections-panel.tsx`** — Related reports, tags

### Report Editor (`/ai-reports/[id]/edit`)
- **`ai-report-editor.tsx`** — Full editor extending existing block-based editing
  - Reuses existing block components (text, heading, image, comparison, divider)
  - Adds forms for: methodology, prompts, agents, people, provenance
- **`prompt-editor.tsx`** — Add/edit/remove disclosed prompts
- **`agent-editor.tsx`** — Add/edit AI contributor cards
- **`people-editor.tsx`** — Add/edit suggested reviewers and collaborators
- **`provenance-editor.tsx`** — Add/edit repo links and data sources

### Shared / Reused
- Existing block components (text, heading, image, comparison, divider)
- Existing annotation system
- Existing export infrastructure (extended for AI report format)

---

## New Files

```
src/
├── app/
│   └── ai-reports/
│       ├── layout.tsx                    # AI Reports sub-layout
│       ├── page.tsx                      # AI Reports index/landing
│       ├── demo/
│       │   └── page.tsx                  # Demo AI-native report
│       └── [id]/
│           ├── page.tsx                  # View AI report
│           └── edit/
│               └── page.tsx             # Edit AI report
├── components/
│   └── ai-report/
│       ├── ai-report-viewer.tsx
│       ├── ai-report-editor.tsx
│       ├── report-hero.tsx
│       ├── methodology-panel.tsx
│       ├── prompt-card.tsx
│       ├── agent-card.tsx
│       ├── reasoning-trace.tsx
│       ├── confidence-badge.tsx
│       ├── people-panel.tsx
│       ├── person-card.tsx
│       ├── review-status.tsx
│       ├── provenance-panel.tsx
│       ├── repo-card.tsx
│       ├── data-source-card.tsx
│       ├── chat-panel.tsx
│       └── connections-panel.tsx
├── contexts/
│   └── ai-report-context.tsx             # State management for AI reports
├── lib/
│   ├── ai-report-types.ts               # All new TypeScript types
│   ├── ai-report-demo-data.ts           # Demo data for AI-native report
│   └── ai-report-storage.ts             # localStorage layer for AI reports
```

---

## Implementation Order

### Phase 1: Foundation
1. Define all types in `ai-report-types.ts`
2. Create demo data in `ai-report-demo-data.ts`
3. Create localStorage layer in `ai-report-storage.ts`
4. Create `AIReportContext` provider

### Phase 2: Routes & Layout
5. Create AI reports layout with distinct navigation
6. Update header with "AI Reports" link
7. Create AI reports index page
8. Create demo page route

### Phase 3: Viewer Components (read-only first)
9. Build `report-hero.tsx` — title, summary, status, authors, AI contributors
10. Build `methodology-panel.tsx` with `prompt-card`, `agent-card`, `reasoning-trace`, `confidence-badge`
11. Build `people-panel.tsx` with `person-card` and `review-status`
12. Build `provenance-panel.tsx` with `repo-card` and `data-source-card`
13. Build `connections-panel.tsx`
14. Build `chat-panel.tsx` (UI shell — conversational interface)
15. Assemble `ai-report-viewer.tsx`

### Phase 4: Editor Components
16. Build prompt, agent, people, provenance editors
17. Assemble `ai-report-editor.tsx`
18. Wire up edit page with auto-save

### Phase 5: Polish
19. AI reports index page with grid/list view
20. Export support (JSON format for AI reports)
21. Responsive design pass
22. Dark mode verification

---

## Design Principles

1. **Transparency first** — Every AI contribution is visible and inspectable
2. **Progressive disclosure** — Start with summaries, drill into detail on demand
3. **Reuse existing infrastructure** — Block system, annotations, export all carry over
4. **Separate but connected** — AI reports are a distinct section, not a mode toggle on existing reports
5. **Demo-driven** — Ship with a compelling demo report that showcases all features
