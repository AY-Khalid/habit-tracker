import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',

  use: {
    // Base URL — all page.goto('/login') calls
    // become http://localhost:3000/login
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Start the Next.js server before tests run
//   webServer: {
//     command: 'npm run dev',
//     url: 'http://localhost:3000',
//     reuseExistingServer: !process.env.CI,
//     timeout: 120000,
//   },


webServer: {
  command: 'npm run build && npm run start',
  url: 'http://localhost:3000',
},
})