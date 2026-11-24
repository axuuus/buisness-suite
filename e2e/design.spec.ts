import { test, expect } from "@playwright/test";

test.describe("Design System Page (/design)", () => {
  test("renders heading and all major component sections", async ({ page }) => {
    await page.goto("/design");

    // Title
    await expect(page.locator("h1")).toContainText("Galeria Komponentów");

    // Section 1: Tokens
    await expect(page.locator("h2").filter({ hasText: "Tokeny systemowe" })).toBeVisible();

    // Section 2: Buttons
    await expect(page.locator("h2").filter({ hasText: "Przyciski" })).toBeVisible();

    // Section 3: Form inputs
    await expect(page.locator("h2").filter({ hasText: "Pola zakresu" })).toBeVisible();

    // Section 4: Cards
    await expect(page.locator("h2").filter({ hasText: "Karty solidne" })).toBeVisible();

    // Section 5: Badges & Chips
    await expect(page.locator("h2").filter({ hasText: "Chipy delty" })).toBeVisible();

    // Section 6: Charts
    await expect(page.locator("h2").filter({ hasText: "Wykresy systemowe" })).toBeVisible();

    // Section 7: Tables
    await expect(page.locator("h2").filter({ hasText: "Tabela z trybem" })).toBeVisible();

    // Section 8: Floating elements
    await expect(page.locator("h2").filter({ hasText: "Elementy pływające" })).toBeVisible();

    // Section 9: States
    await expect(page.locator("h2").filter({ hasText: "Stany komponentów" })).toBeVisible();

    // Section 10: Shell
    await expect(page.locator("h2").filter({ hasText: "Shell" })).toBeVisible();
  });

  test("toggles theme to dark and light", async ({ page }) => {
    await page.goto("/design");

    // Click dark theme button
    await page.getByRole("button", { name: "dark" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    // Click light theme button
    await page.getByRole("button", { name: "light" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("opens modal and triggers toast", async ({ page }) => {
    await page.goto("/design");

    // Click button to open modal
    await page.getByRole("button", { name: "Otwórz modal" }).click();
    await expect(page.locator(".ov")).toBeVisible();
    await expect(page.locator(".md h3")).toContainText("Przykładowy Modal");

    // Close modal via button
    await page.getByRole("button", { name: "Zapisz zmiany" }).click();
    await expect(page.locator(".ov")).not.toBeVisible();

    // Toast appears
    await expect(page.locator(".toast")).toHaveClass(/on/);
    await expect(page.locator(".toast")).toContainText("Zapisano pomyślnie");
  });
});
