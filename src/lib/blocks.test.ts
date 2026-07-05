import { describe, it, expect } from "vitest";
import { moveBlockInList } from "./blocks";
import type { Block } from "./types";

function block(id: string, position: number): Block {
  return { id, report_id: "r", type: "text", position, content: { html: "" } };
}

const ids = (blocks: Block[]) => blocks.map((b) => b.id);

describe("moveBlockInList", () => {
  const base = [block("A", 0), block("B", 1), block("C", 2), block("D", 3)];

  it("moves a block downward to the correct slot (regression: off-by-one)", () => {
    // Drag A so it inserts before C (drop index 2). Expected: B, A, C, D.
    const result = moveBlockInList(base, "A", 2);
    expect(ids(result)).toEqual(["B", "A", "C", "D"]);
  });

  it("moves a block upward to the correct slot", () => {
    // Drag D so it inserts before B (drop index 1). Expected: A, D, B, C.
    const result = moveBlockInList(base, "D", 1);
    expect(ids(result)).toEqual(["A", "D", "B", "C"]);
  });

  it("moves a block to the end", () => {
    const result = moveBlockInList(base, "A", base.length);
    expect(ids(result)).toEqual(["B", "C", "D", "A"]);
  });

  it("renumbers positions to be contiguous from 0", () => {
    const result = moveBlockInList(base, "A", 2);
    expect(result.map((b) => b.position)).toEqual([0, 1, 2, 3]);
  });

  it("returns the input unchanged when the id is not found", () => {
    const result = moveBlockInList(base, "Z", 1);
    expect(result).toBe(base);
  });

  it("does not mutate the input array", () => {
    const snapshot = ids(base);
    moveBlockInList(base, "A", 3);
    expect(ids(base)).toEqual(snapshot);
  });
});
