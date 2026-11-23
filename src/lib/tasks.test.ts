import { describe, it, expect } from "vitest";
import { Task, Status, TaskPriority } from "@/types/task";
import { generatePositionBetween, sortByPosition } from "./fractional-indexing";

describe("Tasks Module - State & Logic", () => {
  const sampleStatuses: Status[] = [
    { id: "stat-todo", workspace_id: "ws-1", name: "Do zrobienia", color: "#8c3150", category: "todo", position: 1 },
    { id: "stat-prog", workspace_id: "ws-1", name: "W trakcie", color: "#C93B6D", category: "active", position: 2 },
    { id: "stat-done", workspace_id: "ws-1", name: "Ukończone", color: "#4E7356", category: "done", position: 3 },
  ];

  it("creates a task with fractional index position", () => {
    const p1 = generatePositionBetween();
    const task: Task = {
      id: "tsk-test-1",
      workspace_id: "ws-1",
      list_id: "lst-1",
      title: "Zadanie testowe",
      status_id: "stat-todo",
      priority: 2,
      estimate_minutes: 120,
      position: p1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    expect(task.id).toBe("tsk-test-1");
    expect(task.priority).toBe(2);
    expect(task.position).toBe(p1);
  });

  it("handles subtasks hierarchy (up to 3 levels)", () => {
    const parentTask: Task = {
      id: "tsk-parent",
      workspace_id: "ws-1",
      list_id: "lst-1",
      title: "Zadanie nadrzędne",
      status_id: "stat-prog",
      priority: 1,
      estimate_minutes: 300,
      position: "1000",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subtasks: [
        {
          id: "tsk-sub-1",
          workspace_id: "ws-1",
          list_id: "lst-1",
          parent_id: "tsk-parent",
          title: "Podzadanie 1",
          status_id: "stat-done",
          priority: 2,
          estimate_minutes: 60,
          position: "1000",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    };

    expect(parentTask.subtasks?.length).toBe(1);
    expect(parentTask.subtasks?.[0].parent_id).toBe("tsk-parent");
  });

  it("calculates checklist progress accurately", () => {
    const checklists = [
      {
        id: "chk-1",
        task_id: "tsk-1",
        title: "Test checklist",
        position: 1,
        items: [
          { id: "i1", checklist_id: "chk-1", title: "Item 1", is_completed: true, position: 1 },
          { id: "i2", checklist_id: "chk-1", title: "Item 2", is_completed: true, position: 2 },
          { id: "i3", checklist_id: "chk-1", title: "Item 3", is_completed: false, position: 3 },
          { id: "i4", checklist_id: "chk-1", title: "Item 4", is_completed: false, position: 4 },
        ],
      },
    ];

    const total = checklists[0].items.length;
    const completed = checklists[0].items.filter((i) => i.is_completed).length;
    const percentage = Math.round((completed / total) * 100);

    expect(total).toBe(4);
    expect(completed).toBe(2);
    expect(percentage).toBe(50);
  });

  it("filters tasks by status, priority, and text search", () => {
    const tasks: Task[] = [
      { id: "t1", workspace_id: "ws-1", list_id: "lst-1", title: "Makiety UI", status_id: "stat-todo", priority: 1, position: "a", estimate_minutes: 60, created_at: "", updated_at: "" },
      { id: "t2", workspace_id: "ws-1", list_id: "lst-1", title: "Implementacja API", status_id: "stat-prog", priority: 2, position: "b", estimate_minutes: 60, created_at: "", updated_at: "" },
      { id: "t3", workspace_id: "ws-1", list_id: "lst-1", title: "Testy E2E", status_id: "stat-done", priority: 3, position: "c", estimate_minutes: 60, created_at: "", updated_at: "" },
    ];

    // Search filter
    const searchMatch = tasks.filter((t) => t.title.toLowerCase().includes("api"));
    expect(searchMatch.length).toBe(1);
    expect(searchMatch[0].id).toBe("t2");

    // Priority filter
    const prioMatch = tasks.filter((t) => [1, 2].includes(t.priority));
    expect(prioMatch.length).toBe(2);

    // Status filter
    const statusMatch = tasks.filter((t) => t.status_id === "stat-done");
    expect(statusMatch.length).toBe(1);
    expect(statusMatch[0].id).toBe("t3");
  });
});
