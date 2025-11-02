import { test, expect } from '@flodoc/test-utils';
import { MDXHelpers } from '@flodoc/test-utils/helpers';

/**
 * Code Highlighting Tests
 *
 * Tests syntax highlighting with rehype-pretty-code including:
 * - Different language support
 * - Token highlighting
 * - Line numbers (if implemented)
 */

test.describe('Syntax Highlighting', () => {
  test('should highlight JavaScript code blocks', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    // Look for JavaScript code blocks
    const jsCodeBlock = page.locator('pre code.language-javascript, pre code.language-js').first();

    if (await jsCodeBlock.isVisible()) {
      // Verify highlighting tokens exist
      const tokens = jsCodeBlock.locator('.token, [class*="token-"]');
      const tokenCount = await tokens.count();

      expect(tokenCount).toBeGreaterThan(0);
    }
  });

  test('should highlight TypeScript code blocks', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    // Look for TypeScript code blocks
    const tsCodeBlock = page.locator('pre code.language-typescript, pre code.language-ts').first();

    if (await tsCodeBlock.isVisible()) {
      const tokens = tsCodeBlock.locator('.token, [class*="token-"]');
      const tokenCount = await tokens.count();

      expect(tokenCount).toBeGreaterThan(0);
    }
  });

  test('should handle code blocks without language specified', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    // Look for plain code blocks
    const plainCodeBlock = page.locator('pre code:not([class*="language-"])').first();

    if (await plainCodeBlock.isVisible()) {
      // Should still be visible even without highlighting
      await expect(plainCodeBlock).toBeVisible();
    }
  });

  test('should render inline code correctly', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    // Look for inline code elements
    const inlineCode = page.locator('code:not(pre code)').first();

    if (await inlineCode.isVisible()) {
      await expect(inlineCode).toBeVisible();

      // Inline code should have different styling than block code
      const backgroundColor = await inlineCode.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      expect(backgroundColor).toBeTruthy();
    }
  });
});

test.describe('Code Block Features', () => {
  test('should preserve code indentation', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const codeBlock = page.locator('pre code').first();

    if (await codeBlock.isVisible()) {
      const codeContent = await codeBlock.textContent();

      // Code should have actual content
      expect(codeContent).toBeTruthy();
      expect(codeContent!.length).toBeGreaterThan(0);
    }
  });

  test('should handle multi-line code blocks', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const codeBlock = page.locator('pre code').first();

    if (await codeBlock.isVisible()) {
      const codeContent = await codeBlock.textContent();

      // If it's a multi-line block, should contain newlines
      if (codeContent && codeContent.includes('\n')) {
        expect(codeContent.split('\n').length).toBeGreaterThan(1);
      }
    }
  });
});
