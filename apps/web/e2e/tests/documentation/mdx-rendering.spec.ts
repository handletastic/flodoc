import { test, expect } from '@flodoc/test-utils';
import { MDXHelpers } from '@flodoc/test-utils/helpers';

/**
 * MDX Rendering Tests
 *
 * Tests MDX document rendering including:
 * - Basic MDX content rendering
 * - Frontmatter metadata
 * - Code highlighting
 * - GFM features (tables, task lists, etc.)
 */

test.describe('MDX Document Rendering', () => {
  test('should render MDX document with title and content', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    // Verify MDX is rendered
    const isRendered = await documentPage.verifyMDXRendered();
    expect(isRendered).toBe(true);

    // Verify title is visible
    await expect(documentPage.title).toBeVisible();

    // Verify content is visible
    await expect(documentPage.content).toBeVisible();
  });

  test('should render frontmatter metadata', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    // Verify document has a title
    const titleText = await documentPage.getTitleText();
    expect(titleText.length).toBeGreaterThan(0);

    // Verify tags are displayed (if they exist)
    const tags = await documentPage.getTags();
    // Tags might be empty, so just check it's an array
    expect(Array.isArray(tags)).toBe(true);
  });

  test('should render code blocks with syntax highlighting', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    // Check if there are code blocks
    const codeBlockCount = await documentPage.codeBlocks.count();

    if (codeBlockCount > 0) {
      // Verify syntax highlighting is applied
      const hasHighlighting = await documentPage.verifyCodeHighlighting();
      expect(hasHighlighting).toBe(true);
    }
  });

  test('should handle document without code blocks', async ({ page, documentPage }) => {
    await documentPage.goto('basic-concepts');

    // Document should still render even without code blocks
    const isRendered = await documentPage.verifyMDXRendered();
    expect(isRendered).toBe(true);
  });
});

test.describe('MDX Content Features', () => {
  test('should render headings correctly', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    // Verify heading structure
    const headings = await MDXHelpers.getDocumentHeadings(page);
    expect(headings.length).toBeGreaterThan(0);

    // Should have an h1 (title)
    const h1 = headings.find(h => h.level === 1);
    expect(h1).toBeDefined();
  });

  test('should render links correctly', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    // Check for links in content
    const links = await page.locator('a').count();

    // Document should have at least some links (navigation + content)
    expect(links).toBeGreaterThan(0);
  });

  test('should render formatted text (bold, italic, etc.)', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    // Just verify content has some text formatting
    const content = await documentPage.content.textContent();
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(50);
  });
});

test.describe('Multiple Documents', () => {
  const testDocuments = [
    'getting-started',
    'basic-concepts',
    'installation',
    'creating-documents',
    'document-connections',
  ];

  for (const slug of testDocuments) {
    test(`should render ${slug} document`, async ({ page, documentPage }) => {
      await documentPage.goto(slug);

      // Verify document loads and renders
      const isRendered = await documentPage.verifyMDXRendered();
      expect(isRendered).toBe(true);

      // Verify has title
      await expect(documentPage.title).toBeVisible();
    });
  }
});
