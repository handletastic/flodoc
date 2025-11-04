import { test, expect, devices } from '@playwright/test';

/**
 * Mobile Table of Contents Tests (F-006)
 *
 * Tests responsive TableOfContents component:
 * - Collapsible behavior on mobile
 * - Touch-friendly interactions
 * - Smooth scrolling
 * - Visual regression
 *
 * TDD: Write tests first, then implement responsive CSS
 */

const MOBILE_DEVICES = [
  { name: 'iPhone SE', ...devices['iPhone SE'] },
  { name: 'iPhone 12', ...devices['iPhone 12'] },
  { name: 'iPhone 14 Pro Max', ...devices['iPhone 14 Pro Max'] },
  { name: 'Pixel 5', ...devices['Pixel 5'] },
];

test.describe('Mobile Table of Contents - Collapsible', () => {
  for (const device of MOBILE_DEVICES) {
    test(`should be collapsed by default on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      const toc = page.getByTestId('table-of-contents');

      // TOC should be present
      await expect(toc).toBeVisible();

      // Toggle button should be visible
      const toggle = page.getByTestId('toc-toggle');
      await expect(toggle).toBeVisible();

      // Content should be hidden initially
      const content = page.getByTestId('toc-content');
      await expect(content).not.toBeVisible();

      await context.close();
    });

    test(`should expand when toggle is clicked on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      const toggle = page.getByTestId('toc-toggle');
      const content = page.getByTestId('toc-content');

      // Initially hidden
      await expect(content).not.toBeVisible();

      // Click to expand
      await toggle.click();
      await page.waitForTimeout(200);

      // Should be visible
      await expect(content).toBeVisible();

      // Click to collapse
      await toggle.click();
      await page.waitForTimeout(200);

      // Should be hidden again
      await expect(content).not.toBeVisible();

      await context.close();
    });

    test(`toggle should have touch-friendly size on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      const toggle = page.getByTestId('toc-toggle');
      const toggleBox = await toggle.boundingBox();

      expect(toggleBox).toBeTruthy();
      expect(toggleBox!.height).toBeGreaterThanOrEqual(44);

      await context.close();
    });

    test(`TOC links should have touch-friendly height on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      // Expand TOC
      const toggle = page.getByTestId('toc-toggle');
      await toggle.click();
      await page.waitForTimeout(200);

      // Check link heights
      const tocLinks = page.getByTestId('toc-content').locator('a');
      const linkCount = await tocLinks.count();

      if (linkCount > 0) {
        for (let i = 0; i < Math.min(linkCount, 3); i++) {
          const link = tocLinks.nth(i);
          const box = await link.boundingBox();
          expect(box).toBeTruthy();
          expect(box!.height).toBeGreaterThanOrEqual(36); // Slightly smaller than buttons is ok
        }
      }

      await context.close();
    });

    test(`should close after link click on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      // Expand TOC
      const toggle = page.getByTestId('toc-toggle');
      const content = page.getByTestId('toc-content');

      await toggle.click();
      await page.waitForTimeout(200);
      await expect(content).toBeVisible();

      // Click a link
      const firstLink = content.locator('a').first();
      const hasLinks = await firstLink.count() > 0;

      if (hasLinks) {
        await firstLink.click();
        await page.waitForTimeout(300);

        // TOC should collapse
        await expect(content).not.toBeVisible();
      }

      await context.close();
    });

    test(`should have proper visual appearance on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      // Screenshot collapsed
      await expect(page).toHaveScreenshot(`${device.name.toLowerCase().replace(/\s+/g, '-')}-toc-collapsed.png`);

      // Expand and screenshot
      const toggle = page.getByTestId('toc-toggle');
      await toggle.click();
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot(`${device.name.toLowerCase().replace(/\s+/g, '-')}-toc-expanded.png`);

      await context.close();
    });
  }
});

test.describe('Mobile Table of Contents - Smooth Scrolling', () => {
  test('should smoothly scroll to section on link click', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    await page.goto('/docs/getting-started');
    await page.waitForLoadState('networkidle');

    // Expand TOC
    const toggle = page.getByTestId('toc-toggle');
    await toggle.click();
    await page.waitForTimeout(200);

    // Click second link (if exists)
    const content = page.getByTestId('toc-content');
    const links = content.locator('a');
    const linkCount = await links.count();

    if (linkCount > 1) {
      const initialScroll = await page.evaluate(() => window.scrollY);

      await links.nth(1).click();
      await page.waitForTimeout(500); // Wait for smooth scroll

      const finalScroll = await page.evaluate(() => window.scrollY);

      // Should have scrolled
      expect(finalScroll).not.toBe(initialScroll);
    }

    await context.close();
  });
});

test.describe('Tablet Table of Contents', () => {
  test('should show expanded TOC on iPad', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPad (gen 7)'],
    });
    const page = await context.newPage();

    await page.goto('/docs/getting-started');
    await page.waitForLoadState('networkidle');

    const toc = page.getByTestId('table-of-contents');
    await expect(toc).toBeVisible();

    // Take screenshot
    await expect(page).toHaveScreenshot('ipad-toc.png');

    await context.close();
  });
});
