import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Flodoc</h1>
      <p className="text-muted-foreground text-lg mb-8">
        A documentation application that uses react-flow to connect multiple documents
      </p>
      <div className="flex gap-4">
        <Link
          to="/docs/$slug"
          params={{ slug: 'getting-started' }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          View Documentation
        </Link>
        <Link
          to="/flow/$view"
          params={{ view: 'knowledge-graph' }}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
        >
          View Flow Graph
        </Link>
      </div>
    </div>
  )
}
