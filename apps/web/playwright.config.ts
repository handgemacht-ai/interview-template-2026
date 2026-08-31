import { defineConfig } from '@playwright/test';

const port = Number(process.env.WEB_PORT ?? 4200);

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: `http://localhost:${port}` },
  webServer: {
    command: 'pnpm exec nx serve web',
    url: `http://localhost:${port}`,
    reuseExistingServer: true,
    timeout: 90_000,
  },
});
