# Changelog

All notable changes to Flodoc will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- MDX document loading and rendering
- React Flow graph visualization
- Document navigation and search
- Dark mode implementation

## [0.1.0] - 2025-01-01

### Added

#### Infrastructure
- Bun monorepo workspace structure with `apps/` and `packages/`
- Vite + React 19 + TypeScript build configuration
- TanStack Router with file-based routing and route tree generation
- Tailwind CSS with Shadcn UI design system
- MDX support with remark-gfm, remark-frontmatter, rehype-pretty-code
- TypeScript path aliases for clean imports

#### Dependencies
- **TanStack Suite**: Router (v1.86.6), Query (v5.62.21), Table (v8.20.6), Form (v0.37.0)
- **React Flow**: @xyflow/react (v12.3.10) for graph visualization
- **MDX**: @mdx-js/rollup with remark/rehype plugins
- **Styling**: Tailwind CSS (v3.4.17) + Shadcn UI components
- **Utilities**: gray-matter, clsx, tailwind-merge, class-variance-authority

#### Configuration
- Vite configuration with MDX and TanStack Router plugins
- Tailwind config with CSS variables for theming
- TypeScript configuration with strict mode and path aliases
- ESLint configuration for code quality
- PostCSS with autoprefixer

#### Sample Content
- 5 interconnected sample MDX documents in `content/docs/`:
  - Getting Started
  - Basic Concepts
  - Installation
  - Creating Documents
  - Document Connections

#### Documentation
- Comprehensive CLAUDE.md for development guidance
- Project README with tech stack and setup instructions
- `.gitignore` for proper file exclusion

#### Meta-Documentation
- Complete `.docs/` structure with:
  - 5 Architecture Decision Records (ADRs)
  - Feature tracking system (backlog, in-progress, completed)
  - User stories and personas
  - Subagent workflows and patterns
  - Development workflow and code review checklist
  - Project history and changelog
  - Templates for ADRs, features, stories, and retrospectives

### Changed
- N/A (initial release)

### Deprecated
- N/A (initial release)

### Removed
- N/A (initial release)

### Fixed
- N/A (initial release)

### Security
- N/A (initial release)

---

## Version History

- **v0.1.0** (2025-01-01): Initial project setup and infrastructure

---

## Notes

### Versioning Strategy

**Pre-1.0 (Current Phase)**:
- 0.x.0: Major feature additions
- 0.0.x: Minor features and fixes

**Post-1.0 (Stable)**:
- Major.x.x: Breaking changes
- x.Minor.x: New features (backward compatible)
- x.x.Patch: Bug fixes and minor improvements

### Change Categories

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

---

**Last Updated**: 2025-01-01
