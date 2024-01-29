import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    // App needs to be running for e2e tests to work - this would normally come from .env or similar config
    baseURL: 'http://localhost:8002',
  },
  testDir: './e2e',
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    // More browsers can be defined here...
  ],
};

export default config;
