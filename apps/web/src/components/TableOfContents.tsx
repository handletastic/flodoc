import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

/**
 * Heading structure for TOC
 */
export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

/**
 * Table of Contents Component Props
 */
interface TableOfContentsProps {
  className?: string;
}

/**
 * Table of Contents Component (F-015)
 *
 * Auto-generates TOC from document H2-H4 headings with features:
 * - Auto-generation from H2-H4 headings
 * - Active section highlighting
 * - Smooth scrolling to sections
 * - Sticky/fixed position on desktop
 * - Collapsible on mobile
 */
export function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  // Extract headings from document
  useEffect(() => {
    // Select H2-H4 headings only
    const headingElements = Array.from(
      document.querySelectorAll('article h2, article h3, article h4')
    );

    const headingData: TocHeading[] = headingElements
      .map((heading) => {
        const level = parseInt(heading.tagName.charAt(1));
        let id = heading.id;

        // Generate ID if not present
        if (!id) {
          id = heading.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || '';
          heading.id = id;
        }

        return {
          id,
          text: heading.textContent || '',
          level,
        };
      })
      .filter((heading) => heading.id && heading.text);

    setHeadings(headingData);
  }, []);

  // Track active section
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  // Handle link click
  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();

      const element = document.getElementById(id);
      if (element) {
        // Update URL hash
        window.history.pushState(null, '', `#${id}`);

        // Smooth scroll to element
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Close mobile menu after navigation
        setIsOpen(false);
      }
    },
    []
  );

  // Toggle mobile menu
  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Handle keyboard events for toggle
  const handleToggleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    },
    [toggleMenu]
  );

  // If no headings, don't render TOC
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn(
        'table-of-contents',
        'lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto',
        'w-full lg:w-64',
        className
      )}
      aria-label="Table of Contents"
      data-testid="table-of-contents"
    >
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMenu}
        onKeyDown={handleToggleKeyDown}
        className="lg:hidden w-full flex items-center justify-between px-4 py-3 text-sm font-medium bg-secondary text-secondary-foreground rounded-lg mb-2"
        aria-expanded={isOpen}
        aria-controls="toc-content"
        data-testid="toc-toggle"
      >
        <span>Table of Contents</span>
        <svg
          className={cn(
            'w-4 h-4 transition-transform',
            isOpen && 'transform rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* TOC Content */}
      <div
        id="toc-content"
        className={cn(
          'space-y-1',
          // Mobile: collapsible
          'lg:block',
          isOpen ? 'block' : 'hidden'
        )}
        aria-hidden={!isOpen ? 'true' : 'false'}
        data-testid="toc-content"
      >
        {/* Desktop Title */}
        <div className="hidden lg:block mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            On This Page
          </h3>
        </div>

        {/* TOC Links */}
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            const indent = (heading.level - 2) * 12; // 0px for H2, 12px for H3, 24px for H4

            return (
              <li key={heading.id} style={{ paddingLeft: `${indent}px` }}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleLinkClick(e, heading.id)}
                  className={cn(
                    'block py-1 px-2 rounded transition-colors',
                    'hover:text-primary hover:bg-accent',
                    isActive
                      ? 'text-primary font-medium bg-accent'
                      : 'text-muted-foreground'
                  )}
                  data-active={isActive}
                  data-heading-level={heading.level}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
