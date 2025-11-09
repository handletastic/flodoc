import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from '@xyflow/react';
import type { Connection, Node, EdgeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { DocumentMetadata } from '@/lib/mdx/types';
import { buildGraphData } from '@/lib/graph/builder';
import type { GraphLayout } from '@/lib/graph/builder';
import { GraphControls } from './graph/GraphControls';
import { GraphLegend } from './graph/GraphLegend';
import { CustomEdge } from './graph/CustomEdge';
import { useNavigate } from '@tanstack/react-router';

interface DocumentGraphProps {
  documents: DocumentMetadata[];
}

export type ViewMode = 'knowledge-graph' | 'navigation-tree' | 'learning-path';

// Define custom edge types
const edgeTypes: EdgeTypes = {
  smoothstep: CustomEdge,
};

export function DocumentGraph({ documents }: DocumentGraphProps) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('knowledge-graph');
  const [showMinimap, setShowMinimap] = useState(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Build nodes and edges from documents based on view mode
  const { nodes: initialNodes, edges: initialEdges} = useMemo(() => {
    return buildGraphData(documents, viewMode);
  }, [documents, viewMode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when view mode changes
  useMemo(() => {
    const { nodes: newNodes, edges: newEdges } = buildGraphData(documents, viewMode);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [documents, viewMode, setNodes, setEdges]);

  // Update nodes when hover state changes
  useMemo(() => {
    if (!hoveredNodeId) return;

    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        className: node.id === hoveredNodeId
          ? 'bg-background border-2 border-primary transition-colors highlighted'
          : 'bg-background border-2 border-border hover:border-primary transition-colors',
      }))
    );
  }, [hoveredNodeId, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle node click - navigate to document
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const slug = node.id;
      navigate({ to: `/docs/${slug}` });
    },
    [navigate]
  );

  // Handle node hover enter
  const onNodeMouseEnter = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setHoveredNodeId(node.id);
    },
    []
  );

  // Handle node hover leave
  const onNodeMouseLeave = useCallback(
    () => {
      setHoveredNodeId(null);
    },
    []
  );

  // Get layout type for data attribute
  const layoutType: GraphLayout = useMemo(() => {
    switch (viewMode) {
      case 'navigation-tree':
        return 'tree';
      case 'learning-path':
        return 'path';
      default:
        return 'force';
    }
  }, [viewMode]);

  return (
    <div
      data-testid="flow-container"
      data-layout={layoutType}
      className="w-full h-full relative bg-background"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        panOnDrag
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        zoomOnDoubleClick
        minZoom={0.1}
        maxZoom={2}
        className="bg-background"
      >
        <Background />
        <Controls />
        {showMinimap && (
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
            className="bg-background border rounded"
          />
        )}

        {/* Custom Controls Panel */}
        <Panel position="top-left" className="bg-transparent">
          <GraphControls
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showMinimap={showMinimap}
            onToggleMinimap={() => setShowMinimap(!showMinimap)}
          />
        </Panel>

        {/* Legend Panel */}
        <Panel position="bottom-right" className="bg-transparent">
          <GraphLegend />
        </Panel>
      </ReactFlow>
    </div>
  );
}
