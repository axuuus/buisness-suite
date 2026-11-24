"use client";

import React from "react";
import { Task, TaskPriority } from "@/types/task";
import { useTask } from "@/context/task-context";
import { useWorkspace } from "@/context/workspace-context";

interface TaskRowProps {
  task: Task;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({ task, onMoveUp, onMoveDown }) => {
  const { setSelectedTaskId, updateTask, statuses, tags } = useTask();
  const { members } = useWorkspace();

  const isDone = task.status_id === "stat-done";
  const status = statuses.find((s) => s.id === task.status_id) || statuses[0];

  const handleToggleDone = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = isDone ? "stat-todo" : "stat-done";
    updateTask(task.id, { status_id: nextStatus });
  };

  const priorityMeta: Record<TaskPriority, { icon: string; label: string; color: string }> = {
    1: { icon: "🚩", label: "Pilny", color: "text-red-500" },
    2: { icon: "🚩", label: "Wysoki", color: "text-amber-500" },
    3: { icon: "🚩", label: "Normalny", color: "text-blue-400" },
    4: { icon: "🚩", label: "Niski", color: "text-gray-400" },
  };

  // Due date styling
  let dueDateText = "";
  let dueDateColor = "text-[var(--muted)]";
  if (task.due_date) {
    const due = new Date(task.due_date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.round((due.getTime() - now.getTime()) / 86400000);

    if (diffDays < 0 && !isDone) {
      dueDateText = `Zaległe (${Math.abs(diffDays)}d)`;
      dueDateColor = "text-red-400 font-semibold";
    } else if (diffDays === 0) {
      dueDateText = "Dzisiaj";
      dueDateColor = "text-amber-400 font-semibold";
    } else if (diffDays === 1) {
      dueDateText = "Jutro";
    } else {
      dueDateText = task.due_date;
    }
  }

  // Checklist counts
  const totalChecklistItems =
    task.checklists?.reduce((sum, chk) => sum + chk.items.length, 0) || 0;
  const completedChecklistItems =
    task.checklists?.reduce(
      (sum, chk) => sum + chk.items.filter((i) => i.is_completed).length,
      0
    ) || 0;

  // Subtask counts
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks =
    task.subtasks?.filter((s) => s.status_id === "stat-done").length || 0;

  return (
    <div
      onClick={() => setSelectedTaskId(task.id)}
      className="group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg border-b border-[var(--line)] hover:bg-[var(--chip)] cursor-pointer transition-colors duration-150 select-none text-xs"
    >
      {/* Left: Reorder handles + Status Checkbox + Title */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Reorder arrows */}
        <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
          {onMoveUp && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              className="text-[0.6rem] text-[var(--muted)] hover:text-[var(--text)] leading-none"
              title="Przesuń wyżej"
            >
              ▲
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              className="text-[0.6rem] text-[var(--muted)] hover:text-[var(--text)] leading-none"
              title="Przesuń niżej"
            >
              ▼
            </button>
          )}
        </div>

        {/* Checkbox button */}
        <button
          type="button"
          onClick={handleToggleDone}
          className={`w-4 h-4 rounded flex items-center justify-center border transition ${
            isDone
              ? "bg-[#4E7356] border-[#4E7356] text-white"
              : "border-[var(--line)] hover:border-[var(--accent)]"
          }`}
          title={isDone ? "Oznacz jako nieukończone" : "Oznacz jako ukończone"}
        >
          {isDone && <span className="text-[0.65rem] font-bold">✓</span>}
        </button>

        {/* Title */}
        <span
          className={`font-medium truncate ${
            isDone ? "line-through text-[var(--muted)] opacity-70" : "text-[var(--text)]"
          }`}
        >
          {task.title}
        </span>

        {/* Badges: Checklists & Subtasks */}
        {totalChecklistItems > 0 && (
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.65rem] bg-[var(--surface)] text-[var(--muted)] border border-[var(--line)] flex-none"
            title={`Lista kontrolna: ${completedChecklistItems}/${totalChecklistItems}`}
          >
            ☑ {completedChecklistItems}/{totalChecklistItems}
          </span>
        )}

        {totalSubtasks > 0 && (
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.65rem] bg-[var(--surface)] text-[var(--muted)] border border-[var(--line)] flex-none"
            title={`Podzadania: ${completedSubtasks}/${totalSubtasks}`}
          >
            ↳ {completedSubtasks}/{totalSubtasks}
          </span>
        )}
      </div>

      {/* Right meta: Status, Priority, Due Date, Tags, Assignees */}
      <div className="flex items-center gap-3 flex-none text-[0.72rem]">
        {/* Tagi (tylko na ekranach >= 768px) */}
        {task.tag_ids && task.tag_ids.length > 0 && (
          <div className="hidden md:flex items-center gap-1">
            {task.tag_ids.slice(0, 2).map((tid) => {
              const tg = tags.find((t) => t.id === tid);
              if (!tg) return null;
              return (
                <span
                  key={tg.id}
                  className="px-2 py-0.5 rounded-full text-[0.65rem] font-medium"
                  style={{ backgroundColor: `${tg.color}22`, color: tg.color }}
                >
                  #{tg.name}
                </span>
              );
            })}
          </div>
        )}

        {/* Due date */}
        {dueDateText && (
          <span className={`hidden sm:inline-block ${dueDateColor}`}>
            {dueDateText}
          </span>
        )}

        {/* Priority */}
        <span
          className={`flex items-center gap-1 font-semibold ${priorityMeta[task.priority].color}`}
          title={`Priorytet: ${priorityMeta[task.priority].label}`}
        >
          {priorityMeta[task.priority].icon}
        </span>

        {/* Assignee Avatars */}
        {task.assignee_ids && task.assignee_ids.length > 0 ? (
          <div className="flex -space-x-1.5 items-center">
            {task.assignee_ids.slice(0, 3).map((uid) => {
              const m = members.find((mem) => mem.user_id === uid);
              const name = m?.profile.full_name || "User";
              return (
                <span
                  key={uid}
                  className="w-5 h-5 rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--blue-400)] text-white text-[0.6rem] font-bold flex items-center justify-center border border-[var(--surface)]"
                  title={name}
                >
                  {name.charAt(0)}
                </span>
              );
            })}
          </div>
        ) : (
          <span className="w-5 h-5 rounded-full border border-dashed border-[var(--line)] text-[var(--muted)] text-[0.6rem] flex items-center justify-center">
            +
          </span>
        )}
      </div>
    </div>
  );
};
