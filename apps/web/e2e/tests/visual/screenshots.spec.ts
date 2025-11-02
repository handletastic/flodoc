import { test, expect } from '@flodoc/test-utils';

/**
 * Visual Regression Tests
 *
 * Captures and compares screenshots to detect unintended visual changes.
 *
 * IMPORTANT:
 * - First run generates baseline screenshots
 * - Subsequent runs compare against baselines
 * - Review changes carefully before updating baselines
 * - Use `npx playwright test --update-snapshots` to update baselines
 */

test.describe('Visual Regression - Home Page', () => {
  test('home page layout matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('home page on mobile matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('home-page-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Document Pages', () => {
  test('document page layout matches baseline', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    // Hide volatile elements (dates, timestamps)
    await page.addStyleTag({
      content: '[data-volatile], [data-timestamp] { visibility: hidden !important; }',
    });

    await expect(page).toHaveScreenshot('document-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('document with code highlighting matches baseline', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    // Focus on the main content area
    await expect(documentPage.content).toHaveScreenshot('document-content.png', {
      animations: 'disabled',
    });
  });

  test('document page on tablet matches baseline', async ({ page, documentPage }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await documentPage.goto('getting-started');

    await expect(page).toHaveScreenshot('document-page-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Navigation', () => {
  test('main navigation matches baseline', async ({ page, navigationPage }) => {
    await navigationPage.goto('/');

    // Screenshot just the navigation area
    await expect(navigationPage.mainNav).toHaveScreenshot('main-navigation.png', {
      animations: 'disabled',
    });
  });

  test('navigation on mobile matches baseline', async ({ page, navigationPage }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await navigationPage.goto('/');

    await expect(navigationPage.mainNav).toHaveScreenshot('main-navigation-mobile.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Dark Mode', () => {
  test.skip('home page in dark mode matches baseline', async ({ page, navigationPage }) => {
    await navigationPage.goto('/');

    // Toggle to dark mode
    await navigationPage.toggleTheme();
    await page.waitForTimeout(500); // Allow theme transition

    await expect(page).toHaveScreenshot('home-page-dark.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test.skip('document page in dark mode matches baseline', async ({ page, documentPage, navigationPage }) => {
    await documentPage.goto('getting-started');

    // Toggle to dark mode
    await navigationPage.toggleTheme();
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('document-page-dark.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Flow Visualization', () => {
  test.skip('knowledge graph view matches baseline', async ({ page, flowPage }) => {
    await flowPage.goto('knowledge-graph');
    await page.waitForTimeout(2000); // Allow flow layout to stabilize

    // Hide minimap for consistent screenshots
    await page.addStyleTag({
      content: '.react-flow__minimap { display: none !important; }',
    });

    // Fit view before screenshot
    await flowPage.fitView();
    await page.waitForTimeout(500);

    await expect(flowPage.flowContainer).toHaveScreenshot('knowledge-graph.png', {
      animations: 'disabled',
    });
  });

  test.skip('navigation tree view matches baseline', async ({ page, flowPage }) => {
    await flowPage.goto('navigation-tree');
    await page.waitForTimeout(2000);

    await page.addStyleTag({
      content: '.react-flow__minimap { display: none !important; }',
    });

    await flowPage.fitView();
    await page.waitForTimeout(500);

    await expect(flowPage.flowContainer).toHaveScreenshot('navigation-tree.png', {
      animations: 'disabled',
    });
  });

  test.skip('learning path view matches baseline', async ({ page, flowPage }) => {
    await flowPage.goto('learning-path');
    await page.waitForTimeout(2000);

    await page.addStyleTag({
      content: '.react-flow__minimap { display: none !important; }',
    });

    await flowPage.fitView();
    await page.waitForTimeout(500);

    await expect(flowPage.flowContainer).toHaveScreenshot('learning-path.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Responsive Layouts', () => {
  const viewports = [
    { name: 'mobile-portrait', width: 375, height: 667 },
    { name: 'mobile-landscape', width: 667, height: 375 },
    { name: 'tablet-portrait', width: 768, height: 1024 },
    { name: 'tablet-landscape', width: 1024, height: 768 },
    { name: 'desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`home page on ${viewport.name} matches baseline`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot(`home-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
});
