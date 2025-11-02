import { Page } from '@playwright/test';

/**
 * TanStack Router Test Helpers
 *
 * Utilities for testing TanStack Router navigation and routing behavior.
 */
export class RouterHelpers {
  /**
   * Wait for a route change to complete
   */
  static async waitForRouteChange(page: Page, expectedPath: string, timeout = 5000) {
    await page.waitForURL(`**${expectedPath}`, {
      waitUntil: 'networkidle',
      timeout,
    });
  }

  /**
   * Navigate using a TanStack Router Link component
   */
  static async navigateWithRouter(page: Page, path: string) {
    const link = page.locator(`a[href="${path}"]`).first();
    await link.click();
    await this.waitForRouteChange(page, path);
  }

  /**
   * Verify route search parameters
   */
  static async verifyRouteParams(
    page: Page,
    expectedParams: Record<string, string>
  ): Promise<boolean> {
    const url = new URL(page.url());

    for (const [key, value] of Object.entries(expectedParams)) {
      const actual = url.searchParams.get(key);
      if (actual !== value) {
        console.error(`Route param ${key} expected ${value}, got ${actual}`);
        return false;
      }
    }

    return true;
  }

  /**
   * Get current route parameters
   */
  static async getRouteParams(page: Page): Promise<Record<string, string>> {
    const url = new URL(page.url());
    const params: Record<string, string> = {};

    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return params;
  }

  /**
   * Verify hash fragment
   */
  static async verifyHash(page: Page, expectedHash: string): Promise<boolean> {
    const url = new URL(page.url());
    return url.hash === expectedHash;
  }

  /**
   * Navigate back using browser history
   */
  static async goBack(page: Page) {
    await page.goBack();
    await page.waitForLoadState('networkidle');
  }

  /**
   * Navigate forward using browser history
   */
  static async goForward(page: Page) {
    await page.goForward();
    await page.waitForLoadState('networkidle');
  }

  /**
   * Verify router state (useful for debugging)
   */
  static async getRouterState(page: Page): Promise<any> {
    return await page.evaluate(() => {
      // Access TanStack Router state from window (if exposed in dev)
      return (window as any).__TANSTACK_ROUTER__;
    });
  }
}
