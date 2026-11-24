"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/workspace-context";
import { useTask } from "@/context/task-context";
import { getRoleLabel } from "@/lib/permissions";

interface SidebarProps {
  onNewTaskClick: () => void;
  onCreateWorkspaceClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onNewTaskClick,
  onCreateWorkspaceClick,
}) => {
  const {
    currentWorkspace,
    workspaces,
    switchWorkspace,
    currentRole,
    isSidebarOpen,
    setIsSidebarOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    activeTab,
    setActiveTab,
  } = useWorkspace();

  const { spaces, activeListId, setActiveListId, setActiveSpaceId } = useTask();

  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [openSpaces, setOpenSpaces] = useState<Record<string, boolean>>({
    "sp-client-projects": true,
    "sp-finance": true,
    "sp-marketing": true,
  });

  const toggleSpace = (id: string) => {
    setOpenSpaces((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const content = (
    <aside
      className={`sidebar flex flex-col justify-between h-full p-3.5 bg-[var(--surface)] border border-[var(--line)] rounded-2xl shadow-sm transition-all duration-200 z-40 ${
        isSidebarCollapsed ? "w-16 items-center" : "w-60"
      }`}
    >
      <div className="space-y-4 w-full">
        {/* Workspace Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--line)] border border-[var(--line)] transition-colors text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--blue-500)] to-[var(--blue-700)] text-white font-bold text-xs flex items-center justify-center flex-none">
                {currentWorkspace.name.charAt(0)}
              </div>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <div className="font-semibold text-xs text-[var(--text)] truncate">
                    {currentWorkspace.name}
                  </div>
                  <div className="text-[0.62rem] text-[var(--muted)] flex items-center gap-1">
                    <span>{currentWorkspace.default_currency}</span>
                    <span>•</span>
                    <span className="text-[var(--accent)]">{getRoleLabel(currentRole)}</span>
                  </div>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <svg className="w-3.5 h-3.5 text-[var(--muted)] flex-none" viewBox="0 0 10 10">
                <path d="M1 3h8L5 8z" fill="currentColor" />
              </svg>
            )}
          </button>

          {/* Workspace Dropdown */}
          {isWorkspaceMenuOpen && (
            <div className="pop float absolute w-56 left-0 top-12 z-50 p-1.5 shadow-xl">
              <div className="text-xs font-semibold text-[var(--muted)] border-b border-[var(--line)] p-2 mb-1">
                Twoje przestrzenie robocze
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => {
                    switchWorkspace(ws.id);
                    setIsWorkspaceMenuOpen(false);
                  }}
                  className={`mi ${ws.id === currentWorkspace.id ? "bg-[var(--surface-2)] font-semibold" : ""}`}
                >
                  <span className="truncate">{ws.name}</span>
                  <span className="text-[0.65rem] opacity-75">{ws.default_currency}</span>
                </button>
              ))}
              <div className="border-t border-[var(--line)] pt-1 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsWorkspaceMenuOpen(false);
                    onCreateWorkspaceClick();
                  }}
                  className="mi text-[var(--accent)] font-medium"
                >
                  + Nowy workspace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Add Button */}
        {!isSidebarCollapsed ? (
          <button
            type="button"
            onClick={onNewTaskClick}
            className="btn w-full text-xs font-medium py-2 shadow-sm"
          >
            + Nowe zadanie
          </button>
        ) : (
          <button
            type="button"
            onClick={onNewTaskClick}
            className="w-8 h-8 rounded-full bg-[var(--ink-btn)] text-[var(--on-ink)] flex items-center justify-center font-bold text-sm shadow-md"
            title="Nowe zadanie"
          >
            +
          </button>
        )}

        {/* Navigation items */}
        <div className="space-y-1 w-full pt-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab("Tasks");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "Tasks"
                ? "bg-[var(--surface-2)] text-[var(--accent)] font-semibold"
                : "text-[var(--text)] hover:bg-[var(--surface-2)]"
            }`}
          >
            <svg className="w-4 h-4 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            {!isSidebarCollapsed && <span>Wszystkie zadania</span>}
          </button>
        </div>

        {/* ClickUp-style Space Tree */}
        {!isSidebarCollapsed && (
          <div className="pt-2 border-t border-[var(--line)]">
            <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--muted)] px-2 mb-1.5">
              Przestrzenie (Spaces)
            </div>
            <div className="space-y-2">
              {spaces.map((sp) => (
                <div key={sp.id} className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => toggleSpace(sp.id)}
                    className="w-full flex items-center justify-between px-2 py-1 text-xs font-medium text-[var(--text)] hover:bg-[var(--surface-2)] rounded-md"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full flex-none" style={{ backgroundColor: sp.color }} />
                      <span className="truncate">{sp.name}</span>
                    </div>
                    <span className="text-[0.6rem] text-[var(--muted)]">
                      {openSpaces[sp.id] ? "▾" : "▸"}
                    </span>
                  </button>

                  {openSpaces[sp.id] && (
                    <div className="pl-4 space-y-0.5">
                      {sp.lists.map((lst) => (
                        <button
                          key={lst.id}
                          type="button"
                          onClick={() => {
                            setActiveSpaceId(sp.id);
                            setActiveListId(lst.id);
                            setActiveTab("Tasks");
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1 text-[0.72rem] rounded truncate block transition ${
                            activeTab === "Tasks" && activeListId === lst.id
                              ? "text-[var(--accent)] font-semibold bg-[var(--surface-2)]"
                              : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                          }`}
                        >
                          • {lst.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer controls: Collapse button */}
      <div className="w-full border-t border-[var(--line)] pt-3 flex items-center justify-between">
        {!isSidebarCollapsed && (
          <div className="text-[0.68rem] text-[var(--muted)] truncate">
            {currentWorkspace.name}
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--muted)] hidden lg:inline-flex"
          aria-label={isSidebarCollapsed ? "Rozwiń panel boczny" : "Zwiń panel boczny"}
          title={isSidebarCollapsed ? "Rozwiń panel" : "Zwiń panel"}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isSidebarCollapsed ? (
              <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
            ) : (
              <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
            )}
          </svg>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <div className="hidden lg:flex flex-col h-full flex-none self-stretch">{content}</div>

      {/* Mobile Drawer (<= 900px) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Drawer panel */}
          <div className="relative w-64 h-full z-50 p-2">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
