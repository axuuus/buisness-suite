import { test, expect } from "@playwright/test";

test.describe("Design System Page (/design)", () => {
  test("renders heading and all major component sections", async ({ page }) => {
    await page.goto("/design");

    // Title
    await expect(page.locator("h1")).toContainText("Galeria Komponentów Velodrome");

    // Section 1: Buttons
    await expect(page.locator("h2").filter({ hasText: "1. Przyciski" })).toBeVisible();

    // Section 2: Cards
    await expect(page.locator("h2").filter({ hasText: "2. Karty KPI" })).toBeVisible();

    // Section 3: Charts
    await expect(page.locator("h2").filter({ hasText: "3. Wykresy Liniowe" })).toBeVisible();

    // Section 4: Badges
    await expect(page.locator("h2").filter({ hasText: "4. Pigułki Statusu" })).toBeVisible();

    // Section 5: Switches
    await expect(page.locator("h2").filter({ hasText: "5. Przełączniki" })).toBeVisible();
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
    await page.getByRole("button", { name: "Otwórz Modal (.md)" }).click();
    await expect(page.locator(".ov")).toBeVisible();
    await expect(page.locator(".md h3")).toContainText("Przykładowy Szklany Modal");

    // Close modal via button
    await page.getByRole("button", { name: "Zapisz zmiany" }).click();
    await expect(page.locator(".ov")).not.toBeVisible();

    // Toast appears
    await expect(page.locator(".toast")).toHaveClass(/on/);
    await expect(page.locator(".toast")).toContainText("Zapisano pomyślnie");
  });
});
