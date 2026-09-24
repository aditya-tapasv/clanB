import { defineConfig, devices } from "@playwright/test";

/**
 * E2E against the production build (`pnpm build` first).
 * Uses the locally installed Chrome and Edge channels so no browser download is needed.
 */
const PORT = Number(process.env.E2E_PORT ?? 3100);

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 4,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `pnpm start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: "chrome-desktop", use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1440, height: 900 } } },
    { name: "edge-desktop", use: { ...devices["Desktop Edge"], channel: "msedge", viewport: { width: 1280, height: 800 } } },
    {
      name: "chrome-mobile",
      use: { ...devices["Pixel 7"], channel: "chrome", viewport: { width: 375, height: 812 } },
    },
  ],
});
