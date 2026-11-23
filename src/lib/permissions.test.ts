import { describe, it, expect } from "vitest";
import { can, type Role, type Permission } from "./permissions";

describe("Permissions Matrix (Section 6)", () => {
  it("owner has all permissions including workspace:delete", () => {
    expect(can("owner", "workspace:delete")).toBe(true);
    expect(can("owner", "workspace:manage")).toBe(true);
    expect(can("owner", "rates_budgets_costs:view")).toBe(true);
    expect(can("owner", "invoices_clients_payments:manage")).toBe(true);
  });

  it("admin has workspace:manage but CANNOT delete workspace", () => {
    expect(can("admin", "workspace:manage")).toBe(true);
    expect(can("admin", "workspace:delete")).toBe(false);
    expect(can("admin", "invitations:manage")).toBe(true);
    expect(can("admin", "rates_budgets_costs:view")).toBe(true);
  });

  it("manager can manage tasks and see financial rates, but cannot manage workspace/invoices", () => {
    expect(can("manager", "tasks:create_edit")).toBe(true);
    expect(can("manager", "rates_budgets_costs:view")).toBe(true);
    expect(can("manager", "workspace:manage")).toBe(false);
    expect(can("manager", "invoices_clients_payments:manage")).toBe(false);
  });

  it("member CANNOT see rates, budgets, costs (Rule: strict financial isolation)", () => {
    expect(can("member", "tasks:create_edit")).toBe(true);
    expect(can("member", "time:own_entry")).toBe(true);
    expect(can("member", "rates_budgets_costs:view")).toBe(false);
    expect(can("member", "financial_reports:view")).toBe(false);
    expect(can("member", "invoices_clients_payments:manage")).toBe(false);
    expect(can("member", "time:others_view_approve")).toBe(false);
  });

  it("viewer is read-only for tasks and cannot see financial data or log time", () => {
    expect(can("viewer", "tasks:view")).toBe(true);
    expect(can("viewer", "tasks:create_edit")).toBe(false);
    expect(can("viewer", "time:own_entry")).toBe(false);
    expect(can("viewer", "rates_budgets_costs:view")).toBe(false);
  });

  it("returns false for null or undefined role", () => {
    expect(can(null, "tasks:view")).toBe(false);
    expect(can(undefined, "tasks:view")).toBe(false);
  });
});
