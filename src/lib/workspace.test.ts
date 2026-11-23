import { describe, it, expect } from "vitest";
import { can, Role } from "./permissions";
import { formatMoney } from "./money";

interface MockWorkspace {
  id: string;
  name: string;
  currency: "PLN" | "EUR" | "USD" | "GBP";
}

interface MockMembership {
  workspaceId: string;
  userId: string;
  role: Role;
}

describe("Multi-tenant Workspace Isolation & RLS Simulation (Section 5.1 & 5.5)", () => {
  const ws1: MockWorkspace = { id: "ws-1", name: "Velodrome Studio", currency: "PLN" };
  const ws2: MockWorkspace = { id: "ws-2", name: "Acme Agency", currency: "EUR" };

  const memberships: MockMembership[] = [
    { workspaceId: "ws-1", userId: "user-alice", role: "owner" },
    { workspaceId: "ws-1", userId: "user-bob", role: "member" },
    { workspaceId: "ws-2", userId: "user-charlie", role: "owner" },
  ];

  const isMember = (wsId: string, userId: string): boolean => {
    return memberships.some((m) => m.workspaceId === wsId && m.userId === userId);
  };

  const getRole = (wsId: string, userId: string): Role | null => {
    const mem = memberships.find((m) => m.workspaceId === wsId && m.userId === userId);
    return mem ? mem.role : null;
  };

  it("User from ws1 can access ws1 but CANNOT access ws2 (Strict tenant isolation)", () => {
    // Alice in ws1
    expect(isMember(ws1.id, "user-alice")).toBe(true);
    expect(isMember(ws2.id, "user-alice")).toBe(false);

    // Charlie in ws2
    expect(isMember(ws2.id, "user-charlie")).toBe(true);
    expect(isMember(ws1.id, "user-charlie")).toBe(false);
  });

  it("Member role in ws1 cannot see financial rates or delete workspace", () => {
    const bobRole = getRole(ws1.id, "user-bob");
    expect(bobRole).toBe("member");
    expect(can(bobRole, "rates_budgets_costs:view")).toBe(false);
    expect(can(bobRole, "workspace:delete")).toBe(false);
  });

  it("Owner in ws1 can view financial data and manage workspace", () => {
    const aliceRole = getRole(ws1.id, "user-alice");
    expect(aliceRole).toBe("owner");
    expect(can(aliceRole, "rates_budgets_costs:view")).toBe(true);
    expect(can(aliceRole, "workspace:delete")).toBe(true);
  });

  it("Workspace currency formatting displays minor units properly in respective currencies", () => {
    expect(formatMoney(10000n, ws1.currency)).toContain("100,00");
    expect(formatMoney(10000n, ws1.currency)).toContain("zł");
    expect(formatMoney(10000n, ws2.currency)).toContain("100,00");
    expect(formatMoney(10000n, ws2.currency)).toContain("€");
  });
});
