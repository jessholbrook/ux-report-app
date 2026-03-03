"use client";

import { useState } from "react";
import type { PromptEntry } from "@/lib/ai-report-types";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Terminal } from "lucide-react";

export function PromptCard({ prompt }: { prompt: PromptEntry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <Terminal className="size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{prompt.label}</span>
            <Badge variant="outline" className="text-xs">
              {prompt.agent}
            </Badge>
          </div>
          {prompt.context && !expanded && (
            <p className="mt-0.5 text-xs text-muted-foreground truncate">
              {prompt.context}
            </p>
          )}
        </div>
        {expanded ? (
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t px-4 pb-4 pt-3 space-y-3">
          {prompt.context && (
            <p className="text-sm text-muted-foreground">{prompt.context}</p>
          )}

          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Prompt
            </span>
            <pre className="mt-1 whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-sm font-mono leading-relaxed">
              {prompt.prompt_text}
            </pre>
          </div>

          {prompt.output_summary && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Output Summary
              </span>
              <p className="mt-1 text-sm">{prompt.output_summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
