import { MarkerType } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import type { DocumentMetadata } from '@/lib/mdx/types';
import type { ViewMode } from '@/components/DocumentGraph';

export type GraphLayout = 'force' | 'tree' | 'path';

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

/**
 * Build graph data (nodes and edges) from documents based on view mode
 */
export function buildGraphData(
  documents: DocumentMetadata[],
  viewMode: ViewMode
): GraphData {
  const nodes = buildNodes(documents, viewMode);
  const edges = buildEdges(documents, viewMode);

  return { nodes, edges };
}

/**
 * Build nodes from documents
 */
function buildNodes(documents: DocumentMetadata[], viewMode: ViewMode): Node[] {
  const layout = getLayoutType(viewMode);

  return documents.map((doc, index) => {
    const position = calculateNodePosition(index, documents.length, layout);

    return {
      id: doc.slug,
      type: 'default',
      data: {
        label: doc.title,
      },
      position,
      className: 'bg-background border-2 border-border hover:border-primary transition-colors',
      style: {
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      },
    };
  });
}

/**
 * Build edges from document connections
 */
function buildEdges(documents: DocumentMetadata[], viewMode: ViewMode): Edge[] {
  const edges: Edge[] = [];

  documents.forEach((doc) => {
    // Get connections from document
    const connections = doc.connections || [];

    // Process each connection based on type
    connections.forEach((conn) => {
      switch (conn.type) {
        case 'prerequisite':
          edges.push(createEdge(conn.target, doc.slug, 'prerequisite'));
          break;
        case 'next':
          edges.push(createEdge(doc.slug, conn.target, 'example'));
          break;
        case 'related':
        case 'seealso':
          edges.push(createEdge(doc.slug, conn.target, 'related'));
          break;
      }
    });
  });

  // For tree and path layouts, add hierarchical edges if no connections exist
  if (viewMode === 'navigation-tree' || viewMode === 'learning-path') {
    addHierarchicalEdges(documents, edges, viewMode);
  }

  return edges;
}

/**
 * Create an edge with styling based on connection type
 */
function createEdge(source: string, target: string, type: string): Edge {
  const edgeStyles = getEdgeStyle(type);

  return {
    id: `${source}-${target}-${type}`,
    source,
    target,
    type: 'smoothstep',
    animated: type === 'prerequisite',
    label: type,
    labelStyle: { fontSize: '10px', fill: edgeStyles.stroke },
    style: { stroke: edgeStyles.stroke, strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: edgeStyles.stroke,
    },
    data: { type },
  };
}

/**
 * Get edge styling based on connection type
 */
function getEdgeStyle(type: string): { stroke: string } {
  switch (type) {
    case 'prerequisite':
      return { stroke: '#ef4444' }; // red
    case 'related':
      return { stroke: '#3b82f6' }; // blue
    case 'example':
      return { stroke: '#10b981' }; // green
    default:
      return { stroke: '#6b7280' }; // gray
  }
}

/**
 * Add hierarchical edges for tree and path layouts
 */
function addHierarchicalEdges(
  documents: DocumentMetadata[],
  edges: Edge[],
  viewMode: ViewMode
): void {
  // Group documents by category or create sequential connections
  if (viewMode === 'navigation-tree') {
    // Create tree structure based on document slugs or categories
    const rootDocs = documents.filter((doc) =>
      doc.slug.includes('getting-started') || doc.slug.includes('index')
    );

    rootDocs.forEach((rootDoc) => {
      const relatedDocs = documents.filter(
        (doc) => doc.slug !== rootDoc.slug && doc.slug.startsWith(rootDoc.slug.split('/')[0])
      );

      relatedDocs.forEach((relatedDoc) => {
        const edgeExists = edges.some(
          (e) => e.source === rootDoc.slug && e.target === relatedDoc.slug
        );

        if (!edgeExists) {
          edges.push(createEdge(rootDoc.slug, relatedDoc.slug, 'hierarchy'));
        }
      });
    });
  } else if (viewMode === 'learning-path') {
    // Create sequential path through documents
    for (let i = 0; i < documents.length - 1; i++) {
      const edgeExists = edges.some(
        (e) => e.source === documents[i].slug && e.target === documents[i + 1].slug
      );

      if (!edgeExists) {
        edges.push(createEdge(documents[i].slug, documents[i + 1].slug, 'next'));
      }
    }
  }
}

/**
 * Calculate node position based on layout type
 */
function calculateNodePosition(
  index: number,
  total: number,
  layout: GraphLayout
): { x: number; y: number } {
  switch (layout) {
    case 'tree':
      return calculateTreePosition(index, total);
    case 'path':
      return calculatePathPosition(index, total);
    case 'force':
    default:
      return calculateForcePosition(index, total);
  }
}

/**
 * Calculate position for force-directed layout (circular)
 */
function calculateForcePosition(index: number, total: number): { x: number; y: number } {
  const radius = Math.max(300, total * 30);
  const angle = (index / total) * 2 * Math.PI;

  return {
    x: radius * Math.cos(angle) + 400,
    y: radius * Math.sin(angle) + 300,
  };
}

/**
 * Calculate position for tree layout (hierarchical)
 */
function calculateTreePosition(index: number, _total: number): { x: number; y: number } {
  const itemsPerLevel = 4;
  const level = Math.floor(index / itemsPerLevel);
  const positionInLevel = index % itemsPerLevel;

  return {
    x: positionInLevel * 250 + 100,
    y: level * 200 + 100,
  };
}

/**
 * Calculate position for path layout (sequential)
 */
function calculatePathPosition(index: number, _total: number): { x: number; y: number } {
  const spacing = 300;

  // Create a winding path
  const row = Math.floor(index / 3);
  const col = index % 3;

  return {
    x: col * spacing + 100,
    y: row * 250 + 100,
  };
}

/**
 * Get layout type from view mode
 */
function getLayoutType(viewMode: ViewMode): GraphLayout {
  switch (viewMode) {
    case 'navigation-tree':
      return 'tree';
    case 'learning-path':
      return 'path';
    default:
      return 'force';
  }
}
