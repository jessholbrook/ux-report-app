import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import type { Block, Annotation } from "./types";

const ANNOTATION_TYPE_LABELS: Record<string, string> = {
  finding: "Finding",
  implication: "Implication",
  change: "Change",
};

export async function exportReportAsPdf(
  title: string,
  blocks: Block[],
  annotations: Annotation[]
): Promise<void> {
  const container = document.getElementById("report-content");
  if (!container) throw new Error("Report content container not found");

  // Find all mode toggle buttons and switch comparisons to side-by-side
  const modeButtons = container.querySelectorAll<HTMLButtonElement>("button");
  modeButtons.forEach((btn) => {
    if (btn.textContent?.includes("Switch to Side by Side")) {
      btn.click();
    }
  });

  // Wait for re-render
  await new Promise((r) => setTimeout(r, 300));

  const dataUrl = await toPng(container, {
    pixelRatio: 2,
    backgroundColor: "#ffffff",
  });

  // Load image to get dimensions
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = dataUrl;
  });

  const imgWidth = 190; // A4 width minus margins (mm)
  const pageHeight = 277; // A4 height minus margins (mm)
  const imgHeight = (img.height * imgWidth) / img.width;

  const pdf = new jsPDF("p", "mm", "a4");
  let heightLeft = imgHeight;
  let position = 10; // top margin

  // Add first page
  pdf.addImage(dataUrl, "PNG", 10, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Add subsequent pages if content overflows
  while (heightLeft > 0) {
    position = -(imgHeight - heightLeft) + 10;
    pdf.addPage();
    pdf.addImage(dataUrl, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // Append annotation summary
  if (annotations.length > 0) {
    pdf.addPage();
    let y = 20;

    pdf.setFontSize(18);
    pdf.text("Annotation Summary", 10, y);
    y += 12;

    // Group annotations by block
    const byBlock = new Map<string, Annotation[]>();
    annotations.forEach((a) => {
      const list = byBlock.get(a.block_id) ?? [];
      list.push(a);
      byBlock.set(a.block_id, list);
    });

    byBlock.forEach((blockAnnotations, blockId) => {
      const block = blocks.find((b) => b.id === blockId);
      const blockLabel =
        block?.type === "image"
          ? "Image Block"
          : block?.type === "comparison"
            ? "Comparison Block"
            : "Block";

      if (y > 260) {
        pdf.addPage();
        y = 20;
      }

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(blockLabel, 10, y);
      y += 7;

      blockAnnotations
        .sort((a, b) => a.label - b.label)
        .forEach((a) => {
          if (y > 270) {
            pdf.addPage();
            y = 20;
          }

          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(10);
          const typeLabel = ANNOTATION_TYPE_LABELS[a.type] || a.type;
          pdf.text(`#${a.label} [${typeLabel}]`, 14, y);
          y += 5;

          if (a.text) {
            pdf.setFont("helvetica", "normal");
            const lines = pdf.splitTextToSize(a.text, 170);
            pdf.text(lines, 14, y);
            y += lines.length * 5 + 3;
          }
        });

      y += 5;
    });
  }

  // Restore comparison modes back to slider if they were toggled
  const restoreButtons = container.querySelectorAll<HTMLButtonElement>("button");
  restoreButtons.forEach((btn) => {
    if (btn.textContent?.includes("Switch to Slider")) {
      btn.click();
    }
  });

  pdf.save(`${title || "report"}.pdf`);
}
