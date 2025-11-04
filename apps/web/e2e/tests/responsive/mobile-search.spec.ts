import { test, expect, devices } from '@playwright/test';

/**
 * Mobile Search Tests (F-006)
 *
 * Tests responsive Search component:
 * - Responsive input sizing
 * - Touch-friendly interactions
 * - Mobile keyboard behavior
 * - Results dropdown on small screens
 *
 * TDD: Write tests first, then implement responsive CSS
 */

const MOBILE_DEVICES = [
  { name: 'iPhone SE', ...devices['iPhone SE'] },
  { name: 'iPhone 12', ...devices['iPhone 12'] },
  { name: 'iPhone 14 Pro Max', ...devices['iPhone 14 Pro Max'] },
  { name: 'Pixel 5', ...devices['Pixel 5'] },
];

test.describe('Mobile Search - Input Sizing', () => {
  for (const device of MOBILE_DEVICES) {
    test(`should be properly sized on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/');

      const searchInput = page.getByTestId('search-input');
      await expect(searchInput).toBeVisible();

      // Input should have touch-friendly height
      const inputBox = await searchInput.boundingBox();
      expect(inputBox).toBeTruthy();
      expect(inputBox!.height).toBeGreaterThanOrEqual(44);

      // Font size should be at least 16px to prevent zoom on iOS
      const fontSize = await searchInput.evaluate(el => {
        return window.getComputedStyle(el).fontSize;
      });
      expect(parseInt(fontSize)).toBeGreaterThanOrEqual(16);

      await context.close();
    });

    test(`should be responsive width on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/');

      const searchInput = page.getByTestId('search-input');
      const inputBox = await searchInput.boundingBox();
      const viewport = page.viewportSize();

      expect(inputBox).toBeTruthy();
      expect(viewport).toBeTruthy();

      // Search should adapt to available space but not overflow
      expect(inputBox!.width).toBeLessThan(viewport!.width);
      expect(inputBox!.width).toBeGreaterThan(100); // Should have reasonable width

      await context.close();
    });
  }
});

test.describe('Mobile Search - Results Dropdown', () => {
  for (const device of MOBILE_DEVICES) {
    test(`search results should fit viewport on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/');

      const searchInput = page.getByTestId('search-input');
      await searchInput.click();
      await searchInput.fill('getting');
      await page.waitForTimeout(300);

      const results = page.getByTestId('search-results');
      await expect(results).toBeVisible();

      const resultsBox = await results.boundingBox();
      const viewport = page.viewportSize();

      expect(resultsBox).toBeTruthy();
      expect(viewport).toBeTruthy();

      // Results should fit within viewport width
      expect(resultsBox!.width).toBeLessThanOrEqual(viewport!.width);

      // Results should not exceed viewport height
      expect(resultsBox!.height).toBeLessThanOrEqual(viewport!.height - resultsBox!.y);

      await context.close();
    });

    test(`search result items should be touch-friendly on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/');

      const searchInput = page.getByTestId('search-input');
      await searchInput.click();
      await searchInput.fill('getting');
      await page.waitForTimeout(300);

      const resultItems = page.locator('[data-testid="search-result-item"]');
      const itemCount = await resultItems.count();

      if (itemCount > 0) {
        // Check first few items
        for (let i = 0; i < Math.min(itemCount, 3); i++) {
          const item = resultItems.nth(i);
          const box = await item.boundingBox();
          expect(box).toBeTruthy();
          expect(box!.height).toBeGreaterThanOrEqual(44);
        }
      }

      await context.close();
    });

    test(`should handle scrolling in results on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/');

      const searchInput = page.getByTestId('search-input');
      await searchInput.click();
      await searchInput.fill('doc'); // Search for common term
      await page.waitForTimeout(300);

      const results = page.getByTestId('search-results');
      await expect(results).toBeVisible();

      // Check if results are scrollable
      const scrollHeight = await results.evaluate(el => el.scrollHeight);
      const clientHeight = await results.evaluate(el => el.clientHeight);

      // If scrollable, test scrolling
      if (scrollHeight > clientHeight) {
        await results.evaluate(el => el.scrollTo(0, 100));
        await page.waitForTimeout(100);

        const scrollTop = await results.evaluate(el => el.scrollTop);
        expect(scrollTop).toBeGreaterThan(0);
      }

      await context.close();
    });

    test(`should have proper visual appearance on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/');

      // Screenshot with search closed
      await expect(page).toHaveScreenshot(`${device.name.toLowerCase().replace(/\s+/g, '-')}-search-closed.png`);

      // Focus and search
      const searchInput = page.getByTestId('search-input');
      await searchInput.click();
      await searchInput.fill('getting');
      await page.waitForTimeout(300);

      // Screenshot with search results
      await expect(page).toHaveScreenshot(`${device.name.toLowerCase().replace(/\s+/g, '-')}-search-results.png`);

      await context.close();
    });
  }
});

test.describe('Mobile Search - Interaction', () => {
  test('should close results when clicking outside', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    await page.goto('/');

    const searchInput = page.getByTestId('search-input');
    await searchInput.click();
    await searchInput.fill('getting');
    await page.waitForTimeout(300);

    const results = page.getByTestId('search-results');
    await expect(results).toBeVisible();

    // Click outside
    await page.locator('body').click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(200);

    // Results should be hidden
    await expect(results).not.toBeVisible();

    await context.close();
  });
});
