"use client";

import React, { useState, useEffect } from "react";
import { useTask } from "@/context/task-context";
import { useWorkspace } from "@/context/workspace-context";
import { TaskPriority } from "@/types/task";
import { Button } from "@/components/ui/button";

export const TaskDrawer: React.FC = () => {
  const {
    selectedTask,
    setSelectedTaskId,
    updateTask,
    deleteTask,
    statuses,
    tags,
    addSubtask,
    addChecklist,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
  } = useTask();

  const { members } = useWorkspace();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [newChecklistItemTitle, setNewChecklistItemTitle] = useState<{ [key: string]: string }>({});
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description || "");
      setIsConfirmDeleteOpen(false);
    }
  }, [selectedTask]);

  // Obsługa klawisza ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedTaskId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedTaskId]);

  if (!selectedTask) return null;

  const currentStatus = statuses.find((s) => s.id === selectedTask.status_id) || statuses[0];

  const handleTitleBlur = () => {
    if (title.trim() && title !== selectedTask.title) {
      updateTask(selectedTask.id, { title: title.trim() });
    }
  };

  const handleDescriptionBlur = () => {
    if (description !== (selectedTask.description || "")) {
      updateTask(selectedTask.id, { description });
    }
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(selectedTask.id, newSubtaskTitle.trim());
    setNewSubtaskTitle("");
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    const t = newChecklistTitle.trim() || "Lista kontrolna";
    addChecklist(selectedTask.id, t);
    setNewChecklistTitle("");
  };

  const handleAddChecklistItem = (checklistId: string, e: React.FormEvent) => {
    e.preventDefault();
    const itemTitle = newChecklistItemTitle[checklistId]?.trim();
    if (!itemTitle) return;
    addChecklistItem(checklistId, itemTitle);
    setNewChecklistItemTitle((prev) => ({ ...prev, [checklistId]: "" }));
  };

  const toggleAssignee = (userId: string) => {
    const current = selectedTask.assignee_ids || [];
    const updated = current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId];
    updateTask(selectedTask.id, { assignee_ids: updated });
  };

  const toggleTag = (tagId: string) => {
    const current = selectedTask.tag_ids || [];
    const updated = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId];
    updateTask(selectedTask.id, { tag_ids: updated });
  };

  const priorities: { value: TaskPriority; label: string; color: string }[] = [
    { value: 1, label: "Pilny (Urgent)", color: "#EF4444" },
    { value: 2, label: "Wysoki (High)", color: "#F59E0B" },
    { value: 3, label: "Normalny (Normal)", color: "#3B82F6" },
    { value: 4, label: "Niski (Low)", color: "#6B7280" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
      {/* Overlay click to close */}
      <div className="absolute inset-0" onClick={() => setSelectedTaskId(null)} />

      {/* Drawer Container */}
      <aside
        className="relative w-full sm:max-w-xl md:max-w-2xl h-full flex flex-col bg-[var(--pop)] border-l border-[var(--edge)] shadow-2xl backdrop-blur-2xl z-10 overflow-hidden"
        role="dialog"
        aria-label="Panel szczegółów zadania"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--line)] bg-[var(--chip)]">
          <div className="flex items-center gap-2">
            {/* Status Selector */}
            <select
              aria-label="Wybierz status zadania"
              className="text-xs font-semibold px-2.5 py-1 rounded-md border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] cursor-pointer outline-none"
              value={selectedTask.status_id}
              onChange={(e) => updateTask(selectedTask.id, { status_id: e.target.value })}
            >
              {statuses.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>

            {/* Priority Selector */}
            <select
              aria-label="Wybierz priorytet zadania"
              className="text-xs font-semibold px-2.5 py-1 rounded-md border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] cursor-pointer outline-none"
              value={selectedTask.priority}
              onChange={(e) =>
                updateTask(selectedTask.id, { priority: Number(e.target.value) as TaskPriority })
              }
            >
              {priorities.map((p) => (
                <option key={p.value} value={p.value}>
                  🚩 {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsConfirmDeleteOpen(true)}
              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-500 text-xs transition"
              title="Usuń zadanie"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTaskId(null)}
              className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--chip)] transition"
              title="Zamknij (ESC)"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Confirm delete alert */}
          {isConfirmDeleteOpen && (
            <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 flex items-center justify-between">
              <span className="text-xs text-red-300 font-medium">Czy na pewno chcesz usunąć to zadanie?</span>
              <div className="flex gap-2">
                <Button variant="danger" size="sm" onClick={() => deleteTask(selectedTask.id)}>
                  Usuń
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsConfirmDeleteOpen(false)}>
                  Anuluj
                </Button>
              </div>
            </div>
          )}

          {/* Title input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              placeholder="Tytuł zadania..."
              className="w-full text-xl font-bold bg-transparent border-b border-transparent hover:border-[var(--line)] focus:border-[var(--accent)] outline-none text-[var(--text)] transition pb-1"
            />
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-[var(--line)] bg-[var(--chip)] text-xs">
            {/* Termin (Due date) */}
            <div className="space-y-1">
              <span className="text-[var(--muted)] block font-medium">Termin wykonania:</span>
              <input
                type="date"
                aria-label="Termin wykonania zadania"
                value={selectedTask.due_date || ""}
                onChange={(e) => updateTask(selectedTask.id, { due_date: e.target.value || null })}
                className="w-full bg-[var(--surface)] text-[var(--text)] px-2.5 py-1.5 rounded-lg border border-[var(--line)] outline-none"
              />
            </div>

            {/* Estymata (Estimate minutes) */}
            <div className="space-y-1">
              <span className="text-[var(--muted)] block font-medium">Estymata czasowa:</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  aria-label="Estymata czasowa w minutach"
                  min="0"
                  step="15"
                  value={selectedTask.estimate_minutes || 0}
                  onChange={(e) =>
                    updateTask(selectedTask.id, { estimate_minutes: Number(e.target.value) || 0 })
                  }
                  className="w-24 bg-[var(--surface)] text-[var(--text)] px-2.5 py-1.5 rounded-lg border border-[var(--line)] outline-none"
                />
                <span className="text-[var(--muted)]">min ({Math.round((selectedTask.estimate_minutes || 0) / 60 * 10) / 10}h)</span>
              </div>
            </div>

            {/* Przypisani użytkownicy */}
            <div className="col-span-1 sm:col-span-2 space-y-1.5">
              <span className="text-[var(--muted)] block font-medium">Przypisani członkowie:</span>
              <div className="flex flex-wrap gap-1.5">
                {members.map((m) => {
                  const isAssigned = (selectedTask.assignee_ids || []).includes(m.user_id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleAssignee(m.user_id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                        isAssigned
                          ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                          : "bg-[var(--surface)] text-[var(--muted)] border-[var(--line)] hover:border-[var(--text)]"
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[0.6rem] font-bold">
                        {m.profile.full_name.charAt(0)}
                      </span>
                      <span>{m.profile.full_name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tagi */}
            <div className="col-span-1 sm:col-span-2 space-y-1.5">
              <span className="text-[var(--muted)] block font-medium">Tagi:</span>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tg) => {
                  const isTagged = (selectedTask.tag_ids || []).includes(tg.id);
                  return (
                    <button
                      key={tg.id}
                      type="button"
                      onClick={() => toggleTag(tg.id)}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition ${
                        isTagged
                          ? "bg-opacity-20 border-current"
                          : "opacity-50 border-transparent hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: isTagged ? `${tg.color}33` : "transparent",
                        borderColor: tg.color,
                        color: tg.color,
                      }}
                    >
                      #{tg.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Description Editor */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--muted)] block">Opis zadania</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              placeholder="Dodaj szczegółowy opis zadania, wymagania techniczne lub wytyczne..."
              className="w-full bg-[var(--surface)] text-[var(--text)] text-xs p-3 rounded-xl border border-[var(--line)] focus:border-[var(--accent)] outline-none transition resize-y leading-relaxed"
            />
          </div>

          {/* Checklists Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Listy kontrolne (Checklists)
              </h4>
              <button
                type="button"
                onClick={handleAddChecklist}
                className="text-xs text-[var(--accent)] hover:underline font-medium"
              >
                + Nowa lista
              </button>
            </div>

            {selectedTask.checklists && selectedTask.checklists.length > 0 ? (
              selectedTask.checklists.map((chk) => {
                const total = chk.items.length;
                const completed = chk.items.filter((i) => i.is_completed).length;
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <div key={chk.id} className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--chip)] space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--text)]">{chk.title}</span>
                      <span className="text-[var(--muted)] text-[0.7rem]">{completed}/{total} ({pct}%)</span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--blue-400)] transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    {/* Items list */}
                    <div className="space-y-1 pt-1">
                      {chk.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-2 text-xs group">
                          <label className="flex items-center gap-2 cursor-pointer truncate">
                            <input
                              type="checkbox"
                              checked={item.is_completed}
                              onChange={() => toggleChecklistItem(chk.id, item.id)}
                              className="rounded border-[var(--line)] text-[var(--accent)] focus:ring-0 cursor-pointer"
                            />
                            <span className={item.is_completed ? "line-through text-[var(--muted)]" : "text-[var(--text)]"}>
                              {item.title}
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() => deleteChecklistItem(chk.id, item.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 text-[0.7rem] transition"
                            title="Usuń punkt"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Item form */}
                    <form onSubmit={(e) => handleAddChecklistItem(chk.id, e)} className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Dodaj punkt..."
                        value={newChecklistItemTitle[chk.id] || ""}
                        onChange={(e) =>
                          setNewChecklistItemTitle((prev) => ({ ...prev, [chk.id]: e.target.value }))
                        }
                        className="flex-1 text-xs bg-[var(--surface)] text-[var(--text)] px-2.5 py-1 rounded-lg border border-[var(--line)] outline-none"
                      />
                      <Button variant="ghost" size="sm" type="submit">
                        +
                      </Button>
                    </form>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-[var(--muted)] italic">Brak list kontrolnych dla tego zadania.</p>
            )}
          </div>

          {/* Subtasks Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Podzadania (Subtasks)
            </h4>

            {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
              <div className="space-y-1.5">
                {selectedTask.subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--line)] bg-[var(--chip)] text-xs"
                  >
                    <span className="font-medium text-[var(--text)] truncate">{sub.title}</span>
                    <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--muted)]">
                      {statuses.find((s) => s.id === sub.status_id)?.name || "Do zrobienia"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Quick add subtask form */}
            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <input
                type="text"
                placeholder="Wpisz tytuł podzadania i naciśnij Enter..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="flex-1 text-xs bg-[var(--surface)] text-[var(--text)] px-3 py-1.5 rounded-lg border border-[var(--line)] outline-none"
              />
              <Button variant="rose" size="sm" type="submit">
                Dodaj
              </Button>
            </form>
          </div>
        </div>
      </aside>
    </div>
  );
};
