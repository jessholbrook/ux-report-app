"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const starterQuestions = [
  "What was the most critical finding?",
  "How confident are we in the back-button finding?",
  "What prompts were used for analysis?",
  "Who should review this report and why?",
];

export function ChatPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  function handleSend(text?: string) {
    const message = text || input.trim();
    if (!message) return;

    const userMsg: Message = { role: "user", content: message };

    // Simulated response based on question
    const response = getSimulatedResponse(message);
    const assistantMsg: Message = { role: "assistant", content: response };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
  }

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 size-12 rounded-full p-0 shadow-lg"
      >
        <MessageCircle className="size-5" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-96 flex-col rounded-lg border bg-background shadow-xl max-h-[32rem]">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot className="size-4 text-violet-500" />
          <span className="text-sm font-medium">Chat with this report</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(false)}
          className="size-7 p-0"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[12rem]">
        {messages.length === 0 ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Ask questions about this report&apos;s findings, methodology, or
              recommendations.
            </p>
            <div className="space-y-1.5">
              {starterQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="block w-full rounded-md border px-3 py-2 text-left text-xs hover:bg-muted/50 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900">
                  <Bot className="size-3 text-violet-600 dark:text-violet-400" />
                </div>
              )}
              <div
                className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                  <User className="size-3" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="border-t p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this report..."
            className="text-sm"
          />
          <Button type="submit" size="sm" className="shrink-0 px-3">
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function getSimulatedResponse(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("critical") || q.includes("most important")) {
    return "The most critical finding is the hamburger menu discovery rate — only 25% of participants found the primary navigation without help. This is well below the 80% industry benchmark and directly impacts core task flows like account management.";
  }

  if (q.includes("back") || q.includes("checkout")) {
    return "The back-button finding has medium confidence. While 5 of 12 participants experienced the issue (all on Android), the sample skews 7 Android / 5 iOS. The team recommends a larger Android-specific study to confirm, but the severity of the impact (cart abandonment) warrants proactive design changes.";
  }

  if (q.includes("prompt") || q.includes("methodology") || q.includes("how")) {
    return "Three prompts were used: (1) Session Transcript Analysis — individual session analysis with Claude Opus, (2) Cross-Session Pattern Synthesis — identifying patterns across all 12 sessions, and (3) Action Classification — quantitative classification of 847 user actions with Claude Haiku. All prompts are disclosed in the Methodology section.";
  }

  if (q.includes("review") || q.includes("who")) {
    return "Three reviewers are suggested: Dr. Emily Rivera (VP Product) — she championed the current hamburger menu and needs to see these findings; James Park (Mobile Engineer) — will lead implementation; and Lisa Tran (Research Manager) — for methodology validation of the AI-assisted approach. Lisa has already approved; Emily has requested additional business impact data.";
  }

  if (q.includes("recommend") || q.includes("next") || q.includes("action")) {
    return "Four recommendations: (1) Replace hamburger menu with bottom tab navigation, (2) Surface search as a persistent visible element, (3) Override back button in checkout to navigate steps instead of exiting, (4) Keep current category structure (it tested well at 89% card sort alignment).";
  }

  return "Based on this report's findings, the mobile navigation redesign should prioritize replacing the hamburger menu with bottom tabs and surfacing search. The AI analysis identified these as the highest-impact changes, supported by both qualitative (participant feedback) and quantitative (task completion rates) evidence. Check the Methodology section for full prompt and reasoning transparency.";
}
