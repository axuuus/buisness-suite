"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Workspace, UserProfile, WorkspaceMember, WorkspaceInvitation } from "@/types/workspace";
import { Role } from "@/lib/permissions";
import { BRAND } from "@/config/brand";

export type TabName = "Overview" | "Tasks" | "Analytics" | "Customers" | "Billing" | "Reports" | "Settings";
export type SeasonName = "2024 Season" | "2025 Season" | "2026 Season";
export type PlatformFilter = "All" | "Tiktok Shop" | "Instagram" | "Shopify";

interface WorkspaceContextType {
  currentWorkspace: Workspace;
  workspaces: Workspace[];
  currentUser: UserProfile;
  currentRole: Role;
  members: WorkspaceMember[];
  invitations: WorkspaceInvitation[];
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
  season: SeasonName;
  setSeason: (season: SeasonName) => void;
  platform: PlatformFilter;
  setPlatform: (plat: PlatformFilter) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  theme: "auto" | "light" | "dark";
  setTheme: (t: "auto" | "light" | "dark") => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  switchWorkspace: (workspaceId: string) => void;
  createWorkspace: (name: string, currency?: "PLN" | "EUR" | "USD" | "GBP") => Promise<Workspace>;
  inviteMember: (email: string, role: Role) => Promise<WorkspaceInvitation>;
}

const DEFAULT_WORKSPACES: Workspace[] = [
  {
    id: "ws-1",
    name: "Velodrome Studio",
    slug: "velodrome-studio",
    default_currency: "PLN",
    locale: "pl",
    timezone: "Europe/Warsaw",
    created_at: new Date().toISOString(),
  },
  {
    id: "ws-2",
    name: "Northwind Co.",
    slug: "northwind-co",
    default_currency: "EUR",
    locale: "en",
    timezone: "Europe/Berlin",
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_USER: UserProfile = {
  id: "usr-me",
  full_name: "Jan Kowalski",
  email: "jan@velodrome.app",
  locale: "pl",
};

const DEFAULT_MEMBERS: WorkspaceMember[] = [
  {
    id: "mem-1",
    workspace_id: "ws-1",
    user_id: "usr-me",
    role: "owner",
    status: "active",
    profile: {
      full_name: "Jan Kowalski",
      email: "jan@velodrome.app",
    },
  },
  {
    id: "mem-2",
    workspace_id: "ws-1",
    user_id: "usr-anna",
    role: "admin",
    status: "active",
    profile: {
      full_name: "Anna Nowak",
      email: "anna@velodrome.app",
    },
  },
  {
    id: "mem-3",
    workspace_id: "ws-1",
    user_id: "usr-piotr",
    role: "member",
    status: "active",
    profile: {
      full_name: "Piotr Wiśniewski",
      email: "piotr@velodrome.app",
    },
  },
];

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(DEFAULT_WORKSPACES);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>("ws-1");
  const [members, setMembers] = useState<WorkspaceMember[]>(DEFAULT_MEMBERS);
  const [invitations, setInvitations] = useState<WorkspaceInvitation[]>([]);
  const [activeTab, setActiveTab] = useState<TabName>("Overview");
  const [season, setSeason] = useState<SeasonName>("2025 Season");
  const [platform, setPlatform] = useState<PlatformFilter>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [theme, setThemeState] = useState<"auto" | "light" | "dark">("auto");
  const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(true);

  // Load persisted settings
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("vd_theme") as "auto" | "light" | "dark" | null;
      if (savedTheme) {
        setTheme(savedTheme);
      }
      const savedAnim = localStorage.getItem("vd_anim");
      if (savedAnim !== null) {
        setAnimationsEnabled(savedAnim === "true");
      }
      const savedWs = localStorage.getItem("vd_workspace");
      if (savedWs) {
        setCurrentWorkspaceId(savedWs);
      }
    } catch {
      // ignore
    }
  }, []);

  const setTheme = (t: "auto" | "light" | "dark") => {
    setThemeState(t);
    try {
      localStorage.setItem("vd_theme", t);
    } catch {}
    const root = document.documentElement;
    if (t === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", t);
    }
  };

  const setAnimationsEnabled = (enabled: boolean) => {
    setAnimationsEnabledState(enabled);
    try {
      localStorage.setItem("vd_anim", String(enabled));
    } catch {}
    const root = document.documentElement;
    if (!enabled) {
      root.classList.add("nm");
    } else {
      root.classList.remove("nm");
    }
  };

  const currentWorkspace =
    workspaces.find((w) => w.id === currentWorkspaceId) || workspaces[0];

  const currentMember = members.find(
    (m) => m.workspace_id === currentWorkspace.id && m.user_id === DEFAULT_USER.id
  );
  const currentRole: Role = currentMember ? currentMember.role : "owner";

  const switchWorkspace = (workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId);
    try {
      localStorage.setItem("vd_workspace", workspaceId);
    } catch {}
  };

  const createWorkspace = async (
    name: string,
    currency: "PLN" | "EUR" | "USD" | "GBP" = "PLN"
  ): Promise<Workspace> => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      slug,
      default_currency: currency,
      locale: "pl",
      timezone: "Europe/Warsaw",
      created_at: new Date().toISOString(),
    };
    setWorkspaces((prev) => [...prev, newWs]);
    setMembers((prev) => [
      ...prev,
      {
        id: `mem-${Date.now()}`,
        workspace_id: newWs.id,
        user_id: DEFAULT_USER.id,
        role: "owner",
        status: "active",
        profile: {
          full_name: DEFAULT_USER.full_name,
          email: DEFAULT_USER.email,
        },
      },
    ]);
    switchWorkspace(newWs.id);
    return newWs;
  };

  const inviteMember = async (email: string, role: Role): Promise<WorkspaceInvitation> => {
    const newInv: WorkspaceInvitation = {
      id: `inv-${Date.now()}`,
      workspace_id: currentWorkspace.id,
      email,
      role,
      token: Math.random().toString(36).substring(2, 15),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    };
    setInvitations((prev) => [...prev, newInv]);
    return newInv;
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        workspaces,
        currentUser: DEFAULT_USER,
        currentRole,
        members,
        invitations,
        activeTab,
        setActiveTab,
        season,
        setSeason,
        platform,
        setPlatform,
        searchQuery,
        setSearchQuery,
        isSidebarOpen,
        setIsSidebarOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        theme,
        setTheme,
        animationsEnabled,
        setAnimationsEnabled,
        switchWorkspace,
        createWorkspace,
        inviteMember,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
