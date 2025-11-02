import { Page, expect } from '@playwright/test';

/**
 * MDX Test Helpers
 *
 * Utilities for testing MDX content rendering, frontmatter, and features.
 */
export class MDXHelpers {
  /**
   * Verify frontmatter metadata is properly rendered
   */
  static async verifyFrontmatter(
    page: Page,
    expectedMeta: {
      title?: string;
      description?: string;
      tags?: string[];
    }
  ) {
    if (expectedMeta.title) {
      const heading = page.locator('h1').first();
      await expect(heading).toContainText(expectedMeta.title);
    }

    if (expectedMeta.description) {
      const description = page.locator('[data-testid="doc-description"]');
      if (await description.isVisible()) {
        await expect(description).toContainText(expectedMeta.description);
      }
    }

    if (expectedMeta.tags) {
      for (const tag of expectedMeta.tags) {
        const tagElement = page.locator(`[data-tag="${tag}"], [data-testid="doc-tag"]:has-text("${tag}")`);
        await expect(tagElement).toBeVisible();
      }
    }
  }

  /**
   * Verify code block syntax highlighting
   */
  static async verifyCodeBlock(page: Page, language: string) {
    const codeBlock = page.locator(`pre code.language-${language}, pre code[class*="${language}"]`).first();
    await expect(codeBlock).toBeVisible();

    // Verify syntax highlighting from rehype-pretty-code
    // Check for token elements that indicate highlighting is applied
    const tokens = codeBlock.locator('.token, [class*="token-"]');
    const tokenCount = await tokens.count();

    expect(tokenCount).toBeGreaterThan(0);
  }

  /**
   * Test document connections rendering
   */
  static async testDocumentConnections(
    page: Page,
    expectedConnections: Array<{
      type: 'prerequisite' | 'next' | 'related' | 'seealso';
      target: string;
    }>
  ) {
    for (const conn of expectedConnections) {
      // Look for connection with specific type and target
      const link = page.locator(
        `[data-connection-type="${conn.type}"] a[href="/docs/${conn.target}"], ` +
        `[data-connection-type="${conn.type}"] a[href*="${conn.target}"]`
      ).first();

      await expect(link).toBeVisible();
    }
  }

  /**
   * Verify GitHub Flavored Markdown features
   */
  static async verifyGFMFeatures(page: Page) {
    // Check for tables
    const tables = page.locator('table');
    if ((await tables.count()) > 0) {
      await expect(tables.first()).toBeVisible();
    }

    // Check for task lists
    const taskLists = page.locator('input[type="checkbox"]');
    if ((await taskLists.count()) > 0) {
      await expect(taskLists.first()).toBeVisible();
    }

    // Check for strikethrough
    const strikethrough = page.locator('del, s');
    if ((await strikethrough.count()) > 0) {
      await expect(strikethrough.first()).toBeVisible();
    }
  }

  /**
   * Verify MDX component rendering (custom React components)
   */
  static async verifyMDXComponent(page: Page, componentName: string) {
    const component = page.locator(`[data-component="${componentName}"], .mdx-${componentName}`);
    await expect(component).toBeVisible();
  }

  /**
   * Get all headings from the document
   */
  static async getDocumentHeadings(page: Page): Promise<Array<{ level: number; text: string }>> {
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();

    return Promise.all(
      headings.map(async (heading) => {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        const text = (await heading.textContent()) || '';
        const level = parseInt(tagName.replace('h', ''));

        return { level, text: text.trim() };
      })
    );
  }

  /**
   * Verify document table of contents (if implemented)
   */
  static async verifyTableOfContents(page: Page, expectedHeadings: string[]) {
    const toc = page.locator('[data-testid="table-of-contents"], .toc');

    if (await toc.isVisible()) {
      for (const heading of expectedHeadings) {
        const tocLink = toc.locator(`a:has-text("${heading}")`);
        await expect(tocLink).toBeVisible();
      }
    }
  }

  /**
   * Click on a heading anchor link
   */
  static async clickHeadingAnchor(page: Page, headingText: string) {
    const heading = page.locator('h1, h2, h3, h4, h5, h6').filter({ hasText: headingText });
    const anchor = heading.locator('a').first();

    await anchor.click();
    await page.waitForLoadState('networkidle');
  }

  /**
   * Verify code block has copy button
   */
  static async verifyCodeCopyButton(page: Page) {
    const codeBlock = page.locator('pre').first();
    const copyButton = codeBlock.locator('button[title*="copy"], button[aria-label*="copy"]');

    if (await copyButton.isVisible()) {
      await expect(copyButton).toBeVisible();
      return true;
    }

    return false;
  }
}
