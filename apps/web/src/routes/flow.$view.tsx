import { createFileRoute } from '@tanstack/react-router';
import { DocumentGraph } from '@/components/DocumentGraph';
import { getAllDocuments } from '@/lib/mdx';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/flow/$view')({
  component: FlowPage,
})

function FlowPage() {
  const { view } = Route.useParams()

  // Load all documents for graph visualization
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: getAllDocuments,
    enabled: view === 'knowledge-graph', // Only load for knowledge-graph view
  });

  // Handle knowledge-graph view specifically
  if (view === 'knowledge-graph') {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div data-testid="graph-loading" className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading document graph...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-screen flex flex-col">
        {/* Page Header */}
        <header className="border-b bg-background p-4 shrink-0">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Knowledge Graph</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Visualize document relationships and connections
            </p>
          </div>
        </header>

        {/* Graph Container */}
        <div className="flex-1 min-h-0">
          <DocumentGraph documents={documents} />
        </div>
      </div>
    );
  }

  // Default placeholder for other views
  return (
    <div className="container mx-auto px-4 py-8">
      <div data-testid="flow-container" className="react-flow min-h-[600px] border rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Flow Visualization: {view}</h1>
          <p className="text-muted-foreground">
            React Flow visualization will be implemented here.
          </p>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Available Views:</h2>
            <ul className="space-y-2">
              <li>• Knowledge Graph - Bidirectional document relationships</li>
              <li>• Navigation Tree - Hierarchical document structure</li>
              <li>• Learning Path - Sequential learning progression</li>
            </ul>
          </div>
        </div>

        {/* Placeholder for React Flow controls */}
        <div className="react-flow__controls absolute bottom-4 left-4 flex flex-col gap-2">
          <button className="px-3 py-1 bg-background border rounded hover:bg-accent">Zoom In</button>
          <button className="px-3 py-1 bg-background border rounded hover:bg-accent">Zoom Out</button>
          <button className="px-3 py-1 bg-background border rounded hover:bg-accent">Fit View</button>
        </div>

        {/* Placeholder for minimap */}
        <div className="react-flow__minimap absolute bottom-4 right-4 w-32 h-24 bg-background border rounded">
          <p className="text-xs p-2">Minimap</p>
        </div>
      </div>
    </div>
  )
}
