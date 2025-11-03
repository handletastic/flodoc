import { Link } from '@tanstack/react-router';
import { Search } from './Search';

export function Navigation() {
  return (
    <nav data-testid="main-nav" className="border-b sticky top-0 bg-background z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link to="/" data-testid="logo" className="text-xl font-bold hover:opacity-80 shrink-0">
          Flodoc
        </Link>

        {/* Search - centered */}
        <Search />

        {/* Navigation Links */}
        <div className="flex gap-6 shrink-0">
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
          className="px-3 py-1 rounded border hover:bg-accent shrink-0"
          aria-label="Toggle theme"
        >
          Theme
        </button>
      </div>
    </nav>
  );
}
