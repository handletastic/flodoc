# @flodoc/playwright-config

Shared Playwright base configuration for all apps in the Flodoc monorepo.

## Overview

This package provides a base Playwright configuration that can be extended by all apps, ensuring:

- **Zero duplication**: Single source of truth for common settings
- **Consistency**: All apps use the same test configuration
- **Easy updates**: Change base config once, applies to all apps
- **Best practices**: Pre-configured with optimal settings

## Usage

### In Your App's playwright.config.ts

```typescript
import { defineConfig } from '@playwright/test';
import { baseConfig } from '@flodoc/playwright-config';

export default defineConfig({
  ...baseConfig,

  // Override test directory
  testDir: './tests',

  // Override base URL
  use: {
    ...baseConfig.use,
    baseURL: 'http://localhost:3000',
  },

  // Override web server
  webServer: {
    command: 'bun --filter my-app dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Base Configuration Features

### Browser Coverage

Desktop browsers:
- **Chromium** (Desktop Chrome) - 1920x1080
- **Firefox** (Desktop Firefox) - 1920x1080
- **WebKit** (Desktop Safari) - 1920x1080

Mobile viewports:
- **Pixel 5** (Mobile Chrome)
- **iPhone 12** (Mobile Safari)

### Execution Settings

- **Parallel execution**: `fullyParallel: true`
- **Retries**: 2 retries in CI, 0 locally
- **Workers**: 1 worker in CI (stability), unlimited locally (speed)
- **Timeout**: 30 seconds per test, 5 seconds for assertions

### Reporting

- **HTML**: Interactive HTML report
- **JSON**: Machine-readable test results
- **GitHub**: GitHub Actions annotations (CI only)
- **List**: Console output (local development)

### Tracing and Debugging

- **Trace**: On first retry (local), on failure (CI)
- **Screenshots**: Only on failure
- **Video**: Retain on failure
- **Viewport**: 1280x720 default

### Visual Regression

- **Max diff pixels**: 100
- **Threshold**: 0.2 (20%)

## Configuration Options

### Base URL

```typescript
use: {
  baseURL: process.env.BASE_URL || 'http://localhost:5173',
}
```

Set via environment variable:
```bash
BASE_URL=http://localhost:3000 npx playwright test
```

### Timeout Configuration

```typescript
timeout: 30000,              // 30 seconds per test
expect: {
  timeout: 5000,             // 5 seconds for assertions
}
use: {
  actionTimeout: 10000,      // 10 seconds for actions
  navigationTimeout: 30000,  // 30 seconds for page loads
}
```

### Web Server

Automatically starts dev server before tests:

```typescript
webServer: {
  command: 'bun run dev',
  url: 'http://localhost:5173',
  reuseExistingServer: !process.env.CI,
  timeout: 120000, // 2 minutes to start
}
```

## Overriding Defaults

### Add Custom Projects

```typescript
export default defineConfig({
  ...baseConfig,
  projects: [
    ...baseConfig.projects,
    {
      name: 'custom-project',
      testMatch: '**/custom/**/*.spec.ts',
    },
  ],
});
```

### Add Custom Reporters

```typescript
export default defineConfig({
  ...baseConfig,
  reporter: [
    ...baseConfig.reporter,
    ['custom-reporter', { /* options */ }],
  ],
});
```

### Modify Existing Settings

```typescript
export default defineConfig({
  ...baseConfig,
  timeout: 60000,  // Increase timeout to 60 seconds
  retries: 3,      // Always retry 3 times
});
```

## Environment Variables

- **`CI`**: Enable CI-specific settings (retries, single worker)
- **`BASE_URL`**: Override base URL for tests
- **`COVERAGE`**: Enable code coverage collection

## Best Practices

### DO ✅

1. Extend base config, don't replace it
2. Override only what's necessary
3. Use environment variables for dynamic values
4. Keep app-specific settings in app configs

### DON'T ❌

1. Copy-paste base config into app configs
2. Hardcode URLs or ports
3. Disable safety features (retries, timeouts)
4. Change base config for app-specific needs

## IMPORTANT: Runtime Requirements

**Use Node.js, not Bun, to run Playwright tests.**

Bun has known compatibility issues with Playwright that cause:
- Tests hanging for ~2 minutes
- Potential segfaults
- Zombie processes

### Correct Usage

```bash
# ✅ Correct - uses Node.js
npx playwright test

# ❌ Incorrect - uses Bun (will have issues)
bun playwright test
```

See [ADR-0006](.docs/decisions/0006-playwright-e2e-testing.md) for details.

## TypeScript Support

Full TypeScript support with types:

```typescript
import type { PlaywrightTestConfig } from '@playwright/test';

export interface MonorepoPlaywrightConfig extends PlaywrightTestConfig {
  appName?: string;
  appPort?: number;
}
```

## File Structure

```
packages/playwright-config/
├── playwright.base.ts   # Base configuration export
├── package.json
├── tsconfig.json
└── README.md
```

## Related Packages

- **@flodoc/test-utils**: Shared testing utilities (fixtures, page objects, helpers)
- **@playwright/test**: Playwright testing framework

## Related Documentation

- [Testing Workflow](.docs/workflows/testing-workflow.md)
- [ADR-0006: Playwright E2E Testing](.docs/decisions/0006-playwright-e2e-testing.md)
- [Playwright Documentation](https://playwright.dev)

## License

Private package for Flodoc monorepo use only.
