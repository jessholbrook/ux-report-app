import type { RepoLink } from "@/lib/ai-report-types";
import { GitBranch, ExternalLink } from "lucide-react";

export function RepoCard({ repo }: { repo: RepoLink }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
    >
      <GitBranch className="size-4 shrink-0 text-muted-foreground mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium group-hover:underline">
            {repo.label}
          </span>
          <ExternalLink className="size-3 text-muted-foreground" />
        </div>
        {repo.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {repo.description}
          </p>
        )}
      </div>
    </a>
  );
}
