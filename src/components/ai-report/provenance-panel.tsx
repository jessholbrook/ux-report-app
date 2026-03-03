"use client";

import { useState } from "react";
import type { RepoLink, DataSource } from "@/lib/ai-report-types";
import { RepoCard } from "./repo-card";
import { DataSourceCard } from "./data-source-card";
import { ChevronDown, ChevronRight, FileSearch } from "lucide-react";

interface ProvenancePanelProps {
  repoLinks: RepoLink[];
  dataSources: DataSource[];
}

export function ProvenancePanel({
  repoLinks,
  dataSources,
}: ProvenancePanelProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="rounded-lg border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <FileSearch className="size-5 text-emerald-500" />
        <h2 className="font-semibold flex-1">Provenance & Data</h2>
        {expanded ? (
          <ChevronDown className="size-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-5 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t px-4 pb-4 pt-3 space-y-5">
          {/* Repo Links */}
          {repoLinks.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Repositories</h3>
              <div className="space-y-2">
                {repoLinks.map((repo) => (
                  <RepoCard key={repo.url} repo={repo} />
                ))}
              </div>
            </div>
          )}

          {/* Data Sources */}
          {dataSources.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Data Sources</h3>
              <div className="space-y-2">
                {dataSources.map((source) => (
                  <DataSourceCard key={source.label} source={source} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
