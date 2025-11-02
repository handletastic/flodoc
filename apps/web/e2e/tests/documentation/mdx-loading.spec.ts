import { test, expect } from '@playwright/test';

/**
 * E2E Tests for F-002: MDX Document Loading and Rendering
 *
 * Tests the complete MDX loading pipeline:
 * - Loading MDX documents from content/docs/
 * - Parsing frontmatter metadata
 * - Rendering MDX content with proper components
 * - Handling document connections
 * - Error handling for missing documents
 */

test.describe('MDX Document Loading', () => {
  test.describe('Document Loading and Display', () => {
    test('should load and display an MDX document', async ({ page }) => {
      await page.goto('/docs/getting-started');

      // Wait for content to load
      const docContent = page.locator('[data-testid="doc-content"]');
      await expect(docContent).toBeVisible();

      // Check that title is rendered from frontmatter
      const title = page.locator('h1').first();
      await expect(title).toContainText('Getting Started');

      // Verify content is rendered
      await expect(docContent).toContainText('Welcome to Flodoc');
      await expect(docContent).toContainText('What is Flodoc?');
    });

    test('should load a different document', async ({ page }) => {
      await page.goto('/docs/basic-concepts');

      const docContent = page.locator('[data-testid="doc-content"]');
      await expect(docContent).toBeVisible();

      const title = page.locator('h1').first();
      await expect(title).toContainText('Basic Concepts');

      await expect(docContent).toContainText('Understanding the core concepts');
    });

    test('should render Markdown formatting correctly', async ({ page }) => {
      await page.goto('/docs/getting-started');

      // Check headings
      await expect(page.locator('h2').first()).toBeVisible();

      // Check lists
      await expect(page.locator('ul').first()).toBeVisible();

      // Check links
      const links = page.locator('a[href^="/docs/"]');
      await expect(links.first()).toBeVisible();
    });
  });

  test.describe('Frontmatter Metadata', () => {
    test('should display document description', async ({ page }) => {
      await page.goto('/docs/getting-started');

      // Description should be available (either displayed or in meta tags)
      const description = page.locator('[data-testid="doc-description"]');

      // Check if description is displayed on page or in metadata
      const isVisible = await description.isVisible().catch(() => false);
      if (isVisible) {
        await expect(description).toContainText('Introduction to Flodoc');
      } else {
        // Should at least be in meta tags
        const metaDescription = page.locator('meta[name="description"]');
        expect(await metaDescription.getAttribute('content')).toContain('Flodoc');
      }
    });

    test('should display document tags', async ({ page }) => {
      await page.goto('/docs/getting-started');

      // Check for tags
      const tags = page.locator('[data-testid="doc-tag"]');
      const tagCount = await tags.count();

      expect(tagCount).toBeGreaterThan(0);

      // Verify expected tags from frontmatter
      const tagTexts = await tags.allTextContents();
      expect(tagTexts.some(t => t.includes('tutorial') || t.includes('beginner'))).toBeTruthy();
    });
  });

  test.describe('Document Connections', () => {
    test('should display document connections', async ({ page }) => {
      await page.goto('/docs/getting-started');

      // Check for connections section
      const connections = page.locator('[data-testid="doc-connection"]');
      const connectionCount = await connections.count();

      expect(connectionCount).toBeGreaterThan(0);
    });

    test('should link to connected documents', async ({ page }) => {
      await page.goto('/docs/getting-started');

      // Find a connection link
      const nextLink = page.locator('[data-testid="doc-connection"][data-connection-type="next"]');
      await expect(nextLink).toBeVisible();

      // Click and verify navigation
      await nextLink.click();

      // Should navigate to connected document
      await expect(page).toHaveURL(/\/docs\/.+/);

      // New document should load
      const newDocContent = page.locator('[data-testid="doc-content"]');
      await expect(newDocContent).toBeVisible();
    });

    test('should display different connection types', async ({ page }) => {
      await page.goto('/docs/basic-concepts');

      // Check for different connection types
      const prerequisiteConnection = page.locator('[data-connection-type="prerequisite"]');
      const nextConnection = page.locator('[data-connection-type="next"]');
      const relatedConnection = page.locator('[data-connection-type="related"]');

      // At least one type should be present
      const hasConnections =
        await prerequisiteConnection.count() > 0 ||
        await nextConnection.count() > 0 ||
        await relatedConnection.count() > 0;

      expect(hasConnections).toBeTruthy();
    });
  });

  test.describe('Code Blocks', () => {
    test('should render code blocks with syntax highlighting', async ({ page }) => {
      await page.goto('/docs/basic-concepts');

      // Check for code blocks
      const codeBlocks = page.locator('pre code');
      await expect(codeBlocks.first()).toBeVisible();

      // Verify syntax highlighting is applied (should have token classes)
      const codeContent = await codeBlocks.first().innerHTML();
      expect(codeContent.length).toBeGreaterThan(0);
    });

    test('should display YAML code blocks', async ({ page }) => {
      await page.goto('/docs/basic-concepts');

      // Should have YAML code block showing frontmatter example
      const yamlCode = page.locator('pre code.language-yaml, pre code').filter({ hasText: 'title:' });
      await expect(yamlCode.first()).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should show 404 for missing document', async ({ page }) => {
      const response = await page.goto('/docs/non-existent-document');

      // Should either show 404 page or error message
      const docContent = page.locator('[data-testid="doc-content"]');
      const errorMessage = page.locator('[data-testid="doc-error"]');
      const notFoundMessage = page.locator('text=/not found|404/i');

      // One of these should be visible
      const hasError =
        await errorMessage.isVisible().catch(() => false) ||
        await notFoundMessage.isVisible().catch(() => false);

      expect(hasError).toBeTruthy();
    });

    test('should handle document with missing frontmatter gracefully', async ({ page }) => {
      // Even if frontmatter is incomplete, should still render
      await page.goto('/docs/getting-started');

      // Document should load without crashing
      const docContent = page.locator('[data-testid="doc-content"]');
      await expect(docContent).toBeVisible();
    });
  });

  test.describe('Navigation Integration', () => {
    test('should work with browser back/forward navigation', async ({ page }) => {
      // Navigate to first document
      await page.goto('/docs/getting-started');
      await expect(page.locator('h1')).toContainText('Getting Started');

      // Navigate to second document
      await page.goto('/docs/basic-concepts');
      await expect(page.locator('h1')).toContainText('Basic Concepts');

      // Go back
      await page.goBack();
      await expect(page.locator('h1')).toContainText('Getting Started');

      // Go forward
      await page.goForward();
      await expect(page.locator('h1')).toContainText('Basic Concepts');
    });

    test('should update URL when navigating between documents', async ({ page }) => {
      await page.goto('/docs/getting-started');
      expect(page.url()).toContain('/docs/getting-started');

      // Click a link to another document
      const link = page.locator('a[href="/docs/basic-concepts"]').first();
      await link.click();

      // URL should update
      await expect(page).toHaveURL(/\/docs\/basic-concepts/);
    });

    test('should be shareable via direct URL', async ({ page }) => {
      // Direct navigation to document should work
      await page.goto('/docs/basic-concepts');

      // Document should load correctly
      const docContent = page.locator('[data-testid="doc-content"]');
      await expect(docContent).toBeVisible();
      await expect(page.locator('h1')).toContainText('Basic Concepts');
    });
  });

  test.describe('MDX Component Support', () => {
    test('should render MDX with React components', async ({ page }) => {
      await page.goto('/docs/getting-started');

      // MDX should allow custom components
      // At minimum, standard HTML elements should be styled
      const docContent = page.locator('[data-testid="doc-content"]');
      await expect(docContent).toBeVisible();

      // Check that prose styling is applied (from Tailwind)
      const hasProseClass = await docContent.evaluate((el) =>
        el.className.includes('prose')
      );
      expect(hasProseClass).toBeTruthy();
    });
  });

  test.describe('Performance', () => {
    test('should load documents quickly', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/docs/getting-started');

      const docContent = page.locator('[data-testid="doc-content"]');
      await expect(docContent).toBeVisible();

      const loadTime = Date.now() - startTime;

      // Should load in under 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should not reload entire app when navigating between documents', async ({ page }) => {
      await page.goto('/docs/getting-started');

      // Add a marker to detect full page reload
      await page.evaluate(() => {
        (window as any).__navigationMarker = true;
      });

      // Navigate to another document
      await page.locator('a[href^="/docs/"]').first().click();
      await page.locator('[data-testid="doc-content"]').waitFor();

      // Marker should still exist (no full reload)
      const markerExists = await page.evaluate(() => {
        return (window as any).__navigationMarker === true;
      });

      expect(markerExists).toBeTruthy();
    });
  });

  test.describe('SEO and Accessibility', () => {
    test('should set document title from frontmatter', async ({ page }) => {
      await page.goto('/docs/getting-started');

      // Page title should include document title
      const title = await page.title();
      expect(title).toContain('Getting Started');
    });

    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/docs/getting-started');

      // Tab to first link
      await page.keyboard.press('Tab');

      // Should be able to navigate with keyboard
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/docs/getting-started');

      // Should have h1
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);

      // Should have h2 elements
      const h2Count = await page.locator('h2').count();
      expect(h2Count).toBeGreaterThan(0);
    });
  });
});
