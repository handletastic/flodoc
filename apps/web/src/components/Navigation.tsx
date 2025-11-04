import { Link } from '@tanstack/react-router';
import { Search } from './Search';
import { useState } from 'react';

/**
 * Navigation Component with Mobile-First Responsive Design
 *
 * Features:
 * - Desktop: Full horizontal navigation
 * - Mobile: Hamburger menu with slide-in drawer
 * - Touch-friendly targets (44x44px)
 * - Smooth animations
 * - Sticky header
 */
export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav data-testid="main-nav" className="border-b sticky top-0 bg-background z-50">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-2 md:gap-4">
        {/* Logo */}
        <Link
          to="/"
          data-testid="logo"
          className="text-lg md:text-xl font-bold hover:opacity-80 shrink-0"
        >
          Flodoc
        </Link>

        {/* Desktop Search - Hidden on mobile, shown on md+ */}
        <div className="hidden md:flex flex-1 max-w-md">
          <Search />
        </div>

        {/* Desktop Navigation Links - Hidden on mobile */}
        <div
          data-testid="desktop-nav-links"
          className="hidden md:flex gap-6 shrink-0"
        >
          <Link
            to="/docs/$slug"
            params={{ slug: 'getting-started' }}
            className="hover:underline"
            activeProps={{ className: 'text-primary font-medium' }}
          >
            Docs
          </Link>
          <Link
            to="/flow/$view"
            params={{ view: 'knowledge-graph' }}
            className="hover:underline"
            activeProps={{ className: 'text-primary font-medium' }}
          >
            Flow
          </Link>
        </div>

        {/* Desktop Theme Toggle - Hidden on mobile */}
        <button
          data-testid="theme-toggle"
          className="hidden md:block px-3 py-1 rounded border hover:bg-accent shrink-0"
          aria-label="Toggle theme"
        >
          Theme
        </button>

        {/* Mobile Hamburger Button */}
        <button
          data-testid="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          className="md:hidden p-3 -mr-3 hover:bg-accent rounded-md transition-colors"
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {isMobileMenuOpen ? (
              // X icon when menu is open
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </>
            ) : (
              // Hamburger icon when menu is closed
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Search Bar - Below header on mobile */}
      <div className="md:hidden border-t px-4 py-2">
        <Search />
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Menu Drawer */}
          <div
            data-testid="mobile-menu"
            className="fixed top-0 right-0 bottom-0 w-64 bg-background border-l shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out"
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold text-lg">Menu</span>
              <button
                onClick={closeMobileMenu}
                className="p-2 hover:bg-accent rounded-md"
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Menu Links - Touch-friendly */}
            <nav className="flex flex-col p-4 space-y-2">
              <Link
                to="/docs/$slug"
                params={{ slug: 'getting-started' }}
                onClick={closeMobileMenu}
                className="px-4 py-3 text-base hover:bg-accent rounded-md transition-colors"
                activeProps={{ className: 'text-primary font-medium bg-accent' }}
              >
                Docs
              </Link>
              <Link
                to="/flow/$view"
                params={{ view: 'knowledge-graph' }}
                onClick={closeMobileMenu}
                className="px-4 py-3 text-base hover:bg-accent rounded-md transition-colors"
                activeProps={{ className: 'text-primary font-medium bg-accent' }}
              >
                Flow
              </Link>

              {/* Theme Toggle in Mobile Menu */}
              <button
                className="px-4 py-3 text-base text-left hover:bg-accent rounded-md transition-colors border-t mt-4 pt-6"
                aria-label="Toggle theme"
              >
                Theme
              </button>
            </nav>
          </div>
        </>
      )}
    </nav>
  );
}
