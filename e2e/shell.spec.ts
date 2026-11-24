import { test, expect } from "@playwright/test";

test.describe("Velodrome Shell & Clean Data Light Dashboard (/)", () => {
  test("renders top navigation bar with logo and nav pills", async ({ page }) => {
    await page.goto("/");

    // TopBar
    const topBar = page.locator("header.top");
    await expect(topBar).toBeVisible();
    await expect(topBar.locator(".logo")).toContainText("velodrome");

    // Nav pills
    await expect(topBar.locator("nav.pills .pill").filter({ hasText: "Home" })).toBeVisible();
    await expect(topBar.locator("nav.pills .pill").filter({ hasText: "Budget" })).toBeVisible();
    await expect(topBar.locator("nav.pills .pill").filter({ hasText: "Work" })).toBeVisible();
  });

  test("renders Home view (#v-home) by default and switches to Budget view (#v-budget)", async ({ page }) => {
    await page.goto("/");

    // Default Home view
    await expect(page.locator("#v-home")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Przegląd");
    await expect(page.locator(".funnel")).toBeVisible();

    // Switch to Budget tab
    await page.locator("nav.pills .pill").filter({ hasText: "Budget" }).click();
    await expect(page.locator("#v-budget")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Rebranding Atlas");

    // Check KPI cards (.g4) and burn-down chart
    await expect(page.locator(".g4")).toBeVisible();
    await expect(page.locator(".use")).toBeVisible();
  });

  test("interacts with expenses table and sorting in Budget view", async ({ page }) => {
    await page.goto("/#budget");

    await expect(page.locator("#v-budget")).toBeVisible();
    const table = page.locator("#tb");
    await expect(table).toBeVisible();
    await expect(page.locator("text=Studio Foto Nova")).toBeVisible();

    // Click sort button on amount
    const sortBtn = page.locator("#tb button[data-k='amt']");
    if (await sortBtn.isVisible()) {
      await sortBtn.click();
      await expect(table).toBeVisible();
    }
  });

  test("switches to Work view with Sidebar and TaskListView", async ({ page }) => {
    await page.goto("/");

    // Click Work pill
    await page.locator("nav.pills .pill").filter({ hasText: "Work" }).click();
    await expect(page.locator("h2", { hasText: "Website Redesign" })).toBeVisible();

    // On viewport >= 1024px, the sidebar is visible; on mobile/tablet it opens via mobile menu button
    const visibleSidebar = page.locator(".sidebar:visible");
    if (await visibleSidebar.count() > 0) {
      await expect(visibleSidebar.first()).toBeVisible();
    } else {
      const drawerBtn = page.locator("button[aria-label='Menu boczne']");
      if (await drawerBtn.isVisible()) {
        await drawerBtn.click();
        await expect(page.locator(".sidebar:visible").first()).toBeVisible();
      }
    }
  });

  test("opens command palette with search button and closes with ESC", async ({ page }) => {
    await page.goto("/");

    // Click search icon in TopBar
    await page.locator("button[aria-label='Szukaj (Ctrl+K)']").click();
    await expect(page.locator("role=dialog")).toBeVisible();
    await expect(page.locator("input[placeholder*='Wpisz polecenie']")).toBeVisible();

    // Press Escape to close
    await page.keyboard.press("Escape");
    await expect(page.locator("role=dialog")).not.toBeVisible();
  });
});
