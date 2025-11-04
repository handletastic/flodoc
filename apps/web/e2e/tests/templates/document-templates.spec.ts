import { test, expect } from '@playwright/test';

/**
 * Document Templates Tests (F-014)
 *
 * Tests the template system that provides pre-built document structures
 * for common documentation patterns (guides, tutorials, API references, etc.)
 *
 * Test Coverage:
 * - Template listing page
 * - Template preview
 * - Template selection
 * - Template customization form
 * - Template download/copy
 * - Template content structure
 *
 * TDD: Write tests first, then implement the feature
 */

test.describe('Document Templates - Template Listing', () => {
  test('should display templates page', async ({ page }) => {
    await page.goto('/templates');

    // Page should have a header
    const heading = page.getByRole('heading', { name: /templates/i, level: 1 });
    await expect(heading).toBeVisible();

    // Should have a description or intro text
    const description = page.getByTestId('templates-description');
    await expect(description).toBeVisible();
  });

  test('should list all available templates', async ({ page }) => {
    await page.goto('/templates');

    // Should show template cards
    const templateCards = page.locator('[data-testid="template-card"]');
    await expect(templateCards).toHaveCount(5); // We expect 5 templates

    // Each template card should have essential info
    const firstCard = templateCards.first();
    await expect(firstCard.locator('[data-testid="template-title"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="template-description"]')).toBeVisible();
  });

  test('should display template types correctly', async ({ page }) => {
    await page.goto('/templates');

    // Check for specific template types
    const expectedTemplates = [
      'Guide Template',
      'Tutorial Template',
      'API Reference Template',
      'Changelog Template',
      'FAQ Template',
    ];

    for (const templateName of expectedTemplates) {
      const template = page.locator('[data-testid="template-card"]', {
        has: page.locator(`[data-testid="template-title"]:has-text("${templateName}")`),
      });
      await expect(template).toBeVisible();
    }
  });

  test('should show template preview button', async ({ page }) => {
    await page.goto('/templates');

    const templateCards = page.locator('[data-testid="template-card"]');
    const firstCard = templateCards.first();

    const previewButton = firstCard.locator('[data-testid="template-preview-btn"]');
    await expect(previewButton).toBeVisible();
    await expect(previewButton).toBeEnabled();
  });

  test('should show template use button', async ({ page }) => {
    await page.goto('/templates');

    const templateCards = page.locator('[data-testid="template-card"]');
    const firstCard = templateCards.first();

    const useButton = firstCard.locator('[data-testid="template-use-btn"]');
    await expect(useButton).toBeVisible();
    await expect(useButton).toBeEnabled();
  });
});

test.describe('Document Templates - Template Preview', () => {
  test('should open preview modal when preview button is clicked', async ({ page }) => {
    await page.goto('/templates');

    // Click preview button on first template
    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-preview-btn"]').click();

    // Preview modal should be visible
    const previewModal = page.getByTestId('template-preview-modal');
    await expect(previewModal).toBeVisible();
  });

  test('should display template content in preview', async ({ page }) => {
    await page.goto('/templates');

    // Open preview
    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-preview-btn"]').click();

    // Preview should show template content
    const previewContent = page.getByTestId('template-preview-content');
    await expect(previewContent).toBeVisible();
    await expect(previewContent).not.toBeEmpty();
  });

  test('should show template metadata in preview', async ({ page }) => {
    await page.goto('/templates');

    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-preview-btn"]').click();

    // Should show frontmatter metadata
    const metadata = page.getByTestId('template-preview-metadata');
    await expect(metadata).toBeVisible();
  });

  test('should close preview modal', async ({ page }) => {
    await page.goto('/templates');

    // Open preview
    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-preview-btn"]').click();

    const previewModal = page.getByTestId('template-preview-modal');
    await expect(previewModal).toBeVisible();

    // Close modal
    const closeButton = page.getByTestId('template-preview-close');
    await closeButton.click();

    await expect(previewModal).not.toBeVisible();
  });

  test('should allow copying template from preview', async ({ page }) => {
    await page.goto('/templates');

    // Open preview
    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-preview-btn"]').click();

    // Should have a copy button in preview
    const copyButton = page.getByTestId('template-copy-btn');
    await expect(copyButton).toBeVisible();
    await expect(copyButton).toBeEnabled();
  });
});

test.describe('Document Templates - Template Customization', () => {
  test('should open customization form when use button is clicked', async ({ page }) => {
    await page.goto('/templates');

    // Click use button on first template
    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-use-btn"]').click();

    // Customization modal/form should be visible
    const customizationForm = page.getByTestId('template-customization-form');
    await expect(customizationForm).toBeVisible();
  });

  test('should have form fields for customization', async ({ page }) => {
    await page.goto('/templates');

    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-use-btn"]').click();

    // Should have title input
    const titleInput = page.getByTestId('template-form-title');
    await expect(titleInput).toBeVisible();

    // Should have description input
    const descriptionInput = page.getByTestId('template-form-description');
    await expect(descriptionInput).toBeVisible();

    // Should have slug input
    const slugInput = page.getByTestId('template-form-slug');
    await expect(slugInput).toBeVisible();
  });

  test('should auto-generate slug from title', async ({ page }) => {
    await page.goto('/templates');

    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-use-btn"]').click();

    // Type in title
    const titleInput = page.getByTestId('template-form-title');
    await titleInput.fill('My New Document');

    // Slug should auto-generate
    const slugInput = page.getByTestId('template-form-slug');
    await expect(slugInput).toHaveValue('my-new-document');
  });

  test('should allow adding tags', async ({ page }) => {
    await page.goto('/templates');

    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-use-btn"]').click();

    // Should have tags input
    const tagsInput = page.getByTestId('template-form-tags');
    await expect(tagsInput).toBeVisible();

    // Add tags
    await tagsInput.fill('tutorial, guide, beginner');
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/templates');

    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-use-btn"]').click();

    // Try to submit without filling required fields
    const submitButton = page.getByTestId('template-form-submit');
    await submitButton.click();

    // Should show validation errors
    const errors = page.locator('[data-testid="form-error"]');
    await expect(errors.first()).toBeVisible();
  });

  test('should close customization form', async ({ page }) => {
    await page.goto('/templates');

    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-use-btn"]').click();

    const customizationForm = page.getByTestId('template-customization-form');
    await expect(customizationForm).toBeVisible();

    // Close form
    const closeButton = page.getByTestId('template-form-cancel');
    await closeButton.click();

    await expect(customizationForm).not.toBeVisible();
  });
});

test.describe('Document Templates - Copy to Clipboard', () => {
  test('should copy template to clipboard with customizations', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('/templates');

    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-use-btn"]').click();

    // Fill in customization form
    await page.getByTestId('template-form-title').fill('My Guide');
    await page.getByTestId('template-form-description').fill('A helpful guide');
    await page.getByTestId('template-form-tags').fill('guide, tutorial');

    // Click copy button
    const copyButton = page.getByTestId('template-form-copy');
    await copyButton.click();

    // Should show success message
    const successMessage = page.getByTestId('copy-success-message');
    await expect(successMessage).toBeVisible();

    // Verify clipboard content
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardContent).toContain('My Guide');
    expect(clipboardContent).toContain('A helpful guide');
    expect(clipboardContent).toContain('guide');
    expect(clipboardContent).toContain('tutorial');
  });

  test('should copy raw template without customization', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('/templates');

    // Click preview on first template
    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-preview-btn"]').click();

    // Copy from preview (raw template)
    const copyButton = page.getByTestId('template-copy-btn');
    await copyButton.click();

    // Should show success message
    const successMessage = page.getByTestId('copy-success-message');
    await expect(successMessage).toBeVisible();

    // Clipboard should have content
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardContent.length).toBeGreaterThan(0);
    expect(clipboardContent).toContain('---'); // Should have frontmatter
  });
});

test.describe('Document Templates - Download', () => {
  test('should download template with customizations', async ({ page }) => {
    await page.goto('/templates');

    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-use-btn"]').click();

    // Fill in customization form
    await page.getByTestId('template-form-title').fill('My Guide');
    await page.getByTestId('template-form-description').fill('A helpful guide');
    await page.getByTestId('template-form-slug').fill('my-guide');

    // Start waiting for download before clicking
    const downloadPromise = page.waitForEvent('download');

    // Click download button
    const downloadButton = page.getByTestId('template-form-download');
    await downloadButton.click();

    // Wait for download
    const download = await downloadPromise;

    // Verify download filename
    expect(download.suggestedFilename()).toMatch(/my-guide\.mdx/);
  });

  test('should download raw template from preview', async ({ page }) => {
    await page.goto('/templates');

    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-preview-btn"]').click();

    // Start waiting for download
    const downloadPromise = page.waitForEvent('download');

    // Click download button in preview
    const downloadButton = page.getByTestId('template-download-btn');
    await downloadButton.click();

    // Wait for download
    const download = await downloadPromise;

    // Verify download occurred
    expect(download.suggestedFilename()).toMatch(/\.mdx$/);
  });
});

test.describe('Document Templates - Template Content Structure', () => {
  test('should have proper frontmatter in Guide template', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('/templates');

    // Find Guide template
    const guideCard = page.locator('[data-testid="template-card"]', {
      has: page.locator('[data-testid="template-title"]:has-text("Guide Template")'),
    });
    await guideCard.locator('[data-testid="template-preview-btn"]').click();

    // Copy template
    await page.getByTestId('template-copy-btn').click();

    // Check content structure
    const content = await page.evaluate(() => navigator.clipboard.readText());

    // Should have frontmatter with required fields
    expect(content).toContain('---');
    expect(content).toContain('title:');
    expect(content).toContain('description:');
    expect(content).toContain('slug:');
    expect(content).toContain('tags:');
  });

  test('should have placeholder content with instructions', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('/templates');

    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-preview-btn"]').click();

    await page.getByTestId('template-copy-btn').click();

    const content = await page.evaluate(() => navigator.clipboard.readText());

    // Should have helpful comments/instructions
    expect(content).toContain('#'); // Should have markdown headings
  });

  test('should have different structures for different template types', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('/templates');

    const templates = [
      'Guide Template',
      'Tutorial Template',
      'API Reference Template',
    ];

    const contents: string[] = [];

    for (const templateName of templates) {
      const card = page.locator('[data-testid="template-card"]', {
        has: page.locator(`[data-testid="template-title"]:has-text("${templateName}")`),
      });
      await card.locator('[data-testid="template-preview-btn"]').click();

      await page.getByTestId('template-copy-btn').click();

      const content = await page.evaluate(() => navigator.clipboard.readText());
      contents.push(content);

      // Close preview
      await page.getByTestId('template-preview-close').click();
      await page.waitForTimeout(200);
    }

    // Each template should be unique
    expect(contents[0]).not.toEqual(contents[1]);
    expect(contents[1]).not.toEqual(contents[2]);
    expect(contents[0]).not.toEqual(contents[2]);
  });
});

test.describe('Document Templates - Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/templates');

    // Tab through template cards
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to activate with Enter
    await page.keyboard.press('Enter');

    // A modal should have opened
    const modal = page.locator('[data-testid="template-preview-modal"], [data-testid="template-customization-form"]');
    await expect(modal.first()).toBeVisible();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/templates');

    const templateCards = page.locator('[data-testid="template-card"]');
    const firstCard = templateCards.first();

    // Buttons should have accessible names
    const previewBtn = firstCard.locator('[data-testid="template-preview-btn"]');
    const useBtn = firstCard.locator('[data-testid="template-use-btn"]');

    await expect(previewBtn).toHaveAccessibleName();
    await expect(useBtn).toHaveAccessibleName();
  });

  test('should trap focus in modal', async ({ page }) => {
    await page.goto('/templates');

    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-use-btn"]').click();

    // Get all focusable elements in modal
    const modal = page.getByTestId('template-customization-form');

    // Tab through should stay in modal
    await page.keyboard.press('Tab');
    const firstFocus = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));

    // Keep tabbing
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
    }

    // Should still be within modal
    const activeElement = await page.evaluate(() => {
      const el = document.activeElement;
      return el?.closest('[data-testid="template-customization-form"]') !== null;
    });

    expect(activeElement).toBe(true);
  });
});

test.describe('Document Templates - Visual Appearance', () => {
  test('should display templates page correctly', async ({ page }) => {
    await page.goto('/templates');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('templates-page.png', {
      fullPage: true,
    });
  });

  test('should display preview modal correctly', async ({ page }) => {
    await page.goto('/templates');

    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-preview-btn"]').click();

    await page.waitForTimeout(300); // Wait for animation

    await expect(page).toHaveScreenshot('template-preview-modal.png');
  });

  test('should display customization form correctly', async ({ page }) => {
    await page.goto('/templates');

    const firstCard = page.locator('[data-testid="template-card"]').first();
    await firstCard.locator('[data-testid="template-use-btn"]').click();

    await page.waitForTimeout(300); // Wait for animation

    await expect(page).toHaveScreenshot('template-customization-form.png');
  });
});
