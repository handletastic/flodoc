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
import type { Connection, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { DocumentMetadata } from '@/lib/mdx/types';
import { buildGraphData } from '@/lib/graph/builder';
import type { GraphLayout } from '@/lib/graph/builder';
import { GraphControls } from './graph/GraphControls';
import { GraphLegend } from './graph/GraphLegend';
import { useNavigate } from '@tanstack/react-router';

interface DocumentGraphProps {
  documents: DocumentMetadata[];
}

export type ViewMode = 'knowledge-graph' | 'navigation-tree' | 'learning-path';

export function DocumentGraph({ documents }: DocumentGraphProps) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('knowledge-graph');
  const [showMinimap, setShowMinimap] = useState(true);

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
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
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
