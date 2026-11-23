"use client";

import React, { useState } from "react";
import { WorkspaceProvider, useWorkspace } from "@/context/workspace-context";
import { TaskProvider, useTask } from "@/context/task-context";
import { HeroBanner } from "@/components/shell/hero-banner";
import { Sidebar } from "@/components/shell/sidebar";
import { CommandPalette } from "@/components/shell/command-palette";
import { OverviewTab } from "@/components/dashboard/overview-tab";
import { TaskListView } from "@/components/tasks/task-list-view";
import { AnalyticsTab } from "@/components/dashboard/analytics-tab";
import { CustomersTab } from "@/components/dashboard/customers-tab";
import { BillingTab } from "@/components/dashboard/billing-tab";
import { ReportsTab } from "@/components/dashboard/reports-tab";
import { SettingsTab } from "@/components/dashboard/settings-tab";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

const DashboardContent: React.FC = () => {
  const { activeTab, setActiveTab, createWorkspace } = useWorkspace();
  const { spaces, createTask, setSelectedTaskId } = useTask();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewWorkspaceModalOpen, setIsNewWorkspaceModalOpen] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [newWsCurrency, setNewWsCurrency] = useState<"PLN" | "EUR" | "USD" | "GBP">("PLN");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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
    setActiveTab("Tasks");
    setSelectedTaskId(created.id);
    showToast(`Utworzono zadanie "${taskTitle}"!`);
    setTaskTitle("");
  };

  return (
    <div className="shell h-screen flex flex-col overflow-hidden" id="shell">
      {/* 1. Top Banner (Hero) */}
      <HeroBanner onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      {/* 2. Middle Body: Sidebar + Main Content Area */}
      <div className="flex flex-1 min-h-0 h-full items-stretch overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar
          onNewTaskClick={() => setIsNewTaskModalOpen(true)}
          onCreateWorkspaceClick={() => setIsNewWorkspaceModalOpen(true)}
        />

        {/* Scrollable Main Area */}
        <main className="main flex-1 min-h-0 h-full overflow-y-auto" id="main">
          {activeTab === "Overview" && <OverviewTab />}
          {activeTab === "Tasks" && <TaskListView />}
          {activeTab === "Analytics" && <AnalyticsTab />}
          {activeTab === "Customers" && <CustomersTab />}
          {activeTab === "Billing" && <BillingTab />}
          {activeTab === "Reports" && <ReportsTab />}
          {activeTab === "Settings" && <SettingsTab />}
        </main>
      </div>

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
            <Button variant="rose" type="submit">
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
            <Button variant="rose" type="submit">
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
