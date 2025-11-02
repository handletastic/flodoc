# Technology Stack

Detailed breakdown of Flodoc's technology choices with rationale.

## Core Technologies

### Runtime & Build

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **Bun** | 1.3.1+ | Runtime & package manager | 10x faster than npm, native TypeScript, workspaces (ADR-0001) |
| **Vite** | 7.1.12+ | Build tool & dev server | Fast HMR, excellent DX, React/TS support |
| **TypeScript** | 5.9.3+ | Type system | Type safety, better DX, catches errors early |
| **React** | 19.2.0+ | UI framework | Component-based, large ecosystem, team familiarity |

**Rationale**: Modern stack prioritizing developer experience and performance. Bun's speed significantly improves iteration time.

---

## Frontend Framework & State

### UI Framework

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **React 19** | 19.2.0+ | UI library | Latest features, concurrent rendering, ecosystem |
| **TanStack Router** | 1.134.4+ | Routing | Type-safe, file-based, TanStack integration (ADR-0002) |
| **TanStack Query** | 5.90.5+ | Data fetching | Caching, loading states, server state management |
| **TanStack Table** | 8.21.3+ | Tables/lists | Headless UI, flexible, type-safe |
| **TanStack Form** | 1.23.8+ | Form management | Type-safe forms, validation |

**Rationale**: TanStack suite provides cohesive, type-safe ecosystem with excellent React integration. Consistent API across tools.

---

## Visualization

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **React Flow** | 12.9.2+ | Graph visualization | Professional node-based UI, customizable, performant (ADR-0003) |

**Rationale**: Best-in-class graph visualization for React. Handles complex document relationships with interactive navigation.

---

## Styling & UI Components

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **Tailwind CSS** | 3.4.18+ | Utility CSS | Rapid development, consistent design, small bundle |
| **Shadcn UI** | N/A | Component library | Copy-paste components, full control, Radix primitives (ADR-0005) |
| **Radix UI** | Various | Headless components | Accessibility, unstyled primitives |
| **Lucide React** | 0.552.0+ | Icons | Clean icons, tree-shakeable |
| **clsx** | 2.1.1+ | Class names | Conditional className logic |
| **tailwind-merge** | 3.3.1+ | Class merging | Prevent Tailwind conflicts |
| **class-variance-authority** | 0.7.1+ | Variant classes | Type-safe component variants |

**Rationale**: Tailwind + Shadcn provides maximum flexibility with minimal bundle size. Own the code, customize freely.

---

## Content & Documentation

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **MDX** | 3.1.1+ | Markdown + JSX | Rich docs, component embedding (ADR-0004) |
| **remark-gfm** | 4.0.1+ | GFM support | Tables, task lists, strikethrough |
| **remark-frontmatter** | 5.0.0+ | YAML parsing | Document metadata |
| **rehype-pretty-code** | 0.14.1+ | Syntax highlighting | Beautiful code blocks |
| **gray-matter** | 4.0.3+ | Frontmatter extraction | Parse metadata at runtime |

**Rationale**: MDX is the gold standard for React documentation. Plugin ecosystem provides extensive functionality.

---

## Future Technologies (Planned)

### CMS (M4)

| Technology | Status | Purpose | Notes |
|------------|--------|---------|-------|
| **TinaCMS** | Planned | Content editing | Client-side, Git-based, MDX support |

**Rationale**: Client-side CMS aligns with offline-first goals. No server required, Git-driven workflow.

### Testing (M2)

| Technology | Status | Purpose | Notes |
|------------|--------|---------|-------|
| **Vitest** | Planned | Unit testing | Vite-native, fast, Jest-compatible API |
| **Playwright** | Planned | E2E testing | Cross-browser, reliable, great DX |
| **Testing Library** | Planned | Component testing | Best practices, user-centric |

**Rationale**: Modern testing stack aligned with Vite. Vitest shares Vite config, Playwright is industry standard.

### Deployment (M3)

| Technology | Status | Purpose | Notes |
|------------|--------|---------|-------|
| **GitHub Actions** | Planned | CI/CD | Free for public repos, integrated |
| **GitHub Pages** | Planned | Hosting | Free, simple, git-driven |

**Rationale**: Zero-cost hosting for open source. Aligns with git-driven philosophy.

---

## Development Tools

| Tool | Purpose | Why |
|------|---------|-----|
| **ESLint** | Linting | Catch errors, enforce standards |
| **Prettier** | Formatting | Consistent code style (future) |
| **TypeScript ESLint** | TS linting | TypeScript-specific rules |

---

## Monorepo Structure

### Workspaces

```
flodoc/
├── apps/web          - Main React application
├── packages/ui       - Shared UI components
├── packages/types    - Shared TypeScript types
└── content/docs      - MDX documentation
```

**Tools**: Bun workspaces (built-in, no additional tools needed)

---

## Version Constraints

### Node.js Compatibility

- Bun 1.3.1+ required
- Node.js 18+ recommended (for contributor compatibility)
- npm/pnpm can work but Bun strongly preferred

### Browser Support

Target browsers:
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile: iOS Safari 14+, Chrome Android latest

### TypeScript

- Strict mode enabled
- ES2022 target
- ESNext modules

---

## Decision Principles

Technology choices follow these principles:

1. **Developer Experience**: Tools should be pleasant to use
2. **Type Safety**: TypeScript everywhere, strict mode
3. **Performance**: Fast build times, small bundles
4. **Modern**: Use latest stable versions
5. **Ecosystem**: Prefer cohesive ecosystems (TanStack)
6. **Ownership**: Control over dependencies (Shadcn approach)
7. **Simplicity**: Avoid over-engineering

---

## Technology Comparison

### Why Not X?

**Why not Next.js?**
- Too heavy for our use case
- Server-side complexity not needed
- Conflicts with offline-first goal
- TinaCMS simpler with CSR

**Why not pnpm/npm?**
- Bun is dramatically faster
- Native TypeScript support
- Single tool (not npm + ts-node)
- Modern, future-focused

**Why not Material-UI?**
- Large bundle size
- Opinionated design
- Less customization flexibility
- Shadcn gives us more control

**Why not Contentful/Sanity?**
- Violates offline-first requirement
- Vendor lock-in
- Not git-driven
- Costs money

---

## Stack Evolution

### How We Got Here

1. **User Requirements**: Git-driven, offline-first, TypeScript
2. **Technology Selection**: Research alternatives (see ADRs)
3. **Proof of Concept**: Validate choices work together
4. **Iteration**: Refine as we learn

### Future Evolution

- **Testing**: Add Vitest + Playwright (M2)
- **CMS**: Integrate TinaCMS (M4)
- **Deployment**: GitHub Actions + Pages (M3)
- **Monitoring**: Consider analytics (post-1.0)

---

## Related Documentation

- ADR-0001: Bun monorepo decision
- ADR-0002: TanStack Router decision
- ADR-0003: React Flow decision
- ADR-0004: MDX decision
- ADR-0005: Shadcn UI decision

---

**Last Updated**: 2025-01-01
**Review Schedule**: After each milestone or major dependency update
