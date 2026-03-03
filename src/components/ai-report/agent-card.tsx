import type { AIContributor } from "@/lib/ai-report-types";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";

export function AgentCard({ contributor }: { contributor: AIContributor }) {
  return (
    <div className="flex gap-3 rounded-lg border p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
        <Bot className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{contributor.model_name}</span>
          <Badge variant="secondary" className="text-xs">
            {contributor.role}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {contributor.description}
        </p>
        <code className="mt-1 block text-xs text-muted-foreground/70">
          {contributor.model_id}
        </code>
      </div>
    </div>
  );
}
