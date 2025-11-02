# Flodoc E2E Tests

Comprehensive end-to-end testing suite for the Flodoc web application using Playwright.

## Quick Start

```bash
# Install dependencies (first time)
bun install
npx playwright install --with-deps chromium

# Run tests
bun run test:e2e

# Run with UI Mode (recommended)
bun run test:e2e:ui

# Run in headed mode
bun run test:e2e:headed

# Run with code coverage
bun run test:e2e:coverage

# Update visual regression baselines
bun run test:e2e:update-snapshots
```

## Test Structure

```
apps/web/e2e/
├── tests/
│   ├── navigation/           # Navigation and routing
│   │   ├── main-nav.spec.ts
│   │   └── routing.spec.ts
│   ├── documentation/        # MDX rendering
│   │   ├── mdx-rendering.spec.ts
│   │   ├── document-connections.spec.ts
│   │   └── code-highlighting.spec.ts
│   ├── flow-visualization/   # React Flow
│   │   └── flow-rendering.spec.ts (skipped until implemented)
│   └── visual/              # Visual regression
│       └── screenshots.spec.ts
├── playwright.config.ts     # App-specific config
└── .gitignore
```

## Writing Tests

Use shared test utilities from `@flodoc/test-utils`:

```typescript
import { test, expect } from '@flodoc/test-utils';

test('example test', async ({ page, documentPage, flowPage, navigationPage }) => {
  // Use page objects for common interactions
  await documentPage.goto('getting-started');

  // Verify content
  const isRendered = await documentPage.verifyMDXRendered();
  expect(isRendered).toBe(true);
});
```

## Available Fixtures

- **`page`**: Standard Playwright Page object
- **`documentPage`**: MDX document page interactions
- **`flowPage`**: React Flow visualization interactions
- **`navigationPage`**: App navigation interactions

## Helper Utilities

```typescript
import { MDXHelpers, RouterHelpers, FlowHelpers } from '@flodoc/test-utils/helpers';

// MDX testing
await MDXHelpers.verifyFrontmatter(page, { title: 'Getting Started' });
await MDXHelpers.verifyCodeBlock(page, 'typescript');

// Router testing
await RouterHelpers.waitForRouteChange(page, '/docs/getting-started');
await RouterHelpers.goBack(page);

// Flow testing
await FlowHelpers.waitForFlowReady(page);
await FlowHelpers.verifyNodeCount(page, 5);
```

## Test Organization

Tests are organized by **feature**, not by type:

- ✅ **navigation/**: App navigation, routing, TanStack Router
- ✅ **documentation/**: MDX rendering, frontmatter, code highlighting, connections
- ⏭️ **flow-visualization/**: React Flow (marked `.skip()` until implemented)
- ✅ **visual/**: Visual regression testing

## Browser Coverage

- **Desktop**: Chromium, Firefox, WebKit (1920x1080)
- **Mobile**: Pixel 5, iPhone 12

## Visual Regression Testing

### First Run (Generate Baselines)

```bash
bun run test:e2e tests/visual
```

Baselines saved to `tests/visual/screenshots.spec.ts-snapshots/`

### Update Baselines

After intentional UI changes:

```bash
bun run test:e2e:update-snapshots
```

### Best Practices

1. Hide volatile elements (dates, timestamps)
2. Disable animations: `animations: 'disabled'`
3. Wait for layout stabilization
4. Mask dynamic content

## Code Coverage

### Running with Coverage

```bash
bun run test:e2e:coverage
```

### Reports

- **HTML**: `test-results/coverage/index.html`
- **monocart Report**: `test-results/monocart-report.html`
- **LCOV**: `test-results/coverage/lcov.info`
- **JSON**: `test-results/coverage/coverage.json`

Coverage is filtered to only include `apps/web/src/**` files.

## Configuration

### Playwright Config

Extends base config from `@flodoc/playwright-config`:

```typescript
import { baseConfig } from '@flodoc/playwright-config';

export default defineConfig({
  ...baseConfig,
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:5173',
  },
});
```

### Environment Variables

- **`BASE_URL`**: Override base URL (default: http://localhost:5173)
- **`COVERAGE`**: Enable coverage collection (default: false)
- **`CI`**: Enable CI-specific settings (retries, single worker)

## IMPORTANT: Runtime

**Always use Node.js to run Playwright tests, not Bun.**

Bun has known compatibility issues with Playwright:
- Tests hang for ~2 minutes
- Potential segfaults
- Zombie processes

✅ Correct:
```bash
npx playwright test
bun run test:e2e  # Runs npx under the hood
```

❌ Incorrect:
```bash
bun playwright test  # Will cause issues
```

## Debugging

### UI Mode (Recommended)

```bash
bun run test:e2e:ui
```

Interactive mode with:
- Time travel debugging
- Watch mode
- Step-through execution
- Inspector

### Headed Mode

```bash
bun run test:e2e:headed
```

See the browser during test execution.

### Debug Specific Test

```bash
cd e2e
npx playwright test tests/navigation/routing.spec.ts --debug
```

### View Traces

```bash
npx playwright show-trace test-results/trace.zip
```

## Troubleshooting

### Tests Hanging

- Ensure dev server is running: `bun run dev`
- Check `webServer` config in `playwright.config.ts`
- Increase timeout if needed

### Visual Regression Failures

- Use same OS for baselines (preferably Ubuntu)
- Disable animations
- Hide volatile elements
- Adjust threshold in config

### Flaky Tests

- Add proper waits: `waitForLoadState('networkidle')`
- Use `toBeVisible()` instead of checking existence
- Increase timeouts for slow operations
- Enable retries in config

## Next Steps

1. Install Playwright browsers:
   ```bash
   npx playwright install --with-deps
   ```

2. Run tests:
   ```bash
   bun run test:e2e
   ```

3. Generate baselines for visual tests:
   ```bash
   bun run test:e2e tests/visual
   ```

4. Implement React Flow routes (flow visualization tests currently skipped)

5. Add more test coverage as features are implemented

## Related Documentation

- [Testing Workflow](.docs/workflows/testing-workflow.md)
- [ADR-0006: Playwright E2E Testing](.docs/decisions/0006-playwright-e2e-testing.md)
- [Test Utils Package](packages/test-utils/README.md)
- [Playwright Config Package](packages/playwright-config/README.md)
- [Playwright Documentation](https://playwright.dev)

## Test Statistics

- **Total Tests**: 15+ E2E tests, 10+ visual regression tests
- **Coverage**: Navigation, MDX rendering, document connections, visual layouts
- **Browsers**: 5 projects (3 desktop + 2 mobile)
- **Test Files**: 6 test files across 4 feature areas
