"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type {
  Methodology,
  AIContributor,
  PromptEntry,
} from "@/lib/ai-report-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronRight,
  FlaskConical,
  Bot,
  Terminal,
  Plus,
  Trash2,
  X,
  Check,
} from "lucide-react";

interface EditableMethodologyPanelProps {
  methodology: Methodology;
  aiContributors: AIContributor[];
  onUpdateMethodology: (methodology: Methodology) => void;
  onUpdateContributors: (contributors: AIContributor[]) => void;
}

function ContributorEditor({
  contributor,
  onSave,
  onCancel,
}: {
  contributor: AIContributor;
  onSave: (c: AIContributor) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(contributor);

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          AI Contributor
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
      <div className="grid grid-cols-2 gap-2">
        <Input
          value={draft.model_name}
          onChange={(e) => setDraft({ ...draft, model_name: e.target.value })}
          placeholder="Model name (e.g. Claude Opus)"
          className="h-8 text-sm"
        />
        <Input
          value={draft.model_id}
          onChange={(e) => setDraft({ ...draft, model_id: e.target.value })}
          placeholder="Model ID"
          className="h-8 text-sm font-mono"
        />
      </div>
      <Input
        value={draft.role}
        onChange={(e) => setDraft({ ...draft, role: e.target.value })}
        placeholder="Role (e.g. Primary Analysis)"
        className="h-8 text-sm"
      />
      <Textarea
        value={draft.description}
        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        placeholder="What this model did..."
        rows={2}
        className="text-sm"
      />
    </div>
  );
}

function PromptEditor({
  prompt,
  onSave,
  onCancel,
}: {
  prompt: PromptEntry;
  onSave: (p: PromptEntry) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(prompt);

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Prompt
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
      <div className="grid grid-cols-2 gap-2">
        <Input
          value={draft.label}
          onChange={(e) => setDraft({ ...draft, label: e.target.value })}
          placeholder="Prompt label"
          className="h-8 text-sm"
        />
        <Input
          value={draft.agent}
          onChange={(e) => setDraft({ ...draft, agent: e.target.value })}
          placeholder="Agent (e.g. Claude Opus)"
          className="h-8 text-sm"
        />
      </div>
      <Textarea
        value={draft.prompt_text}
        onChange={(e) => setDraft({ ...draft, prompt_text: e.target.value })}
        placeholder="The actual prompt text..."
        rows={4}
        className="text-sm font-mono"
      />
      <Textarea
        value={draft.context || ""}
        onChange={(e) =>
          setDraft({ ...draft, context: e.target.value || undefined })
        }
        placeholder="Context (when/why this prompt was used)"
        rows={2}
        className="text-sm"
      />
      <Input
        value={draft.output_summary || ""}
        onChange={(e) =>
          setDraft({ ...draft, output_summary: e.target.value || undefined })
        }
        placeholder="Output summary"
        className="h-8 text-sm"
      />
    </div>
  );
}

export function EditableMethodologyPanel({
  methodology,
  aiContributors,
  onUpdateMethodology,
  onUpdateContributors,
}: EditableMethodologyPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [editingContributor, setEditingContributor] = useState<string | null>(null);
  const [addingContributor, setAddingContributor] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null);
  const [addingPrompt, setAddingPrompt] = useState(false);

  function saveContributor(c: AIContributor) {
    const idx = aiContributors.findIndex((x) => x.model_id === editingContributor);
    if (idx >= 0) {
      const updated = [...aiContributors];
      updated[idx] = c;
      onUpdateContributors(updated);
    }
    setEditingContributor(null);
  }

  function addContributor(c: AIContributor) {
    onUpdateContributors([...aiContributors, c]);
    setAddingContributor(false);
  }

  function deleteContributor(modelId: string) {
    onUpdateContributors(aiContributors.filter((c) => c.model_id !== modelId));
  }

  function savePrompt(p: PromptEntry) {
    const updated = methodology.prompts.map((x) =>
      x.id === editingPrompt ? p : x
    );
    onUpdateMethodology({ ...methodology, prompts: updated });
    setEditingPrompt(null);
  }

  function addPrompt(p: PromptEntry) {
    onUpdateMethodology({
      ...methodology,
      prompts: [...methodology.prompts, p],
    });
    setAddingPrompt(false);
  }

  function deletePrompt(id: string) {
    onUpdateMethodology({
      ...methodology,
      prompts: methodology.prompts.filter((p) => p.id !== id),
    });
  }

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
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Overview
            </label>
            <Textarea
              value={methodology.overview}
              onChange={(e) =>
                onUpdateMethodology({
                  ...methodology,
                  overview: e.target.value,
                })
              }
              placeholder="Describe the research methodology..."
              rows={3}
              className="text-sm"
            />
          </div>

          {/* AI Contributors */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">AI Agents Used</h3>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setAddingContributor(true)}
              >
                <Plus className="size-3 mr-1" />
                Add Agent
              </Button>
            </div>
            <div className="space-y-2">
              {aiContributors.map((contributor) =>
                editingContributor === contributor.model_id ? (
                  <ContributorEditor
                    key={contributor.model_id}
                    contributor={contributor}
                    onSave={saveContributor}
                    onCancel={() => setEditingContributor(null)}
                  />
                ) : (
                  <div
                    key={contributor.model_id}
                    className="group flex gap-3 rounded-lg border p-3"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                      <Bot className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {contributor.model_name}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {contributor.role}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {contributor.description}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-1.5"
                        onClick={() =>
                          setEditingContributor(contributor.model_id)
                        }
                      >
                        <Terminal className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-1.5 text-destructive hover:text-destructive"
                        onClick={() =>
                          deleteContributor(contributor.model_id)
                        }
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                )
              )}
              {addingContributor && (
                <ContributorEditor
                  contributor={{
                    model_name: "",
                    model_id: "",
                    role: "",
                    description: "",
                  }}
                  onSave={addContributor}
                  onCancel={() => setAddingContributor(false)}
                />
              )}
            </div>
          </div>

          {/* Disclosed Prompts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                Disclosed Prompts ({methodology.prompts.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setAddingPrompt(true)}
              >
                <Plus className="size-3 mr-1" />
                Add Prompt
              </Button>
            </div>
            <div className="space-y-2">
              {methodology.prompts.map((prompt) =>
                editingPrompt === prompt.id ? (
                  <PromptEditor
                    key={prompt.id}
                    prompt={prompt}
                    onSave={savePrompt}
                    onCancel={() => setEditingPrompt(null)}
                  />
                ) : (
                  <div
                    key={prompt.id}
                    className="group flex items-center gap-3 rounded-lg border p-3"
                  >
                    <Terminal className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {prompt.label}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {prompt.agent}
                        </Badge>
                      </div>
                      {prompt.context && (
                        <p className="mt-0.5 text-xs text-muted-foreground truncate">
                          {prompt.context}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-1.5"
                        onClick={() => setEditingPrompt(prompt.id)}
                      >
                        <Terminal className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-1.5 text-destructive hover:text-destructive"
                        onClick={() => deletePrompt(prompt.id)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                )
              )}
              {addingPrompt && (
                <PromptEditor
                  prompt={{
                    id: uuidv4(),
                    label: "",
                    prompt_text: "",
                    agent: "",
                  }}
                  onSave={addPrompt}
                  onCancel={() => setAddingPrompt(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
