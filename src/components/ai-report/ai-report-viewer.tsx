"use client";

import { useAIReport } from "@/contexts/ai-report-context";
import { ReportHero } from "./report-hero";
import { FindingCard } from "./finding-card";
import { MethodologyPanel } from "./methodology-panel";
import { PeoplePanel } from "./people-panel";
import { ProvenancePanel } from "./provenance-panel";
import { ConnectionsPanel } from "./connections-panel";
import { ChatPanel } from "./chat-panel";
import { Separator } from "@/components/ui/separator";
import type {
  AIReportSection,
  FindingContent,
} from "@/lib/ai-report-types";
import type { HeadingContent, TextContent } from "@/lib/types";

function SectionRenderer({ section }: { section: AIReportSection }) {
  switch (section.type) {
    case "finding":
      return <FindingCard section={section} />;

    case "heading": {
      const content = section.content as HeadingContent;
      const Tag = `h${content.level}` as "h1" | "h2" | "h3";
      const sizeClass =
        content.level === 1
          ? "text-2xl font-bold"
          : content.level === 2
            ? "text-xl font-semibold"
            : "text-lg font-medium";
      return <Tag className={sizeClass}>{content.text}</Tag>;
    }

    case "text": {
      const content = section.content as TextContent;
      return (
        <div
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
      );
    }

    case "divider":
      return <Separator className="my-2" />;

    default:
      return null;
  }
}

export function AIReportViewer() {
  const { report } = useAIReport();
  const sortedSections = [...report.sections].sort(
    (a, b) => a.position - b.position
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Hero */}
      <ReportHero report={report} />

      <Separator className="my-8" />

      {/* Report Content */}
      <div className="space-y-4">
        {sortedSections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>

      <Separator className="my-8" />

      {/* Methodology */}
      <div className="space-y-4">
        <MethodologyPanel
          methodology={report.methodology}
          aiContributors={report.ai_contributors}
        />

        {/* People */}
        <PeoplePanel
          reviewers={report.suggested_reviewers}
          collaborators={report.suggested_collaborators}
          reviews={report.reviews}
        />

        {/* Provenance */}
        <ProvenancePanel
          repoLinks={report.repo_links}
          dataSources={report.data_sources}
        />

        {/* Connections */}
        <ConnectionsPanel relatedReports={report.related_reports} />
      </div>

      {/* Chat */}
      <ChatPanel />
    </div>
  );
}
