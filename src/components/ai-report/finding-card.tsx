"use client";

import type { AIReportSection, FindingContent } from "@/lib/ai-report-types";
import { ConfidenceBadge } from "./confidence-badge";
import { ReasoningTrace } from "./reasoning-trace";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
} from "lucide-react";

const severityConfig: Record<
  FindingContent["severity"],
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

export function FindingCard({ section }: { section: AIReportSection }) {
  const content = section.content as FindingContent;
  const config = severityConfig[content.severity];
  const Icon = config.icon;

  return (
    <div
      className={`rounded-lg border border-l-4 ${config.borderClass} p-4 space-y-3`}
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
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {content.description}
          </p>
        </div>
      </div>

      {section.reasoning && <ReasoningTrace reasoning={section.reasoning} />}
    </div>
  );
}
