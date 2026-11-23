export type TaskPriority = 1 | 2 | 3 | 4; // 1: Pilny, 2: Wysoki, 3: Normalny, 4: Niski
export type StatusCategory = "todo" | "active" | "done";

export interface Status {
  id: string;
  workspace_id: string;
  space_id?: string;
  list_id?: string;
  name: string;
  color: string;
  category: StatusCategory;
  position: number;
  is_default?: boolean;
}

export interface Tag {
  id: string;
  workspace_id: string;
  name: string;
  color: string;
}

export interface ChecklistItem {
  id: string;
  checklist_id: string;
  title: string;
  is_completed: boolean;
  position: number;
}

export interface Checklist {
  id: string;
  task_id: string;
  title: string;
  position: number;
  items: ChecklistItem[];
}

export interface Task {
  id: string;
  workspace_id: string;
  list_id: string;
  parent_id?: string | null;
  title: string;
  description?: string;
  status_id: string;
  priority: TaskPriority;
  start_date?: string | null; // ISO Date YYYY-MM-DD
  due_date?: string | null;   // ISO Date YYYY-MM-DD
  estimate_minutes: number;
  position: string;           // Fractional index string (np. "0|hzzzzz:")
  completed_at?: string | null;
  recurring_rule?: string | null;
  custom?: Record<string, unknown>;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string;
  // Relacje
  assignee_ids?: string[];
  tag_ids?: string[];
  checklists?: Checklist[];
  subtasks?: Task[];
}

export interface Space {
  id: string;
  workspace_id: string;
  name: string;
  color: string;
  icon: string;
  position: string;
  lists: List[];
}

export interface Folder {
  id: string;
  workspace_id: string;
  space_id: string;
  name: string;
  position: string;
}

export interface List {
  id: string;
  workspace_id: string;
  space_id: string;
  folder_id?: string | null;
  name: string;
  position: string;
  project_id?: string | null;
  task_count?: number;
}

export type TaskGroupBy = "status" | "priority" | "assignee" | "due_date" | "tag" | "none";
export type TaskSortField = "position" | "priority" | "due_date" | "title" | "created_at" | "estimate";
export type TaskSortDirection = "asc" | "desc";

export interface TaskFilter {
  search?: string;
  status_ids?: string[];
  priority?: TaskPriority[];
  assignee_ids?: string[];
  tag_ids?: string[];
  due_date_range?: "all" | "overdue" | "today" | "this_week" | "no_date";
}

export interface SavedView {
  id: string;
  workspace_id: string;
  user_id?: string;
  scope: "workspace" | "space" | "list";
  name: string;
  type: "list" | "board" | "calendar" | "timeline";
  filters: TaskFilter;
  sort: {
    field: TaskSortField;
    direction: TaskSortDirection;
  };
  group_by: TaskGroupBy;
  columns?: string[];
  is_shared: boolean;
}
