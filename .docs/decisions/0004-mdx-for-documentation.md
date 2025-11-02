---
id: ADR-0004
title: Use MDX for documentation with remark/rehype plugins
date: 2025-01-01
status: accepted
deciders: [Development Team]
consulted: []
informed: [All Contributors]
---

# ADR-0004: Use MDX for Documentation

## Status

Accepted

## Context

Flodoc needs a documentation format that:
- Is human-readable and git-friendly
- Supports rich content beyond plain text
- Allows embedding interactive components
- Has frontmatter for metadata (title, tags, connections)
- Supports standard markdown features (tables, code blocks, etc.)
- Can be processed and rendered in React
- Enables content authors without React knowledge to write docs

## Decision Drivers

- Content authoring experience
- Component embedding capabilities
- Git-friendliness (plain text, diffable)
- Ecosystem and tooling
- Processing flexibility (remark/rehype plugins)
- React integration
- TypeScript support

## Considered Options

### Option 1: MDX with remark/rehype ecosystem

**Description**: Markdown with JSX support, processed with remark (Markdown) and rehype (HTML) plugins

**Pros**:
- Full Markdown support (GitHub Flavored Markdown)
- Embed React components directly
- Frontmatter support (YAML metadata)
- Extensive plugin ecosystem (syntax highlighting, TOC, etc.)
- Git-friendly plain text format
- Standard in React community
- TypeScript support
- Can use gray-matter for frontmatter parsing
- Vite integration available

**Cons**:
- Build complexity (needs compilation)
- Component imports can be confusing for non-devs
- TypeScript types for MDX content require setup
- Runtime overhead for dynamic content

**Effort**: Medium - setup and configuration needed

### Option 2: Plain Markdown with React renderer

**Description**: Pure Markdown parsed with react-markdown or similar

**Pros**:
- Simple and familiar format
- No compilation needed
- Lighter weight
- Easy for non-developers
- Many parsing libraries available

**Cons**:
- Cannot embed React components
- Limited interactivity
- Custom component mapping is hacky
- Less flexible for rich content
- Would need separate system for interactive examples

**Effort**: Low - simple to set up

### Option 3: Custom JSON/YAML format

**Description**: Structured data format with custom renderer

**Pros**:
- Fully structured and parseable
- Easy to validate
- Type-safe schemas
- Flexible rendering

**Cons**:
- Not human-friendly to write
- Poor git diffs
- No standard tooling
- High authoring friction
- Would need custom editor

**Effort**: Very High - build entire system

### Option 4: Notion API or Headless CMS

**Description**: Use external CMS for content storage

**Pros**:
- Rich editing UI
- Collaboration features
- Asset management
- Version control in platform

**Cons**:
- Violates offline-first requirement
- Vendor lock-in
- Network dependency
- Conflicts with git-driven approach
- Additional complexity and cost
- Not file-based

**Effort**: High - integration and setup

## Decision

**Chosen**: Option 1 - MDX with remark/rehype plugins

**Rationale**:

MDX is the ideal choice for Flodoc's requirements:

1. **Best of Both Worlds**: Plain Markdown for simple content + React components for rich interactions
2. **Git-Driven**: Plain text files in `content/docs/` directory
3. **Frontmatter**: YAML metadata for document properties and connections
4. **Extensibility**: Vast plugin ecosystem for features like:
   - GitHub Flavored Markdown (tables, task lists, strikethrough)
   - Syntax highlighting with rehype-pretty-code
   - Automatic heading IDs
   - Table of contents generation
5. **Offline-First**: All content local, no network dependencies
6. **React Integration**: Native support for embedding components
7. **Community Standard**: Wide adoption in React documentation sites

Plugin Configuration:
- `remark-gfm`: GitHub Flavored Markdown features
- `remark-frontmatter`: Parse YAML frontmatter
- `rehype-pretty-code`: Beautiful code syntax highlighting
- `gray-matter`: Extract frontmatter for metadata processing

## Consequences

### Positive

- Authors can write plain Markdown for most content
- Can embed interactive examples and custom components
- Excellent syntax highlighting out of the box
- Git-friendly with meaningful diffs
- Frontmatter enables document metadata and connections
- Standard approach familiar to React developers
- Extensive customization through plugins

### Negative

- Requires build step (compile MDX to JSX)
- Component imports may confuse non-developer contributors
- Need to document which components are available
- Type safety for MDX content requires additional setup
- Runtime overhead for component rendering

### Neutral

- Need to create component library for common patterns
- Should provide templates/examples for authors
- May need custom editor integration (VS Code extension)

## Action Items

- [x] Install MDX packages (@mdx-js/rollup)
- [x] Configure Vite with MDX plugin
- [x] Add remark-gfm, remark-frontmatter plugins
- [x] Add rehype-pretty-code for syntax highlighting
- [x] Install gray-matter for frontmatter parsing
- [x] Create sample MDX files in content/docs
- [ ] Create MDX component provider
- [ ] Document available components for authors
- [ ] Set up TypeScript types for frontmatter schema
- [ ] Create authoring guide for contributors

## Follow-up

- Create reusable component library for common patterns
- Evaluate editor extensions for MDX
- Consider adding more rehype/remark plugins as needed
- Monitor MDX v3 updates and features

## Related Decisions

- ADR-0001: Bun monorepo (MDX files in content/ directory)
- ADR-0003: React Flow (visualizing connections from frontmatter)
- Related to TinaCMS integration (future decision)

## References

- [MDX Documentation](https://mdxjs.com)
- [remark plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md)
- [rehype plugins](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md)
- [gray-matter](https://github.com/jonschlinkert/gray-matter)

---

**Notes**:
- User explicitly requested MDX for rich documentation
- Frontmatter crucial for document connections feature
- Component embedding enables interactive examples
