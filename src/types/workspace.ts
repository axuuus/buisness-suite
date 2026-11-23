import { Role } from "@/lib/permissions";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  default_currency: "PLN" | "EUR" | "USD" | "GBP";
  locale: "pl" | "en";
  timezone: string;
  logo?: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  email: string;
  locale: "pl" | "en";
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: Role;
  status: "active" | "suspended";
  profile: {
    full_name: string;
    avatar_url?: string | null;
    email: string;
  };
}

export interface WorkspaceInvitation {
  id: string;
  workspace_id: string;
  email: string;
  role: Role;
  token: string;
  expires_at: string;
  accepted_at?: string | null;
  created_at: string;
}
