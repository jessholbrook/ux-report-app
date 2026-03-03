"use client";

import { useState } from "react";
import type { RelatedReport } from "@/lib/ai-report-types";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Link2, ArrowLeft, ArrowRight, ArrowLeftRight, Replace } from "lucide-react";

const relationshipConfig: Record<
  RelatedReport["relationship"],
  { icon: typeof ArrowLeft; label: string }
> = {
  "prior-research": { icon: ArrowLeft, label: "Prior research" },
  "follow-up": { icon: ArrowRight, label: "Follow-up" },
  related: { icon: ArrowLeftRight, label: "Related" },
  supersedes: { icon: Replace, label: "Supersedes" },
};

interface ConnectionsPanelProps {
  relatedReports: RelatedReport[];
}

export function ConnectionsPanel({ relatedReports }: ConnectionsPanelProps) {
  const [expanded, setExpanded] = useState(true);

  if (relatedReports.length === 0) return null;

  return (
    <section className="rounded-lg border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <Link2 className="size-5 text-orange-500" />
        <h2 className="font-semibold flex-1">Related Reports</h2>
        {expanded ? (
          <ChevronDown className="size-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-5 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t px-4 pb-4 pt-3 space-y-2">
          {relatedReports.map((report) => {
            const config = relationshipConfig[report.relationship];
            const Icon = config.icon;
            return (
              <div
                key={report.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm flex-1">{report.title}</span>
                <Badge variant="outline" className="text-xs">
                  {config.label}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
