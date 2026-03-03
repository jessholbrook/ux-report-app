import type { DataSource } from "@/lib/ai-report-types";
import {
  Database,
  ClipboardList,
  Video,
  BookOpen,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const typeIcons: Record<DataSource["type"], typeof Database> = {
  dataset: Database,
  survey: ClipboardList,
  recording: Video,
  notebook: BookOpen,
  other: FileText,
};

export function DataSourceCard({ source }: { source: DataSource }) {
  const Icon = typeIcons[source.type];
  const Wrapper = source.url ? "a" : "div";
  const linkProps = source.url
    ? { href: source.url, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...linkProps}
      className="group flex gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
    >
      <Icon className="size-4 shrink-0 text-muted-foreground mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium">
            {source.label}
          </span>
          <Badge variant="outline" className="text-xs capitalize">
            {source.type}
          </Badge>
          {source.url && (
            <ExternalLink className="size-3 text-muted-foreground" />
          )}
        </div>
        {source.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {source.description}
          </p>
        )}
      </div>
    </Wrapper>
  );
}
