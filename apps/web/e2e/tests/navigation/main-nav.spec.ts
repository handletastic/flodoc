import { test, expect } from '@flodoc/test-utils';

/**
 * Main Navigation Tests
 *
 * Tests the primary navigation functionality including:
 * - Navigation visibility
 * - Logo link to home
 * - Navigation link functionality
 */

test.describe('Main Navigation', () => {
  test('should display main navigation', async ({ page, navigationPage }) => {
    await navigationPage.goto('/');

    // Verify navigation is visible
    const isNavVisible = await navigationPage.isNavVisible();
    expect(isNavVisible).toBe(true);
  });

  test('should navigate to home when clicking logo', async ({ page, navigationPage }) => {
    await navigationPage.goto('/docs/getting-started');

    // Click logo to return home
    await navigationPage.gotoHome();

    // Verify we're on the home page
    expect(page.url()).toMatch(/\/$/);
  });

  test('should display navigation links', async ({ page, navigationPage }) => {
    await navigationPage.goto('/');

    // Get all nav links
    const navLinks = await navigationPage.getNavLinkTexts();

    // Should have at least a few navigation items
    expect(navLinks.length).toBeGreaterThan(0);
  });

  test('should navigate using TanStack Router links', async ({ page, navigationPage }) => {
    await navigationPage.goto('/');

    // Navigate to a docs page if a link exists
    // This is a placeholder - adjust based on your actual navigation structure
    const navLinks = await navigationPage.getNavLinkTexts();

    if (navLinks.some(link => link.includes('Docs') || link.includes('Documentation'))) {
      await navigationPage.clickNavLink('Docs');
      await page.waitForLoadState('networkidle');

      // Verify navigation occurred
      expect(page.url()).not.toMatch(/\/$/);
    }
  });
});

test.describe('Navigation Responsiveness', () => {
  test('should display navigation on desktop viewport', async ({ page, navigationPage }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await navigationPage.goto('/');

    const isNavVisible = await navigationPage.isNavVisible();
    expect(isNavVisible).toBe(true);
  });

  test('should handle navigation on mobile viewport', async ({ page, navigationPage }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await navigationPage.goto('/');

    // On mobile, there might be a hamburger menu
    // This test should be adjusted based on your actual mobile navigation
    const isNavVisible = await navigationPage.isNavVisible();
    expect(isNavVisible).toBe(true);
  });
});
