import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

/**
 * Page Object for MDX Document pages
 *
 * Handles interactions with documentation pages including:
 * - MDX content rendering
 * - Frontmatter metadata
 * - Document connections
 * - Code highlighting
 */
export class DocumentPage extends BasePage {
  // Page elements
  readonly title: Locator;
  readonly content: Locator;
  readonly description: Locator;
  readonly tags: Locator;
  readonly connections: Locator;
  readonly codeBlocks: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.title = page.locator('h1').first();
    this.content = page.locator('[data-testid="doc-content"], main, article').first();
    this.description = page.locator('[data-testid="doc-description"]');
    this.tags = page.locator('[data-testid="doc-tag"], [data-tag]');
    this.connections = page.locator('[data-testid="doc-connection"], [data-connection-type]');
    this.codeBlocks = page.locator('pre code');
  }

  /**
   * Navigate to a document by slug
   */
  async goto(slug: string) {
    await super.goto(`/docs/${slug}`);
  }

  /**
   * Get the number of document connections
   */
  async getConnectionCount(): Promise<number> {
    return await this.connections.count();
  }

  /**
   * Click on a specific connection by index
   */
  async clickConnection(index: number) {
    await this.connections.nth(index).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get all connection targets
   */
  async getConnectionTargets(): Promise<string[]> {
    const links = await this.connections.locator('a').all();
    const hrefs = await Promise.all(links.map(link => link.getAttribute('href')));
    return hrefs.filter((href): href is string => href !== null);
  }

  /**
   * Get connections by type
   */
  async getConnectionsByType(type: 'prerequisite' | 'next' | 'related' | 'seealso'): Promise<Locator> {
    return this.page.locator(`[data-connection-type="${type}"]`);
  }

  /**
   * Verify MDX component rendering
   */
  async verifyMDXRendered(): Promise<boolean> {
    // Check if content has been rendered (not just raw markdown)
    const hasHeading = await this.title.isVisible();
    const hasContent = await this.content.isVisible();
    return hasHeading && hasContent;
  }

  /**
   * Verify code highlighting is applied
   */
  async verifyCodeHighlighting(): Promise<boolean> {
    if ((await this.codeBlocks.count()) === 0) {
      return false;
    }

    // Check if syntax highlighting tokens are present
    const firstCodeBlock = this.codeBlocks.first();
    const tokens = firstCodeBlock.locator('.token, [class*="token-"]');
    return (await tokens.count()) > 0;
  }

  /**
   * Get all tags for the document
   */
  async getTags(): Promise<string[]> {
    const tagElements = await this.tags.all();
    return Promise.all(tagElements.map(tag => tag.textContent().then(t => t?.trim() || '')));
  }

  /**
   * Search for text within the document content
   */
  async hasContentText(text: string): Promise<boolean> {
    const content = await this.content.textContent();
    return content?.includes(text) || false;
  }

  /**
   * Get the document title text
   */
  async getTitleText(): Promise<string> {
    return (await this.title.textContent()) || '';
  }
}
