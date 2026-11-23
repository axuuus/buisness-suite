/**
 * Role i uprawnienia platformy Velodrome zgodnie z sekcją 6 specyfikacji PLAN-platforma.md
 */

export type Role = "owner" | "admin" | "manager" | "member" | "viewer";

export type Permission =
  | "workspace:manage"
  | "workspace:delete"
  | "invitations:manage"
  | "spaces:create"
  | "tasks:create_edit"
  | "tasks:view"
  | "time:own_entry"
  | "time:others_view_approve"
  | "rates_budgets_costs:view" // Członek zwykły i viewer NIGDY tego nie widzą
  | "invoices_clients_payments:manage"
  | "financial_reports:view";

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  owner: [
    "workspace:manage",
    "workspace:delete",
    "invitations:manage",
    "spaces:create",
    "tasks:create_edit",
    "tasks:view",
    "time:own_entry",
    "time:others_view_approve",
    "rates_budgets_costs:view",
    "invoices_clients_payments:manage",
    "financial_reports:view",
  ],
  admin: [
    "workspace:manage", // bez usuwania workspace
    "invitations:manage",
    "spaces:create",
    "tasks:create_edit",
    "tasks:view",
    "time:own_entry",
    "time:others_view_approve",
    "rates_budgets_costs:view",
    "invoices_clients_payments:manage",
    "financial_reports:view",
  ],
  manager: [
    "spaces:create",
    "tasks:create_edit",
    "tasks:view",
    "time:own_entry",
    "time:others_view_approve",
    "rates_budgets_costs:view",
    "financial_reports:view",
  ],
  member: [
    "tasks:create_edit",
    "tasks:view",
    "time:own_entry",
  ],
  viewer: [
    "tasks:view",
  ],
};

/**
 * Sprawdza, czy dana rola posiada określone uprawnienie.
 */
export function can(role: Role | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Zwraca etykietę roli w języku polskim.
 */
export function getRoleLabel(role: Role): string {
  switch (role) {
    case "owner":
      return "Właściciel";
    case "admin":
      return "Administrator";
    case "manager":
      return "Menedżer";
    case "member":
      return "Członek";
    case "viewer":
      return "Obserwator";
  }
}
