import { test, expect, devices } from '@playwright/test';

/**
 * Mobile Sidebar Tests (F-006)
 *
 * Tests responsive sidebar component across mobile devices:
 * - Collapsible sidebar on mobile
 * - Touch-friendly interactions
 * - Proper overlay behavior
 * - Visual regression testing
 *
 * TDD: Write tests first, then implement responsive CSS
 */

const MOBILE_DEVICES = [
  { name: 'iPhone SE', ...devices['iPhone SE'] },
  { name: 'iPhone 12', ...devices['iPhone 12'] },
  { name: 'iPhone 14 Pro Max', ...devices['iPhone 14 Pro Max'] },
  { name: 'Pixel 5', ...devices['Pixel 5'] },
];

test.describe('Mobile Sidebar - Collapsible Behavior', () => {
  for (const device of MOBILE_DEVICES) {
    test(`should be hidden by default on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      const sidebar = page.getByTestId('sidebar');
      const toggle = page.getByTestId('sidebar-toggle');

      // Sidebar should be hidden off-screen
      const sidebarBox = await sidebar.boundingBox();
      expect(sidebarBox).toBeTruthy();
      expect(sidebarBox!.x).toBeLessThan(0); // Off-screen to the left

      // Toggle should be visible
      await expect(toggle).toBeVisible();

      await context.close();
    });

    test(`should slide in when toggle is clicked on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      const sidebar = page.getByTestId('sidebar');
      const toggle = page.getByTestId('sidebar-toggle');

      // Open sidebar
      await toggle.click();
      await page.waitForTimeout(300); // Wait for animation

      // Sidebar should be on-screen
      const sidebarBox = await sidebar.boundingBox();
      expect(sidebarBox).toBeTruthy();
      expect(sidebarBox!.x).toBeGreaterThanOrEqual(0);

      await context.close();
    });

    test(`should show overlay when sidebar is open on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      const toggle = page.getByTestId('sidebar-toggle');

      // No overlay initially
      const overlay = page.locator('[data-testid="sidebar-overlay"], .fixed.inset-0.bg-black\\/50');
      await expect(overlay).not.toBeVisible();

      // Open sidebar
      await toggle.click();
      await page.waitForTimeout(300);

      // Overlay should be visible
      await expect(overlay).toBeVisible();

      await context.close();
    });

    test(`should close when overlay is clicked on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      const sidebar = page.getByTestId('sidebar');
      const toggle = page.getByTestId('sidebar-toggle');

      // Open sidebar
      await toggle.click();
      await page.waitForTimeout(300);

      // Sidebar should be visible
      let sidebarBox = await sidebar.boundingBox();
      expect(sidebarBox!.x).toBeGreaterThanOrEqual(0);

      // Click overlay
      const overlay = page.locator('[data-testid="sidebar-overlay"], .fixed.inset-0.bg-black\\/50').first();
      await overlay.click({ position: { x: 300, y: 300 } }); // Click away from sidebar
      await page.waitForTimeout(300);

      // Sidebar should be hidden
      sidebarBox = await sidebar.boundingBox();
      expect(sidebarBox!.x).toBeLessThan(0);

      await context.close();
    });

    test(`sidebar toggle should have touch-friendly size on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      const toggle = page.getByTestId('sidebar-toggle');
      const toggleBox = await toggle.boundingBox();

      expect(toggleBox).toBeTruthy();
      expect(toggleBox!.width).toBeGreaterThanOrEqual(44);
      expect(toggleBox!.height).toBeGreaterThanOrEqual(44);

      await context.close();
    });

    test(`sidebar links should have touch-friendly height on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      await page.goto('/docs/getting-started');
      await page.waitForLoadState('networkidle');

      // Open sidebar
      const toggle = page.getByTestId('sidebar-toggle');
      await toggle.click();
      await page.waitForTimeout(300);

      // Check link heights
      const sidebar = page.getByTestId('sidebar');
      const links = sidebar.locator('a');
      const linkCount = await links.count();

      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = links.nth(i);
        const box = await link.boundingBox();
        expect(box).toBeTruthy();
        expect(box!.height).toBeGreaterThanOrEqual(44);
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

      // Screenshot with sidebar closed
      await expect(page).toHaveScreenshot(`${device.name.toLowerCase().replace(/\s+/g, '-')}-sidebar-closed.png`);

      // Open sidebar
      const toggle = page.getByTestId('sidebar-toggle');
      await toggle.click();
      await page.waitForTimeout(300);

      // Screenshot with sidebar open
      await expect(page).toHaveScreenshot(`${device.name.toLowerCase().replace(/\s+/g, '-')}-sidebar-open.png`);

      await context.close();
    });
  }
});

test.describe('Mobile Sidebar - Scrolling', () => {
  test('should allow scrolling within sidebar', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    await page.goto('/docs/getting-started');
    await page.waitForLoadState('networkidle');

    // Open sidebar
    const toggle = page.getByTestId('sidebar-toggle');
    await toggle.click();
    await page.waitForTimeout(300);

    const sidebar = page.getByTestId('sidebar');

    // Get scrollable container
    const scrollContainer = sidebar.locator('nav');
    const scrollHeight = await scrollContainer.evaluate(el => el.scrollHeight);
    const clientHeight = await scrollContainer.evaluate(el => el.clientHeight);

    // If content is scrollable, test scrolling
    if (scrollHeight > clientHeight) {
      // Scroll within sidebar
      await scrollContainer.evaluate(el => el.scrollTo(0, 100));
      await page.waitForTimeout(100);

      const scrollTop = await scrollContainer.evaluate(el => el.scrollTop);
      expect(scrollTop).toBeGreaterThan(0);
    }

    await context.close();
  });
});

test.describe('Tablet Sidebar', () => {
  test('should show sidebar on iPad', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPad (gen 7)'],
    });
    const page = await context.newPage();

    await page.goto('/docs/getting-started');
    await page.waitForLoadState('networkidle');

    const sidebar = page.getByTestId('sidebar');

    // Sidebar should be visible on tablet (depending on breakpoint)
    const sidebarBox = await sidebar.boundingBox();
    expect(sidebarBox).toBeTruthy();

    // Take screenshot
    await expect(page).toHaveScreenshot('ipad-sidebar.png');

    await context.close();
  });
});
