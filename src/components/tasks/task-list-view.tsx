"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useTask } from "@/context/task-context";
import { useWorkspace } from "@/context/workspace-context";
import { Task, TaskPriority, TaskGroupBy, TaskSortField } from "@/types/task";
import { TaskRow } from "@/components/tasks/task-row";
import { TaskDrawer } from "@/components/tasks/task-drawer";
import { Button } from "@/components/ui/button";
import { sortByPosition } from "@/lib/fractional-indexing";

const ROW_HEIGHT = 44; // pixels
const OVERSCAN = 12;   // number of items rendered above and below visible viewport

export const TaskListView: React.FC = () => {
  const {
    activeList,
    activeSpace,
    tasks,
    statuses,
    tags,
    filter,
    setFilter,
    groupBy,
    setGroupBy,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    savedViews,
    activeSavedViewId,
    applySavedView,
    saveCurrentView,
    createTask,
    reorderTask,
    is5kStressMode,
    generate5000Tasks,
    resetDemoTasks,
  } = useTask();

  const { members } = useWorkspace();

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [inlineTaskTitles, setInlineTaskTitles] = useState<Record<string, string>>({});
  const [saveViewModalOpen, setSaveViewModalOpen] = useState(false);
  const [newViewName, setNewViewName] = useState("");

  // Virtualization scroll container ref and state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(600);

  // Update viewport dimensions on resize and scroll
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleScroll = () => {
      setScrollTop(el.scrollTop);
    };

    const handleResize = () => {
      setViewportHeight(el.clientHeight || 600);
    };

    handleResize();
    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Filter tasks for current list (or all if stress mode)
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // List check (if not stress mode)
      if (!is5kStressMode && activeList && t.list_id !== activeList.id) {
        return false;
      }

      // Search query
      if (filter.search) {
        const q = filter.search.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = (t.description || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Priority filter
      if (filter.priority && filter.priority.length > 0) {
        if (!filter.priority.includes(t.priority)) return false;
      }

      // Status filter
      if (filter.status_ids && filter.status_ids.length > 0) {
        if (!filter.status_ids.includes(t.status_id)) return false;
      }

      // Assignee filter
      if (filter.assignee_ids && filter.assignee_ids.length > 0) {
        const taskAssignees = t.assignee_ids || [];
        const hasMatching = filter.assignee_ids.some((id) => taskAssignees.includes(id));
        if (!hasMatching) return false;
      }

      return true;
    });
  }, [tasks, is5kStressMode, activeList, filter]);

  // Sort tasks
  const sortedTasks = useMemo(() => {
    const list = [...filteredTasks];
    list.sort((a, b) => {
      let comparison = 0;
      if (sortField === "position") {
        comparison = a.position.localeCompare(b.position);
      } else if (sortField === "priority") {
        comparison = a.priority - b.priority;
      } else if (sortField === "due_date") {
        comparison = (a.due_date || "").localeCompare(b.due_date || "");
      } else if (sortField === "title") {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === "created_at") {
        comparison = a.created_at.localeCompare(b.created_at);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
    return list;
  }, [filteredTasks, sortField, sortDirection]);

  // Group tasks
  interface GroupDefinition {
    id: string;
    label: string;
    color?: string;
    tasks: Task[];
    count: number;
    defaultStatusId?: string;
    defaultPriority?: TaskPriority;
  }

  const groups = useMemo<GroupDefinition[]>(() => {
    if (groupBy === "none") {
      return [
        {
          id: "all",
          label: "Wszystkie zadania",
          tasks: sortedTasks,
          count: sortedTasks.length,
        },
      ];
    }

    if (groupBy === "status") {
      return statuses.map((st) => {
        const groupTasks = sortedTasks.filter((t) => t.status_id === st.id);
        return {
          id: st.id,
          label: st.name,
          color: st.color,
          tasks: groupTasks,
          count: groupTasks.length,
          defaultStatusId: st.id,
        };
      });
    }

    if (groupBy === "priority") {
      const priorityLabels: { p: TaskPriority; label: string; color: string }[] = [
        { p: 1, label: "Pilny (Urgent)", color: "#EF4444" },
        { p: 2, label: "Wysoki (High)", color: "#F59E0B" },
        { p: 3, label: "Normalny (Normal)", color: "#3B82F6" },
        { p: 4, label: "Niski (Low)", color: "#6B7280" },
      ];

      return priorityLabels.map((pl) => {
        const groupTasks = sortedTasks.filter((t) => t.priority === pl.p);
        return {
          id: `prio-${pl.p}`,
          label: pl.label,
          color: pl.color,
          tasks: groupTasks,
          count: groupTasks.length,
          defaultPriority: pl.p,
        };
      });
    }

    if (groupBy === "assignee") {
      const memberGroups = members.map((m) => {
        const groupTasks = sortedTasks.filter((t) => (t.assignee_ids || []).includes(m.user_id));
        return {
          id: `usr-${m.user_id}`,
          label: m.profile.full_name,
          tasks: groupTasks,
          count: groupTasks.length,
        };
      });

      const unassignedTasks = sortedTasks.filter((t) => !t.assignee_ids || t.assignee_ids.length === 0);
      return [
        ...memberGroups,
        {
          id: "unassigned",
          label: "Nieprzypisane",
          color: "#9CA3AF",
          tasks: unassignedTasks,
          count: unassignedTasks.length,
        },
      ];
    }

    return [
      {
        id: "all",
        label: "Zadania",
        tasks: sortedTasks,
        count: sortedTasks.length,
      },
    ];
  }, [groupBy, sortedTasks, statuses, members]);

  // Toggle group collapse
  const toggleGroupCollapse = (groupId: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Inline task submission
  const handleInlineSubmit = (group: GroupDefinition, e: React.FormEvent) => {
    e.preventDefault();
    const title = inlineTaskTitles[group.id]?.trim();
    if (!title) return;

    createTask({
      title,
      status_id: group.defaultStatusId || statuses[0]?.id,
      priority: group.defaultPriority || 3,
      list_id: activeList?.id,
    });

    setInlineTaskTitles((prev) => ({ ...prev, [group.id]: "" }));
  };

  // Move task up/down within list
  const handleMove = (task: Task, direction: "up" | "down", groupTasks: Task[]) => {
    const idx = groupTasks.findIndex((t) => t.id === task.id);
    if (direction === "up" && idx > 0) {
      const targetPrev = idx > 1 ? groupTasks[idx - 2].position : null;
      const targetNext = groupTasks[idx - 1].position;
      reorderTask(task.id, targetPrev, targetNext);
    } else if (direction === "down" && idx < groupTasks.length - 1) {
      const targetPrev = groupTasks[idx + 1].position;
      const targetNext = idx < groupTasks.length - 2 ? groupTasks[idx + 2].position : null;
      reorderTask(task.id, targetPrev, targetNext);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-4 sm:p-6 space-y-4">
      {/* 1. Header Toolbar */}
      <div className="glass p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        {/* Left: List title & Saved views */}
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeSpace?.color || "#C93B6D" }} />
              <h2 className="text-base sm:text-lg font-bold text-[var(--text)]">
                {activeList?.name || "Widok zadań"}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--chip)] text-[var(--muted)] font-medium">
                {filteredTasks.length} zadań
              </span>
            </div>
            <p className="text-[0.7rem] text-[var(--muted)]">
              {activeSpace?.name} › {activeList?.name}
            </p>
          </div>

          {/* Saved Views Pills */}
          <div className="hidden lg:flex items-center gap-1.5 pl-4 border-l border-[var(--line)]">
            {savedViews.map((sv) => (
              <button
                key={sv.id}
                type="button"
                onClick={() => applySavedView(sv)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  sv.id === activeSavedViewId
                    ? "bg-[var(--rose)] text-white"
                    : "bg-[var(--chip)] text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {sv.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSaveViewModalOpen(true)}
              className="text-xs text-[var(--rose)] hover:underline px-1.5"
            >
              + Zapisz widok
            </button>
          </div>
        </div>

        {/* Right: Controls & 5k Stress Test Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Stress test button */}
          <button
            type="button"
            onClick={is5kStressMode ? resetDemoTasks : generate5000Tasks}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition ${
              is5kStressMode
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                : "bg-[var(--chip)] text-[var(--rose)] border-[var(--rose)]/30 hover:border-[var(--rose)]"
            }`}
          >
            {is5kStressMode ? "↺ Resetuj do 5 zadań" : "⚡ Testuj 5000 zadań"}
          </button>

          {/* Group By selector */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <span>Grupuj:</span>
            <select
              aria-label="Grupowanie zadań"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as TaskGroupBy)}
              className="btn text-xs py-1 px-2.5 bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] rounded-lg outline-none cursor-pointer"
            >
              <option value="status">Status</option>
              <option value="priority">Priorytet</option>
              <option value="assignee">Przypisany</option>
              <option value="none">Brak grupowania</option>
            </select>
          </div>

          {/* Sort By selector */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <span>Sortuj:</span>
            <select
              aria-label="Pole sortowania zadań"
              value={sortField}
              onChange={(e) => setSortField(e.target.value as TaskSortField)}
              className="btn text-xs py-1 px-2.5 bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] rounded-lg outline-none cursor-pointer"
            >
              <option value="position">Kolejność (Pozycja)</option>
              <option value="priority">Priorytet</option>
              <option value="due_date">Termin</option>
              <option value="title">Tytuł</option>
            </select>
            <button
              type="button"
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              className="p-1 rounded bg-[var(--surface)] border border-[var(--line)] text-[var(--text)]"
              title={sortDirection === "asc" ? "Rosnąco" : "Malejąco"}
            >
              {sortDirection === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[12rem] max-w-sm">
          <input
            type="text"
            placeholder="Szukaj zadań..."
            value={filter.search || ""}
            onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full bg-[var(--chip)] text-[var(--text)] text-xs px-3 py-1.5 pl-8 rounded-xl border border-[var(--line)] outline-none focus:border-[var(--rose)]"
          />
          <svg
            className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[var(--muted)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>

        {/* Priority quick filter pills */}
        <div className="flex items-center gap-1">
          {([1, 2, 3] as TaskPriority[]).map((p) => {
            const isSelected = filter.priority?.includes(p);
            const label = p === 1 ? "Pilne" : p === 2 ? "Wysokie" : "Normalne";
            return (
              <button
                key={p}
                type="button"
                onClick={() =>
                  setFilter((prev) => {
                    const current = prev.priority || [];
                    const next = current.includes(p)
                      ? current.filter((x) => x !== p)
                      : [...current, p];
                    return { ...prev, priority: next };
                  })
                }
                className={`px-2 py-1 rounded-lg text-[0.7rem] font-medium border transition ${
                  isSelected
                    ? "bg-[var(--rose)] text-white border-[var(--rose)]"
                    : "bg-[var(--chip)] text-[var(--muted)] border-[var(--line)] hover:border-[var(--text)]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Clear filters button */}
        {(filter.search || (filter.priority && filter.priority.length > 0)) && (
          <button
            type="button"
            onClick={() => setFilter({ search: "", priority: [], status_ids: [] })}
            className="text-[0.7rem] text-[var(--rose)] hover:underline ml-1"
          >
            Wyczyść filtry
          </button>
        )}
      </div>

      {/* 3. Main Virtualized Groups List */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0"
        id="task-list-scroll-container"
      >
        {groups.map((grp) => {
          const isCollapsed = !!collapsedGroups[grp.id];
          const groupTasks = grp.tasks;

          // Virtualization logic for this group
          // If the group has <= 20 tasks, render all normally
          // If > 20 tasks, calculate window slice based on scrollTop
          let renderedTasks = groupTasks;
          let topPadding = 0;
          let bottomPadding = 0;

          if (groupTasks.length > 25 && !isCollapsed) {
            const totalCount = groupTasks.length;
            const approxTotalHeight = totalCount * ROW_HEIGHT;
            // Approximate start index relative to scroll
            const visibleCount = Math.ceil(viewportHeight / ROW_HEIGHT);
            const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
            const endIndex = Math.min(totalCount, startIndex + visibleCount + OVERSCAN * 2);

            renderedTasks = groupTasks.slice(startIndex, endIndex);
            topPadding = startIndex * ROW_HEIGHT;
            bottomPadding = Math.max(0, (totalCount - endIndex) * ROW_HEIGHT);
          }

          return (
            <div key={grp.id} className="glass rounded-xl border border-[var(--line)] overflow-hidden">
              {/* Group Header */}
              <div
                onClick={() => toggleGroupCollapse(grp.id)}
                className="flex items-center justify-between px-4 py-2.5 bg-[var(--chip)] cursor-pointer select-none border-b border-[var(--line)]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[0.7rem] text-[var(--muted)]">
                    {isCollapsed ? "▸" : "▾"}
                  </span>
                  {grp.color && (
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: grp.color }}
                    />
                  )}
                  <span className="text-xs font-bold text-[var(--text)] tracking-wide">
                    {grp.label}
                  </span>
                  <span className="text-[0.68rem] px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--muted)] font-semibold">
                    {grp.count}
                  </span>
                </div>

                <span className="text-[0.68rem] text-[var(--muted)]">
                  {isCollapsed ? "Kliknij, aby rozwinąć" : ""}
                </span>
              </div>

              {/* Group Body: Tasks + Inline Add */}
              {!isCollapsed && (
                <div className="p-1 space-y-0.5">
                  {/* Top virtual spacer */}
                  {topPadding > 0 && <div style={{ height: `${topPadding}px` }} />}

                  {renderedTasks.map((t) => (
                    <TaskRow
                      key={t.id}
                      task={t}
                      onMoveUp={() => handleMove(t, "up", groupTasks)}
                      onMoveDown={() => handleMove(t, "down", groupTasks)}
                    />
                  ))}

                  {/* Bottom virtual spacer */}
                  {bottomPadding > 0 && <div style={{ height: `${bottomPadding}px` }} />}

                  {/* Inline quick task creator */}
                  <form
                    onSubmit={(e) => handleInlineSubmit(grp, e)}
                    className="flex items-center gap-2 px-3.5 py-2 mt-1 rounded-lg border border-dashed border-[var(--line)] hover:border-[var(--rose)]/40 transition"
                  >
                    <span className="text-[var(--rose)] text-sm font-bold">+</span>
                    <input
                      type="text"
                      placeholder={`Dodaj zadanie do: ${grp.label} (Enter)...`}
                      value={inlineTaskTitles[grp.id] || ""}
                      onChange={(e) =>
                        setInlineTaskTitles((prev) => ({ ...prev, [grp.id]: e.target.value }))
                      }
                      className="w-full bg-transparent text-xs text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
                    />
                  </form>
                </div>
              )}
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="p-8 text-center glass rounded-xl space-y-2">
            <p className="text-sm font-semibold text-[var(--text)]">Brak zadań spełniających kryteria</p>
            <p className="text-xs text-[var(--muted)]">Zmień filtry lub dodaj nowe zadanie za pomocą paska powyżej.</p>
          </div>
        )}
      </div>

      {/* 4. Slide-over Task Drawer */}
      <TaskDrawer />

      {/* 5. Save View Modal */}
      {saveViewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="glass p-5 rounded-2xl max-w-sm w-full space-y-4 border border-[var(--edge)] shadow-2xl">
            <h3 className="text-sm font-bold text-[var(--text)]">Zapisz bieżący widok</h3>
            <p className="text-xs text-[var(--muted)]">
              Zapisz aktualną konfigurację filtrów, grupowania i sortowania jako nowy widok.
            </p>
            <input
              type="text"
              autoFocus
              placeholder="np. Moje zadania z terminem..."
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              className="w-full bg-[var(--surface)] text-[var(--text)] text-xs px-3 py-2 rounded-xl border border-[var(--line)] outline-none focus:border-[var(--rose)]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSaveViewModalOpen(false)}>
                Anuluj
              </Button>
              <Button
                variant="rose"
                size="sm"
                onClick={() => {
                  if (newViewName.trim()) {
                    saveCurrentView(newViewName.trim());
                    setSaveViewModalOpen(false);
                    setNewViewName("");
                  }
                }}
              >
                Zapisz
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
