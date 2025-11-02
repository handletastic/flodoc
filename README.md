# Flodoc

A documentation application that uses React Flow to visualize and navigate connections between documents. Built with a git-driven, offline-first approach using MDX for rich, component-based documentation.

## Features

- 📝 **MDX Documentation**: Write docs in MDX format with embedded React components
- 🔗 **Document Connections**: Define relationships between documents (prerequisite, next, related, seealso)
- 📊 **Visual Flow Graph**: Visualize documentation structure with React Flow
- 🎨 **Modern UI**: Built with Shadcn UI and Tailwind CSS
- 🌙 **Dark Mode**: Full dark mode support
- 📱 **Responsive**: Works on all device sizes
- 🚀 **Fast**: Powered by Vite and Bun

## Tech Stack

- **Runtime**: Bun
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Routing**: TanStack Router (file-based)
- **State**: TanStack Query
- **UI**: Shadcn UI + Tailwind CSS
- **Flow**: React Flow (@xyflow/react)
- **Content**: MDX with remark/rehype plugins

## Getting Started

### Prerequisites

- Bun v1.0 or higher
- Node.js 18+ (for compatibility)

### Installation

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

The development server will be available at `http://localhost:5173`

## Project Structure

```
flodoc/
├── apps/
│   └── web/              # Main React webapp
│       ├── src/
│       │   ├── routes/   # TanStack Router file-based routes
│       │   ├── lib/      # Utility functions
│       │   └── components/ # React components
│       └── vite.config.ts
├── packages/
│   ├── ui/               # Shared Shadcn UI components
│   ├── types/            # Shared TypeScript types
│   └── mdx-plugins/      # Custom MDX plugins
└── content/
    └── docs/             # MDX documentation files
```

## Creating Documentation

Create MDX files in `content/docs/` with the following frontmatter:

```mdx
---
title: Your Document Title
description: Brief description for SEO and navigation
slug: url-friendly-slug
tags: [tutorial, beginner]
connections:
  - type: prerequisite
    target: installation
  - type: next
    target: advanced-topics
---

# Your Content Here

Write your documentation content...
```

### Connection Types

- `prerequisite`: Documents that should be read first
- `next`: Logical next step in the learning path
- `related`: Documents on related topics
- `seealso`: Additional resources

## Development

```bash
# Type checking
bun run typecheck

# Linting
bun run lint

# Clean build artifacts
bun run clean
```

## Monorepo Commands

This is a Bun workspace monorepo. Use these commands:

```bash
# Install all dependencies
bun install

# Run dev in specific package
cd apps/web && bun run dev

# Type check all packages
bun run typecheck
```

## Documentation

### For Users

- **User Documentation**: See sample docs in `content/docs/`
- **Connection Types**: prerequisite, next, related, seealso

### For Developers

- **Development Guide**: See `CLAUDE.md` for comprehensive architecture and development guidance
- **Meta-Documentation**: See `.docs/` directory for:
  - **Architecture Decisions** (`.docs/decisions/`): Why we chose Bun, TanStack, React Flow, etc.
  - **Features** (`.docs/features/`): Current features, backlog, and specifications
  - **User Stories** (`.docs/user-stories/`): Personas and user stories
  - **Workflows** (`.docs/workflows/`): Development processes and Claude Code subagent patterns
  - **History** (`.docs/history/`): Changelog, milestones, and retrospectives
  - **Organization** (`.docs/organization/`): Project status, tech stack, and roadmap

The `.docs/` directory provides complete project context for developers and AI assistants (Claude Code).

## Future Enhancements

See `.docs/organization/roadmap.md` for detailed roadmap. Highlights:

- [ ] TinaCMS integration for client-side editing (M4)
- [ ] GitHub Pages deployment with CI/CD (M3)
- [ ] Full-text search with client-side index (M2)
- [ ] PWA support for offline access (M5)
- [ ] GitHub OAuth for authentication (M4)
- [ ] Export documentation sets (M5)
- [ ] Multiple flow visualization modes (M3)

## License

MIT

## Contributing

Contributions are welcome! Please:

1. Read `CLAUDE.md` for development setup and architecture
2. Check `.docs/workflows/development-workflow.md` for processes
3. Review `.docs/features/backlog.md` for planned features
4. Follow the code review checklist in `.docs/workflows/code-review-checklist.md`
5. Submit a Pull Request using the template
