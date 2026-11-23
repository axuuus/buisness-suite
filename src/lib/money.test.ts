import { describe, it, expect } from "vitest";
import { formatMoney, parseMoneyToMinor } from "./money";

describe("Money utility", () => {
  it("converts minor units to formatted currency string without floating point issues", () => {
    const formatted = formatMoney(8741000, "PLN", "pl-PL");
    expect(formatted).toContain("87");
    expect(formatted).toContain("410");
  });

  it("handles zero and small amounts correctly", () => {
    expect(formatMoney(0, "PLN", "pl-PL")).toContain("0,00");
    expect(formatMoney(99, "PLN", "pl-PL")).toContain("0,99");
  });

  it("parses user input string with comma or dot to minor units", () => {
    expect(parseMoneyToMinor("100,50")).toBe(10050);
    expect(parseMoneyToMinor("100.50")).toBe(10050);
    expect(parseMoneyToMinor("  1 250,99 ")).toBe(125099);
  });
});
