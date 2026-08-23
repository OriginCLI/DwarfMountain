import { defineConfig } from '@playwright/test'

const chromeExecutablePath = process.env.PLAYWRIGHT_CHROME_EXECUTABLE

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    screenshot: 'only-on-failure',
    launchOptions: chromeExecutablePath === undefined ? undefined : { executablePath: chromeExecutablePath },
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: false,
  },
})
