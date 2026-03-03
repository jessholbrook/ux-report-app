"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { AIReport } from "@/lib/ai-report-types";
import { saveAIReport } from "@/lib/ai-report-storage";

interface AIReportContextValue {
  report: AIReport;
  isEditing: boolean;
  isDemo: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  updateReport: (updates: Partial<AIReport>) => void;
  setReport: (report: AIReport) => void;
}

const AIReportContext = createContext<AIReportContextValue | null>(null);

interface AIReportProviderProps {
  children: ReactNode;
  initialReport: AIReport;
  isDemo?: boolean;
  isEditing?: boolean;
}

export function AIReportProvider({
  children,
  initialReport,
  isDemo = false,
  isEditing = false,
}: AIReportProviderProps) {
  const [report, setReport] = useState<AIReport>(initialReport);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateReport = useCallback((updates: Partial<AIReport>) => {
    setReport((prev) => ({
      ...prev,
      ...updates,
      updated_at: new Date().toISOString(),
    }));
  }, []);

  // Auto-save
  useEffect(() => {
    if (isDemo || !isEditing) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsSaving(true);
      saveAIReport(report);
      setIsSaving(false);
      setLastSaved(new Date());
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [report, isDemo, isEditing]);

  return (
    <AIReportContext.Provider
      value={{
        report,
        isEditing,
        isDemo,
        isSaving,
        lastSaved,
        updateReport,
        setReport,
      }}
    >
      {children}
    </AIReportContext.Provider>
  );
}

export function useAIReport() {
  const context = useContext(AIReportContext);
  if (!context) {
    throw new Error("useAIReport must be used within an AIReportProvider");
  }
  return context;
}
