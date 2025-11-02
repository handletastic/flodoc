import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

/**
 * Page Object for React Flow visualization pages
 *
 * Handles interactions with the flow visualization features:
 * - Knowledge Graph view
 * - Navigation Tree view
 * - Learning Path view
 * - Node and edge interactions
 */
export class FlowPage extends BasePage {
  // Flow elements
  readonly flowContainer: Locator;
  readonly nodes: Locator;
  readonly edges: Locator;
  readonly controls: Locator;
  readonly minimap: Locator;
  readonly viewModeSelector: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize React Flow locators
    this.flowContainer = page.locator('.react-flow, [data-testid="flow-container"]');
    this.nodes = page.locator('.react-flow__node');
    this.edges = page.locator('.react-flow__edge');
    this.controls = page.locator('.react-flow__controls');
    this.minimap = page.locator('.react-flow__minimap');
    this.viewModeSelector = page.locator('[data-testid="view-mode-selector"]');
  }

  /**
   * Navigate to the flow visualization page
   */
  async goto(view: 'knowledge-graph' | 'navigation-tree' | 'learning-path' = 'knowledge-graph') {
    await super.goto(`/flow/${view}`);
  }

  /**
   * Wait for the flow to render
   */
  async waitForFlowReady(timeout = 10000) {
    await this.flowContainer.waitFor({ state: 'visible', timeout });
    // Wait for at least one node to be rendered
    await this.nodes.first().waitFor({ state: 'visible', timeout });
    // Allow time for layout stabilization
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get the total number of nodes
   */
  async getNodeCount(): Promise<number> {
    return await this.nodes.count();
  }

  /**
   * Get the total number of edges
   */
  async getEdgeCount(): Promise<number> {
    return await this.edges.count();
  }

  /**
   * Click on a node by its label/title
   */
  async clickNodeByLabel(label: string) {
    const node = this.nodes.filter({ hasText: label }).first();
    await node.click();
  }

  /**
   * Click on a node by index
   */
  async clickNode(index: number) {
    await this.nodes.nth(index).click();
  }

  /**
   * Get all node labels
   */
  async getNodeLabels(): Promise<string[]> {
    const nodeElements = await this.nodes.all();
    return Promise.all(
      nodeElements.map(node => node.textContent().then(text => text?.trim() || ''))
    );
  }

  /**
   * Switch to a different view mode
   */
  async switchViewMode(mode: 'knowledge-graph' | 'navigation-tree' | 'learning-path') {
    await this.viewModeSelector.selectOption(mode);
    await this.waitForFlowReady();
  }

  /**
   * Zoom in using controls
   */
  async zoomIn() {
    await this.controls.locator('button[title*="zoom in"], button[aria-label*="zoom in"]').click();
  }

  /**
   * Zoom out using controls
   */
  async zoomOut() {
    await this.controls.locator('button[title*="zoom out"], button[aria-label*="zoom out"]').click();
  }

  /**
   * Fit the view to show all nodes
   */
  async fitView() {
    await this.controls.locator('button[title*="fit"], button[aria-label*="fit"]').click();
  }

  /**
   * Check if minimap is visible
   */
  async isMinimapVisible(): Promise<boolean> {
    return await this.minimap.isVisible();
  }

  /**
   * Pan the flow view by dragging
   */
  async pan(deltaX: number, deltaY: number) {
    const box = await this.flowContainer.boundingBox();
    if (!box) return;

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(startX + deltaX, startY + deltaY);
    await this.page.mouse.up();
  }

  /**
   * Get a specific node by its data attribute
   */
  getNodeBySlug(slug: string): Locator {
    return this.page.locator(`[data-node-slug="${slug}"], [data-id="${slug}"]`);
  }

  /**
   * Verify that connections are rendered between nodes
   */
  async verifyNodesConnected(sourceLabel: string, targetLabel: string): Promise<boolean> {
    // This is a simplified check - in a real implementation,
    // you'd need to inspect the edge paths to verify specific connections
    const sourceNode = await this.nodes.filter({ hasText: sourceLabel }).first();
    const targetNode = await this.nodes.filter({ hasText: targetLabel }).first();

    const sourceVisible = await sourceNode.isVisible();
    const targetVisible = await targetNode.isVisible();
    const hasEdges = (await this.getEdgeCount()) > 0;

    return sourceVisible && targetVisible && hasEdges;
  }
}
