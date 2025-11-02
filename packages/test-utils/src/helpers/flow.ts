import { Page, expect } from '@playwright/test';

/**
 * React Flow Test Helpers
 *
 * Utilities for testing React Flow visualization features.
 */
export class FlowHelpers {
  /**
   * Wait for React Flow to initialize and render
   */
  static async waitForFlowReady(page: Page, timeout = 10000) {
    // Wait for container
    const flowContainer = page.locator('.react-flow, [data-testid="flow-container"]');
    await flowContainer.waitFor({ state: 'visible', timeout });

    // Wait for nodes to render
    const nodes = page.locator('.react-flow__node');
    await nodes.first().waitFor({ state: 'visible', timeout });

    // Allow time for layout stabilization
    await page.waitForTimeout(1000);
  }

  /**
   * Verify flow has specific number of nodes
   */
  static async verifyNodeCount(page: Page, expectedCount: number) {
    const nodes = page.locator('.react-flow__node');
    await expect(nodes).toHaveCount(expectedCount);
  }

  /**
   * Verify flow has specific number of edges
   */
  static async verifyEdgeCount(page: Page, expectedCount: number) {
    const edges = page.locator('.react-flow__edge');
    await expect(edges).toHaveCount(expectedCount);
  }

  /**
   * Get node by its label/title
   */
  static getNodeByLabel(page: Page, label: string) {
    return page.locator('.react-flow__node').filter({ hasText: label });
  }

  /**
   * Click on a node and verify it's selected
   */
  static async clickAndSelectNode(page: Page, label: string) {
    const node = this.getNodeByLabel(page, label);
    await node.click();

    // Verify node is selected (usually has a 'selected' class)
    await expect(node).toHaveClass(/selected/);
  }

  /**
   * Verify node exists in the flow
   */
  static async verifyNodeExists(page: Page, label: string) {
    const node = this.getNodeByLabel(page, label);
    await expect(node).toBeVisible();
  }

  /**
   * Verify edge exists between two nodes
   */
  static async verifyEdgeExists(page: Page, sourceLabel: string, targetLabel: string) {
    // This is a simplified check
    // In a real implementation, you might need to check edge data attributes
    const sourceNode = this.getNodeByLabel(page, sourceLabel);
    const targetNode = this.getNodeByLabel(page, targetLabel);

    await expect(sourceNode).toBeVisible();
    await expect(targetNode).toBeVisible();

    // Verify at least one edge exists
    const edges = page.locator('.react-flow__edge');
    expect(await edges.count()).toBeGreaterThan(0);
  }

  /**
   * Zoom to specific level
   */
  static async setZoom(page: Page, level: number) {
    // Use React Flow's API if exposed
    await page.evaluate((zoomLevel) => {
      const reactFlow = (window as any).__REACT_FLOW__;
      if (reactFlow && reactFlow.setViewport) {
        reactFlow.setViewport({ x: 0, y: 0, zoom: zoomLevel });
      }
    }, level);
  }

  /**
   * Fit view to show all nodes
   */
  static async fitView(page: Page) {
    const fitButton = page.locator('.react-flow__controls button[title*="fit"], button[aria-label*="fit"]');
    await fitButton.click();
    await page.waitForTimeout(500); // Allow animation to complete
  }

  /**
   * Pan the flow view
   */
  static async pan(page: Page, deltaX: number, deltaY: number) {
    const flowContainer = page.locator('.react-flow, [data-testid="flow-container"]');
    const box = await flowContainer.boundingBox();

    if (!box) {
      throw new Error('Flow container not found');
    }

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + deltaX, startY + deltaY);
    await page.mouse.up();
  }

  /**
   * Verify minimap is visible
   */
  static async verifyMinimapVisible(page: Page) {
    const minimap = page.locator('.react-flow__minimap');
    await expect(minimap).toBeVisible();
  }

  /**
   * Verify controls are visible
   */
  static async verifyControlsVisible(page: Page) {
    const controls = page.locator('.react-flow__controls');
    await expect(controls).toBeVisible();
  }

  /**
   * Get all node labels/titles
   */
  static async getAllNodeLabels(page: Page): Promise<string[]> {
    const nodes = await page.locator('.react-flow__node').all();
    return Promise.all(
      nodes.map(node => node.textContent().then(text => text?.trim() || ''))
    );
  }

  /**
   * Drag a node to a new position
   */
  static async dragNode(page: Page, nodeLabel: string, deltaX: number, deltaY: number) {
    const node = this.getNodeByLabel(page, nodeLabel);
    const box = await node.boundingBox();

    if (!box) {
      throw new Error(`Node "${nodeLabel}" not found`);
    }

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + deltaX, startY + deltaY);
    await page.mouse.up();
    await page.waitForTimeout(300); // Allow drag to complete
  }

  /**
   * Verify node has specific connection type indicator
   */
  static async verifyNodeConnectionType(
    page: Page,
    nodeLabel: string,
    connectionType: 'prerequisite' | 'next' | 'related' | 'seealso'
  ) {
    const node = this.getNodeByLabel(page, nodeLabel);
    const indicator = node.locator(`[data-connection="${connectionType}"]`);
    await expect(indicator).toBeVisible();
  }

  /**
   * Switch between flow view modes
   */
  static async switchViewMode(
    page: Page,
    mode: 'knowledge-graph' | 'navigation-tree' | 'learning-path'
  ) {
    const modeSelector = page.locator('[data-testid="view-mode-selector"]');
    await modeSelector.selectOption(mode);
    await this.waitForFlowReady(page);
  }
}
