import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  saveLocalReport,
  loadLocalReport,
  listLocalReports,
  deleteLocalReport,
} from "./local-storage";
import type { Report } from "./types";

function makeReport(id: string): Report {
  return {
    id,
    owner_id: "",
    title: `Report ${id}`,
    description: null,
    is_public: false,
    share_token: id,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };
}

describe("local-storage", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("round-trips a report and indexes it", () => {
    const report = makeReport("1");
    expect(saveLocalReport(report, [], [])).toBe(true);

    const loaded = loadLocalReport("1");
    expect(loaded?.report.title).toBe("Report 1");
    expect(listLocalReports().map((e) => e.id)).toEqual(["1"]);
  });

  it("deletes a report and its index entry", () => {
    saveLocalReport(makeReport("1"), [], []);
    deleteLocalReport("1");
    expect(loadLocalReport("1")).toBeNull();
    expect(listLocalReports()).toEqual([]);
  });

  it("returns false instead of throwing when the quota is exceeded", () => {
    const spy = vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new DOMException("quota", "QuotaExceededError");
    });

    expect(saveLocalReport(makeReport("1"), [], [])).toBe(false);
    expect(spy).toHaveBeenCalled();
  });

  it("tolerates corrupt index/report JSON without throwing", () => {
    localStorage.setItem("ux-reports-index", "{not json");
    localStorage.setItem("ux-report:1", "also broken");
    expect(listLocalReports()).toEqual([]);
    expect(loadLocalReport("1")).toBeNull();
  });
});
