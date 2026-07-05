import { describe, it, expect } from "vitest";
import { validateExportedReport } from "./import-json";

const validReport = {
  version: 1,
  exported_at: "2026-01-01T00:00:00.000Z",
  report: { id: "r1", title: "My report" },
  blocks: [{ id: "b1", type: "text", position: 0, content: { html: "<p>hi</p>" } }],
  annotations: [
    { id: "a1", block_id: "b1", x_pct: 10, y_pct: 20 },
  ],
};

describe("validateExportedReport", () => {
  it("accepts a well-formed export", () => {
    expect(validateExportedReport(validReport)).toBe(true);
  });

  it("rejects non-objects and wrong versions", () => {
    expect(validateExportedReport(null)).toBe(false);
    expect(validateExportedReport("nope")).toBe(false);
    expect(validateExportedReport({ ...validReport, version: 2 })).toBe(false);
  });

  it("rejects a missing report title", () => {
    expect(
      validateExportedReport({ ...validReport, report: { id: "r1" } })
    ).toBe(false);
  });

  it("rejects a block with an unknown type", () => {
    const bad = {
      ...validReport,
      blocks: [{ id: "b1", type: "banana", position: 0, content: {} }],
    };
    expect(validateExportedReport(bad)).toBe(false);
  });

  it("rejects a block missing content (regression: crash on render)", () => {
    const bad = {
      ...validReport,
      blocks: [{ id: "b1", type: "text", position: 0 }],
    };
    expect(validateExportedReport(bad)).toBe(false);
  });

  it("rejects an annotation missing coordinates", () => {
    const bad = {
      ...validReport,
      annotations: [{ id: "a1", block_id: "b1" }],
    };
    expect(validateExportedReport(bad)).toBe(false);
  });
});
