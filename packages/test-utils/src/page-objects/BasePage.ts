import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object
 *
 * Provides common functionality for all page objects.
 * Extend this class to create specific page objects.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific path
   */
  async goto(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for a specific URL pattern
   */
  async waitForUrl(pattern: string | RegExp, timeout = 5000) {
    await this.page.waitForURL(pattern, {
      waitUntil: 'networkidle',
      timeout,
    });
  }

  /**
   * Get the current URL
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(selector: string, timeout = 5000): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    return element;
  }

  /**
   * Check if an element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Click on an element with optional wait
   */
  async click(selector: string, options?: { timeout?: number; force?: boolean }) {
    await this.page.locator(selector).click(options);
  }

  /**
   * Type text into an input field
   */
  async fill(selector: string, text: string) {
    await this.page.locator(selector).fill(text);
  }

  /**
   * Get text content of an element
   */
  async getText(selector: string): Promise<string> {
    return (await this.page.locator(selector).textContent()) || '';
  }

  /**
   * Take a screenshot for visual regression testing
   */
  async screenshot(name: string, options?: { fullPage?: boolean; mask?: Locator[] }) {
    return await this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: options?.fullPage ?? false,
      mask: options?.mask,
    });
  }
}
