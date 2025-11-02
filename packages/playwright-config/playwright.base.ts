import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test';

/**
 * Base Playwright configuration for Flodoc monorepo
 *
 * This configuration is shared across all apps to minimize duplication.
 * App-specific configs should extend this base configuration.
 *
 * Key Features:
 * - Cross-browser testing (Desktop: Chrome, Firefox, Safari)
 * - Mobile viewport testing (Pixel 5, iPhone 12)
 * - Visual regression with screenshot comparison
 * - Automatic retry on failure (CI only)
 * - Tracing and video on failure
 */

export interface MonorepoPlaywrightConfig extends PlaywrightTestConfig {
  /**
   * Optional app name for identification in reports
   */
  appName?: string;

  /**
   * Optional app port for dev server
   */
  appPort?: number;
}

export const baseConfig = defineConfig({
  // Test directory (override in app configs)
  testDir: './e2e/tests',
  testMatch: '**/*.spec.ts',

  // Timeout configuration
  timeout: 30000, // 30 seconds per test
  expect: {
    timeout: 5000, // 5 seconds for assertions
    toHaveScreenshot: {
      // Visual regression settings
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },

  // Execution settings
  fullyParallel: true, // Run tests in parallel within files
  forbidOnly: !!process.env.CI, // Fail CI if .only() is used
  retries: process.env.CI ? 2 : 0, // Retry failed tests in CI
  workers: process.env.CI ? 1 : undefined, // CI: 1 worker for stability, local: use all cores

  // Reporting
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    process.env.CI ? ['github'] : ['list'],
  ],

  // Output directories
  outputDir: 'test-results',

  // Shared browser context configuration
  use: {
    // Base URL - override in app configs
    baseURL: process.env.BASE_URL || 'http://localhost:5173',

    // Tracing (for debugging)
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Browser context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    // Action timeouts
    actionTimeout: 10000, // 10 seconds for actions (click, fill, etc.)
    navigationTimeout: 30000, // 30 seconds for page loads
  },

  // Browser projects - Desktop + Mobile coverage as requested
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Enable viewport for better React Flow rendering
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Mobile viewports
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 12'],
      },
    },
  ],

  // Web server configuration (override in app configs)
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 120000, // 2 minutes to start
  },
});

export default baseConfig;
