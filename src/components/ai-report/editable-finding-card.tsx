"use client";

import { useState } from "react";
import type {
  AIReportSection,
  FindingContent,
  ConfidenceLevel,
  FindingSeverity,
} from "@/lib/ai-report-types";
import { ConfidenceBadge } from "./confidence-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Lightbulb,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

const severityConfig: Record<
  FindingSeverity,
  { icon: typeof AlertTriangle; className: string; borderClass: string }
> = {
  critical: {
    icon: AlertTriangle,
    className: "text-red-600 dark:text-red-400",
    borderClass: "border-l-red-500",
  },
  major: {
    icon: AlertCircle,
    className: "text-amber-600 dark:text-amber-400",
    borderClass: "border-l-amber-500",
  },
  minor: {
    icon: Info,
    className: "text-blue-600 dark:text-blue-400",
    borderClass: "border-l-blue-500",
  },
  positive: {
    icon: CheckCircle2,
    className: "text-emerald-600 dark:text-emerald-400",
    borderClass: "border-l-emerald-500",
  },
};

const severities: FindingSeverity[] = ["critical", "major", "minor", "positive"];
const confidenceLevels: ConfidenceLevel[] = ["high", "medium", "low"];

interface EditableFindingCardProps {
  section: AIReportSection;
  onUpdate: (section: AIReportSection) => void;
  onDelete: (id: string) => void;
}

export function EditableFindingCard({
  section,
  onUpdate,
  onDelete,
}: EditableFindingCardProps) {
  const content = section.content as FindingContent;
  const config = severityConfig[content.severity];
  const Icon = config.icon;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(content);
  const [draftConfidence, setDraftConfidence] = useState<ConfidenceLevel>(
    section.confidence || "medium"
  );

  function save() {
    onUpdate({
      ...section,
      content: draft,
      confidence: draftConfidence,
    });
    setEditing(false);
  }

  function cancel() {
    setDraft(content);
    setDraftConfidence(section.confidence || "medium");
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="rounded-lg border border-l-4 border-l-violet-500 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-violet-600">
            Editing Finding
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={cancel} className="h-7 px-2">
              <X className="size-3.5" />
            </Button>
            <Button size="sm" onClick={save} className="h-7 px-2">
              <Check className="size-3.5" />
            </Button>
          </div>
        </div>

        <Input
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="Finding title..."
          className="font-semibold"
        />

        <Textarea
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="Describe the finding..."
          rows={3}
        />

        <div className="flex items-center gap-3 flex-wrap">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Severity</label>
            <div className="flex gap-1">
              {severities.map((s) => (
                <Button
                  key={s}
                  variant={draft.severity === s ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs capitalize"
                  onClick={() => setDraft({ ...draft, severity: s })}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Confidence</label>
            <div className="flex gap-1">
              {confidenceLevels.map((c) => (
                <Button
                  key={c}
                  variant={draftConfidence === c ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs capitalize"
                  onClick={() => setDraftConfidence(c)}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground flex items-center gap-1">
            <Lightbulb className="size-3" />
            Recommendation
          </label>
          <Textarea
            value={draft.recommendation || ""}
            onChange={(e) =>
              setDraft({ ...draft, recommendation: e.target.value || undefined })
            }
            placeholder="What should be done about this finding?"
            rows={2}
          />
        </div>

        <Input
          value={draft.prototype_repo || ""}
          onChange={(e) =>
            setDraft({ ...draft, prototype_repo: e.target.value || undefined })
          }
          placeholder="Prototype repo URL (optional)"
          className="text-sm"
        />
      </div>
    );
  }

  return (
    <div
      className={`group rounded-lg border border-l-4 ${config.borderClass} p-4 space-y-3`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`size-5 shrink-0 mt-0.5 ${config.className}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold">{content.title}</h3>
            <Badge variant="outline" className="capitalize text-xs">
              {content.severity}
            </Badge>
            {section.confidence && (
              <ConfidenceBadge level={section.confidence} />
            )}
            <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => setEditing(true)}
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-destructive hover:text-destructive"
                onClick={() => onDelete(section.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {content.description}
          </p>

          {content.recommendation && (
            <div className="mt-3 flex items-start gap-2 rounded-md bg-muted/50 p-3">
              <Lightbulb className="size-4 shrink-0 mt-0.5 text-amber-500" />
              <p className="text-sm">{content.recommendation}</p>
            </div>
          )}
        </div>
      </div>

      {section.reasoning && (
        <div className="rounded-md border border-dashed bg-muted/30 px-3 py-2">
          <span className="text-xs text-muted-foreground">
            AI Reasoning: {section.reasoning.summary}
          </span>
        </div>
      )}
    </div>
  );
}
