import { test, expect } from '@flodoc/test-utils';
import { MDXHelpers } from '@flodoc/test-utils/helpers';

/**
 * Table of Contents (TOC) Tests - F-015
 *
 * Tests for auto-generated TOC from document headings (H2-H4)
 * Features:
 * - Auto-generation from H2-H4 headings
 * - Current section highlighting
 * - Smooth scrolling
 * - Sticky desktop / Collapsible mobile
 */

test.describe('Table of Contents', () => {
  test('should display TOC on document page', async ({ page }) => {
    await page.goto('/docs/getting-started');
    await page.waitForLoadState('networkidle');

    const toc = page.locator('[data-testid="table-of-contents"]');
    await expect(toc).toBeVisible();
  });

  test('should generate TOC from H2-H4 headings', async ({ page }) => {
    await page.goto('/docs/getting-started');
    await page.waitForLoadState('networkidle');

    const allHeadings = await MDXHelpers.getDocumentHeadings(page);
    const h2ToH4Headings = allHeadings.filter(h => h.level >= 2 && h.level <= 4);

    const toc = page.locator('[data-testid="table-of-contents"]');

    for (const heading of h2ToH4Headings) {
      const tocLink = toc.locator(`a:has-text("${heading.text}")`);
      await expect(tocLink).toBeVisible();
    }
  });

  test('should scroll to section when clicked', async ({ page }) => {
    await page.goto('/docs/getting-started');
    await page.waitForLoadState('networkidle');

    const toc = page.locator('[data-testid="table-of-contents"]');
    const firstLink = toc.locator('a').first();
    const linkText = await firstLink.textContent();

    if (linkText) {
      await firstLink.click();
      await page.waitForTimeout(500);

      const targetHeading = page.locator('h2, h3, h4').filter({ hasText: linkText }).first();
      await expect(targetHeading).toBeInViewport();
    }
  });

  test('should highlight current section', async ({ page }) => {
    await page.goto('/docs/getting-started');
    await page.waitForLoadState('networkidle');

    const toc = page.locator('[data-testid="table-of-contents"]');
    const activeLink = toc.locator('[data-active="true"]').first();
    await expect(activeLink).toBeVisible();
  });

  test('should be sticky on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/docs/getting-started');
    await page.waitForLoadState('networkidle');

    const toc = page.locator('[data-testid="table-of-contents"]');
    const initialBox = await toc.boundingBox();

    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(100);

    const newBox = await toc.boundingBox();

    if (initialBox && newBox) {
      expect(Math.abs(initialBox.y - newBox.y)).toBeLessThan(50);
    }
  });

  test('should be collapsible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/docs/getting-started');
    await page.waitForLoadState('networkidle');

    const tocToggle = page.locator('[data-testid="toc-toggle"]');
    await expect(tocToggle).toBeVisible();

    const tocContent = page.locator('[data-testid="toc-content"]');
    await tocToggle.click();
    await page.waitForTimeout(300);

    await expect(tocContent).toBeVisible();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/docs/getting-started');
    await page.waitForLoadState('networkidle');

    const toc = page.locator('[data-testid="table-of-contents"]');
    const ariaLabel = await toc.getAttribute('aria-label');

    expect(ariaLabel).toBeTruthy();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/docs/getting-started');
    await page.waitForLoadState('networkidle');

    const toc = page.locator('[data-testid="table-of-contents"]');
    const firstLink = toc.locator('a').first();

    await firstLink.focus();
    const isFocused = await firstLink.evaluate(el => document.activeElement === el);
    expect(isFocused).toBe(true);
  });
});
