"use client";

import React, { useState, useEffect } from "react";
import { WorkspaceProvider, useWorkspace } from "@/context/workspace-context";
import { TaskProvider, useTask } from "@/context/task-context";
import { TopBar } from "@/components/shell/top-bar";
import { Sidebar } from "@/components/shell/sidebar";
import { CommandPalette } from "@/components/shell/command-palette";
import { HomeView } from "@/components/dashboard/home-view";
import { BudgetView } from "@/components/dashboard/budget-view";
import { TaskListView } from "@/components/tasks/task-list-view";
import { AnalyticsTab } from "@/components/dashboard/analytics-tab";
import { CustomersTab } from "@/components/dashboard/customers-tab";
import { BillingTab } from "@/components/dashboard/billing-tab";
import { ReportsTab } from "@/components/dashboard/reports-tab";
import { SettingsTab } from "@/components/dashboard/settings-tab";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

const DashboardContent: React.FC = () => {
  const { createWorkspace } = useWorkspace();
  const { spaces, createTask, setSelectedTaskId } = useTask();
  const [activeNav, setActiveNav] = useState("home");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewWorkspaceModalOpen, setIsNewWorkspaceModalOpen] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [newWsCurrency, setNewWsCurrency] = useState<"PLN" | "EUR" | "USD" | "GBP">("PLN");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync activeNav with location hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (["home", "work", "time", "budget", "invoices", "clients", "reports", "settings"].includes(hash)) {
        setActiveNav(hash);
      } else if (!hash) {
        setActiveNav("home");
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleNavChange = (nav: string) => {
    setActiveNav(nav);
    if (nav === "home") {
      window.location.hash = "";
    } else {
      window.location.hash = nav;
    }
  };

  // New task form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskSpaceId, setTaskSpaceId] = useState(spaces[0]?.id || "");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    await createWorkspace(newWsName.trim(), newWsCurrency);
    setIsNewWorkspaceModalOpen(false);
    setNewWsName("");
    showToast(`Utworzono przestrzeń roboczą: ${newWsName}!`);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    const created = createTask({ title: taskTitle.trim() });
    setIsNewTaskModalOpen(false);
    handleNavChange("work");
    setSelectedTaskId(created.id);
    showToast(`Utworzono zadanie "${taskTitle}"!`);
    setTaskTitle("");
  };

  return (
    <div className="shell h-screen flex flex-col overflow-hidden" id="shell">
      {/* 1. Top Bar */}
      <TopBar
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        activeNav={activeNav}
        setActiveNav={handleNavChange}
      />

      {/* 2. Middle Body: Sidebar + Main Content Area */}
      {activeNav === "work" ? (
        <div className="flex flex-1 min-h-0 h-full items-stretch overflow-hidden relative">
          {/* Sidebar only in Work mode */}
          <Sidebar
            onNewTaskClick={() => setIsNewTaskModalOpen(true)}
            onCreateWorkspaceClick={() => setIsNewWorkspaceModalOpen(true)}
          />

          {/* Scrollable Work Main Area */}
          <main className="main flex-1 min-h-0 h-full overflow-y-auto" id="main">
            <TaskListView />
          </main>
        </div>
      ) : (
        <main className="main flex-1 min-h-0 h-full overflow-y-auto" id="main">
          <div className="p-4 md:p-6 max-w-[1440px] mx-auto w-full">
            {activeNav === "home" && <HomeView />}
            {activeNav === "budget" && <BudgetView />}
            {activeNav === "time" && <AnalyticsTab />}
            {activeNav === "invoices" && <BillingTab />}
            {activeNav === "clients" && <CustomersTab />}
            {activeNav === "reports" && <ReportsTab />}
            {activeNav === "settings" && <SettingsTab />}
          </div>
        </main>
      )}

      {/* 3. Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNewTaskClick={() => setIsNewTaskModalOpen(true)}
      />

      {/* 4. New Task Modal */}
      <Modal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        title="Utwórz Nowe Zadanie"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--muted)] block mb-1">
              Tytuł zadania
            </label>
            <input
              type="text"
              required
              autoFocus
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="np. Wdrożenie płatności w aplikacji..."
              className="w-full text-xs p-2.5 rounded-xl bg-[var(--chip)] border border-[var(--line)] outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--muted)] block mb-1">
              Przestrzeń (Space)
            </label>
            <select
              value={taskSpaceId}
              onChange={(e) => setTaskSpaceId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-[var(--chip)] border border-[var(--line)] outline-none"
            >
              {spaces.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" onClick={() => setIsNewTaskModalOpen(false)}>
              Anuluj
            </Button>
            <Button variant="primary" type="submit">
              Utwórz zadanie
            </Button>
          </div>
        </form>
      </Modal>

      {/* 5. New Workspace Modal */}
      <Modal
        isOpen={isNewWorkspaceModalOpen}
        onClose={() => setIsNewWorkspaceModalOpen(false)}
        title="Utwórz Przestrzeń Roboczą (Workspace)"
      >
        <form onSubmit={handleCreateWorkspace} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--muted)] block mb-1">
              Nazwa workspace
            </label>
            <input
              type="text"
              required
              autoFocus
              value={newWsName}
              onChange={(e) => setNewWsName(e.target.value)}
              placeholder="np. Agencja Kreatywna, Brand Studio..."
              className="w-full text-xs p-2.5 rounded-xl bg-[var(--chip)] border border-[var(--line)] outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--muted)] block mb-1">
              Waluta rozliczeniowa
            </label>
            <select
              value={newWsCurrency}
              onChange={(e) => setNewWsCurrency(e.target.value as any)}
              className="w-full text-xs p-2.5 rounded-xl bg-[var(--chip)] border border-[var(--line)] outline-none"
            >
              <option value="PLN">PLN (Polski Złoty)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="USD">USD (Dolar amerykański)</option>
              <option value="GBP">GBP (Funt brytyjski)</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" onClick={() => setIsNewWorkspaceModalOpen(false)}>
              Anuluj
            </Button>
            <Button variant="primary" type="submit">
              Utwórz i przełącz
            </Button>
          </div>
        </form>
      </Modal>

      {/* 6. Toast Notification */}
      <div className={`toast ${toastMsg ? "on" : ""}`} role="status">
        {toastMsg}
      </div>
    </div>
  );
};

export const DashboardShell: React.FC = () => {
  return (
    <WorkspaceProvider>
      <TaskProvider>
        <DashboardContent />
      </TaskProvider>
    </WorkspaceProvider>
  );
};
