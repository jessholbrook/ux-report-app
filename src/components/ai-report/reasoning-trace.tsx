"use client";

import { useState } from "react";
import type { ReasoningSummary } from "@/lib/ai-report-types";
import { ConfidenceBadge } from "./confidence-badge";
import { ChevronDown, ChevronRight, Brain } from "lucide-react";

export function ReasoningTrace({
  reasoning,
}: {
  reasoning: ReasoningSummary;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-md border border-dashed bg-muted/30">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted/50 transition-colors"
      >
        <Brain className="size-3.5 shrink-0 text-violet-500" />
        <span className="text-xs font-medium text-muted-foreground flex-1">
          AI Reasoning
        </span>
        <ConfidenceBadge level={reasoning.confidence} />
        {expanded ? (
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-dashed px-3 pb-3 pt-2 space-y-2">
          <p className="text-sm">{reasoning.summary}</p>

          {reasoning.reasoning_steps.length > 0 && (
            <ol className="space-y-1.5 pl-4">
              {reasoning.reasoning_steps.map((step, i) => (
                <li
                  key={i}
                  className="text-xs text-muted-foreground list-decimal leading-relaxed"
                >
                  {step}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
