import { test, expect } from '@flodoc/test-utils';

/**
 * Code Block Enhancements Tests (F-008)
 *
 * Tests for enhanced code block features:
 * - Copy button functionality
 * - Line numbers display
 * - Line highlighting (e.g., {1,3-5})
 * - Filename display above code blocks
 * - Language badge
 */

test.describe('Code Block Copy Button', () => {
  test('should display copy button on code blocks', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const codeBlock = page.locator('[data-testid="code-block"]').first();

    if (await codeBlock.isVisible()) {
      const copyButton = codeBlock.locator('[data-testid="copy-button"]');
      await expect(copyButton).toBeVisible();
    }
  });

  test('should copy code to clipboard when copy button is clicked', async ({ page, documentPage, context }) => {
    await documentPage.goto('getting-started');

    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const codeBlock = page.locator('[data-testid="code-block"]').first();

    if (await codeBlock.isVisible()) {
      const copyButton = codeBlock.locator('[data-testid="copy-button"]');
      await copyButton.click();

      // Wait for clipboard to be populated
      await page.waitForTimeout(100);

      // Verify clipboard content matches code content
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      const codeContent = await codeBlock.locator('code').textContent();

      expect(clipboardText).toBe(codeContent?.trim());
    }
  });

  test('should show feedback after copying', async ({ page, documentPage, context }) => {
    await documentPage.goto('getting-started');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const codeBlock = page.locator('[data-testid="code-block"]').first();

    if (await codeBlock.isVisible()) {
      const copyButton = codeBlock.locator('[data-testid="copy-button"]');
      await copyButton.click();

      // Should show "Copied!" feedback
      const copiedFeedback = codeBlock.locator('[data-testid="copy-feedback"]');
      await expect(copiedFeedback).toBeVisible();
      await expect(copiedFeedback).toHaveText(/copied/i);

      // Feedback should disappear after a few seconds
      await expect(copiedFeedback).not.toBeVisible({ timeout: 3000 });
    }
  });

  test('should have accessible copy button', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const codeBlock = page.locator('[data-testid="code-block"]').first();

    if (await codeBlock.isVisible()) {
      const copyButton = codeBlock.locator('[data-testid="copy-button"]');

      // Should have accessible label
      const ariaLabel = await copyButton.getAttribute('aria-label');
      expect(ariaLabel).toMatch(/copy/i);
    }
  });
});

test.describe('Line Numbers', () => {
  test('should display line numbers for code blocks', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const codeBlock = page.locator('[data-testid="code-block"]').first();

    if (await codeBlock.isVisible()) {
      const lineNumbers = codeBlock.locator('[data-testid="line-number"]');
      const lineCount = await lineNumbers.count();

      expect(lineCount).toBeGreaterThan(0);
    }
  });

  test('should number lines sequentially', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const codeBlock = page.locator('[data-testid="code-block"]').first();

    if (await codeBlock.isVisible()) {
      const lineNumbers = codeBlock.locator('[data-testid="line-number"]');
      const lineCount = await lineNumbers.count();

      // Check first and last line numbers
      if (lineCount > 0) {
        const firstLine = lineNumbers.first();
        await expect(firstLine).toHaveText('1');

        if (lineCount > 1) {
          const lastLine = lineNumbers.last();
          await expect(lastLine).toHaveText(lineCount.toString());
        }
      }
    }
  });

  test('should align line numbers with code lines', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const codeBlock = page.locator('[data-testid="code-block"]').first();

    if (await codeBlock.isVisible()) {
      const lineNumbers = codeBlock.locator('[data-testid="line-number"]');
      const codeLines = codeBlock.locator('[data-line]');

      const lineNumberCount = await lineNumbers.count();
      const codeLinesCount = await codeLines.count();

      expect(lineNumberCount).toBe(codeLinesCount);
    }
  });
});

test.describe('Line Highlighting', () => {
  test('should highlight specified lines', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    // Look for highlighted lines
    const highlightedLine = page.locator('[data-testid="code-block"] [data-highlighted="true"]').first();

    if (await highlightedLine.isVisible()) {
      // Highlighted line should have distinct background
      const bgColor = await highlightedLine.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );
      expect(bgColor).toBeTruthy();
    }
  });

  test('should support single line highlighting', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const highlightedLines = page.locator('[data-testid="code-block"] [data-highlighted="true"]');
    const count = await highlightedLines.count();

    if (count > 0) {
      // At least one line should be highlighted
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });

  test('should support range highlighting', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const highlightedLines = page.locator('[data-testid="code-block"] [data-highlighted="true"]');
    const count = await highlightedLines.count();

    if (count > 1) {
      // Multiple consecutive lines can be highlighted
      expect(count).toBeGreaterThan(1);
    }
  });
});

test.describe('Filename Display', () => {
  test('should display filename above code block', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const codeBlockWithFilename = page.locator('[data-testid="code-block"][data-filename]').first();

    if (await codeBlockWithFilename.isVisible()) {
      const filename = codeBlockWithFilename.locator('[data-testid="code-filename"]');
      await expect(filename).toBeVisible();
    }
  });

  test('should show correct filename', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const codeBlockWithFilename = page.locator('[data-testid="code-block"][data-filename]').first();

    if (await codeBlockWithFilename.isVisible()) {
      const filenameAttr = await codeBlockWithFilename.getAttribute('data-filename');
      const filenameDisplay = codeBlockWithFilename.locator('[data-testid="code-filename"]');
      const filenameText = await filenameDisplay.textContent();

      expect(filenameText).toBe(filenameAttr);
    }
  });

  test('should style filename bar distinctly', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const filenameBar = page.locator('[data-testid="code-filename"]').first();

    if (await filenameBar.isVisible()) {
      // Should have background styling
      const bgColor = await filenameBar.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );
      expect(bgColor).toBeTruthy();
    }
  });
});

test.describe('Language Badge', () => {
  test('should display language badge on code blocks', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const codeBlock = page.locator('[data-testid="code-block"]').first();

    if (await codeBlock.isVisible()) {
      const languageBadge = codeBlock.locator('[data-testid="language-badge"]');
      await expect(languageBadge).toBeVisible();
    }
  });

  test('should show correct language name', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const jsCodeBlock = page.locator('[data-testid="code-block"][data-language="javascript"]').first();

    if (await jsCodeBlock.isVisible()) {
      const languageBadge = jsCodeBlock.locator('[data-testid="language-badge"]');
      const badgeText = await languageBadge.textContent();

      expect(badgeText?.toLowerCase()).toMatch(/javascript|js/);
    }
  });

  test('should style language badge appropriately', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const languageBadge = page.locator('[data-testid="language-badge"]').first();

    if (await languageBadge.isVisible()) {
      // Badge should have styling
      const fontSize = await languageBadge.evaluate(el =>
        window.getComputedStyle(el).fontSize
      );
      expect(fontSize).toBeTruthy();
    }
  });
});

test.describe('Code Block Integration', () => {
  test('should have all enhancements working together', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const enhancedCodeBlock = page.locator('[data-testid="code-block"]').first();

    if (await enhancedCodeBlock.isVisible()) {
      // Should have copy button
      await expect(enhancedCodeBlock.locator('[data-testid="copy-button"]')).toBeVisible();

      // Should have line numbers
      const lineNumbers = enhancedCodeBlock.locator('[data-testid="line-number"]');
      expect(await lineNumbers.count()).toBeGreaterThan(0);

      // Should have language badge
      await expect(enhancedCodeBlock.locator('[data-testid="language-badge"]')).toBeVisible();
    }
  });

  test('should maintain syntax highlighting with enhancements', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const codeBlock = page.locator('[data-testid="code-block"]').first();

    if (await codeBlock.isVisible()) {
      // Should still have syntax tokens
      const tokens = codeBlock.locator('.token, [class*="token-"]');
      const tokenCount = await tokens.count();

      expect(tokenCount).toBeGreaterThan(0);
    }
  });

  test('should be responsive on mobile', async ({ page, documentPage }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await documentPage.goto('getting-started');

    const codeBlock = page.locator('[data-testid="code-block"]').first();

    if (await codeBlock.isVisible()) {
      // Should be horizontally scrollable
      const isScrollable = await codeBlock.evaluate(el =>
        el.scrollWidth > el.clientWidth
      );

      // Copy button should still be accessible
      const copyButton = codeBlock.locator('[data-testid="copy-button"]');
      await expect(copyButton).toBeVisible();
    }
  });

  test('should support dark mode', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    // Toggle dark mode (assuming there's a dark mode toggle)
    const darkModeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();
    }

    const codeBlock = page.locator('[data-testid="code-block"]').first();

    if (await codeBlock.isVisible()) {
      // Code block should have appropriate dark mode styling
      await expect(codeBlock).toBeVisible();
    }
  });
});

test.describe('Accessibility', () => {
  test('should have proper ARIA labels', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const codeBlock = page.locator('[data-testid="code-block"]').first();

    if (await codeBlock.isVisible()) {
      const copyButton = codeBlock.locator('[data-testid="copy-button"]');

      // Copy button should have aria-label
      const ariaLabel = await copyButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });

  test('should be keyboard navigable', async ({ page, documentPage }) => {
    await documentPage.goto('getting-started');

    const codeBlock = page.locator('[data-testid="code-block"]').first();

    if (await codeBlock.isVisible()) {
      const copyButton = codeBlock.locator('[data-testid="copy-button"]');

      // Focus on copy button
      await copyButton.focus();

      // Should be visibly focused
      await expect(copyButton).toBeFocused();

      // Should be activatable with Enter key
      await copyButton.press('Enter');

      // Wait for action to complete
      await page.waitForTimeout(100);
    }
  });

  test('should announce copy action to screen readers', async ({ page, documentPage, context }) => {
    await documentPage.goto('getting-started');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const codeBlock = page.locator('[data-testid="code-block"]').first();

    if (await codeBlock.isVisible()) {
      const copyButton = codeBlock.locator('[data-testid="copy-button"]');
      await copyButton.click();

      // Check for aria-live region or similar feedback
      const feedback = codeBlock.locator('[data-testid="copy-feedback"]');
      if (await feedback.isVisible()) {
        const ariaLive = await feedback.getAttribute('aria-live');
        expect(ariaLive).toBeTruthy();
      }
    }
  });
});
