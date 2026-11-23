import { describe, it, expect } from "vitest";
import { generatePositionBetween, sortByPosition } from "./fractional-indexing";

describe("Fractional Indexing", () => {
  it("generates initial middle position when list is empty", () => {
    const pos = generatePositionBetween();
    expect(pos).toBeTruthy();
    expect(typeof pos).toBe("string");
  });

  it("generates element before the first element", () => {
    const first = "m";
    const before = generatePositionBetween(null, first);
    expect(before.localeCompare(first)).toBeLessThan(0);
  });

  it("generates element after the last element", () => {
    const last = "m";
    const after = generatePositionBetween(last, null);
    expect(after.localeCompare(last)).toBeGreaterThan(0);
  });

  it("generates element between two adjacent elements", () => {
    const p1 = "a";
    const p2 = "z";
    const mid = generatePositionBetween(p1, p2);
    expect(mid.localeCompare(p1)).toBeGreaterThan(0);
    expect(mid.localeCompare(p2)).toBeLessThan(0);
  });

  it("handles repeated insertions between same bounds without collision", () => {
    let p1 = "a";
    const p2 = "b";

    const generated: string[] = [];
    for (let i = 0; i < 10; i++) {
      const mid = generatePositionBetween(p1, p2);
      expect(mid.localeCompare(p1)).toBeGreaterThan(0);
      expect(mid.localeCompare(p2)).toBeLessThan(0);
      generated.push(mid);
      p1 = mid; // insert next one between new mid and p2
    }

    // Verify all generated positions are in strictly increasing order
    for (let i = 0; i < generated.length - 1; i++) {
      expect(generated[i].localeCompare(generated[i + 1])).toBeLessThan(0);
    }
  });

  it("correctly sorts items by position string", () => {
    const items = [
      { id: "1", position: "c" },
      { id: "2", position: "a" },
      { id: "3", position: "b" },
      { id: "4", position: "a0" },
    ];

    const sorted = sortByPosition(items);
    expect(sorted.map((i) => i.id)).toEqual(["2", "4", "3", "1"]);
  });
});
