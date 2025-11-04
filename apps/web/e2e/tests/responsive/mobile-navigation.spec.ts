import { test, expect, devices } from '@playwright/test';

/**
 * Mobile Navigation Tests (F-006)
 *
 * Tests responsive navigation component across mobile devices:
 * - iPhone SE (375x667)
 * - iPhone 12 (390x844)
 * - iPhone 14 Pro Max (430x932)
 * - Pixel 5 (393x851)
 * - iPad (768x1024)
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

test.describe('Mobile Navigation - Hamburger Menu', () => {
  for (const device of MOBILE_DEVICES) {
    test(`should show hamburger menu on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/');

      // Hamburger button should be visible on mobile
      const hamburger = page.getByTestId('mobile-menu-toggle');
      await expect(hamburger).toBeVisible();

      // Desktop navigation links should be hidden
      const desktopNav = page.locator('[data-testid="desktop-nav-links"]');
      await expect(desktopNav).not.toBeVisible();

      await context.close();
    });

    test(`should toggle mobile menu on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/');

      const hamburger = page.getByTestId('mobile-menu-toggle');
      const mobileMenu = page.getByTestId('mobile-menu');

      // Menu should be closed initially
      await expect(mobileMenu).not.toBeVisible();

      // Open menu
      await hamburger.click();
      await expect(mobileMenu).toBeVisible();

      // Close menu
      await hamburger.click();
      await expect(mobileMenu).not.toBeVisible();

      await context.close();
    });

    test(`should have touch-friendly tap targets (44x44px) on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/');

      // Open mobile menu
      const hamburger = page.getByTestId('mobile-menu-toggle');
      await hamburger.click();

      // Check hamburger button size (should be at least 44x44px)
      const hamburgerBox = await hamburger.boundingBox();
      expect(hamburgerBox).toBeTruthy();
      expect(hamburgerBox!.width).toBeGreaterThanOrEqual(44);
      expect(hamburgerBox!.height).toBeGreaterThanOrEqual(44);

      // Check mobile menu links
      const menuLinks = page.locator('[data-testid="mobile-menu"] a');
      const linkCount = await menuLinks.count();

      for (let i = 0; i < linkCount; i++) {
        const link = menuLinks.nth(i);
        const box = await link.boundingBox();
        expect(box).toBeTruthy();
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }

      await context.close();
    });

    test(`should close menu when link is clicked on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/');

      // Open menu
      const hamburger = page.getByTestId('mobile-menu-toggle');
      await hamburger.click();

      const mobileMenu = page.getByTestId('mobile-menu');
      await expect(mobileMenu).toBeVisible();

      // Click a link
      const docsLink = mobileMenu.locator('a', { hasText: 'Docs' }).first();
      await docsLink.click();

      // Menu should close
      await expect(mobileMenu).not.toBeVisible();

      await context.close();
    });

    test(`should have proper visual appearance on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/');

      // Take screenshot with menu closed
      await expect(page).toHaveScreenshot(`${device.name.toLowerCase().replace(/\s+/g, '-')}-nav-closed.png`);

      // Open menu and take screenshot
      const hamburger = page.getByTestId('mobile-menu-toggle');
      await hamburger.click();
      await page.waitForTimeout(300); // Wait for animation

      await expect(page).toHaveScreenshot(`${device.name.toLowerCase().replace(/\s+/g, '-')}-nav-open.png`);

      await context.close();
    });
  }
});

test.describe('Tablet Navigation', () => {
  for (const device of TABLET_DEVICES) {
    test(`should show responsive layout on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/');

      // iPad should show desktop navigation or adapted mobile menu
      const hamburger = page.getByTestId('mobile-menu-toggle');

      // Check if hamburger is visible or hidden (depends on breakpoint)
      const isVisible = await hamburger.isVisible();

      // Take screenshot for visual verification
      await expect(page).toHaveScreenshot(`${device.name.toLowerCase().replace(/\s+/g, '-')}-nav.png`);

      await context.close();
    });
  }
});

test.describe('Navigation - Responsive Typography', () => {
  test('should have readable typography on mobile', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    await page.goto('/');

    // Logo should be readable
    const logo = page.getByTestId('logo');
    const logoStyle = await logo.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
      };
    });

    // Font size should be at least 16px on mobile
    const fontSize = parseInt(logoStyle.fontSize);
    expect(fontSize).toBeGreaterThanOrEqual(16);

    await context.close();
  });
});

test.describe('Navigation - Sticky Behavior', () => {
  test('should remain sticky on mobile scroll', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    await page.goto('/docs/getting-started');
    await page.waitForLoadState('networkidle');

    const nav = page.getByTestId('main-nav');

    // Get initial position
    const initialPos = await nav.boundingBox();
    expect(initialPos).toBeTruthy();

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(100);

    // Nav should still be at top (sticky)
    const scrolledPos = await nav.boundingBox();
    expect(scrolledPos).toBeTruthy();
    expect(scrolledPos!.y).toBeLessThanOrEqual(10);

    await context.close();
  });
});
