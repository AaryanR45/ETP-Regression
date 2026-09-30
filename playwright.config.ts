import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 4 : undefined,
  timeout: 60_000,
  use: {
    baseURL: "https://etp-global.org",

    viewport: {
      width: 1440,
      height: 900,
    },

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
