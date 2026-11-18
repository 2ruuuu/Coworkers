import { loadEnvConfig } from '@next/env';
import { defineConfig, devices } from '@playwright/test';

loadEnvConfig(process.cwd());

// 다른 프로젝트가 3000번 포트를 쓰고 있으면 E2E_PORT로 바꿔 실행한다. (예: E2E_PORT=3100)
const PORT = Number(process.env.E2E_PORT ?? 3000);
const BASE_URL = `http://localhost:${PORT}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /*
   * 모든 테스트가 같은 E2E 팀의 같은 할 일 목록을 쓰므로 병렬로 돌리지 않는다.
   * 백엔드가 반복 일정의 그날 할 일을 조회 시점에 만드는데, 여러 브라우저가 같은 목록을
   * 동시에 조회하면 같은 할 일이 두 개 생겨 수정/삭제가 다른 쪽에 적용되는 경쟁 상태가 있다.
   */
  fullyParallel: false,
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
    {
      name: 'setup',
      testMatch: '/auth/auth.setup.ts',
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: process.env.CI ? `npm run start -- -p ${PORT}` : `npm run dev -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
