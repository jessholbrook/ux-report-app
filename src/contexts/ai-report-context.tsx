"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { AIReport } from "@/lib/ai-report-types";
import { saveAIReport } from "@/lib/ai-report-storage";
import { useAutoSave } from "@/hooks/use-auto-save";

interface AIReportContextValue {
  report: AIReport;
  isEditing: boolean;
  isDemo: boolean;
  saveFailed: boolean;
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

  const updateReport = useCallback((updates: Partial<AIReport>) => {
    setReport((prev) => ({
      ...prev,
      ...updates,
      updated_at: new Date().toISOString(),
    }));
  }, []);

  const { saveFailed, lastSaved } = useAutoSave(
    report,
    saveAIReport,
    !isDemo && isEditing
  );

  return (
    <AIReportContext.Provider
      value={{
        report,
        isEditing,
        isDemo,
        saveFailed,
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
