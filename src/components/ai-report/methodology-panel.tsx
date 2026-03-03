"use client";

import { useState } from "react";
import type { Methodology, AIContributor } from "@/lib/ai-report-types";
import { AgentCard } from "./agent-card";
import { PromptCard } from "./prompt-card";
import { ChevronDown, ChevronRight, FlaskConical } from "lucide-react";

interface MethodologyPanelProps {
  methodology: Methodology;
  aiContributors: AIContributor[];
}

export function MethodologyPanel({
  methodology,
  aiContributors,
}: MethodologyPanelProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="rounded-lg border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <FlaskConical className="size-5 text-violet-500" />
        <h2 className="font-semibold flex-1">Methodology & Transparency</h2>
        {expanded ? (
          <ChevronDown className="size-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-5 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t px-4 pb-4 pt-3 space-y-5">
          {/* Overview */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {methodology.overview}
          </p>

          {/* AI Contributors */}
          {aiContributors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">AI Agents Used</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {aiContributors.map((contributor) => (
                  <AgentCard
                    key={contributor.model_id}
                    contributor={contributor}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Disclosed Prompts */}
          {methodology.prompts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                Disclosed Prompts ({methodology.prompts.length})
              </h3>
              <div className="space-y-2">
                {methodology.prompts.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
