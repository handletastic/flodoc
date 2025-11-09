import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getAllDocuments } from '../lib/mdx/loader';

/**
 * Search component with keyboard shortcuts and mobile-first responsive design
 *
 * Features:
 * - Client-side search with basic string matching
 * - Keyboard shortcuts (Cmd+K / Ctrl+K)
 * - Arrow key navigation
 * - Escape to close
 * - Click outside to close
 * - Search term highlighting
 * - Mobile-optimized input (16px font to prevent zoom on iOS)
 * - Touch-friendly result items (44px height)
 * - Responsive results dropdown
 */
export function Search() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load all documents for search
  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: getAllDocuments,
  });

  // Filter documents based on search query
  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    return documents.filter((doc) => {
      const titleMatch = doc.title.toLowerCase().includes(lowerQuery);
      const descriptionMatch = doc.description?.toLowerCase().includes(lowerQuery);
      const tagMatch = doc.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery));
      const slugMatch = doc.slug.toLowerCase().includes(lowerQuery);

      return titleMatch || descriptionMatch || tagMatch || slugMatch;
    });
  }, [query, documents]);

  // Keyboard shortcut handler (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
        setSelectedIndex(0);
      }

      // Arrow key navigation
      if (isOpen && searchResults.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
          e.preventDefault();
          const selected = searchResults[selectedIndex];
          if (selected) {
            // Navigation will happen via Link component
            setIsOpen(false);
            setQuery('');
            setSelectedIndex(0);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, selectedIndex]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  };

  // Detect OS for keyboard shortcut hint
  const isMac = typeof window !== 'undefined' && /Mac/.test(navigator.platform);
  const shortcutHint = isMac ? '⌘K' : 'Ctrl+K';

  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" data-testid="search-icon">
        <svg
          className="w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Search Input - Mobile optimized */}
      <input
        ref={inputRef}
        type="search"
        data-testid="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={handleInputFocus}
        placeholder="Search docs..."
        className="
          w-full h-11 pl-10 pr-4
          border rounded-md
          bg-background
          focus:outline-none focus:ring-2 focus:ring-primary
          text-base
        "
        style={{ fontSize: '16px' }} // Prevent iOS zoom
      />

      {/* Keyboard shortcut hint - Hidden on mobile */}
      <div className="hidden md:block absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <kbd className="text-xs text-muted-foreground border px-2 py-0.5 rounded">
          {shortcutHint}
        </kbd>
      </div>

      {/* Search Results - Mobile optimized */}
      {isOpen && query.trim() && (
        <div
          ref={resultsRef}
          data-testid="search-results"
          className="
            absolute top-full mt-2 left-0 right-0
            bg-background border rounded-md shadow-lg
            max-h-[60vh] md:max-h-96 overflow-y-auto
            z-50
          "
        >
          {searchResults.length > 0 ? (
            <ul className="py-1">
              {searchResults.map((doc, index) => (
                <li key={doc.slug}>
                  <Link
                    to="/docs/$slug"
                    params={{ slug: doc.slug }}
                    onClick={handleResultClick}
                    data-testid="search-result-item"
                    data-highlighted={index === selectedIndex}
                    className={`
                      block px-4 py-3 min-h-[44px]
                      hover:bg-accent
                      transition-colors
                      ${index === selectedIndex ? 'bg-accent' : ''}
                    `}
                  >
                    <div className="font-medium text-sm md:text-base">
                      <HighlightedText text={doc.title} query={query} />
                    </div>
                    {doc.description && (
                      <div className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                        <HighlightedText text={doc.description} query={query} />
                      </div>
                    )}
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {doc.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-secondary rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div
              data-testid="no-search-results"
              className="px-4 py-8 text-center text-sm text-muted-foreground"
            >
              No documents found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Highlight search terms in text
 */
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) {
    return <>{text}</>;
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
