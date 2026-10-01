import { test, expect } from "@playwright/test";
import { pages } from "../pages.js";
import {
  getVisualMasks,
  stabilizeVisualPage,
} from "./utils/visual-stability.js";

for (const target of pages) {
  test(`${target.name} - visual regression`, async ({ page }) => {
    await page.goto(target.path, {
      waitUntil: "networkidle",
    });

    await stabilizeVisualPage(page);

    // Full-page screenshot comparison
    await expect(page).toHaveScreenshot(
      `${target.name.replace(/[^a-zA-Z0-9]/g, "-")}.png`,
      {
        fullPage: true,
        animations: "disabled",
        scale: "css",
        mask: getVisualMasks(
          page,
          "maskSelectors" in target && Array.isArray(target.maskSelectors)
            ? target.maskSelectors
            : [],
        ),
      },
    );
  });
}
