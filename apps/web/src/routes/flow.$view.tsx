import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/flow/$view')({
  component: FlowPage,
})

function FlowPage() {
  const { view } = Route.useParams()

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
