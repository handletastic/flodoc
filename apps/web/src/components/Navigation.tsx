import { Link } from '@tanstack/react-router'

export function Navigation() {
  return (
    <nav data-testid="main-nav" className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" data-testid="logo" className="text-xl font-bold hover:opacity-80">
          Flodoc
        </Link>

        <div className="flex gap-6">
          <Link
            to="/docs/getting-started"
            className="hover:underline"
            activeProps={{ className: 'text-primary font-medium' }}
          >
            Docs
          </Link>
          <Link
            to="/flow/knowledge-graph"
            className="hover:underline"
            activeProps={{ className: 'text-primary font-medium' }}
          >
            Flow
          </Link>
        </div>

        <button
          data-testid="theme-toggle"
          className="px-3 py-1 rounded border hover:bg-accent"
          aria-label="Toggle theme"
        >
          Theme
        </button>
      </div>
    </nav>
  )
}
