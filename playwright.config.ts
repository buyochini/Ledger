import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'https://thinking-tester-contact-list.herokuapp.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [['html', { open: 'never' }], ['list']],
  testDir: './tests',
  testMatch: /.*\.feature/,
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
