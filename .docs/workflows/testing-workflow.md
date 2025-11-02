---
title: Testing Workflow
category: development
updated: 2025-01-01
---

# Testing Workflow

This document outlines the testing strategy and workflow for Flodoc, including E2E testing with Playwright, code coverage, and quality gates.

## Table of Contents

1. [Testing Strategy](#testing-strategy)
2. [Running Tests](#running-tests)
3. [Writing Tests](#writing-tests)
4. [Visual Regression Testing](#visual-regression-testing)
5. [Code Coverage](#code-coverage)
6. [CI/CD Integration](#cicd-integration)
7. [Troubleshooting](#troubleshooting)

## Testing Strategy

Flodoc uses a multi-layered testing approach:

### Test Pyramid

```
        /\
       /  \
      / E2E \        ← Playwright (Cross-browser, Visual)
     /------\
    /  Inte- \       ← (Future: Component tests)
   /   gration\
  /------------\
 /   Unit Tests \    ← (Future: Vitest)
/________________\
```

### Current Test Types

1. **E2E Tests** (Implemented)
   - Full user flows and scenarios
   - Cross-browser compatibility
   - Mobile responsiveness
   - Tools: Playwright

2. **Visual Regression Tests** (Implemented)
   - Screenshot comparison
   - Layout consistency
   - Responsive breakpoints
   - Tools: Playwright built-in

3. **Unit Tests** (Future)
   - Pure function testing
   - Utility libraries
   - Tools: Vitest

4. **Component Tests** (Future)
   - Isolated component behavior
   - Props and state testing
   - Tools: Vitest browser mode

## Running Tests

### Prerequisites

```bash
# Install dependencies (includes Playwright)
bun install

# Install Playwright browsers (first time only)
npx playwright install --with-deps chromium
```

### Local Development

```bash
# Run all E2E tests (headless)
bun run test:e2e

# Run tests with UI Mode (recommended for development)
bun run test:e2e:ui

# Run tests in headed mode (see browser)
bun run test:e2e:headed

# Run tests with code coverage
bun run test:e2e:coverage

# View test report
bun run test:e2e:report
```

### Specific Test Suites

```bash
# Run only navigation tests
cd apps/web/e2e
npx playwright test tests/navigation

# Run only visual regression tests
npx playwright test tests/visual

# Run specific test file
npx playwright test tests/documentation/mdx-rendering.spec.ts

# Run tests matching a pattern
npx playwright test --grep "should render"
```

### Debug Mode

```bash
# Debug tests with Playwright Inspector
cd apps/web/e2e
npx playwright test --debug

# Debug specific test
npx playwright test tests/navigation/routing.spec.ts --debug

# Run tests with trace
npx playwright test --trace on
```

## Writing Tests

### Test Organization

Tests are organized by **feature**, not by type:

```
apps/web/e2e/tests/
├── navigation/           # Navigation and routing
│   ├── main-nav.spec.ts
│   └── routing.spec.ts
├── documentation/        # MDX content
│   ├── mdx-rendering.spec.ts
│   ├── document-connections.spec.ts
│   └── code-highlighting.spec.ts
├── flow-visualization/   # React Flow
│   └── flow-rendering.spec.ts
└── visual/              # Visual regression
    └── screenshots.spec.ts
```

### Using Custom Fixtures

Flodoc provides custom fixtures for common page interactions:

```typescript
import { test, expect } from '@flodoc/test-utils';

test('should navigate to document', async ({ page, documentPage }) => {
  // documentPage is a custom fixture with helper methods
  await documentPage.goto('getting-started');

  // Verify document loaded
  const isRendered = await documentPage.verifyMDXRendered();
  expect(isRendered).toBe(true);
});
```

### Available Fixtures

- **`documentPage`**: DocumentPage instance for MDX documents
- **`flowPage`**: FlowPage instance for React Flow visualizations
- **`navigationPage`**: NavigationPage instance for app navigation

### Page Object Pattern

Use page objects for maintainable tests:

```typescript
// Using DocumentPage page object
test('should display document title', async ({ documentPage }) => {
  await documentPage.goto('getting-started');

  const title = await documentPage.getTitleText();
  expect(title).toContain('Getting Started');
});

// Using helper utilities
import { MDXHelpers } from '@flodoc/test-utils/helpers';

test('should verify frontmatter', async ({ page, documentPage }) => {
  await documentPage.goto('getting-started');

  await MDXHelpers.verifyFrontmatter(page, {
    title: 'Getting Started',
    tags: ['tutorial', 'beginner'],
  });
});
```

### Test Naming Conventions

Use descriptive test names that explain the **expected behavior**:

```typescript
// ✅ Good
test('should display document connections when available', ...)
test('should navigate to next document when clicking connection', ...)
test('should render code blocks with syntax highlighting', ...)

// ❌ Bad
test('connections test', ...)
test('test navigation', ...)
test('code highlighting', ...)
```

## Visual Regression Testing

### Creating Baseline Screenshots

First run generates baseline screenshots:

```bash
# Run visual tests to create baselines
bun run test:e2e tests/visual

# Baselines saved to:
# apps/web/e2e/tests/visual/screenshots.spec.ts-snapshots/
```

### Updating Baselines

When intentional UI changes are made:

```bash
# Update all snapshots
bun run test:e2e:update-snapshots

# Update specific test snapshots
cd apps/web/e2e
npx playwright test tests/visual --update-snapshots
```

### Writing Visual Tests

```typescript
import { test, expect } from '@flodoc/test-utils';

test('page layout matches baseline', async ({ page }) => {
  await page.goto('/');

  // Full page screenshot
  await expect(page).toHaveScreenshot('home-page.png', {
    fullPage: true,
    animations: 'disabled',
  });
});

// Mobile viewport
test('mobile layout matches baseline', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');

  await expect(page).toHaveScreenshot('home-mobile.png', {
    fullPage: true,
  });
});
```

### Best Practices

1. **Hide volatile elements**: Dates, timestamps, dynamic content
2. **Disable animations**: Use `animations: 'disabled'`
3. **Stabilize before capture**: Wait for layouts to settle
4. **Mask dynamic areas**: User-generated content, randomized elements

```typescript
// Hide volatile elements
await page.addStyleTag({
  content: '[data-volatile] { visibility: hidden !important; }',
});

// Mask dynamic areas
await expect(page).toHaveScreenshot('page.png', {
  mask: [page.locator('.dynamic-content')],
});
```

## Code Coverage

### Running with Coverage

```bash
# Run tests with coverage enabled
bun run test:e2e:coverage

# Coverage reports generated at:
# apps/web/e2e/test-results/coverage/
```

### Coverage Reports

monocart-reporter generates:

- **HTML Report**: `test-results/monocart-report.html` (interactive)
- **JSON**: `coverage/coverage.json` (programmatic access)
- **LCOV**: `coverage/lcov.info` (CI integration)
- **Text Summary**: Console output

### Viewing Coverage

```bash
# Open HTML coverage report
open apps/web/e2e/test-results/coverage/index.html

# Or view monocart report with integrated coverage
open apps/web/e2e/test-results/monocart-report.html
```

### Coverage Configuration

Coverage is filtered to include only app source files:

```typescript
// playwright.config.ts
coverage: {
  enabled: process.env.COVERAGE === 'true',
  entryFilter: (entry) => entry.url.includes('/apps/web/src/'),
  sourceFilter: (path) => path.includes('/apps/web/src/'),
}
```

## CI/CD Integration

### Local Pre-Commit Testing

Before committing:

```bash
# Run type checking
bun run typecheck

# Run linting
bun run lint

# Run E2E tests
bun run test:e2e

# Optional: Run with coverage
bun run test:e2e:coverage
```

### Future GitHub Actions (Not Yet Implemented)

Planned CI workflow:

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: npx playwright install --with-deps
      - run: bun run build
      - run: bun run test:e2e:coverage
      - uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: apps/web/e2e/playwright-report/
```

## Troubleshooting

### Common Issues

#### Tests Hanging

**Problem**: Tests hang or timeout

**Solution**:
- Ensure dev server is running on correct port
- Check `webServer` config in `playwright.config.ts`
- Increase timeout if needed: `test.setTimeout(60000)`

#### Visual Regression Failures

**Problem**: Screenshot diffs on different machines

**Solution**:
- Use same OS for baseline generation (preferably Ubuntu in CI)
- Disable animations: `animations: 'disabled'`
- Hide volatile elements
- Adjust threshold: `maxDiffPixels: 100`

#### Bun Compatibility

**Problem**: Tests fail when run with `bun test`

**Solution**:
- Always use `npx playwright test` (Node.js)
- Bun has known compatibility issues with Playwright
- See ADR-0006 for details

#### Flaky Tests

**Problem**: Tests pass/fail inconsistently

**Solution**:
- Add proper waits: `await page.waitForLoadState('networkidle')`
- Use `toBeVisible()` instead of checking existence
- Increase timeouts for slow operations
- Use retries in config: `retries: 2`

### Debug Checklist

1. ✅ Is dev server running? (`bun run dev`)
2. ✅ Are Playwright browsers installed? (`npx playwright install`)
3. ✅ Is test running in correct directory? (`cd apps/web/e2e`)
4. ✅ Are path aliases configured? (Check `tsconfig.app.json`)
5. ✅ Using Node.js, not Bun? (`npx` not `bun`)

### Getting Help

1. Check Playwright traces: `npx playwright show-trace trace.zip`
2. Use UI Mode for interactive debugging: `bun run test:e2e:ui`
3. Enable verbose logging: `DEBUG=pw:api npx playwright test`
4. Review test report: `bun run test:e2e:report`

## Test Maintenance

### When to Update Tests

- **After UI changes**: Update visual regression baselines
- **After route changes**: Update navigation tests
- **After content changes**: Update MDX rendering tests
- **After feature additions**: Add new test suites

### Review Process

1. Run tests locally before committing
2. Review visual regression diffs carefully
3. Update baselines only for intentional changes
4. Document significant test changes in commit messages

### Performance Tips

1. **Parallel execution**: Tests run in parallel by default
2. **Selective testing**: Run only affected tests during development
3. **Headless mode**: Use headless for faster execution
4. **Project filtering**: Test specific browsers only when needed

```bash
# Test only on Chromium (fastest)
npx playwright test --project=chromium

# Test on specific browsers
npx playwright test --project=chromium --project=firefox
```

## Summary

- **E2E tests**: Playwright for cross-browser testing
- **Visual regression**: Built-in screenshot comparison
- **Code coverage**: monocart-reporter with Istanbul
- **Organization**: Feature-based, not type-based
- **Runtime**: Node.js (not Bun) for Playwright
- **Best practices**: Page Objects, fixtures, helper utilities

For more details, see:
- [ADR-0006: Playwright E2E Testing](.docs/decisions/0006-playwright-e2e-testing.md)
- [Playwright Documentation](https://playwright.dev)
- [Test Utils Package](packages/test-utils/README.md)
