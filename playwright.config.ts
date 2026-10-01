import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!isCI,
  retries: isCI ? 1 : 1,
  workers: isCI ? undefined : 4,
  timeout: 60_000,
  use: {
    baseURL: process.env.SITE_URL || "https://staging2.etp-global.org/",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixelRatio: 0.04,
    },
  },
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
  ],
  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    {
      name: "chromium-mobile",
      use: {
        ...devices["iPhone 15 Pro"],
        defaultBrowserType: "chromium", // force Chromium instead of WebKit
      },
    },
  ],
});
