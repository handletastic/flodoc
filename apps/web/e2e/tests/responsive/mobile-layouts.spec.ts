import { test, expect, devices } from '@playwright/test';

/**
 * Mobile Layout Tests (F-006)
 *
 * Tests overall responsive layout:
 * - Typography scaling
 * - Spacing adjustments
 * - Content reflow
 * - Full page visual regression
 *
 * TDD: Write tests first, then implement responsive CSS
 */

const MOBILE_DEVICES = [
  { name: 'iPhone SE', ...devices['iPhone SE'] },
  { name: 'iPhone 12', ...devices['iPhone 12'] },
  { name: 'iPhone 14 Pro Max', ...devices['iPhone 14 Pro Max'] },
  { name: 'Pixel 5', ...devices['Pixel 5'] },
];

const TABLET_DEVICES = [
  { name: 'iPad', ...devices['iPad (gen 7)'] },
];

test.describe('Mobile Typography - Responsive Scaling', () => {
  for (const device of MOBILE_DEVICES) {
    test(`should have readable typography on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      // Check body text
      const article = page.locator('article');
      const bodyText = article.locator('p').first();

      if (await bodyText.count() > 0) {
        const fontSize = await bodyText.evaluate(el => {
          return parseInt(window.getComputedStyle(el).fontSize);
        });

        // Body text should be at least 16px on mobile
        expect(fontSize).toBeGreaterThanOrEqual(16);

        // Line height should be comfortable
        const lineHeight = await bodyText.evaluate(el => {
          return window.getComputedStyle(el).lineHeight;
        });
        expect(parseFloat(lineHeight)).toBeGreaterThan(fontSize * 1.4);
      }

      await context.close();
    });

    test(`headings should scale appropriately on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      const article = page.locator('article');

      // H1
      const h1 = article.locator('h1').first();
      if (await h1.count() > 0) {
        const h1Size = await h1.evaluate(el => parseInt(window.getComputedStyle(el).fontSize));
        expect(h1Size).toBeGreaterThanOrEqual(24); // Minimum for mobile
        expect(h1Size).toBeLessThanOrEqual(36); // Max to avoid overflow
      }

      // H2
      const h2 = article.locator('h2').first();
      if (await h2.count() > 0) {
        const h2Size = await h2.evaluate(el => parseInt(window.getComputedStyle(el).fontSize));
        expect(h2Size).toBeGreaterThanOrEqual(20);
        expect(h2Size).toBeLessThanOrEqual(30);
      }

      await context.close();
    });
  }
});

test.describe('Mobile Spacing - Responsive Adjustments', () => {
  for (const device of MOBILE_DEVICES) {
    test(`should have appropriate spacing on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      // Check article padding
      const article = page.locator('article');
      if (await article.count() > 0) {
        const padding = await article.evaluate(el => {
          const style = window.getComputedStyle(el);
          return {
            left: parseInt(style.paddingLeft),
            right: parseInt(style.paddingRight),
          };
        });

        // Should have reasonable padding on mobile (not too cramped)
        expect(padding.left).toBeGreaterThanOrEqual(16);
        expect(padding.right).toBeGreaterThanOrEqual(16);

        // But not excessive
        expect(padding.left).toBeLessThanOrEqual(32);
        expect(padding.right).toBeLessThanOrEqual(32);
      }

      await context.close();
    });
  }
});

test.describe('Mobile Layout - Content Reflow', () => {
  for (const device of MOBILE_DEVICES) {
    test(`content should not overflow horizontally on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      // Check for horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = page.viewportSize()!.width;

      // Allow small tolerance for scrollbar
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20);

      await context.close();
    });

    test(`images should be responsive on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      // Check images in article
      const images = page.locator('article img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        for (let i = 0; i < imageCount; i++) {
          const img = images.nth(i);
          const imgBox = await img.boundingBox();
          const viewportWidth = page.viewportSize()!.width;

          if (imgBox) {
            // Images should not exceed viewport
            expect(imgBox.width).toBeLessThanOrEqual(viewportWidth);
          }
        }
      }

      await context.close();
    });
  }
});

test.describe('Mobile Layout - Full Page Visual Regression', () => {
  for (const device of MOBILE_DEVICES) {
    test(`homepage should render correctly on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot(`${device.name.toLowerCase().replace(/\s+/g, '-')}-homepage-full.png`, {
        fullPage: true,
      });

      await context.close();
    });

    test(`docs page should render correctly on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot(`${device.name.toLowerCase().replace(/\s+/g, '-')}-docs-full.png`, {
        fullPage: true,
      });

      await context.close();
    });
  }
});

test.describe('Tablet Layout', () => {
  for (const device of TABLET_DEVICES) {
    test(`should have tablet-optimized layout on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      // Full page screenshot
      await expect(page).toHaveScreenshot(`${device.name.toLowerCase().replace(/\s+/g, '-')}-full-page.png`, {
        fullPage: true,
      });

      await context.close();
    });
  }
});

test.describe('Orientation - Portrait vs Landscape', () => {
  test('should adapt to landscape orientation on mobile', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12 landscape'],
    });
    const page = await context.newPage();

    await page.goto('/docs/getting-started');
    await page.waitForLoadState('networkidle');

    // Take screenshot in landscape
    await expect(page).toHaveScreenshot('iphone-12-landscape.png');

    await context.close();
  });
});
