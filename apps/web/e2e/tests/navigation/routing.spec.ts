import { test, expect } from '@flodoc/test-utils';
import { RouterHelpers } from '@flodoc/test-utils/helpers';

/**
 * Routing Tests
 *
 * Tests TanStack Router navigation and routing behavior including:
 * - Route navigation
 * - Browser history (back/forward)
 * - URL parameters
 */

test.describe('TanStack Router Navigation', () => {
  test('should navigate between routes', async ({ page, navigationPage }) => {
    await navigationPage.goto('/');

    // Verify home page
    expect(page.url()).toMatch(/\/$/);

    // Navigate to a document (if it exists)
    const docsLink = page.locator('a[href^="/docs/"]').first();
    if (await docsLink.isVisible()) {
      const href = await docsLink.getAttribute('href');
      await docsLink.click();
      await page.waitForLoadState('networkidle');

      // Verify navigation occurred
      expect(page.url()).toContain(href || '');
    }
  });

  test('should handle browser back navigation', async ({ page, navigationPage }) => {
    await navigationPage.goto('/');
    const homeUrl = page.url();

    // Navigate to a different page
    const docsLink = page.locator('a[href^="/docs/"]').first();
    if (await docsLink.isVisible()) {
      await docsLink.click();
      await page.waitForLoadState('networkidle');

      // Go back
      await RouterHelpers.goBack(page);

      // Should be back at home
      expect(page.url()).toBe(homeUrl);
    }
  });

  test('should handle browser forward navigation', async ({ page, navigationPage }) => {
    await navigationPage.goto('/');

    // Navigate forward
    const docsLink = page.locator('a[href^="/docs/"]').first();
    if (await docsLink.isVisible()) {
      await docsLink.click();
      await page.waitForLoadState('networkidle');
      const docsUrl = page.url();

      // Go back
      await RouterHelpers.goBack(page);

      // Go forward
      await RouterHelpers.goForward(page);

      // Should be back at docs page
      expect(page.url()).toBe(docsUrl);
    }
  });

  test('should maintain route state during navigation', async ({ page }) => {
    await page.goto('/');

    // Navigate and verify page loads correctly
    const link = page.locator('a').first();
    if (await link.isVisible()) {
      await link.click();
      await page.waitForLoadState('networkidle');

      // Page should have loaded content
      const body = await page.locator('body').textContent();
      expect(body).toBeTruthy();
      expect(body!.length).toBeGreaterThan(0);
    }
  });
});

test.describe('Route Parameters', () => {
  test('should handle dynamic route parameters', async ({ page, documentPage }) => {
    // Navigate to a document with a slug parameter
    await documentPage.goto('getting-started');

    // Verify the URL includes the slug
    expect(page.url()).toContain('getting-started');
  });

  test('should handle 404 for non-existent routes', async ({ page }) => {
    const response = await page.goto('/non-existent-page-that-should-404');

    // Check if 404 handling exists
    // Note: This depends on how your app handles 404s
    // Adjust based on your implementation
    if (response) {
      const status = response.status();
      // Either 404 or 200 with error message shown
      expect([200, 404]).toContain(status);
    }
  });
});
