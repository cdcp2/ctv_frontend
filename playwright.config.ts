import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'node ./e2e/mock-api.mjs',
      url: 'http://127.0.0.1:3000/healthz',
      reuseExistingServer: false,
    },
    {
      command:
        'PUBLIC_API_BASE=http://127.0.0.1:3000 PUBLIC_AD_ROTATION_REFRESH_MS=1000 ASTRO_DISABLE_SHARP=1 npm run dev -- --host 127.0.0.1 --port 4321',
      url: 'http://127.0.0.1:4321',
      reuseExistingServer: false,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
