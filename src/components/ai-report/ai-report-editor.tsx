"use client";

import { useAIReport } from "@/contexts/ai-report-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FindingCard } from "./finding-card";
import { MethodologyPanel } from "./methodology-panel";
import { PeoplePanel } from "./people-panel";
import { ProvenancePanel } from "./provenance-panel";
import { ConnectionsPanel } from "./connections-panel";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
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

export function AIReportEditor() {
  const { report, updateReport, isDemo } = useAIReport();

  const sortedSections = [...report.sections].sort(
    (a, b) => a.position - b.position
  );

  function addFinding() {
    const maxPos = report.sections.length > 0
      ? Math.max(...report.sections.map((s) => s.position))
      : -1;

    const newSection: AIReportSection = {
      id: uuidv4(),
      type: "finding",
      position: maxPos + 1,
      content: {
        title: "New finding",
        description: "Describe the finding...",
        severity: "minor",
      } as FindingContent,
      confidence: "medium",
    };

    updateReport({ sections: [...report.sections, newSection] });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {isDemo && (
        <div className="mb-6 rounded-lg bg-amber-50 px-4 py-3 text-center text-sm text-amber-800 border border-amber-200">
          Demo Mode — Changes are not saved
        </div>
      )}

      {/* Report metadata */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {report.status.replace("-", " ")}
          </Badge>
          <span className="text-xs text-muted-foreground">v{report.version}</span>
        </div>

        <Input
          value={report.title}
          onChange={(e) => updateReport({ title: e.target.value })}
          placeholder="Report title..."
          className="border-none text-3xl font-bold shadow-none focus-visible:ring-0 px-0 h-auto"
        />
        <Textarea
          value={report.summary}
          onChange={(e) => updateReport({ summary: e.target.value })}
          placeholder="Executive summary..."
          className="border-none shadow-none focus-visible:ring-0 px-0 resize-none text-muted-foreground"
          rows={3}
        />
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sortedSections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" onClick={addFinding}>
          <Plus className="size-4 mr-1" />
          Add Finding
        </Button>
      </div>

      <Separator className="my-8" />

      {/* Panels */}
      <div className="space-y-4">
        <MethodologyPanel
          methodology={report.methodology}
          aiContributors={report.ai_contributors}
        />
        <PeoplePanel
          reviewers={report.suggested_reviewers}
          collaborators={report.suggested_collaborators}
          reviews={report.reviews}
        />
        <ProvenancePanel
          repoLinks={report.repo_links}
          dataSources={report.data_sources}
        />
        <ConnectionsPanel relatedReports={report.related_reports} />
      </div>
    </div>
  );
}
