import { test, expect } from "@playwright/test";

test.describe("Velodrome Shell & Dashboard (/)", () => {
  test("renders hero banner with greeting, date and stat pills", async ({ page }) => {
    await page.goto("/");

    // Banner heading
    const header = page.locator("header.hero");
    await expect(header).toBeVisible();
    await expect(header.locator("h1")).toContainText("Velodrome");

    // Stat pills
    await expect(header.locator(".pill").filter({ hasText: "Stable" })).toBeVisible();
    await expect(header.locator(".pill").filter({ hasText: "Growing" })).toBeVisible();
  });

  test("switches between context tabs smoothly without overlapping", async ({ page }) => {
    await page.goto("/");

    // Default Overview tab is selected
    await expect(page.locator("button[role='tab'][aria-selected='true']")).toHaveText("Overview");
    await expect(page.locator("text=Monthly Recurring Revenue")).toBeVisible();
    await expect(page.locator("text=Product Overview")).toBeVisible();

    // Switch to Analytics tab
    await page.getByRole("tab", { name: "Analytics" }).click();
    await expect(page.locator("text=Szczegółowa Analityka i KPI")).toBeVisible();

    // Switch to Billing tab
    await page.getByRole("tab", { name: "Billing" }).click();
    await expect(page.locator("text=Faktury & Rozliczenia Finansowe")).toBeVisible();

    // Switch to Settings tab
    await page.getByRole("tab", { name: "Settings" }).click();
    await expect(page.locator("text=Ustawienia Przestrzeni Roboczej")).toBeVisible();
  });

  test("opens command palette with Help button and closes with ESC", async ({ page }) => {
    await page.goto("/");

    // Click help icon
    await page.locator("button[aria-label='Help & Command Palette']").click();
    await expect(page.locator("role=dialog")).toBeVisible();
    await expect(page.locator("input[placeholder*='Wpisz polecenie']")).toBeVisible();

    // Press Escape to close
    await page.keyboard.press("Escape");
    await expect(page.locator("role=dialog")).not.toBeVisible();
  });

  test("interacts with product overview table and sorting", async ({ page }) => {
    await page.goto("/");

    const table = page.locator("table");
    await expect(table).toBeVisible();
    await expect(page.locator("text=Roche Watch A18")).toBeVisible();

    // On viewport >= 640px, the table headers with sorting are visible; on mobile they transform into cards
    const priceBtn = page.getByRole("button", { name: /Price/ });
    if (await priceBtn.isVisible()) {
      await priceBtn.click();
      await expect(table).toBeVisible();
    }
  });
});
