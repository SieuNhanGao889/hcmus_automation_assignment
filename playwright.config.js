
const { defineConfig, devices } = require('@playwright/test');

const runBy = 'Run by: 23127364';
const runAt = new Date().toISOString();

module.exports = defineConfig({
  testDir: './tests',
  testMatch: /fr(03_forgot_password|09_discount_coupons|15_product_crud)\.spec\.js/,
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: false,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['./reports/run_info_reporter.js'],
  ],
  use: {
    baseURL: process.env.ESHOP_WEB_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  metadata: {
    runBy,
    runAt,
    studentId: '23127364',
  },
  webServer: [
    {
      command: 'node EShop-source/backend/server.js',
      url: process.env.ESHOP_API_URL || 'http://localhost:3000/api/products',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: 'npm --prefix EShop-source/frontend-web run dev -- --host 127.0.0.1',
      url: process.env.ESHOP_WEB_URL || 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'npm --prefix EShop-source/frontend-admin run dev -- --host 127.0.0.1 --port 5174',
      url: process.env.ESHOP_ADMIN_URL || 'http://localhost:5174',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
  // Chạy trên 3 
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
