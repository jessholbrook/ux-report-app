"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useAutoSave } from "@/hooks/use-auto-save";
import type {
  Block,
  BlockType,
  BlockContent,
  Annotation,
  AnnotationType,
  ImageKey,
  Report,
} from "@/lib/types";

interface ReportState {
  report: Report;
  blocks: Block[];
  annotations: Annotation[];
  activeBlockId: string | null;
  isDemo: boolean;
  isEditing: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}

interface ReportContextValue extends ReportState {
  setReport: (report: Report) => void;
  setBlocks: (blocks: Block[]) => void;
  setAnnotations: (annotations: Annotation[]) => void;
  addBlock: (type: BlockType, afterPosition?: number) => Block;
  updateBlock: (id: string, content: Partial<BlockContent>) => void;
  removeBlock: (id: string) => void;
  moveBlock: (id: string, newPosition: number) => void;
  setActiveBlock: (id: string | null) => void;
  addAnnotation: (
    blockId: string,
    imageKey: ImageKey,
    xPct: number,
    yPct: number,
    type?: AnnotationType
  ) => Annotation;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  removeAnnotation: (id: string) => void;
  getBlockAnnotations: (blockId: string, imageKey?: ImageKey) => Annotation[];
  updateReportField: (field: keyof Report, value: string | boolean) => void;
}

const ReportContext = createContext<ReportContextValue | null>(null);

function getDefaultContent(type: BlockType): BlockContent {
  switch (type) {
    case "text":
      return { html: "" };
    case "heading":
      return { level: 2, text: "" };
    case "image":
      return { url: "", caption: "", alt: "" };
    case "comparison":
      return {
        before_url: "",
        after_url: "",
        before_label: "Before",
        after_label: "After",
        default_mode: "slider" as const,
      };
    case "divider":
      return {};
  }
}

interface ReportProviderProps {
  children: ReactNode;
  initialReport?: Report;
  initialBlocks?: Block[];
  initialAnnotations?: Annotation[];
  isDemo?: boolean;
  isEditing?: boolean;
  persistLocally?: boolean;
}

export function ReportProvider({
  children,
  initialReport,
  initialBlocks = [],
  initialAnnotations = [],
  isDemo = false,
  isEditing = false,
  persistLocally = true,
}: ReportProviderProps) {
  const [report, setReport] = useState<Report>(
    initialReport ?? {
      id: uuidv4(),
      owner_id: "",
      title: "Untitled Report",
      description: null,
      is_public: false,
      share_token: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  );

  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [annotations, setAnnotations] =
    useState<Annotation[]>(initialAnnotations);
  const [activeBlockId, setActiveBlock] = useState<string | null>(null);

  const addBlock = useCallback(
    (type: BlockType, afterPosition?: number) => {
      const position =
        afterPosition !== undefined
          ? afterPosition + 1
          : blocks.length > 0
            ? Math.max(...blocks.map((b) => b.position)) + 1
            : 0;

      const newBlock: Block = {
        id: uuidv4(),
        report_id: report.id,
        type,
        position,
        content: getDefaultContent(type),
      };

      setBlocks((prev) => {
        const updated = prev.map((b) =>
          b.position >= position ? { ...b, position: b.position + 1 } : b
        );
        return [...updated, newBlock].sort((a, b) => a.position - b.position);
      });

      setActiveBlock(newBlock.id);
      return newBlock;
    },
    [blocks, report.id]
  );

  const updateBlock = useCallback(
    (id: string, content: Partial<BlockContent>) => {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, content: { ...b.content, ...content } } : b
        )
      );
    },
    []
  );

  const removeBlock = useCallback(
    (id: string) => {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
      setAnnotations((prev) => prev.filter((a) => a.block_id !== id));
      if (activeBlockId === id) setActiveBlock(null);
    },
    [activeBlockId]
  );

  const moveBlock = useCallback((id: string, newPosition: number) => {
    setBlocks((prev) => {
      const block = prev.find((b) => b.id === id);
      if (!block) return prev;

      const others = prev.filter((b) => b.id !== id);
      others.splice(newPosition, 0, block);
      return others.map((b, i) => ({ ...b, position: i }));
    });
  }, []);

  const addAnnotation = useCallback(
    (
      blockId: string,
      imageKey: ImageKey,
      xPct: number,
      yPct: number,
      type: AnnotationType = "finding"
    ) => {
      const blockAnnotations = annotations.filter(
        (a) => a.block_id === blockId
      );
      const label =
        blockAnnotations.length > 0
          ? Math.max(...blockAnnotations.map((a) => a.label)) + 1
          : 1;

      const newAnnotation: Annotation = {
        id: uuidv4(),
        block_id: blockId,
        image_key: imageKey,
        x_pct: xPct,
        y_pct: yPct,
        label,
        type,
        text: "",
      };

      setAnnotations((prev) => [...prev, newAnnotation]);
      return newAnnotation;
    },
    [annotations]
  );

  const updateAnnotation = useCallback(
    (id: string, updates: Partial<Annotation>) => {
      setAnnotations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
      );
    },
    []
  );

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const getBlockAnnotations = useCallback(
    (blockId: string, imageKey?: ImageKey) => {
      return annotations.filter(
        (a) =>
          a.block_id === blockId &&
          (imageKey === undefined || a.image_key === imageKey)
      );
    },
    [annotations]
  );

  const updateReportField = useCallback(
    (field: keyof Report, value: string | boolean) => {
      setReport((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const { isSaving, lastSaved } = useAutoSave({
    report,
    blocks,
    annotations,
    enabled: persistLocally && !isDemo,
  });

  return (
    <ReportContext.Provider
      value={{
        report,
        blocks,
        annotations,
        activeBlockId,
        isDemo,
        isEditing,
        isSaving,
        lastSaved,
        setReport,
        setBlocks,
        setAnnotations,
        addBlock,
        updateBlock,
        removeBlock,
        moveBlock,
        setActiveBlock,
        addAnnotation,
        updateAnnotation,
        removeAnnotation,
        getBlockAnnotations,
        updateReportField,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReport must be used within a ReportProvider");
  }
  return context;
}
