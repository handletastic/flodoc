import { Link, useRouterState } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getAllDocuments } from '../lib/mdx/loader';
import { DocumentMetadata } from '../lib/mdx/types';
import { useState, useEffect } from 'react';

interface SidebarProps {
  className?: string;
}

/**
 * Sidebar component with mobile-first responsive design
 *
 * Features:
 * - Desktop: Sticky sidebar always visible
 * - Mobile: Slide-in drawer with overlay
 * - Touch-friendly links (44px height)
 * - Smooth animations
 * - Auto-close on navigation
 */
export function Sidebar({ className = '' }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Load all documents
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: getAllDocuments,
  });

  // Group documents by category (basic organization)
  const groupedDocs = groupDocuments(documents);

  // Check if a document is active
  const isActive = (doc: DocumentMetadata) => {
    return currentPath.includes(`/docs/${doc.slug}`);
  };

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [currentPath]);

  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  if (isLoading) {
    return (
      <aside
        data-testid="sidebar"
        className={`hidden md:block w-64 border-r bg-background p-4 ${className}`}
      >
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 bg-gray-200 rounded animate-pulse" />
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile sidebar toggle - Touch-friendly 44x44px */}
      <button
        data-testid="sidebar-toggle"
        onClick={toggleSidebar}
        className="md:hidden fixed top-20 left-4 z-50 p-3 min-w-[44px] min-h-[44px] rounded-lg border bg-background shadow-lg hover:bg-accent transition-colors"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isOpen ? (
            // X icon when open
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            // Menu icon when closed
            <>
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        data-testid="sidebar"
        className={`
          fixed md:sticky
          top-[4rem] md:top-16
          left-0
          h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]
          w-64
          border-r bg-background
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${className}
        `}
      >
        <nav className="h-full overflow-y-auto p-4 overscroll-contain">
          <div className="space-y-6">
            {Object.entries(groupedDocs).map(([category, docs]) => (
              <div key={category}>
                <h3 className="font-semibold text-sm uppercase text-muted-foreground mb-3 px-3">
                  {category}
                </h3>
                <ul className="space-y-1">
                  {docs.map((doc) => (
                    <li key={doc.slug}>
                      <Link
                        to={`/docs/${doc.slug}`}
                        onClick={closeSidebar}
                        className={`
                          block px-4 py-3 min-h-[44px]
                          rounded-lg text-sm md:text-base
                          transition-colors duration-150
                          hover:bg-accent hover:text-accent-foreground
                          flex items-center
                          ${
                            isActive(doc)
                              ? 'bg-accent text-accent-foreground font-medium'
                              : 'text-foreground'
                          }
                        `}
                        aria-current={isActive(doc) ? 'page' : undefined}
                      >
                        {doc.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </aside>

      {/* Mobile overlay - Backdrop */}
      {isOpen && (
        <div
          data-testid="sidebar-overlay"
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}

/**
 * Group documents by category based on tags or default grouping
 */
function groupDocuments(documents: DocumentMetadata[]): Record<string, DocumentMetadata[]> {
  const groups: Record<string, DocumentMetadata[]> = {
    'Getting Started': [],
    'Guides': [],
    'Reference': [],
  };

  documents.forEach((doc) => {
    // Simple categorization based on common patterns
    if (
      doc.slug.includes('getting-started') ||
      doc.slug.includes('installation') ||
      doc.slug.includes('basic')
    ) {
      groups['Getting Started'].push(doc);
    } else if (
      doc.slug.includes('creating') ||
      doc.slug.includes('document') ||
      doc.slug.includes('connection')
    ) {
      groups['Guides'].push(doc);
    } else if (doc.slug.includes('code') || doc.slug.includes('example')) {
      groups['Reference'].push(doc);
    } else {
      // Default to Guides
      groups['Guides'].push(doc);
    }
  });

  // Remove empty categories
  Object.keys(groups).forEach((key) => {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  });

  return groups;
}
