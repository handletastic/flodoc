---
id: ADR-0001
title: Use Bun with monorepo workspace structure
date: 2025-01-01
status: accepted
deciders: [Development Team]
consulted: []
informed: [All Contributors]
---

# ADR-0001: Use Bun with Monorepo Workspace Structure

## Status

Accepted

## Context

Flodoc requires a modern development setup that supports:
- Fast dependency installation and script execution
- Shared code between packages (UI components, types, utilities)
- Clear separation between application code and content
- TypeScript-first development
- Ability to scale as the project grows

The project structure needs to support:
- Main web application (`apps/web`)
- Shared UI component library
- Shared TypeScript types
- MDX content that's separate from code
- Potential future packages (CLI tools, plugins, etc.)

## Decision Drivers

- Development speed and iteration time
- TypeScript ecosystem compatibility
- Modern JavaScript runtime features
- Package management simplicity
- Monorepo support without additional tooling
- Long-term maintainability

## Considered Options

### Option 1: Bun with Bun Workspaces

**Description**: Use Bun as both runtime and package manager with built-in workspace support

**Pros**:
- Extremely fast dependency installation (10-100x faster than npm)
- Built-in TypeScript support (no transpilation config needed)
- Native workspace support (no lerna/nx required)
- Modern JavaScript runtime with Node.js compatibility
- Single tool for package management and script running
- Growing ecosystem and active development

**Cons**:
- Relatively new (less mature than npm/pnpm)
- Smaller community compared to Node.js
- Some packages may have compatibility issues
- Less proven in production environments
- Documentation still evolving

**Effort**: Low - straightforward setup

### Option 2: pnpm with Workspaces

**Description**: Use pnpm for efficient package management with workspace protocol

**Pros**:
- Fast and disk-space efficient
- Excellent monorepo support
- Large community and mature tooling
- Strict dependency management
- Well-documented best practices

**Cons**:
- Requires Node.js runtime
- Additional tooling for TypeScript execution (ts-node, tsx)
- More complex setup for monorepos
- Requires understanding of pnpm-specific concepts

**Effort**: Medium - more configuration needed

### Option 3: npm Workspaces

**Description**: Use native npm workspaces introduced in npm 7+

**Pros**:
- Built into npm, no additional tools
- Wide compatibility
- Familiar to most developers
- Stable and well-supported

**Cons**:
- Slower than alternatives
- Less sophisticated workspace features
- Requires Node.js runtime
- Additional tooling for TypeScript

**Effort**: Low - standard setup

### Option 4: Yarn Workspaces

**Description**: Use Yarn v3+ (Berry) with workspaces

**Pros**:
- Mature monorepo support
- Plug'n'Play mode for faster installs
- Good tooling and plugins
- Active development

**Cons**:
- PnP mode can cause compatibility issues
- Requires Node.js runtime
- Additional tooling for TypeScript
- Migration path from Yarn Classic can be complex

**Effort**: Medium - learning curve for Yarn Berry

## Decision

**Chosen**: Option 1 - Bun with Bun Workspaces

**Rationale**:

Bun provides the best developer experience for this TypeScript-first project:

1. **Speed**: Dependency installation is dramatically faster, improving developer productivity
2. **Simplicity**: Single tool for package management, script running, and TypeScript execution
3. **Native TypeScript**: No build step required for development
4. **Workspace Support**: Built-in monorepo capabilities without additional tools
5. **Modern Features**: Native support for modern JavaScript/TypeScript features
6. **Project Fit**: Aligns with project goals of being modern, fast, and TypeScript-focused

While Bun is newer, its benefits outweigh the risks for this project:
- It's a greenfield project (no migration concerns)
- The project is relatively small (manageable if migration needed later)
- Community and stability are improving rapidly
- Fallback to Node.js is straightforward if needed

## Consequences

### Positive

- Extremely fast development feedback loops
- Simplified tooling configuration
- Better TypeScript developer experience
- Future-proof technology choice
- Reduced dependencies in `devDependencies`

### Negative

- Potential compatibility issues with some npm packages
- Smaller community for troubleshooting
- May need to document Bun-specific patterns for contributors
- CI/CD systems need Bun installation support

### Neutral

- Team needs to learn Bun-specific commands
- Need to monitor Bun's evolution and stability
- May need occasional workarounds for package compatibility

## Action Items

- [x] Create root `package.json` with workspaces configuration
- [x] Set up monorepo structure (`apps/*`, `packages/*`)
- [x] Configure VS Code or IDE for Bun
- [x] Document Bun installation in README
- [ ] Add Bun to CI/CD pipeline
- [ ] Create contribution guide mentioning Bun

## Follow-up

- Monitor Bun compatibility with critical dependencies
- Evaluate stability after 3 months of development
- Document any workarounds needed
- Consider migration path if Bun proves problematic (fallback to pnpm)

## Related Decisions

- None (first decision)

## References

- [Bun Official Website](https://bun.sh)
- [Bun Workspaces Documentation](https://bun.sh/docs/install/workspaces)
- [Bun vs Node.js Performance](https://bun.sh/docs/benchmarks)

---

**Notes**:
- Decision made during initial project setup
- No existing codebase to migrate
- User explicitly requested Bun via Homebrew installation
