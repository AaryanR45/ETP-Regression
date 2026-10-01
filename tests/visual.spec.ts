import { test, expect } from "@playwright/test";
import { pages } from "../pages.js";

for (const target of pages) {
  test(`${target.name} - visual regression`, async ({ page }) => {
    await page.goto(`https://staging2.etp-global.org/${target.path}`, {
      waitUntil: "networkidle",
    });

    // Dismiss the cookie consent banner without opting into tracking. for prod
    await page.getByRole("button", { name: "Deny", exact: true }).click();

    // Scroll through the page to trigger viewport-based lazy loading.
    await page.evaluate(async () => {
      for (
        let position = 0;
        position < document.documentElement.scrollHeight;
        position += window.innerHeight
      ) {
        window.scrollTo(0, position);
        await new Promise((resolve) => window.setTimeout(resolve, 100));
      }
      window.scrollTo(0, 0);

      const images = Array.from(document.images);
      images.forEach((image) => {
        image.loading = "eager";
      });
      await Promise.all(images.map((image) => image.decode().catch(() => {})));
    });

    // Allow fonts and any remaining content to finish loading.
    await page.waitForTimeout(5000);


    // Full-page screenshot comparison
    await expect(page).toHaveScreenshot(  
      `${target.name.replace(/[^a-zA-Z0-9]/g, "-")}.png`,
      {
        fullPage: true,
        animations: "disabled",
        scale: "css",
      },
    );
  });
}
