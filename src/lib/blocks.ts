import type { Block } from "./types";

/**
 * Move the block with `id` so it sits at `newPosition`, where `newPosition` is
 * the index of the block it should be inserted *before* in the current order
 * (drag-and-drop "insert here" semantics). Returns a new array with positions
 * renumbered 0..n-1. Pure — no mutation of the input.
 *
 * The subtlety: removing the dragged block first shifts every later block up
 * by one, so a downward move must target one slot earlier than the raw drop
 * index, or the block lands one position too low.
 */
export function moveBlockInList(
  blocks: Block[],
  id: string,
  newPosition: number
): Block[] {
  const currentIndex = blocks.findIndex((b) => b.id === id);
  if (currentIndex === -1) return blocks;

  const insertAt = currentIndex < newPosition ? newPosition - 1 : newPosition;

  const others = blocks.filter((b) => b.id !== id);
  others.splice(insertAt, 0, blocks[currentIndex]);
  return others.map((b, i) => ({ ...b, position: i }));
}
