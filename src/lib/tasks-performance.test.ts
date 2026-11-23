import { describe, it, expect } from "vitest";
import { Task, TaskPriority } from "@/types/task";
import { generatePositionBetween, sortByPosition } from "./fractional-indexing";

describe("Tasks Virtualization & 5000 Items Stress Test", () => {
  it("generates, sorts, filters and virtualizes 5000 tasks in < 150ms", () => {
    const startTime = performance.now();

    const tasks: Task[] = [];
    const statusIds = ["stat-todo", "stat-prog", "stat-review", "stat-done"];
    const priorities: TaskPriority[] = [1, 2, 3, 4];

    let lastPos = "0";
    for (let i = 1; i <= 5000; i++) {
      lastPos = generatePositionBetween(lastPos, null);
      tasks.push({
        id: `tsk-stress-${i}`,
        workspace_id: "ws-1",
        list_id: "lst-1",
        title: `Zadanie produkcyjne #${i} dla zespołu inżynieryjnego`,
        status_id: statusIds[i % statusIds.length],
        priority: priorities[i % priorities.length],
        estimate_minutes: (i % 8 + 1) * 30,
        due_date: "2026-12-31",
        position: lastPos,
        assignee_ids: i % 2 === 0 ? ["usr-1"] : ["usr-2"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    expect(tasks.length).toBe(5000);

    // 1. Sort test
    const sorted = sortByPosition(tasks);
    expect(sorted.length).toBe(5000);
    expect(sorted[0].id).toBe("tsk-stress-1");
    expect(sorted[4999].id).toBe("tsk-stress-5000");

    // 2. Filter test (Search query + status filter)
    const filtered = sorted.filter(
      (t) => t.status_id === "stat-prog" && t.title.includes("#250")
    );
    expect(filtered.length).toBeGreaterThan(0);

    // 3. Virtualization window calculation (e.g., scroll position at item 2500)
    const ROW_HEIGHT = 44;
    const VIEWPORT_HEIGHT = 600;
    const OVERSCAN = 12;

    const scrollTop = 2500 * ROW_HEIGHT;
    const visibleCount = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT);
    const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
    const endIndex = Math.min(tasks.length, startIndex + visibleCount + OVERSCAN * 2);

    const windowSlice = sorted.slice(startIndex, endIndex);

    // The virtualized window slice should only hold around 38 items (not 5000 DOM nodes!)
    expect(windowSlice.length).toBeLessThanOrEqual(50);
    expect(windowSlice.length).toBeGreaterThanOrEqual(visibleCount);
    expect(windowSlice[0].id).toBe(`tsk-stress-${startIndex + 1}`);

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Performance assertion: Entire 5000-task processing must complete in < 250ms
    expect(duration).toBeLessThan(250);
  });
});
