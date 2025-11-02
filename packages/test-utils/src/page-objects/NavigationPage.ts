import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

/**
 * Page Object for App Navigation
 *
 * Handles interactions with the main navigation, search, and routing.
 * Works with TanStack Router for type-safe navigation testing.
 */
export class NavigationPage extends BasePage {
  // Navigation elements
  readonly mainNav: Locator;
  readonly logo: Locator;
  readonly navLinks: Locator;
  readonly searchInput: Locator;
  readonly breadcrumbs: Locator;
  readonly sidebar: Locator;
  readonly themeToggle: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize navigation locators
    this.mainNav = page.locator('nav[data-testid="main-nav"], header nav').first();
    this.logo = page.locator('[data-testid="logo"], a[href="/"]').first();
    this.navLinks = page.locator('nav a');
    this.searchInput = page.locator('input[type="search"], [data-testid="search-input"]');
    this.breadcrumbs = page.locator('[data-testid="breadcrumbs"], nav[aria-label="Breadcrumb"]');
    this.sidebar = page.locator('[data-testid="sidebar"], aside');
    this.themeToggle = page.locator('[data-testid="theme-toggle"]');
  }

  /**
   * Navigate to home page
   */
  async gotoHome() {
    await this.logo.click();
    await this.waitForUrl('/');
  }

  /**
   * Click on a navigation link by text
   */
  async clickNavLink(text: string) {
    await this.navLinks.filter({ hasText: text }).first().click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Search for documents
   */
  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get all navigation link texts
   */
  async getNavLinkTexts(): Promise<string[]> {
    const links = await this.navLinks.all();
    return Promise.all(links.map(link => link.textContent().then(t => t?.trim() || '')));
  }

  /**
   * Check if navigation is visible
   */
  async isNavVisible(): Promise<boolean> {
    return await this.mainNav.isVisible();
  }

  /**
   * Get breadcrumb trail
   */
  async getBreadcrumbs(): Promise<string[]> {
    const items = await this.breadcrumbs.locator('a, span').all();
    return Promise.all(items.map(item => item.textContent().then(t => t?.trim() || '')));
  }

  /**
   * Toggle sidebar (mobile)
   */
  async toggleSidebar() {
    const sidebarToggle = this.page.locator('[data-testid="sidebar-toggle"], button[aria-label*="menu"]');
    await sidebarToggle.click();
  }

  /**
   * Check if sidebar is visible
   */
  async isSidebarVisible(): Promise<boolean> {
    return await this.sidebar.isVisible();
  }

  /**
   * Toggle dark/light theme
   */
  async toggleTheme() {
    if (await this.themeToggle.isVisible()) {
      await this.themeToggle.click();
    }
  }

  /**
   * Navigate using TanStack Router Link
   */
  async navigateToRoute(path: string) {
    const link = this.page.locator(`a[href="${path}"]`).first();
    await link.click();
    await this.waitForUrl(path);
  }

  /**
   * Verify current route matches expected path
   */
  async verifyRoute(expectedPath: string): Promise<boolean> {
    const currentUrl = this.getUrl();
    return currentUrl.endsWith(expectedPath);
  }

  /**
   * Get active nav link (highlighted)
   */
  async getActiveNavLink(): Promise<string> {
    const activeLink = this.mainNav.locator('a[aria-current="page"], a.active').first();
    return (await activeLink.textContent()) || '';
  }
}
