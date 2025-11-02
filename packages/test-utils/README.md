# @flodoc/test-utils

Shared testing utilities for Playwright E2E tests across the Flodoc monorepo.

## Overview

This package provides reusable testing utilities to minimize code duplication across multiple apps:

- **Custom Fixtures**: Pre-configured test fixtures for common scenarios
- **Page Objects**: Maintainable page object models for different page types
- **Helper Functions**: Utility functions for TanStack Router, MDX, and React Flow testing

## Installation

This package is part of the Flodoc monorepo and is automatically available to all apps.

```typescript
// In your test files
import { test, expect } from '@flodoc/test-utils';
import { MDXHelpers } from '@flodoc/test-utils/helpers';
```

## Custom Fixtures

### Available Fixtures

```typescript
import { test, expect } from '@flodoc/test-utils';

test('example test', async ({ page, documentPage, flowPage, navigationPage }) => {
  // documentPage: MDX document page interactions
  // flowPage: React Flow visualization interactions
  // navigationPage: App navigation interactions
});
```

### Example Usage

```typescript
import { test, expect } from '@flodoc/test-utils';

test('should navigate to document', async ({ documentPage }) => {
  // Navigate to a document by slug
  await documentPage.goto('getting-started');

  // Verify MDX rendering
  const isRendered = await documentPage.verifyMDXRendered();
  expect(isRendered).toBe(true);

  // Get document title
  const title = await documentPage.getTitleText();
  expect(title).toContain('Getting Started');
});
```

## Page Objects

### DocumentPage

Handles MDX document interactions:

```typescript
import { test } from '@flodoc/test-utils';

test('document page example', async ({ documentPage }) => {
  await documentPage.goto('getting-started');

  // Check if code highlighting is applied
  const hasHighlighting = await documentPage.verifyCodeHighlighting();

  // Get document tags
  const tags = await documentPage.getTags();

  // Get connection count
  const connections = await documentPage.getConnectionCount();

  // Click on a connection
  await documentPage.clickConnection(0);
});
```

### FlowPage

Handles React Flow visualization interactions:

```typescript
import { test } from '@flodoc/test-utils';

test('flow page example', async ({ flowPage }) => {
  await flowPage.goto('knowledge-graph');

  // Wait for flow to render
  await flowPage.waitForFlowReady();

  // Get node count
  const nodeCount = await flowPage.getNodeCount();

  // Click on a node
  await flowPage.clickNodeByLabel('Getting Started');

  // Zoom controls
  await flowPage.zoomIn();
  await flowPage.fitView();
});
```

### NavigationPage

Handles app navigation:

```typescript
import { test } from '@flodoc/test-utils';

test('navigation example', async ({ navigationPage }) => {
  await navigationPage.goto('/');

  // Click logo to go home
  await navigationPage.gotoHome();

  // Click nav link
  await navigationPage.clickNavLink('Docs');

  // Search
  await navigationPage.search('React Flow');

  // Get nav links
  const links = await navigationPage.getNavLinkTexts();
});
```

## Helper Functions

### RouterHelpers

TanStack Router utilities:

```typescript
import { RouterHelpers } from '@flodoc/test-utils/helpers';

// Wait for route change
await RouterHelpers.waitForRouteChange(page, '/docs/getting-started');

// Navigate with router
await RouterHelpers.navigateWithRouter(page, '/docs/installation');

// Verify route params
const isValid = await RouterHelpers.verifyRouteParams(page, { view: 'grid' });

// Navigate back/forward
await RouterHelpers.goBack(page);
await RouterHelpers.goForward(page);
```

### MDXHelpers

MDX content testing utilities:

```typescript
import { MDXHelpers } from '@flodoc/test-utils/helpers';

// Verify frontmatter
await MDXHelpers.verifyFrontmatter(page, {
  title: 'Getting Started',
  tags: ['tutorial', 'beginner'],
});

// Verify code block highlighting
await MDXHelpers.verifyCodeBlock(page, 'typescript');

// Test document connections
await MDXHelpers.testDocumentConnections(page, [
  { type: 'next', target: 'basic-concepts' },
  { type: 'related', target: 'installation' },
]);

// Get document headings
const headings = await MDXHelpers.getDocumentHeadings(page);

// Verify GFM features (tables, task lists)
await MDXHelpers.verifyGFMFeatures(page);
```

### FlowHelpers

React Flow testing utilities:

```typescript
import { FlowHelpers } from '@flodoc/test-utils/helpers';

// Wait for flow to be ready
await FlowHelpers.waitForFlowReady(page);

// Verify node/edge counts
await FlowHelpers.verifyNodeCount(page, 5);
await FlowHelpers.verifyEdgeCount(page, 4);

// Get node by label
const node = FlowHelpers.getNodeByLabel(page, 'Getting Started');

// Click and select node
await FlowHelpers.clickAndSelectNode(page, 'Getting Started');

// Verify connections
await FlowHelpers.verifyEdgeExists(page, 'Getting Started', 'Basic Concepts');

// Control interactions
await FlowHelpers.fitView(page);
await FlowHelpers.pan(page, 100, 100);
await FlowHelpers.setZoom(page, 1.5);
```

## Package Structure

```
packages/test-utils/
├── src/
│   ├── fixtures/
│   │   ├── base.ts           # Custom fixture definitions
│   │   └── index.ts
│   ├── page-objects/
│   │   ├── BasePage.ts       # Base page class
│   │   ├── DocumentPage.ts   # MDX document page
│   │   ├── FlowPage.ts       # React Flow page
│   │   ├── NavigationPage.ts # Navigation interactions
│   │   └── index.ts
│   ├── helpers/
│   │   ├── router.ts         # TanStack Router helpers
│   │   ├── mdx.ts            # MDX testing helpers
│   │   ├── flow.ts           # React Flow helpers
│   │   └── index.ts
│   └── index.ts              # Main exports
├── package.json
├── tsconfig.json
└── README.md
```

## Creating New Page Objects

Extend `BasePage` for new page types:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class MyCustomPage extends BasePage {
  readonly customElement: Locator;

  constructor(page: Page) {
    super(page);
    this.customElement = page.locator('[data-testid="custom"]');
  }

  async customAction() {
    await this.customElement.click();
  }
}
```

Then add to fixtures in `fixtures/base.ts`:

```typescript
export const test = base.extend<CustomFixtures>({
  myCustomPage: async ({ page }, use) => {
    const myCustomPage = new MyCustomPage(page);
    await use(myCustomPage);
  },
});
```

## Best Practices

1. **Use fixtures** instead of creating page objects in tests
2. **Use page objects** for reusable element locators and actions
3. **Use helpers** for complex multi-step operations
4. **Avoid hardcoding** selectors - use data-testid attributes
5. **Wait for stability** before assertions (use `waitForLoadState`)

## Related Documentation

- [Testing Workflow](.docs/workflows/testing-workflow.md)
- [ADR-0006: Playwright E2E Testing](.docs/decisions/0006-playwright-e2e-testing.md)
- [Playwright Documentation](https://playwright.dev)

## License

Private package for Flodoc monorepo use only.
