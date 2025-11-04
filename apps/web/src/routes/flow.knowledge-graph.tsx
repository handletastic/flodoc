import { createFileRoute } from '@tanstack/react-router';
import { DocumentGraph } from '@/components/DocumentGraph';
import { getAllDocuments } from '@/lib/mdx';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/flow/knowledge-graph')({
  component: KnowledgeGraphPage,
});

function KnowledgeGraphPage() {
  // Load all documents for graph visualization
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: getAllDocuments,
  });

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
