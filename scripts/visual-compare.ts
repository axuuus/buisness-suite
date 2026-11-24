import { chromium } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

const VIEWPORTS = [
  { name: "360px", width: 360, height: 800 },
  { name: "768px", width: 768, height: 1024 },
  { name: "1024px", width: 1024, height: 768 },
  { name: "1440px", width: 1440, height: 900 },
  { name: "2560px", width: 2560, height: 1440 },
];

const THEMES = ["light", "dark"] as const;

const OUTPUT_DIR = path.resolve(process.cwd(), "reference/compare");
const PROTOTYPE_FILE = path.resolve(process.cwd(), "reference/new-look/velodrome-new-look.html");
const BASE_URL = "http://localhost:3000";

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("=== Starting Visual Comparison Run ===");
  console.log(`Output Directory: ${OUTPUT_DIR}`);

  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(`Console error: ${msg.text()}`);
    }
  });

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const theme of THEMES) {
      console.log(`\n--- Viewport: ${vp.name} | Theme: ${theme} ---`);

      // 1. Prototype - Home View
      const protoHomeUrl = `file:///${PROTOTYPE_FILE.replace(/\\/g, "/")}`;
      await page.goto(protoHomeUrl, { waitUntil: "networkidle" });
      await page.evaluate((t) => {
        document.documentElement.setAttribute("data-theme", t);
      }, theme);
      await page.waitForTimeout(150);

      const protoHomePath = path.join(OUTPUT_DIR, `proto-home-${vp.name}-${theme}.png`);
      await page.screenshot({ path: protoHomePath, fullPage: true });

      // Check overflow on prototype home
      const protoOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      if (protoOverflow) console.warn(`[WARN] Prototype Home overflows at ${vp.name}`);

      // 2. App - Home View
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
      await page.evaluate((t) => {
        document.documentElement.setAttribute("data-theme", t);
      }, theme);
      await page.waitForTimeout(200);

      const appHomePath = path.join(OUTPUT_DIR, `app-home-${vp.name}-${theme}.png`);
      await page.screenshot({ path: appHomePath, fullPage: true });

      // Check overflow on app home
      const appHomeOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      if (appHomeOverflow) {
        errors.push(`App Home has horizontal overflow at ${vp.name} (${theme})`);
      }

      // 3. Prototype - Budget View
      const protoBudgetUrl = `file:///${PROTOTYPE_FILE.replace(/\\/g, "/")}#budget`;
      await page.goto(protoBudgetUrl, { waitUntil: "networkidle" });
      await page.evaluate((t) => {
        document.documentElement.setAttribute("data-theme", t);
      }, theme);
      await page.waitForTimeout(150);

      const protoBudgetPath = path.join(OUTPUT_DIR, `proto-budget-${vp.name}-${theme}.png`);
      await page.screenshot({ path: protoBudgetPath, fullPage: true });

      // 4. App - Budget View
      await page.goto(`${BASE_URL}/#budget`, { waitUntil: "networkidle" });
      await page.evaluate((t) => {
        document.documentElement.setAttribute("data-theme", t);
      }, theme);
      await page.waitForTimeout(200);

      const appBudgetPath = path.join(OUTPUT_DIR, `app-budget-${vp.name}-${theme}.png`);
      await page.screenshot({ path: appBudgetPath, fullPage: true });

      // Check overflow on app budget
      const appBudgetOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      if (appBudgetOverflow) {
        errors.push(`App Budget has horizontal overflow at ${vp.name} (${theme})`);
      }

      // 5. App - Design System Gallery
      if (vp.name === "1440px" || vp.name === "360px") {
        await page.goto(`${BASE_URL}/design`, { waitUntil: "networkidle" });
        await page.evaluate((t) => {
          document.documentElement.setAttribute("data-theme", t);
        }, theme);
        await page.waitForTimeout(200);

        const appDesignPath = path.join(OUTPUT_DIR, `app-design-${vp.name}-${theme}.png`);
        await page.screenshot({ path: appDesignPath, fullPage: true });
      }
    }
  }

  await browser.close();

  console.log("\n=== Visual Comparison Run Complete ===");
  if (errors.length > 0) {
    console.error("Errors / Warnings detected:");
    errors.forEach((e) => console.error(" - " + e));
  } else {
    console.log("No horizontal overflow detected on any viewport! All screenshots captured cleanly.");
  }
}

run().catch((err) => {
  console.error("Visual compare failed:", err);
  process.exit(1);
});
