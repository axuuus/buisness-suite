"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import {
  Task,
  Space,
  List,
  Status,
  Tag,
  SavedView,
  TaskPriority,
  TaskFilter,
  TaskSortField,
  TaskSortDirection,
  TaskGroupBy,
  Checklist,
  ChecklistItem,
} from "@/types/task";
import { useWorkspace } from "@/context/workspace-context";
import { generatePositionBetween, sortByPosition } from "@/lib/fractional-indexing";

// Domyślne statusy
const DEFAULT_STATUSES: Status[] = [
  { id: "stat-todo", workspace_id: "ws-1", name: "Do zrobienia", color: "#8c3150", category: "todo", position: 1, is_default: true },
  { id: "stat-prog", workspace_id: "ws-1", name: "W trakcie", color: "#C93B6D", category: "active", position: 2 },
  { id: "stat-review", workspace_id: "ws-1", name: "Weryfikacja", color: "#E0839C", category: "active", position: 3 },
  { id: "stat-done", workspace_id: "ws-1", name: "Ukończone", color: "#4E7356", category: "done", position: 4 },
];

// Domyślne tagi
const DEFAULT_TAGS: Tag[] = [
  { id: "tag-design", workspace_id: "ws-1", name: "Design", color: "#C93B6D" },
  { id: "tag-frontend", workspace_id: "ws-1", name: "Frontend", color: "#8C3150" },
  { id: "tag-backend", workspace_id: "ws-1", name: "Backend", color: "#3B82F6" },
  { id: "tag-bug", workspace_id: "ws-1", name: "Bug", color: "#EF4444" },
  { id: "tag-marketing", workspace_id: "ws-1", name: "Marketing", color: "#F59E0B" },
];

// Domyślne przestrzenie i listy
const DEFAULT_SPACES: Space[] = [
  {
    id: "sp-client-projects",
    workspace_id: "ws-1",
    name: "Client Projects",
    color: "#C93B6D",
    icon: "briefcase",
    position: "1",
    lists: [
      { id: "lst-redesign", workspace_id: "ws-1", space_id: "sp-client-projects", name: "Website Redesign", position: "1", task_count: 5 },
      { id: "lst-mobile", workspace_id: "ws-1", space_id: "sp-client-projects", name: "Aplikacja mobilna", position: "2", task_count: 3 },
      { id: "lst-q2", workspace_id: "ws-1", space_id: "sp-client-projects", name: "Kampania Q2", position: "3", task_count: 2 },
    ],
  },
  {
    id: "sp-finance",
    workspace_id: "ws-1",
    name: "Finanse & Rozliczenia",
    color: "#D97706",
    icon: "banknotes",
    position: "2",
    lists: [
      { id: "lst-invoices", workspace_id: "ws-1", space_id: "sp-finance", name: "Faktury i windykacja", position: "1", task_count: 2 },
      { id: "lst-tax", workspace_id: "ws-1", space_id: "sp-finance", name: "Zamknięcie miesiąca", position: "2", task_count: 2 },
    ],
  },
  {
    id: "sp-marketing",
    workspace_id: "ws-1",
    name: "Marketing & Growth",
    color: "#10B981",
    icon: "megaphone",
    position: "3",
    lists: [
      { id: "lst-content", workspace_id: "ws-1", space_id: "sp-marketing", name: "Plan publikacji", position: "1", task_count: 2 },
    ],
  },
];

// Domyślne zadania seedujące
const INITIAL_TASKS: Task[] = [
  {
    id: "tsk-101",
    workspace_id: "ws-1",
    list_id: "lst-redesign",
    title: "Makiety Liquid Glass dla strony głównej i banera",
    description: "Przygotowanie pełnych makiet w Figma uwzględniających rozmycie, gradient różowo-grafitowy oraz stany komponentów.",
    status_id: "stat-prog",
    priority: 1, // Urgent
    due_date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    estimate_minutes: 240,
    position: "1000",
    assignee_ids: ["usr-me"],
    tag_ids: ["tag-design", "tag-frontend"],
    checklists: [
      {
        id: "chk-1",
        task_id: "tsk-101",
        title: "Elementy designu",
        position: 1,
        items: [
          { id: "ci-1", checklist_id: "chk-1", title: "Gradient paska hero", is_completed: true, position: 1 },
          { id: "ci-2", checklist_id: "chk-1", title: "Obsługa trybu ciemnego", is_completed: true, position: 2 },
          { id: "ci-3", checklist_id: "chk-1", title: "Animacja pasów drift", is_completed: false, position: 3 },
        ],
      },
    ],
    subtasks: [
      {
        id: "tsk-101-sub1",
        workspace_id: "ws-1",
        list_id: "lst-redesign",
        parent_id: "tsk-101",
        title: "Wybór palety barw i tokenów",
        status_id: "stat-done",
        priority: 2,
        estimate_minutes: 60,
        position: "1000",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "tsk-101-sub2",
        workspace_id: "ws-1",
        list_id: "lst-redesign",
        parent_id: "tsk-101",
        title: "Wdrożenie tokenów do Tailwind",
        status_id: "stat-prog",
        priority: 2,
        estimate_minutes: 90,
        position: "2000",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "tsk-102",
    workspace_id: "ws-1",
    list_id: "lst-redesign",
    title: "Implementacja wirtualizacji widoku listy (5000+ zadań)",
    description: "Optymalizacja renderowania listy za pomocą kalkulacji widocznego okna scrolla bez opóźnień i z 60fps.",
    status_id: "stat-prog",
    priority: 2, // High
    due_date: new Date(Date.now() + 86400000 * 4).toISOString().split("T")[0],
    estimate_minutes: 360,
    position: "2000",
    assignee_ids: ["usr-me", "usr-piotr"],
    tag_ids: ["tag-frontend"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "tsk-103",
    workspace_id: "ws-1",
    list_id: "lst-redesign",
    title: "Panel zadania (Slide-over / Drawer) z checklistami i tagami",
    description: "Stylowy panel wysuwany z prawej krawędzi z natychmiastowym zapisem i obsługą skrótów klawiszowych.",
    status_id: "stat-todo",
    priority: 2,
    due_date: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
    estimate_minutes: 180,
    position: "3000",
    assignee_ids: ["usr-anna"],
    tag_ids: ["tag-frontend", "tag-design"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "tsk-104",
    workspace_id: "ws-1",
    list_id: "lst-redesign",
    title: "Obsługa sortowania po pozycji ułamkowej (Fractional Indexing)",
    description: "Stabilny algorytm przestawiania kolejności zadań bez reindeksowania całej bazy.",
    status_id: "stat-done",
    priority: 3,
    due_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    estimate_minutes: 120,
    position: "4000",
    assignee_ids: ["usr-me"],
    tag_ids: ["tag-backend"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "tsk-105",
    workspace_id: "ws-1",
    list_id: "lst-redesign",
    title: "Przygotowanie testów E2E dla widoku listy i drag&drop",
    description: "Pokrycie scenariuszy tworzenia zadania, edycji w drawerze, zmiany statusu i filtrów.",
    status_id: "stat-todo",
    priority: 2,
    due_date: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
    estimate_minutes: 180,
    position: "5000",
    assignee_ids: ["usr-anna"],
    tag_ids: ["tag-frontend"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Inne listy
  {
    id: "tsk-201",
    workspace_id: "ws-1",
    list_id: "lst-mobile",
    title: "Konfiguracja nawigacji mobilnej i gesture drawer",
    description: "Szuflada boczna dla ekranów poniżej 900px.",
    status_id: "stat-done",
    priority: 3,
    estimate_minutes: 150,
    position: "1000",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "tsk-202",
    workspace_id: "ws-1",
    list_id: "lst-mobile",
    title: "Testy responsywności na widokach 360px",
    description: "Eliminacja pasków przewijania w poziomie.",
    status_id: "stat-prog",
    priority: 1,
    estimate_minutes: 90,
    position: "2000",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

interface TaskContextType {
  spaces: Space[];
  activeSpaceId: string;
  setActiveSpaceId: (id: string) => void;
  activeListId: string;
  setActiveListId: (id: string) => void;
  activeList: List | undefined;
  activeSpace: Space | undefined;
  statuses: Status[];
  tags: Tag[];
  tasks: Task[];
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  selectedTask: Task | undefined;
  // Operacje na zadaniach
  createTask: (data: Partial<Task> & { title: string; list_id?: string }) => Task;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, targetListId: string, prevPos?: string | null, nextPos?: string | null) => void;
  reorderTask: (taskId: string, prevPos?: string | null, nextPos?: string | null) => void;
  // Podzadania & checklisty
  addSubtask: (parentTaskId: string, title: string) => Task;
  addChecklist: (taskId: string, title: string) => Checklist;
  addChecklistItem: (checklistId: string, title: string) => ChecklistItem;
  toggleChecklistItem: (checklistId: string, itemId: string) => void;
  deleteChecklistItem: (checklistId: string, itemId: string) => void;
  // Filtry, sortowanie, widoki
  filter: TaskFilter;
  setFilter: React.Dispatch<React.SetStateAction<TaskFilter>>;
  groupBy: TaskGroupBy;
  setGroupBy: (gb: TaskGroupBy) => void;
  sortField: TaskSortField;
  setSortField: (sf: TaskSortField) => void;
  sortDirection: TaskSortDirection;
  setSortDirection: (sd: TaskSortDirection) => void;
  savedViews: SavedView[];
  activeSavedViewId: string | null;
  applySavedView: (view: SavedView) => void;
  saveCurrentView: (name: string) => SavedView;
  // Generator 5000 zadań (Stress Test)
  is5kStressMode: boolean;
  generate5000Tasks: () => void;
  resetDemoTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentWorkspace } = useWorkspace();

  const [spaces, setSpaces] = useState<Space[]>(DEFAULT_SPACES);
  const [activeSpaceId, setActiveSpaceId] = useState<string>("sp-client-projects");
  const [activeListId, setActiveListId] = useState<string>("lst-redesign");
  const [statuses] = useState<Status[]>(DEFAULT_STATUSES);
  const [tags, setTags] = useState<Tag[]>(DEFAULT_TAGS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [is5kStressMode, setIs5kStressMode] = useState<boolean>(false);

  // Filtrowanie i sortowanie
  const [filter, setFilter] = useState<TaskFilter>({
    search: "",
    status_ids: [],
    priority: [],
    assignee_ids: [],
    tag_ids: [],
    due_date_range: "all",
  });
  const [groupBy, setGroupBy] = useState<TaskGroupBy>("status");
  const [sortField, setSortField] = useState<TaskSortField>("position");
  const [sortDirection, setSortDirection] = useState<TaskSortDirection>("asc");
  const [savedViews, setSavedViews] = useState<SavedView[]>([
    {
      id: "view-default",
      workspace_id: currentWorkspace.id,
      scope: "list",
      name: "Domyślny widok",
      type: "list",
      filters: {},
      sort: { field: "position", direction: "asc" },
      group_by: "status",
      is_shared: true,
    },
    {
      id: "view-urgent",
      workspace_id: currentWorkspace.id,
      scope: "list",
      name: "Tylko pilne",
      type: "list",
      filters: { priority: [1, 2] },
      sort: { field: "priority", direction: "asc" },
      group_by: "priority",
      is_shared: true,
    },
  ]);
  const [activeSavedViewId, setActiveSavedViewId] = useState<string | null>("view-default");

  // Ładowanie z localStorage (jeśli dostępne)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`velodrome_tasks_${currentWorkspace.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
        }
      }
    } catch {
      // Ignoruj błędy parsowania
    }
  }, [currentWorkspace.id]);

  // Zapisywanie do localStorage (o ile nie jesteśmy w trybie 5000 zadań)
  useEffect(() => {
    if (!is5kStressMode) {
      try {
        localStorage.setItem(`velodrome_tasks_${currentWorkspace.id}`, JSON.stringify(tasks));
      } catch {
        // storage quota
      }
    }
  }, [tasks, currentWorkspace.id, is5kStressMode]);

  const activeSpace = useMemo(() => {
    return spaces.find((s) => s.id === activeSpaceId) || spaces[0];
  }, [spaces, activeSpaceId]);

  const activeList = useMemo(() => {
    for (const sp of spaces) {
      const found = sp.lists.find((l) => l.id === activeListId);
      if (found) return found;
    }
    return spaces[0]?.lists[0];
  }, [spaces, activeListId]);

  const selectedTask = useMemo(() => {
    if (!selectedTaskId) return undefined;
    return tasks.find((t) => t.id === selectedTaskId);
  }, [tasks, selectedTaskId]);

  // Tworzenie zadania
  const createTask = useCallback(
    (data: Partial<Task> & { title: string; list_id?: string }): Task => {
      const targetListId = data.list_id || activeListId;

      // Wylicz pozycję na koniec listy
      const listTasks = tasks.filter((t) => t.list_id === targetListId && !t.parent_id);
      const sorted = sortByPosition(listTasks);
      const lastPos = sorted.length > 0 ? sorted[sorted.length - 1].position : null;
      const newPos = generatePositionBetween(lastPos, null);

      const newTask: Task = {
        id: `tsk-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        workspace_id: currentWorkspace.id,
        list_id: targetListId,
        title: data.title,
        description: data.description || "",
        status_id: data.status_id || statuses[0]?.id || "stat-todo",
        priority: data.priority || 3,
        estimate_minutes: data.estimate_minutes || 0,
        due_date: data.due_date || null,
        position: newPos,
        assignee_ids: data.assignee_ids || [],
        tag_ids: data.tag_ids || [],
        checklists: [],
        subtasks: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setTasks((prev) => [newTask, ...prev]);

      // Zaktualizuj licznik w liście
      setSpaces((prev) =>
        prev.map((sp) => ({
          ...sp,
          lists: sp.lists.map((l) =>
            l.id === targetListId ? { ...l, task_count: (l.task_count || 0) + 1 } : l
          ),
        }))
      );

      return newTask;
    },
    [activeListId, currentWorkspace.id, statuses, tasks]
  );

  // Aktualizacja zadania
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, ...updates, updated_at: new Date().toISOString() };
          // Jeśli status zmienia się na done, ustaw completed_at
          if (updates.status_id) {
            const isDone = updates.status_id === "stat-done";
            updated.completed_at = isDone ? new Date().toISOString() : null;
          }
          return updated;
        }
        return t;
      })
    );
  }, []);

  // Usunięcie zadania
  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSelectedTaskId((curr) => (curr === taskId ? null : curr));
  }, []);

  // Przestawienie pozycji (Fractional Indexing)
  const reorderTask = useCallback(
    (taskId: string, prevPos?: string | null, nextPos?: string | null) => {
      const newPos = generatePositionBetween(prevPos, nextPos);
      updateTask(taskId, { position: newPos });
    },
    [updateTask]
  );

  // Przeniesienie do innej listy
  const moveTask = useCallback(
    (taskId: string, targetListId: string, prevPos?: string | null, nextPos?: string | null) => {
      const newPos = generatePositionBetween(prevPos, nextPos);
      updateTask(taskId, { list_id: targetListId, position: newPos });
    },
    [updateTask]
  );

  // Dodawanie podzadania
  const addSubtask = useCallback(
    (parentTaskId: string, title: string): Task => {
      const parent = tasks.find((t) => t.id === parentTaskId);
      const subtask: Task = {
        id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        workspace_id: currentWorkspace.id,
        list_id: parent?.list_id || activeListId,
        parent_id: parentTaskId,
        title,
        status_id: statuses[0]?.id || "stat-todo",
        priority: 3,
        estimate_minutes: 0,
        position: generatePositionBetween(null, null),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === parentTaskId) {
            return {
              ...t,
              subtasks: [...(t.subtasks || []), subtask],
            };
          }
          return t;
        })
      );
      return subtask;
    },
    [activeListId, currentWorkspace.id, statuses, tasks]
  );

  // Dodawanie checklisty
  const addChecklist = useCallback((taskId: string, title: string): Checklist => {
    const chk: Checklist = {
      id: `chk-${Date.now()}`,
      task_id: taskId,
      title: title || "Lista zadań",
      position: Date.now(),
      items: [],
    };

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            checklists: [...(t.checklists || []), chk],
          };
        }
        return t;
      })
    );
    return chk;
  }, []);

  // Dodawanie elementu checklisty
  const addChecklistItem = useCallback((checklistId: string, title: string): ChecklistItem => {
    const item: ChecklistItem = {
      id: `ci-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`,
      checklist_id: checklistId,
      title,
      is_completed: false,
      position: Date.now(),
    };

    setTasks((prev) =>
      prev.map((t) => {
        if (!t.checklists) return t;
        return {
          ...t,
          checklists: t.checklists.map((c) => {
            if (c.id === checklistId) {
              return { ...c, items: [...c.items, item] };
            }
            return c;
          }),
        };
      })
    );
    return item;
  }, []);

  // Zaznaczanie elementu checklisty
  const toggleChecklistItem = useCallback((checklistId: string, itemId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (!t.checklists) return t;
        return {
          ...t,
          checklists: t.checklists.map((c) => {
            if (c.id === checklistId) {
              return {
                ...c,
                items: c.items.map((i) => (i.id === itemId ? { ...i, is_completed: !i.is_completed } : i)),
              };
            }
            return c;
          }),
        };
      })
    );
  }, []);

  // Usuwanie elementu checklisty
  const deleteChecklistItem = useCallback((checklistId: string, itemId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (!t.checklists) return t;
        return {
          ...t,
          checklists: t.checklists.map((c) => {
            if (c.id === checklistId) {
              return {
                ...c,
                items: c.items.filter((i) => i.id !== itemId),
              };
            }
            return c;
          }),
        };
      })
    );
  }, []);

  // Zarządzanie zapisanymi widokami
  const applySavedView = useCallback((view: SavedView) => {
    setFilter(view.filters || {});
    setGroupBy(view.group_by || "status");
    setSortField(view.sort.field || "position");
    setSortDirection(view.sort.direction || "asc");
    setActiveSavedViewId(view.id);
  }, []);

  const saveCurrentView = useCallback(
    (name: string): SavedView => {
      const newView: SavedView = {
        id: `view-${Date.now()}`,
        workspace_id: currentWorkspace.id,
        scope: "list",
        name,
        type: "list",
        filters: filter,
        sort: { field: sortField, direction: sortDirection },
        group_by: groupBy,
        is_shared: true,
      };
      setSavedViews((prev) => [...prev, newView]);
      setActiveSavedViewId(newView.id);
      return newView;
    },
    [currentWorkspace.id, filter, groupBy, sortDirection, sortField]
  );

  // Generator 5000 zadań (Stress Test / Performance benchmark)
  const generate5000Tasks = useCallback(() => {
    setIs5kStressMode(true);
    const generated: Task[] = [];
    const statusIds = ["stat-todo", "stat-prog", "stat-review", "stat-done"];
    const priorities: TaskPriority[] = [1, 2, 3, 4];
    const tagsIds = ["tag-design", "tag-frontend", "tag-backend", "tag-bug"];

    let lastPos = "0";
    const baseDate = new Date();

    for (let i = 1; i <= 5000; i++) {
      lastPos = generatePositionBetween(lastPos, null);
      const stId = statusIds[i % statusIds.length];
      const prio = priorities[i % priorities.length];
      const dueDate = new Date(baseDate.getTime() + (i % 30) * 86400000).toISOString().split("T")[0];

      generated.push({
        id: `tsk-perf-${i}`,
        workspace_id: currentWorkspace.id,
        list_id: "lst-redesign",
        title: `Zadanie wydajnościowe #${i} – Przetwarzanie danych ${i}`,
        description: `Opis zadania wydajnościowego #${i} do weryfikacji wirtualizacji widoku listy.`,
        status_id: stId,
        priority: prio,
        estimate_minutes: (i % 8 + 1) * 30,
        due_date: dueDate,
        position: lastPos,
        tag_ids: [tagsIds[i % tagsIds.length]],
        assignee_ids: i % 2 === 0 ? ["usr-me"] : ["usr-anna"],
        created_at: baseDate.toISOString(),
        updated_at: baseDate.toISOString(),
      });
    }

    setTasks(generated);
  }, [currentWorkspace.id]);

  const resetDemoTasks = useCallback(() => {
    setIs5kStressMode(false);
    setTasks(INITIAL_TASKS);
  }, []);

  const value = {
    spaces,
    activeSpaceId,
    setActiveSpaceId,
    activeListId,
    setActiveListId,
    activeList,
    activeSpace,
    statuses,
    tags,
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    selectedTask,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTask,
    addSubtask,
    addChecklist,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
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
    is5kStressMode,
    generate5000Tasks,
    resetDemoTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
