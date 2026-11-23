import { test, expect } from "@playwright/test";

test.describe("Velodrome Tasks & List View (Faza 2)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("navigates to Tasks view and renders list with groups", async ({ page }) => {
    // Click Tasks tab in hero banner
    const tasksTab = page.locator("button[role='tab']", { hasText: "Tasks" });
    await expect(tasksTab).toBeVisible();
    await tasksTab.click();

    // Check list title and task rows
    await expect(page.locator("h2", { hasText: "Website Redesign" })).toBeVisible();
    await expect(page.locator("text=Makiety Liquid Glass dla strony głównej")).toBeVisible();
    await expect(page.locator("text=Implementacja wirtualizacji widoku listy")).toBeVisible();

    // Group headers
    await expect(page.locator("text=Do zrobienia")).toBeVisible();
    await expect(page.locator("text=W trakcie")).toBeVisible();
  });

  test("creates a task inline in the group", async ({ page }) => {
    // Navigate to tasks tab
    await page.locator("button[role='tab']", { hasText: "Tasks" }).click();

    // Find inline task input for "Do zrobienia" group
    const inlineInput = page.locator("input[placeholder*='Dodaj zadanie do: Do zrobienia']");
    await expect(inlineInput).toBeVisible();

    const testTaskName = "Zadanie z testu automatycznego Playwright";
    await inlineInput.fill(testTaskName);
    await inlineInput.press("Enter");

    // Verify task is now visible in the list
    await expect(page.locator(`text=${testTaskName}`)).toBeVisible();
  });

  test("opens slide-over task drawer, views details and closes with Escape", async ({ page }) => {
    await page.locator("button[role='tab']", { hasText: "Tasks" }).click();

    // Click on the first task row
    const firstTask = page.locator("text=Makiety Liquid Glass dla strony głównej");
    await expect(firstTask).toBeVisible();
    await firstTask.click();

    // Verify task drawer opened
    const drawer = page.locator("aside[role='dialog']");
    await expect(drawer).toBeVisible();

    // Check details in drawer
    await expect(page.locator("h4", { hasText: "Listy kontrolne (Checklists)" })).toBeVisible();
    await expect(page.locator("h4", { hasText: "Podzadania (Subtasks)" })).toBeVisible();

    // Close with Escape
    await page.keyboard.press("Escape");
    await expect(drawer).not.toBeVisible();
  });

  test("filters tasks by search input", async ({ page }) => {
    await page.locator("button[role='tab']", { hasText: "Tasks" }).click();

    const searchInput = page.locator("input[placeholder='Szukaj zadań...']");
    await searchInput.fill("wirtualizacji");

    // "Implementacja wirtualizacji" should be visible
    await expect(page.locator("text=Implementacja wirtualizacji widoku listy")).toBeVisible();

    // "Makiety Liquid Glass" should NOT be visible
    await expect(page.locator("text=Makiety Liquid Glass dla strony głównej")).not.toBeVisible();

    // Clear search
    await searchInput.fill("");
    await expect(page.locator("text=Makiety Liquid Glass dla strony głównej")).toBeVisible();
  });

  test("toggles 5000 tasks stress test and scrolls virtual container", async ({ page }) => {
    await page.locator("button[role='tab']", { hasText: "Tasks" }).click();

    // Click stress test button
    const stressBtn = page.locator("button", { hasText: "Testuj 5000 zadań" });
    await expect(stressBtn).toBeVisible();
    await stressBtn.click();

    // Counter badge should show 5000
    await expect(page.locator("text=5000 zadań")).toBeVisible();

    // Scroll virtual container
    const scrollContainer = page.locator("#task-list-scroll-container");
    await expect(scrollContainer).toBeVisible();

    await scrollContainer.evaluate((el) => {
      el.scrollTop = 5000;
    });

    // Reset back
    const resetBtn = page.locator("button", { hasText: "Resetuj do 5 zadań" });
    await expect(resetBtn).toBeVisible();
    await resetBtn.click();

    await expect(page.locator("h2", { hasText: "Website Redesign" })).toBeVisible();
  });
});
