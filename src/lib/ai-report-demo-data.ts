import type { AIReport } from "./ai-report-types";

const REPORT_ID = "ai-demo-report-001";

export const demoAIReport: AIReport = {
  id: REPORT_ID,
  title: "AI-Assisted Analysis: Mobile Navigation Redesign",
  summary:
    "Using Claude to analyze 12 moderated usability sessions, we identified 4 critical navigation patterns causing user drop-off. AI-assisted synthesis reduced analysis time from 2 weeks to 3 days while surfacing patterns human reviewers had missed in initial passes.",
  status: "published",
  created_at: "2025-01-15T10:00:00Z",
  updated_at: "2025-01-18T16:30:00Z",
  version: 3,
  human_hours_estimate: 80,
  ai_minutes_actual: 4320,

  authors: [
    {
      name: "Sarah Chen",
      role: "Lead UX Researcher",
      avatar_url: "https://placehold.co/40x40/6366f1/ffffff?text=SC",
    },
    {
      name: "Marcus Johnson",
      role: "Product Designer",
      avatar_url: "https://placehold.co/40x40/8b5cf6/ffffff?text=MJ",
    },
  ],

  ai_contributors: [
    {
      model_name: "Claude Opus",
      model_id: "claude-opus-4-6",
      role: "Primary Analysis",
      description:
        "Analyzed session transcripts, identified behavioral patterns, synthesized findings across participants, and generated initial recommendations.",
    },
    {
      model_name: "Claude Haiku",
      model_id: "claude-haiku-4-5-20251001",
      role: "Data Classification",
      description:
        "Classified 847 user actions across sessions into task categories, tagged emotional sentiment, and flagged friction points for deeper analysis.",
    },
  ],

  sections: [
    {
      id: "section-1",
      type: "heading",
      position: 0,
      content: { level: 1 as const, text: "Key Findings" },
    },
    {
      id: "section-2",
      type: "finding",
      position: 1,
      content: {
        title: "Hamburger menu discovery rate critically low on key flows",
        description:
          "Only 3 of 12 participants (25%) discovered the primary navigation menu without prompting during the account management task. Users expected tab-based navigation visible at the bottom of the screen.",
        severity: "critical" as const,
        recommendation:
          "Replace the hamburger menu with a 5-tab bottom navigation bar (Home, Search, Categories, Cart, Account). Prototype with the existing icon system and run a quick A/B preference test before full implementation.",
        prototype_repo: "https://github.com/example/mobile-bottom-nav-prototype",
      },
      confidence: "high",
      reasoning: {
        id: "reasoning-1",
        finding_id: "section-2",
        summary:
          "Strong quantitative signal (25% discovery) corroborated by consistent verbal feedback across sessions. 9 of 12 participants explicitly mentioned expecting bottom navigation.",
        confidence: "high",
        reasoning_steps: [
          "Analyzed task completion logs for 'account management' across all 12 sessions",
          "Identified that only 3 participants found the hamburger menu without prompting",
          "Cross-referenced with session transcripts — 9 participants verbalized confusion",
          "Compared against mobile UX benchmarks: industry standard discovery rate for primary nav is >80%",
          "Pattern is consistent across age groups and tech comfort levels, ruling out demographic bias",
        ],
      },
    },
    {
      id: "section-3",
      type: "finding",
      position: 2,
      content: {
        title: "Search-first behavior dominates for product discovery",
        description:
          "8 of 12 participants (67%) attempted to use search before browsing categories. The current search placement (behind a tap) adds an unnecessary step. Participants spent an average of 4.2 seconds looking for the search bar.",
        severity: "major" as const,
        recommendation:
          "Surface search as a persistent bar at the top of home and category pages. Add a floating search button on product detail and checkout screens for quick access.",
      },
      confidence: "high",
      reasoning: {
        id: "reasoning-2",
        finding_id: "section-3",
        summary:
          "Clear behavioral pattern with strong participant count. Time-on-task data confirms the friction added by hidden search.",
        confidence: "high",
        reasoning_steps: [
          "Tracked initial action taken on product discovery task across all sessions",
          "67% of participants tapped the area where search would typically appear",
          "Measured average time to find search functionality: 4.2s (vs. <1s benchmark for visible search)",
          "Analyzed post-task survey: 10 of 12 participants rated search findability as 'poor' or 'very poor'",
        ],
      },
    },
    {
      id: "section-4",
      type: "finding",
      position: 3,
      content: {
        title: "Back navigation causes unintended exits from checkout",
        description:
          "5 of 12 participants accidentally exited the checkout flow by using the device back button. The app treats the back gesture as 'exit checkout' rather than 'previous step,' causing frustration and cart abandonment.",
        severity: "critical" as const,
        recommendation:
          "Override the system back gesture within checkout to navigate to the previous step. Add an explicit 'Exit checkout' action behind a confirmation dialog to prevent accidental cart abandonment.",
      },
      confidence: "medium",
      reasoning: {
        id: "reasoning-3",
        finding_id: "section-4",
        summary:
          "Moderate sample size for this specific behavior but high severity impact. Consistent with known Android back-button UX patterns in e-commerce apps.",
        confidence: "medium",
        reasoning_steps: [
          "Identified 5 instances of unintended checkout exit across sessions",
          "All 5 occurred on Android devices using the system back gesture",
          "3 of 5 participants expressed strong frustration ('I just lost my whole cart')",
          "Compared with iOS sessions where this pattern did not occur (swipe-back handled differently)",
          "Note: sample skews 7 Android / 5 iOS — larger Android-specific study recommended to confirm",
        ],
      },
    },
    {
      id: "section-5",
      type: "finding",
      position: 4,
      content: {
        title: "Category groupings match user mental models well",
        description:
          "11 of 12 participants successfully completed the category browsing task on first attempt. Card sort alignment between our IA and user expectations scored 89% — significantly above the 70% benchmark.",
        severity: "positive" as const,
        recommendation:
          "Preserve the current category structure as-is. Use it as a reference model when expanding to new product verticals — the mental model alignment here is strong.",
      },
      confidence: "high",
      reasoning: {
        id: "reasoning-4",
        finding_id: "section-5",
        summary:
          "Very strong quantitative signal with near-unanimous task success. Card sort data provides additional validation beyond behavioral observation.",
        confidence: "high",
        reasoning_steps: [
          "Task completion rate for category browsing: 92% (11/12) on first attempt",
          "Average time-to-complete: 8.3s (benchmark: <15s for similar e-commerce apps)",
          "Post-task card sort alignment: 89% agreement with current category structure",
          "Only outlier participant had domain-specific expectations (professional buyer vs. consumer)",
        ],
      },
    },
    {
      id: "section-6",
      type: "divider",
      position: 5,
      content: {},
    },
    {
      id: "section-7",
      type: "heading",
      position: 6,
      content: { level: 2 as const, text: "Recommendations" },
    },
    {
      id: "section-8",
      type: "text",
      position: 7,
      content: {
        html: "<p><strong>1. Replace hamburger menu with bottom tab navigation.</strong> Implement a 5-tab bottom bar: Home, Search, Categories, Cart, Account. This directly addresses the 25% discovery rate for primary navigation and aligns with participant expectations.</p><p><strong>2. Surface search as a persistent element.</strong> Move search to a visible bar at the top of the home screen and category pages. Consider a floating search button on other screens.</p><p><strong>3. Implement step-based back navigation in checkout.</strong> Override the system back gesture within the checkout flow to navigate to the previous checkout step rather than exiting. Add an explicit &lsquo;Exit checkout&rsquo; option with a confirmation dialog.</p><p><strong>4. Preserve current category structure.</strong> The 89% card sort alignment suggests our information architecture is well-designed. No changes recommended here.</p>",
      },
    },
  ],

  methodology: {
    overview:
      "We conducted 12 moderated usability sessions over 5 days. Session recordings and transcripts were analyzed using Claude Opus for pattern synthesis and Claude Haiku for action classification. Human researchers validated all AI-generated findings against raw session data.",
    prompts: [
      {
        id: "prompt-1",
        label: "Session Transcript Analysis",
        prompt_text:
          "Analyze the following usability session transcript. Identify: (1) Task completion/failure points, (2) Verbal expressions of confusion or satisfaction, (3) Unexpected navigation paths, (4) Time-on-task anomalies. Format findings with participant quotes and timestamps.\n\n[Session transcript attached]",
        context:
          "Used as the first-pass analysis prompt for each of the 12 session transcripts. Each transcript was processed independently before cross-session synthesis.",
        agent: "Claude Opus",
        output_summary:
          "Generated structured findings per session with 15-25 observations each, including severity ratings and supporting quotes.",
      },
      {
        id: "prompt-2",
        label: "Cross-Session Pattern Synthesis",
        prompt_text:
          "You have analyzed 12 individual usability sessions. Here are the per-session findings:\n\n[All 12 session analyses attached]\n\nSynthesize patterns across sessions. For each pattern: (1) How many participants exhibited it, (2) Severity and confidence assessment, (3) Supporting evidence from multiple sessions, (4) Potential design recommendations. Focus on patterns that appear in 3+ sessions.",
        context:
          "Synthesis prompt run after all individual sessions were analyzed. This is where the cross-cutting themes emerged.",
        agent: "Claude Opus",
        output_summary:
          "Identified 4 primary patterns and 3 secondary patterns. The 4 primary patterns became the key findings in this report.",
      },
      {
        id: "prompt-3",
        label: "Action Classification",
        prompt_text:
          'Classify each user action in the following session log into these categories: [navigation, search, browsing, cart-management, checkout, account, help-seeking, error-recovery, other]. For each action, also tag: emotional_sentiment (positive/neutral/negative/frustrated), friction_level (none/low/medium/high), and whether it was a deviation from the expected task flow.\n\n[Session action log attached]',
        context:
          "Used for quantitative analysis of user behavior patterns. Run on structured action logs extracted from screen recordings.",
        agent: "Claude Haiku",
        output_summary:
          "Classified 847 total actions across 12 sessions. Identified 127 high-friction points and 43 task flow deviations.",
      },
    ],
    reasoning_summaries: [
      {
        id: "reasoning-1",
        finding_id: "section-2",
        summary:
          "Strong quantitative signal (25% discovery) corroborated by consistent verbal feedback across sessions.",
        confidence: "high",
        reasoning_steps: [
          "Analyzed task completion logs for 'account management' across all 12 sessions",
          "Identified that only 3 participants found the hamburger menu without prompting",
          "Cross-referenced with session transcripts — 9 participants verbalized confusion",
          "Compared against mobile UX benchmarks: industry standard discovery rate for primary nav is >80%",
          "Pattern is consistent across age groups and tech comfort levels, ruling out demographic bias",
        ],
      },
      {
        id: "reasoning-2",
        finding_id: "section-3",
        summary:
          "Clear behavioral pattern with strong participant count. Time-on-task data confirms the friction added by hidden search.",
        confidence: "high",
        reasoning_steps: [
          "Tracked initial action taken on product discovery task across all sessions",
          "67% of participants tapped the area where search would typically appear",
          "Measured average time to find search functionality: 4.2s (vs. <1s benchmark for visible search)",
          "Analyzed post-task survey: 10 of 12 participants rated search findability as 'poor' or 'very poor'",
        ],
      },
      {
        id: "reasoning-3",
        finding_id: "section-4",
        summary:
          "Moderate sample size for this specific behavior but high severity impact.",
        confidence: "medium",
        reasoning_steps: [
          "Identified 5 instances of unintended checkout exit across sessions",
          "All 5 occurred on Android devices using the system back gesture",
          "3 of 5 participants expressed strong frustration",
          "Compared with iOS sessions where this pattern did not occur",
          "Note: sample skews 7 Android / 5 iOS — larger Android-specific study recommended",
        ],
      },
      {
        id: "reasoning-4",
        finding_id: "section-5",
        summary:
          "Very strong quantitative signal with near-unanimous task success.",
        confidence: "high",
        reasoning_steps: [
          "Task completion rate for category browsing: 92% (11/12) on first attempt",
          "Average time-to-complete: 8.3s (benchmark: <15s for similar e-commerce apps)",
          "Post-task card sort alignment: 89% agreement with current category structure",
          "Only outlier participant had domain-specific expectations",
        ],
      },
    ],
  },

  suggested_reviewers: [
    {
      name: "Dr. Emily Rivera",
      role: "VP of Product",
      reason:
        "Could prioritize the bottom-nav migration on Q2 roadmap. Owns the mobile navigation budget and previously championed the hamburger menu — she'll want to see this data before sprint planning.",
      expertise: ["mobile UX", "product strategy", "e-commerce"],
      avatar_url: "https://placehold.co/40x40/ec4899/ffffff?text=ER",
    },
    {
      name: "James Park",
      role: "Senior Mobile Engineer",
      reason:
        "Could implement the back-button override and bottom-nav shell within a single sprint. Has shipped similar navigation refactors on the Android codebase before.",
      expertise: ["Android", "iOS", "mobile architecture"],
      avatar_url: "https://placehold.co/40x40/f59e0b/ffffff?text=JP",
    },
    {
      name: "Lisa Tran",
      role: "UX Research Manager",
      reason:
        "Could adapt this AI-assisted analysis workflow for the upcoming checkout redesign study. Her team runs 3 similar studies per quarter.",
      expertise: ["research methods", "usability testing", "team leadership"],
      avatar_url: "https://placehold.co/40x40/10b981/ffffff?text=LT",
    },
  ],

  suggested_collaborators: [
    {
      name: "Alex Kim",
      role: "Data Scientist",
      reason:
        "Could validate these findings at scale by pulling funnel drop-off rates and running a targeted A/B test on bottom-nav vs. hamburger within a week.",
      expertise: ["analytics", "A/B testing", "Python", "statistics"],
      avatar_url: "https://placehold.co/40x40/3b82f6/ffffff?text=AK",
    },
    {
      name: "Priya Patel",
      role: "Accessibility Specialist",
      reason:
        "Could audit the bottom-nav prototype for screen reader compatibility and write the WCAG test plan before engineering starts building.",
      expertise: ["WCAG", "screen readers", "inclusive design", "mobile a11y"],
      avatar_url: "https://placehold.co/40x40/6366f1/ffffff?text=PP",
    },
  ],

  reviews: [
    {
      reviewer: "Lisa Tran",
      status: "approved",
      comment:
        "Methodology is sound. The AI-assisted approach surfaced the back-button pattern that our initial manual review missed. Recommending this approach for future studies with appropriate human validation.",
      reviewed_at: "2025-01-17T14:00:00Z",
    },
    {
      reviewer: "Dr. Emily Rivera",
      status: "changes-requested",
      comment:
        "Findings are compelling. Requesting additional data on the business impact of the hamburger menu change — can we estimate conversion lift? Also want to see competitive analysis for bottom nav implementations.",
      reviewed_at: "2025-01-18T09:30:00Z",
    },
    {
      reviewer: "James Park",
      status: "pending",
    },
  ],

  repo_links: [
    {
      url: "https://github.com/example/mobile-nav-analysis",
      label: "Analysis Repository",
      description:
        "Jupyter notebooks with session analysis, classification results, and visualization code.",
    },
    {
      url: "https://github.com/example/ux-research-tools",
      label: "Research Tools",
      description:
        "Custom scripts for transcript processing and action log extraction.",
    },
  ],

  data_sources: [
    {
      label: "Session Recordings",
      type: "recording",
      description:
        "12 moderated usability sessions (45-60 min each), recorded via Lookback.",
    },
    {
      label: "Session Transcripts",
      type: "dataset",
      description:
        "Auto-generated transcripts reviewed and corrected by research team.",
    },
    {
      label: "Post-Task Survey",
      type: "survey",
      description:
        "SUS + custom questions administered after each task block.",
    },
    {
      label: "Action Logs",
      type: "notebook",
      url: "https://github.com/example/mobile-nav-analysis/blob/main/action-classification.ipynb",
      description:
        "Structured logs of 847 user actions extracted from screen recordings.",
    },
  ],

  related_reports: [
    {
      id: "report-prev-001",
      title: "Mobile App Baseline Usability Study (Q3 2024)",
      relationship: "prior-research",
    },
    {
      id: "report-prev-002",
      title: "Competitive Navigation Analysis",
      relationship: "related",
    },
  ],

  tags: [
    "mobile",
    "navigation",
    "usability-testing",
    "AI-assisted",
    "e-commerce",
  ],
};
