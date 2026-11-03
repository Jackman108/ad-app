import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PORT ?? 3000);
// localhost (не 127.0.0.1) — совпадает с BETTER_AUTH trustedOrigins / cookies
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    ...devices['Desktop Chrome'],
    // Локально: системный Chrome, если `npx playwright install` не докачал build (медленная сеть).
    // CI / полный install: убрать channel или ставить `npm run test:e2e:install`.
    channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome',
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'yarn dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
