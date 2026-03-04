"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  listAIReports,
  type AIReportIndexEntry,
} from "@/lib/ai-report-storage";
import {
  Bot,
  FlaskConical,
  Users,
  MessageCircle,
  FileSearch,
  Plus,
  Sparkles,
} from "lucide-react";

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Bot;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border p-6">
      <Icon className="size-5 text-violet-500 mb-3" />
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function ReportCard({ entry }: { entry: AIReportIndexEntry }) {
  return (
    <Link
      href={`/ai-reports/${entry.id}`}
      className="block rounded-lg border p-5 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="capitalize text-xs">
          {entry.status}
        </Badge>
        <time className="text-xs text-muted-foreground">
          {new Date(entry.updated_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
      <h3 className="font-semibold">{entry.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
        {entry.summary}
      </p>
      {entry.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {entry.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </Link>
  );
}

function LandingContent() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-muted-foreground">
          <Sparkles className="size-3.5 text-violet-500" />
          AI-Native Research
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          AI-Native UX Reports
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Research reports built for transparency. Disclose prompts, show
          reasoning, suggest reviewers, and let anyone interrogate the
          findings.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/ai-reports/new">
              <Plus className="size-4 mr-2" />
              New Report
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/ai-reports/demo">View Demo Report</Link>
          </Button>
        </div>
      </div>

      <div className="mt-20 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={FlaskConical}
          title="Methodology Transparency"
          description="Disclose every prompt, show which AI agents contributed, and make reasoning chains inspectable."
        />
        <FeatureCard
          icon={Bot}
          title="AI Agent Cards"
          description="Document which models were used, their roles, and exact model versions for reproducibility."
        />
        <FeatureCard
          icon={MessageCircle}
          title="Chat with Reports"
          description="Let readers ask follow-up questions and drill into any finding interactively."
        />
        <FeatureCard
          icon={Users}
          title="People & Reviews"
          description="Suggest reviewers and collaborators with rationale. Track review status and approvals."
        />
        <FeatureCard
          icon={FileSearch}
          title="Provenance & Data"
          description="Link to repos, notebooks, datasets, and recordings so findings can be reproduced."
        />
        <FeatureCard
          icon={Sparkles}
          title="Confidence Levels"
          description="Per-finding confidence indicators so readers know what's solid versus speculative."
        />
      </div>
    </div>
  );
}

export default function AIReportsPage() {
  const [entries, setEntries] = useState<AIReportIndexEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(listAIReports());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (entries.length === 0) return <LandingContent />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">AI Reports</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/ai-reports/new">
              <Plus className="size-4 mr-1" />
              New Report
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/ai-reports/demo">View Demo</Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {entries.map((entry) => (
          <ReportCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
