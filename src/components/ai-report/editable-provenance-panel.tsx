"use client";

import { useState } from "react";
import type { RepoLink, DataSource, DataSourceType } from "@/lib/ai-report-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronRight,
  FileSearch,
  GitBranch,
  Database,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";

const dataSourceTypes: DataSourceType[] = [
  "dataset",
  "survey",
  "recording",
  "notebook",
  "other",
];

function RepoEditor({
  repo,
  onSave,
  onCancel,
}: {
  repo: RepoLink;
  onSave: (r: RepoLink) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(repo);

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Repository
        </span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-6 px-1.5" onClick={onCancel}>
            <X className="size-3" />
          </Button>
          <Button size="sm" className="h-6 px-1.5" onClick={() => onSave(draft)}>
            <Check className="size-3" />
          </Button>
        </div>
      </div>
      <Input
        value={draft.label}
        onChange={(e) => setDraft({ ...draft, label: e.target.value })}
        placeholder="Label (e.g. Analysis Repository)"
        className="h-8 text-sm"
      />
      <Input
        value={draft.url}
        onChange={(e) => setDraft({ ...draft, url: e.target.value })}
        placeholder="URL"
        className="h-8 text-sm font-mono"
      />
      <Input
        value={draft.description || ""}
        onChange={(e) =>
          setDraft({ ...draft, description: e.target.value || undefined })
        }
        placeholder="Description (optional)"
        className="h-8 text-sm"
      />
    </div>
  );
}

function DataSourceEditor({
  source,
  onSave,
  onCancel,
}: {
  source: DataSource;
  onSave: (s: DataSource) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(source);

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Data Source
        </span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-6 px-1.5" onClick={onCancel}>
            <X className="size-3" />
          </Button>
          <Button size="sm" className="h-6 px-1.5" onClick={() => onSave(draft)}>
            <Check className="size-3" />
          </Button>
        </div>
      </div>
      <Input
        value={draft.label}
        onChange={(e) => setDraft({ ...draft, label: e.target.value })}
        placeholder="Label (e.g. Session Recordings)"
        className="h-8 text-sm"
      />
      <div className="flex gap-1 flex-wrap">
        {dataSourceTypes.map((t) => (
          <Button
            key={t}
            variant={draft.type === t ? "default" : "outline"}
            size="sm"
            className="h-6 text-xs capitalize"
            onClick={() => setDraft({ ...draft, type: t })}
          >
            {t}
          </Button>
        ))}
      </div>
      <Textarea
        value={draft.description || ""}
        onChange={(e) =>
          setDraft({ ...draft, description: e.target.value || undefined })
        }
        placeholder="Description"
        rows={2}
        className="text-sm"
      />
      <Input
        value={draft.url || ""}
        onChange={(e) =>
          setDraft({ ...draft, url: e.target.value || undefined })
        }
        placeholder="URL (optional)"
        className="h-8 text-sm font-mono"
      />
    </div>
  );
}

interface EditableProvenancePanelProps {
  repoLinks: RepoLink[];
  dataSources: DataSource[];
  onUpdateRepos: (repos: RepoLink[]) => void;
  onUpdateSources: (sources: DataSource[]) => void;
}

export function EditableProvenancePanel({
  repoLinks,
  dataSources,
  onUpdateRepos,
  onUpdateSources,
}: EditableProvenancePanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [editingRepo, setEditingRepo] = useState<number | null>(null);
  const [addingRepo, setAddingRepo] = useState(false);
  const [editingSource, setEditingSource] = useState<number | null>(null);
  const [addingSource, setAddingSource] = useState(false);

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
          {/* Repos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Repositories</h3>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setAddingRepo(true)}
              >
                <Plus className="size-3 mr-1" />
                Add Repo
              </Button>
            </div>
            <div className="space-y-2">
              {repoLinks.map((repo, idx) =>
                editingRepo === idx ? (
                  <RepoEditor
                    key={idx}
                    repo={repo}
                    onSave={(r) => {
                      const updated = [...repoLinks];
                      updated[idx] = r;
                      onUpdateRepos(updated);
                      setEditingRepo(null);
                    }}
                    onCancel={() => setEditingRepo(null)}
                  />
                ) : (
                  <div
                    key={idx}
                    className="group flex items-center gap-3 rounded-lg border p-3"
                  >
                    <GitBranch className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium">{repo.label}</span>
                      {repo.description && (
                        <p className="text-xs text-muted-foreground">
                          {repo.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-1.5"
                        onClick={() => setEditingRepo(idx)}
                      >
                        <Pencil className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-1.5 text-destructive hover:text-destructive"
                        onClick={() =>
                          onUpdateRepos(repoLinks.filter((_, i) => i !== idx))
                        }
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                )
              )}
              {addingRepo && (
                <RepoEditor
                  repo={{ url: "", label: "" }}
                  onSave={(r) => {
                    onUpdateRepos([...repoLinks, r]);
                    setAddingRepo(false);
                  }}
                  onCancel={() => setAddingRepo(false)}
                />
              )}
            </div>
          </div>

          {/* Data Sources */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Data Sources</h3>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setAddingSource(true)}
              >
                <Plus className="size-3 mr-1" />
                Add Source
              </Button>
            </div>
            <div className="space-y-2">
              {dataSources.map((source, idx) =>
                editingSource === idx ? (
                  <DataSourceEditor
                    key={idx}
                    source={source}
                    onSave={(s) => {
                      const updated = [...dataSources];
                      updated[idx] = s;
                      onUpdateSources(updated);
                      setEditingSource(null);
                    }}
                    onCancel={() => setEditingSource(null)}
                  />
                ) : (
                  <div
                    key={idx}
                    className="group flex items-center gap-3 rounded-lg border p-3"
                  >
                    <Database className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium">
                          {source.label}
                        </span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {source.type}
                        </Badge>
                      </div>
                      {source.description && (
                        <p className="text-xs text-muted-foreground">
                          {source.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-1.5"
                        onClick={() => setEditingSource(idx)}
                      >
                        <Pencil className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-1.5 text-destructive hover:text-destructive"
                        onClick={() =>
                          onUpdateSources(
                            dataSources.filter((_, i) => i !== idx)
                          )
                        }
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                )
              )}
              {addingSource && (
                <DataSourceEditor
                  source={{ label: "", type: "other" }}
                  onSave={(s) => {
                    onUpdateSources([...dataSources, s]);
                    setAddingSource(false);
                  }}
                  onCancel={() => setAddingSource(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
