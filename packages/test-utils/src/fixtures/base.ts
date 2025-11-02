import { test as base } from '@playwright/test';
import { DocumentPage } from '../page-objects/DocumentPage.js';
import { FlowPage } from '../page-objects/FlowPage.js';
import { NavigationPage } from '../page-objects/NavigationPage.js';

/**
 * Custom fixtures for Flodoc E2E tests
 *
 * These fixtures provide:
 * - Pre-initialized page objects
 * - Automatic cleanup
 * - Consistent test setup
 */
export type CustomFixtures = {
  /**
   * Document page object for testing MDX document rendering and interactions
   */
  documentPage: DocumentPage;

  /**
   * Flow page object for testing React Flow visualization features
   */
  flowPage: FlowPage;

  /**
   * Navigation page object for testing app navigation and routing
   */
  navigationPage: NavigationPage;
};

/**
 * Extended test with custom fixtures
 *
 * Usage:
 * ```typescript
 * import { test, expect } from '@flodoc/test-utils';
 *
 * test('should navigate to document', async ({ documentPage }) => {
 *   await documentPage.goto('getting-started');
 *   await expect(documentPage.title).toBeVisible();
 * });
 * ```
 */
export const test = base.extend<CustomFixtures>({
  // Document page fixture
  documentPage: async ({ page }, use) => {
    const documentPage = new DocumentPage(page);
    await use(documentPage);
    // Cleanup happens automatically
  },

  // Flow visualization page fixture
  flowPage: async ({ page }, use) => {
    const flowPage = new FlowPage(page);
    await use(flowPage);
  },

  // Navigation page fixture
  navigationPage: async ({ page }, use) => {
    const navigationPage = new NavigationPage(page);
    await use(navigationPage);
  },
});

// Re-export expect
export { expect } from '@playwright/test';
