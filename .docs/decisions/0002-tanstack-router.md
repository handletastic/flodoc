---
id: ADR-0002
title: Use TanStack Router for routing with file-based routes
date: 2025-01-01
status: accepted
deciders: [Development Team]
consulted: []
informed: [All Contributors]
---

# ADR-0002: Use TanStack Router for Routing

## Status

Accepted

## Context

Flodoc needs a routing solution that supports:
- File-based routing for developer experience
- Type-safe route parameters and search params
- Code splitting and lazy loading
- Data loading and caching integration
- Nested layouts
- Full TypeScript support

The application will have:
- Main documentation viewer routes
- Flow graph visualization routes
- Potentially an admin/editing interface (TinaCMS)
- Dynamic routes for MDX documents

## Decision Drivers

- Type safety for routes and parameters
- Developer experience and productivity
- Integration with TanStack Query
- Performance (code splitting, prefetching)
- Modern routing patterns
- Ecosystem compatibility

## Considered Options

### Option 1: TanStack Router

**Description**: Modern, type-safe router with file-based routing and automatic route tree generation

**Pros**:
- Full TypeScript support with automatic type generation
- File-based routing (similar to Next.js)
- Seamless integration with TanStack Query
- Built-in data loading patterns
- Search param handling with type safety
- Automatic code splitting
- Active development and modern features
- Part of TanStack ecosystem (Query, Table, Form)

**Cons**:
- Newer library (less battle-tested than React Router)
- Smaller community
- Learning curve for file-based conventions
- Documentation still evolving
- May have breaking changes as it matures

**Effort**: Medium - new patterns to learn

### Option 2: React Router v6

**Description**: Industry-standard React routing library

**Pros**:
- Mature and widely adopted
- Large community and resources
- Stable API
- Extensive documentation
- Battle-tested in production
- Wide ecosystem support

**Cons**:
- No built-in file-based routing
- Less TypeScript support (requires manual typing)
- Data loading patterns less integrated
- More boilerplate for type-safe routes
- Search params handling less ergonomic

**Effort**: Low - familiar to most developers

### Option 3: Next.js App Router (Framework)

**Description**: Use Next.js framework instead of Vite + React

**Pros**:
- File-based routing built-in
- Server components and SSR
- Excellent DX and tooling
- Large ecosystem
- Automatic code splitting

**Cons**:
- Framework lock-in (full Next.js adoption required)
- Heavier than needed for this use case
- Would replace Vite build system
- Server-side complexity not needed
- Conflicts with offline-first, git-driven goals
- TinaCMS client-side editing more complex with SSR

**Effort**: High - complete architecture change

### Option 4: Wouter

**Description**: Minimalist React router

**Pros**:
- Tiny bundle size (~1.5KB)
- Simple API
- Good performance
- TypeScript support

**Cons**:
- Manual route configuration
- No built-in data loading
- No file-based routing
- Limited features for complex apps
- Manual code splitting setup

**Effort**: Low - simple to set up

## Decision

**Chosen**: Option 1 - TanStack Router

**Rationale**:

TanStack Router aligns perfectly with project goals and tech stack:

1. **Type Safety**: Automatic route type generation prevents routing errors and improves DX
2. **Ecosystem Integration**: Works seamlessly with TanStack Query for data fetching
3. **File-Based Routing**: Reduces boilerplate and matches modern patterns (Next.js, SvelteKit)
4. **Future-Proof**: Active development with modern features being added
5. **Performance**: Built-in code splitting and lazy loading
6. **Consistency**: Part of the TanStack ecosystem we're already committed to

The decision to use the entire TanStack suite (Router, Query, Table, Form) provides:
- Consistent API patterns across tools
- Better integration between components
- Unified TypeScript experience
- Single ecosystem to learn and maintain

## Consequences

### Positive

- Automatic route tree generation saves development time
- Type-safe routing prevents common errors
- Excellent integration with TanStack Query for data loading
- Modern DX with file-based routing
- Less boilerplate compared to manual routing

### Negative

- Requires learning TanStack Router patterns
- Smaller community for troubleshooting
- Potential breaking changes as library evolves
- Contributors need to understand file-based conventions
- Route tree generation adds a build step

### Neutral

- Generated route tree file (`routeTree.gen.ts`) needs gitignore
- CI/CD needs to generate routes during build
- Documentation must explain file-based routing structure

## Action Items

- [x] Install TanStack Router packages
- [x] Configure Vite plugin for route generation
- [x] Create `__root.tsx` and initial routes
- [x] Set up route tree generation
- [x] Add TypeScript configuration for route types
- [ ] Document routing patterns in CLAUDE.md
- [ ] Create examples of common routing scenarios
- [ ] Add route generation to CI/CD build step

## Follow-up

- Monitor for breaking changes in TanStack Router updates
- Evaluate developer experience after implementing several routes
- Document any patterns or workarounds needed
- Consider fallback to React Router if serious issues arise (low probability)

## Related Decisions

- ADR-0001: Bun monorepo (TanStack Router works well with Bun)
- Related to future data loading decisions (will use TanStack Query)

## References

- [TanStack Router Documentation](https://tanstack.com/router)
- [File-Based Routing Guide](https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing)
- [Type Safety in TanStack Router](https://tanstack.com/router/latest/docs/framework/react/guide/type-safety)

---

**Notes**:
- User requested TanStack suite including Router
- File-based routing provides better DX for document-heavy application
- Integration with TanStack Query critical for MDX content loading
