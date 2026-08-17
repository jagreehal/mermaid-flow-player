import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60_000, // 60s per test (diagram load + Mermaid render can be slow)
  reporter: [['list'], ['html'], ['executable-stories-playwright/reporter']],

  use: {
    // `pnpm dev` serves on 4322 under the /mermaid-flow-player base, so specs
    // can keep using site-root paths like '/diagram-types/flowcharts'.
    baseURL: 'http://localhost:4322/mermaid-flow-player/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:4322/mermaid-flow-player/',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  // Default: run only Chromium so E2E passes without installing all browsers.
  // To run Firefox/WebKit: pnpm exec playwright install && pnpm test:e2e:all
  projects: process.env.E2E_ALL_BROWSERS
    ? [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
      ]
    : [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
