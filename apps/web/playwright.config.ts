import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E test configuration for Lobster University web app.
 *
 * Port 3000 may be occupied by another project (openclaw-cloud). This config
 * uses port 3001 for the Lobster University dev server. Playwright spawns
 * the server automatically if it is not yet running.
 *
 * All routes are prefixed with /en (default locale).
 */

const PORT = parseInt(process.env.E2E_PORT ?? "3001", 10);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["junit", { outputFile: "playwright-report/junit.xml" }],
    ["list"],
  ],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
    // Give pages ample time to render server components
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Start dev server on port 3001 to avoid conflict with openclaw-cloud (port 3000)
  webServer: {
    command: `npx next dev --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
  outputDir: "playwright-results",
});
