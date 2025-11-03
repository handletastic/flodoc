import { Link, useMatches } from '@tanstack/react-router';

/**
 * Breadcrumbs component for navigation context
 *
 * Features:
 * - Shows current location in site hierarchy
 * - Links to parent pages
 * - ARIA-compliant breadcrumb navigation
 */
export function Breadcrumbs() {
  const matches = useMatches();

  // Build breadcrumb trail from route matches
  const breadcrumbs = buildBreadcrumbs(matches);

  // Don't show breadcrumbs on home page or if only one item
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav
      data-testid="breadcrumbs"
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-sm text-muted-foreground mb-6"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={crumb.path} className="flex items-center space-x-2">
              {index > 0 && (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {isLast ? (
                <span
                  className="font-medium text-foreground"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface Breadcrumb {
  label: string;
  path: string;
}

/**
 * Build breadcrumb trail from route matches
 */
function buildBreadcrumbs(matches: any[]): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = [
    {
      label: 'Home',
      path: '/',
    },
  ];

  // Process route matches to build breadcrumb trail
  matches.forEach((match) => {
    const pathname = match.pathname;

    // Skip root path (already added as Home)
    if (pathname === '/') {
      return;
    }

    // Handle docs routes
    if (pathname.startsWith('/docs/')) {
      // Add "Docs" breadcrumb if not already added
      if (!breadcrumbs.some((b) => b.path === '/docs')) {
        breadcrumbs.push({
          label: 'Docs',
          path: '/docs',
        });
      }

      // Add document-specific breadcrumb
      const slug = pathname.replace('/docs/', '');
      if (slug) {
        // Convert slug to readable title
        const title = formatSlugToTitle(slug);
        breadcrumbs.push({
          label: title,
          path: pathname,
        });
      }
    }

    // Handle flow routes
    if (pathname.startsWith('/flow/')) {
      breadcrumbs.push({
        label: 'Flow',
        path: pathname,
      });
    }
  });

  return breadcrumbs;
}

/**
 * Convert a slug to a readable title
 */
function formatSlugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
