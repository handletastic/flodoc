import { test, expect } from '@playwright/test';

test.describe('Document Graph Visualization', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the flow/knowledge-graph route
    await page.goto('/flow/knowledge-graph');
  });

  test('should display the graph canvas', async ({ page }) => {
    // Check that the React Flow container is rendered
    const flowContainer = page.locator('[data-testid="flow-container"]');
    await expect(flowContainer).toBeVisible();

    // Check for React Flow viewport
    const viewport = page.locator('.react-flow__viewport');
    await expect(viewport).toBeVisible();
  });

  test('should render document nodes', async ({ page }) => {
    // Wait for nodes to be rendered
    await page.waitForSelector('.react-flow__node', { timeout: 5000 });

    // Check that at least one node is rendered
    const nodes = page.locator('.react-flow__node');
    const nodeCount = await nodes.count();
    expect(nodeCount).toBeGreaterThan(0);
  });

  test('should render edges between connected documents', async ({ page }) => {
    // Wait for edges to be rendered
    await page.waitForSelector('.react-flow__edge', { timeout: 5000 });

    // Check that at least one edge is rendered
    const edges = page.locator('.react-flow__edge');
    const edgeCount = await edges.count();
    expect(edgeCount).toBeGreaterThan(0);
  });

  test('should display view mode selector', async ({ page }) => {
    // Check for view mode controls
    const viewModeSelector = page.locator('[data-testid="view-mode-selector"]');
    await expect(viewModeSelector).toBeVisible();

    // Check for available view modes
    await expect(page.locator('[data-view-mode="knowledge-graph"]')).toBeVisible();
    await expect(page.locator('[data-view-mode="navigation-tree"]')).toBeVisible();
    await expect(page.locator('[data-view-mode="learning-path"]')).toBeVisible();
  });

  test('should switch between view modes', async ({ page }) => {
    // Wait for initial render
    await page.waitForSelector('.react-flow__node', { timeout: 5000 });

    // Click navigation tree view
    await page.locator('[data-view-mode="navigation-tree"]').click();

    // Check that layout changed (tree layout should be hierarchical)
    const flowContainer = page.locator('[data-testid="flow-container"]');
    await expect(flowContainer).toHaveAttribute('data-layout', 'tree');

    // Click learning path view
    await page.locator('[data-view-mode="learning-path"]').click();
    await expect(flowContainer).toHaveAttribute('data-layout', 'path');
  });

  test('should display graph controls', async ({ page }) => {
    // Check for zoom controls
    await expect(page.locator('[data-testid="zoom-in"]')).toBeVisible();
    await expect(page.locator('[data-testid="zoom-out"]')).toBeVisible();
    await expect(page.locator('[data-testid="fit-view"]')).toBeVisible();

    // Check for additional controls
    await expect(page.locator('[data-testid="toggle-minimap"]')).toBeVisible();
  });

  test('should zoom in and out', async ({ page }) => {
    await page.waitForSelector('.react-flow__node', { timeout: 5000 });

    // Get initial zoom level
    const viewport = page.locator('.react-flow__viewport');
    const initialTransform = await viewport.getAttribute('style');

    // Zoom in
    await page.locator('[data-testid="zoom-in"]').click();
    await page.waitForTimeout(300); // Wait for animation

    const zoomedTransform = await viewport.getAttribute('style');
    expect(zoomedTransform).not.toBe(initialTransform);

    // Zoom out
    await page.locator('[data-testid="zoom-out"]').click();
    await page.waitForTimeout(300);
  });

  test('should fit view to show all nodes', async ({ page }) => {
    await page.waitForSelector('.react-flow__node', { timeout: 5000 });

    // Click fit view button
    await page.locator('[data-testid="fit-view"]').click();
    await page.waitForTimeout(500);

    // All nodes should be visible in viewport
    const nodes = page.locator('.react-flow__node');
    const nodeCount = await nodes.count();

    // Check that multiple nodes are visible
    expect(nodeCount).toBeGreaterThan(0);
  });

  test('should display node labels with document titles', async ({ page }) => {
    await page.waitForSelector('.react-flow__node', { timeout: 5000 });

    // Check that nodes have labels
    const nodeLabels = page.locator('.react-flow__node-default');
    const firstLabel = nodeLabels.first();
    const labelText = await firstLabel.textContent();

    expect(labelText).toBeTruthy();
    expect(labelText?.trim().length).toBeGreaterThan(0);
  });

  test('should highlight node on hover', async ({ page }) => {
    await page.waitForSelector('.react-flow__node', { timeout: 5000 });

    const firstNode = page.locator('.react-flow__node').first();

    // Hover over node
    await firstNode.hover();

    // Check for highlighted state
    await expect(firstNode).toHaveClass(/selected|highlighted/);
  });

  test('should navigate to document when node is clicked', async ({ page }) => {
    await page.waitForSelector('.react-flow__node', { timeout: 5000 });

    // Get the first node
    const firstNode = page.locator('.react-flow__node').first();
    const nodeLabel = await firstNode.textContent();

    // Click the node
    await firstNode.click();

    // Should navigate to the document page or show document details
    await page.waitForTimeout(500);

    // Check if navigated to docs page or if a panel/modal opened
    const url = page.url();
    const hasDocsUrl = url.includes('/docs/');
    const hasPanel = await page.locator('[data-testid="document-panel"]').isVisible().catch(() => false);

    expect(hasDocsUrl || hasPanel).toBe(true);
  });

  test('should show connection types in different colors', async ({ page }) => {
    await page.waitForSelector('.react-flow__edge', { timeout: 5000 });

    // Check for different edge types (prerequisites, related, examples)
    const edges = page.locator('.react-flow__edge');
    const edgeCount = await edges.count();

    expect(edgeCount).toBeGreaterThan(0);

    // Check that edges have different stroke colors or classes
    const firstEdge = edges.first();
    const edgePath = firstEdge.locator('path').first();
    const stroke = await edgePath.getAttribute('stroke');

    expect(stroke).toBeTruthy();
  });

  test('should toggle minimap', async ({ page }) => {
    await page.waitForSelector('.react-flow__node', { timeout: 5000 });

    // Check if minimap is initially visible or hidden
    const minimapVisible = await page.locator('.react-flow__minimap').isVisible().catch(() => false);

    // Toggle minimap
    await page.locator('[data-testid="toggle-minimap"]').click();
    await page.waitForTimeout(300);

    // Check that visibility changed
    const minimapVisibleAfter = await page.locator('.react-flow__minimap').isVisible().catch(() => false);
    expect(minimapVisibleAfter).toBe(!minimapVisible);
  });

  test('should pan the canvas', async ({ page }) => {
    await page.waitForSelector('.react-flow__node', { timeout: 5000 });

    const viewport = page.locator('.react-flow__viewport');
    const initialTransform = await viewport.getAttribute('style');

    // Simulate pan by dragging on the canvas background
    const canvas = page.locator('.react-flow__pane');
    const box = await canvas.boundingBox();

    if (box) {
      await page.mouse.move(box.x + 100, box.y + 100);
      await page.mouse.down();
      await page.mouse.move(box.x + 200, box.y + 200);
      await page.mouse.up();

      await page.waitForTimeout(300);

      const newTransform = await viewport.getAttribute('style');
      expect(newTransform).not.toBe(initialTransform);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/flow/knowledge-graph');

    await page.waitForSelector('.react-flow__node', { timeout: 5000 });

    // Check that controls are accessible on mobile
    const controls = page.locator('[data-testid="graph-controls"]');
    await expect(controls).toBeVisible();

    // Check that nodes are rendered and visible
    const nodes = page.locator('.react-flow__node');
    expect(await nodes.count()).toBeGreaterThan(0);
  });

  test('should load graph data from documents', async ({ page }) => {
    await page.waitForSelector('.react-flow__node', { timeout: 5000 });

    // Check that nodes represent actual documents
    const nodes = page.locator('.react-flow__node');
    const nodeCount = await nodes.count();

    // Should have nodes for the documents in the system
    expect(nodeCount).toBeGreaterThan(2); // At least a few documents
  });

  test('should show loading state while fetching data', async ({ page }) => {
    // Navigate and check for loading indicator
    const navigationPromise = page.goto('/flow/knowledge-graph');

    // Check for loading state
    const loadingIndicator = page.locator('[data-testid="graph-loading"]');
    const isLoading = await loadingIndicator.isVisible().catch(() => false);

    await navigationPromise;

    // Loading should complete
    await expect(loadingIndicator).not.toBeVisible({ timeout: 5000 });
  });

  test('should display legend for connection types', async ({ page }) => {
    await page.waitForSelector('.react-flow__node', { timeout: 5000 });

    // Check for legend
    const legend = page.locator('[data-testid="graph-legend"]');
    await expect(legend).toBeVisible();

    // Check for different connection types in legend
    await expect(page.locator('[data-legend-item="prerequisite"]')).toBeVisible();
    await expect(page.locator('[data-legend-item="related"]')).toBeVisible();
    await expect(page.locator('[data-legend-item="example"]')).toBeVisible();
  });
});
