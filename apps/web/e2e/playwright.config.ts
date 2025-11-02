import { defineConfig } from '@playwright/test';
import { baseConfig } from '@flodoc/playwright-config';

/**
 * Playwright configuration for Flodoc Web App
 *
 * Extends the base configuration from @flodoc/playwright-config
 * with app-specific settings.
 *
 * IMPORTANT: Use Node.js to run Playwright tests, not Bun
 * Bun has known compatibility issues with Playwright that can cause hangs and crashes.
 *
 * Run tests with:
 *   npx playwright test
 *   npx playwright test --ui
 *   npx playwright test --headed
 */

export default defineConfig({
  ...baseConfig,

  // Override test directory for this app
  testDir: './tests',

  // App-specific settings
  use: {
    ...baseConfig.use,
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
  },

  // Override web server for this specific app
  webServer: {
    command: 'bun --filter web dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 120000, // 2 minutes to start
  },

  // Output directories
  outputDir: 'test-results',

  // Reporter configuration with monocart for code coverage
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    process.env.CI ? ['github'] : ['list'],
    [
      'monocart-reporter',
      {
        name: 'Flodoc E2E Test Report',
        outputFile: './test-results/monocart-report.html',
        coverage: {
          // Enable code coverage collection
          enabled: process.env.COVERAGE === 'true' || process.env.CI === 'true',

          // Only include source files from the app
          entryFilter: (entry: any) => {
            // Filter to only include app source files
            return entry.url && entry.url.includes('/apps/web/src/');
          },

          // Filter source files
          sourceFilter: (sourcePath: string) => {
            // Include only app source files, exclude tests and node_modules
            return (
              sourcePath.includes('/apps/web/src/') &&
              !sourcePath.includes('node_modules') &&
              !sourcePath.includes('.test.') &&
              !sourcePath.includes('.spec.')
            );
          },

          // Coverage thresholds (optional - adjust as needed)
          reports: [
            ['html', { subdir: 'coverage' }],
            ['json', { file: 'coverage/coverage.json' }],
            ['lcovonly', { file: 'coverage/lcov.info' }],
            'text',
            'text-summary',
          ],

          // Coverage output directory
          outputDir: './test-results/coverage',
        },

        // Test result columns to display
        columns: (defaultColumns: any) => {
          return [
            ...defaultColumns,
            {
              id: 'duration',
              name: 'Duration',
              align: 'right',
              formatter: (v: number) => `${v.toFixed(0)}ms`,
            },
          ];
        },
      },
    ],
  ],
});
