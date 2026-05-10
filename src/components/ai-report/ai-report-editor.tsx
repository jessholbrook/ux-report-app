"use client";

import { useAIReport } from "@/contexts/ai-report-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EditableFindingCard } from "./editable-finding-card";
import { EditableMethodologyPanel } from "./editable-methodology-panel";
import { EditablePeoplePanel } from "./editable-people-panel";
import { EditableProvenancePanel } from "./editable-provenance-panel";
import { ConnectionsPanel } from "./connections-panel";
import { AIExportToolbar } from "./ai-export-toolbar";
import { useState } from "react";
import { Plus, X, Hash, Heading2, Type, Minus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type {
  AIReportSection,
  AIReportStatus,
  FindingContent,
} from "@/lib/ai-report-types";
import type { HeadingContent, TextContent } from "@/lib/types";

const statuses: AIReportStatus[] = ["draft", "in-review", "published"];

function EditableHeading({
  section,
  onUpdate,
  onDelete,
}: {
  section: AIReportSection;
  onUpdate: (s: AIReportSection) => void;
  onDelete: (id: string) => void;
}) {
  const content = section.content as HeadingContent;
  const sizeClass =
    content.level === 1
      ? "text-2xl font-bold"
      : content.level === 2
        ? "text-xl font-semibold"
        : "text-lg font-medium";

  return (
    <div className="group flex items-center gap-2">
      <Input
        value={content.text}
        onChange={(e) =>
          onUpdate({
            ...section,
            content: { ...content, text: e.target.value },
          })
        }
        className={`border-none shadow-none focus-visible:ring-0 px-0 h-auto ${sizeClass}`}
        placeholder="Heading..."
      />
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
        onClick={() => onDelete(section.id)}
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}

function EditableText({
  section,
  onUpdate,
  onDelete,
}: {
  section: AIReportSection;
  onUpdate: (s: AIReportSection) => void;
  onDelete: (id: string) => void;
}) {
  const content = section.content as TextContent;

  return (
    <div className="group relative">
      <Textarea
        value={content.html.replace(/<[^>]+>/g, "")}
        onChange={(e) =>
          onUpdate({
            ...section,
            content: { html: `<p>${e.target.value}</p>` },
          })
        }
        className="border-none shadow-none focus-visible:ring-0 px-0 resize-none text-sm"
        placeholder="Write something..."
        rows={3}
      />
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-0 right-0 h-7 px-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
        onClick={() => onDelete(section.id)}
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}

function EditableDivider({
  section,
  onDelete,
}: {
  section: AIReportSection;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="group flex items-center gap-2">
      <Separator className="flex-1" />
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
        onClick={() => onDelete(section.id)}
      >
        <X className="size-3" />
      </Button>
    </div>
  );
}

function TagInput({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState("");

  function addTag(raw: string) {
    const tag = raw
      .replace(/^#/, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        <Hash className="size-3.5 text-muted-foreground" />
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs group gap-1">
            #{tag}
            <button
              onClick={() => removeTag(tag)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(input);
          }
        }}
        onBlur={() => {
          if (input.trim()) addTag(input);
        }}
        placeholder="Add tag..."
        className="h-8 text-sm"
      />
    </div>
  );
}

export function AIReportEditor() {
  const { report, updateReport, isDemo } = useAIReport();

  const sortedSections = [...report.sections].sort(
    (a, b) => a.position - b.position
  );

  function nextPosition() {
    return report.sections.length > 0
      ? Math.max(...report.sections.map((s) => s.position)) + 1
      : 0;
  }

  function addFinding() {
    const newSection: AIReportSection = {
      id: uuidv4(),
      type: "finding",
      position: nextPosition(),
      content: {
        title: "New finding",
        description: "Describe the finding...",
        severity: "minor",
      } as FindingContent,
      confidence: "medium",
    };
    updateReport({ sections: [...report.sections, newSection] });
  }

  function addHeading() {
    const newSection: AIReportSection = {
      id: uuidv4(),
      type: "heading",
      position: nextPosition(),
      content: { level: 2, text: "" } as HeadingContent,
    };
    updateReport({ sections: [...report.sections, newSection] });
  }

  function addText() {
    const newSection: AIReportSection = {
      id: uuidv4(),
      type: "text",
      position: nextPosition(),
      content: { html: "<p></p>" } as TextContent,
    };
    updateReport({ sections: [...report.sections, newSection] });
  }

  function addDivider() {
    const newSection: AIReportSection = {
      id: uuidv4(),
      type: "divider",
      position: nextPosition(),
      content: {},
    };
    updateReport({ sections: [...report.sections, newSection] });
  }

  function updateSection(updated: AIReportSection) {
    updateReport({
      sections: report.sections.map((s) =>
        s.id === updated.id ? updated : s
      ),
    });
  }

  function deleteSection(id: string) {
    updateReport({
      sections: report.sections.filter((s) => s.id !== id),
    });
  }

  function renderSection(section: AIReportSection) {
    switch (section.type) {
      case "finding":
        return (
          <EditableFindingCard
            key={section.id}
            section={section}
            onUpdate={updateSection}
            onDelete={deleteSection}
          />
        );
      case "heading":
        return (
          <EditableHeading
            key={section.id}
            section={section}
            onUpdate={updateSection}
            onDelete={deleteSection}
          />
        );
      case "text":
        return (
          <EditableText
            key={section.id}
            section={section}
            onUpdate={updateSection}
            onDelete={deleteSection}
          />
        );
      case "divider":
        return (
          <EditableDivider
            key={section.id}
            section={section}
            onDelete={deleteSection}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {isDemo && (
        <div className="mb-6 rounded-lg bg-amber-50 px-4 py-3 text-center text-sm text-amber-800 border border-amber-200">
          Demo Mode — Changes are not saved
        </div>
      )}

      <div className="mb-6">
        <AIExportToolbar />
      </div>

      {/* Report metadata */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center gap-2">
          {statuses.map((s) => (
            <Button
              key={s}
              variant={report.status === s ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs capitalize"
              onClick={() => updateReport({ status: s })}
            >
              {s.replace("-", " ")}
            </Button>
          ))}
          <span className="text-xs text-muted-foreground ml-2">
            v{report.version}
          </span>
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

        {/* Time estimates */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground whitespace-nowrap">
              Manual estimate (hours)
            </label>
            <Input
              type="number"
              min={0}
              value={report.human_hours_estimate ?? ""}
              onChange={(e) =>
                updateReport({
                  human_hours_estimate: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="h-8 w-24 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground whitespace-nowrap">
              AI-assisted (minutes)
            </label>
            <Input
              type="number"
              min={0}
              value={report.ai_minutes_actual ?? ""}
              onChange={(e) =>
                updateReport({
                  ai_minutes_actual: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="h-8 w-24 text-sm"
            />
          </div>
        </div>

        {/* Tags */}
        <TagInput
          tags={report.tags}
          onChange={(tags) => updateReport({ tags })}
        />
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sortedSections.map((section) => renderSection(section))}
      </div>

      {/* Section toolbar */}
      <div className="mt-4 flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={addFinding}>
          <Plus className="size-3.5 mr-1" />
          Finding
        </Button>
        <Button variant="outline" size="sm" onClick={addHeading}>
          <Heading2 className="size-3.5 mr-1" />
          Heading
        </Button>
        <Button variant="outline" size="sm" onClick={addText}>
          <Type className="size-3.5 mr-1" />
          Text
        </Button>
        <Button variant="outline" size="sm" onClick={addDivider}>
          <Minus className="size-3.5 mr-1" />
          Divider
        </Button>
      </div>

      <Separator className="my-8" />

      {/* Editable panels */}
      <div className="space-y-4">
        <EditableMethodologyPanel
          methodology={report.methodology}
          aiContributors={report.ai_contributors}
          onUpdateMethodology={(methodology) => updateReport({ methodology })}
          onUpdateContributors={(ai_contributors) =>
            updateReport({ ai_contributors })
          }
        />
        <EditablePeoplePanel
          reviewers={report.suggested_reviewers}
          collaborators={report.suggested_collaborators}
          reviews={report.reviews}
          onUpdateReviewers={(suggested_reviewers) =>
            updateReport({ suggested_reviewers })
          }
          onUpdateCollaborators={(suggested_collaborators) =>
            updateReport({ suggested_collaborators })
          }
        />
        <EditableProvenancePanel
          repoLinks={report.repo_links}
          dataSources={report.data_sources}
          onUpdateRepos={(repo_links) => updateReport({ repo_links })}
          onUpdateSources={(data_sources) => updateReport({ data_sources })}
        />
        <ConnectionsPanel relatedReports={report.related_reports} />
      </div>
    </div>
  );
}
