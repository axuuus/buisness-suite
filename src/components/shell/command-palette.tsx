"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWorkspace, TabName } from "@/context/workspace-context";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNewTaskClick: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNewTaskClick,
}) => {
  const {
    setActiveTab,
    theme,
    setTheme,
    animationsEnabled,
    setAnimationsEnabled,
    workspaces,
    switchWorkspace,
  } = useWorkspace();

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Global hotkey Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // If not open, parent controls it
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  interface CommandItem {
    id: string;
    title: string;
    category: "Nawigacja" | "Akcje" | "Ustawienia" | "Workspace";
    action: () => void;
  }

  const COMMANDS: CommandItem[] = [
    {
      id: "tab-overview",
      title: "Przejdź do: Przegląd (Overview)",
      category: "Nawigacja",
      action: () => {
        setActiveTab("Overview");
        onClose();
      },
    },
    {
      id: "tab-analytics",
      title: "Przejdź do: Analityka",
      category: "Nawigacja",
      action: () => {
        setActiveTab("Analytics");
        onClose();
      },
    },
    {
      id: "tab-billing",
      title: "Przejdź do: Rozliczenia (Billing)",
      category: "Nawigacja",
      action: () => {
        setActiveTab("Billing");
        onClose();
      },
    },
    {
      id: "tab-settings",
      title: "Przejdź do: Ustawienia",
      category: "Nawigacja",
      action: () => {
        setActiveTab("Settings");
        onClose();
      },
    },
    {
      id: "act-new-task",
      title: "+ Utwórz nowe zadanie",
      category: "Akcje",
      action: () => {
        onClose();
        onNewTaskClick();
      },
    },
    {
      id: "set-theme-dark",
      title: "Przełącz motyw: Ciemny",
      category: "Ustawienia",
      action: () => {
        setTheme("dark");
        onClose();
      },
    },
    {
      id: "set-theme-light",
      title: "Przełącz motyw: Jasny",
      category: "Ustawienia",
      action: () => {
        setTheme("light");
        onClose();
      },
    },
    {
      id: "set-anim",
      title: animationsEnabled ? "Wyłącz animację pasów (drift)" : "Włącz animację pasów (drift)",
      category: "Ustawienia",
      action: () => {
        setAnimationsEnabled(!animationsEnabled);
        onClose();
      },
    },
    ...workspaces.map((ws) => ({
      id: `ws-${ws.id}`,
      title: `Przełącz na workspace: ${ws.name}`,
      category: "Workspace" as const,
      action: () => {
        switchWorkspace(ws.id);
        onClose();
      },
    })),
  ];

  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="ov" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="md max-w-xl w-full p-0 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--line)]">
          <svg className="w-4 h-4 text-[var(--muted)] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-0 outline-none text-sm text-[var(--text)] placeholder-[var(--muted)]"
            placeholder="Wpisz polecenie lub wyszukaj... (np. 'Zadanie', 'Motyw', 'Analityka')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="px-2 py-0.5 text-[0.65rem] font-semibold text-[var(--muted)] bg-[var(--chip)] rounded border border-[var(--line)]">
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => (
              <button
                key={cmd.id}
                type="button"
                onClick={cmd.action}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left hover:bg-[var(--chip)] transition-colors group"
              >
                <span className="font-medium text-[var(--text)] group-hover:text-[var(--accent)]">
                  {cmd.title}
                </span>
                <span className="text-[0.65rem] text-[var(--muted)] bg-[var(--chip)] px-2 py-0.5 rounded-full">
                  {cmd.category}
                </span>
              </button>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-[var(--muted)]">
              Brak pasujących poleceń.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
