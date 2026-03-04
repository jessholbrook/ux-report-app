"use client";

import type { AIReportSection, FindingContent } from "@/lib/ai-report-types";
import { ConfidenceBadge } from "./confidence-badge";
import { ReasoningTrace } from "./reasoning-trace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Lightbulb,
  ExternalLink,
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

          {content.recommendation && (
            <div className="mt-3 flex items-start gap-2 rounded-md bg-muted/50 p-3">
              <Lightbulb className="size-4 shrink-0 mt-0.5 text-amber-500" />
              <div className="space-y-2">
                <p className="text-sm">{content.recommendation}</p>
                {content.prototype_repo ? (
                  <a
                    href={content.prototype_repo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      View Prototype
                      <ExternalLink className="size-3 ml-1" />
                    </Button>
                  </a>
                ) : (
                  <a
                    href={`https://github.com/new?name=${encodeURIComponent(
                      content.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "")
                    )}-prototype`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Build Prototype
                      <ExternalLink className="size-3 ml-1" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {section.reasoning && <ReasoningTrace reasoning={section.reasoning} />}
    </div>
  );
}
