---
id: ADR-0005
title: Use Shadcn UI with Tailwind CSS for component library
date: 2025-01-01
status: accepted
deciders: [Development Team]
consulted: []
informed: [All Contributors]
---

# ADR-0005: Use Shadcn UI with Tailwind CSS

## Status

Accepted

## Context

Flodoc needs a UI component library that:
- Provides high-quality, accessible components
- Supports dark mode natively
- Is customizable to match brand
- Works well with TypeScript
- Has good documentation
- Doesn't add excessive bundle size
- Allows for component-level customization
- Supports modern design patterns

## Decision Drivers

- Component quality and accessibility
- Customization flexibility
- Bundle size impact
- Developer experience
- Dark mode support
- TypeScript integration
- Maintenance burden
- Styling approach

## Considered Options

### Option 1: Shadcn UI + Tailwind CSS

**Description**: Copy-paste component library built on Radix UI primitives with Tailwind CSS styling

**Pros**:
- **No bundle bloat**: Components copied to your codebase (only what you use)
- **Full customization**: Owns the code, can modify freely
- **Accessibility**: Built on Radix UI primitives (WAI-ARIA compliant)
- **Tailwind integration**: Uses utility-first CSS
- **Dark mode**: Built-in with CSS variables
- **TypeScript**: Full TypeScript support
- **Modern design**: Beautiful, modern components
- **Active development**: Frequent updates and new components
- **No vendor lock-in**: Code lives in your repo

**Cons**:
- Manual updates (copy components again for updates)
- Need to maintain component code
- Requires Tailwind CSS (couples decisions)
- Initial setup takes time

**Effort**: Medium - setup Tailwind + copy components

### Option 2: Material-UI (MUI)

**Description**: Comprehensive React component library implementing Material Design

**Pros**:
- Complete component set
- Mature and battle-tested
- Large community
- Good documentation
- Strong accessibility
- Active development

**Cons**:
- Large bundle size (even with tree-shaking)
- Material Design aesthetic (opinionated)
- Harder to customize deeply
- CSS-in-JS dependency
- More dependencies to manage
- Can feel heavy for simple apps

**Effort**: Low - npm install and use

### Option 3: Chakra UI

**Description**: Simple, modular component library with built-in dark mode

**Pros**:
- Excellent dark mode support
- Good accessibility
- Styled-system API
- TypeScript support
- Good documentation
- Smaller than MUI

**Cons**:
- Opinionated styling approach
- CSS-in-JS (runtime overhead)
- Less customizable than Shadcn
- Growing but smaller ecosystem
- Component ownership is external

**Effort**: Low - npm install and use

### Option 4: Headless UI + Custom Styling

**Description**: Unstyled, accessible components from Tailwind team

**Pros**:
- Complete control over styling
- Accessibility built-in
- Small bundle size
- Tailwind team quality
- No design opinions

**Cons**:
- Must build all styling from scratch
- Time-consuming
- No pre-built complex components
- Higher maintenance burden

**Effort**: Very High - build everything

### Option 5: Ant Design

**Description**: Enterprise-grade component library

**Pros**:
- Comprehensive components
- Good for admin interfaces
- Strong internationalization
- Active development

**Cons**:
- Opinionated design system
- Large bundle size
- Harder to customize
- Less modern aesthetic
- Chinese company (potential concerns)

**Effort**: Low - npm install and use

## Decision

**Chosen**: Option 1 - Shadcn UI + Tailwind CSS

**Rationale**:

Shadcn UI provides the best balance for Flodoc:

1. **Ownership**: Components live in our codebase - full control
2. **Quality**: Built on Radix UI (excellent accessibility)
3. **Performance**: Only include components we use, no bundle bloat
4. **Customization**: Tailwind utilities + component code ownership = maximum flexibility
5. **Dark Mode**: First-class support with CSS variables
6. **Modern**: Beautiful, clean design that matches modern web standards
7. **DX**: Excellent TypeScript support, well-documented
8. **Alignment**: Tailwind CSS matches utility-first approach

The copy-paste approach is actually an advantage:
- No surprise breaking changes from library updates
- Customize components without fighting abstractions
- Learn component internals by owning the code
- No vendor lock-in

Tailwind CSS coupling is acceptable because:
- Tailwind is industry standard
- Utility-first CSS is productive
- Excellent IDE support
- Small learning curve
- Great performance with JIT mode

## Consequences

### Positive

- Complete control over component behavior
- Can customize any aspect without hacks
- Excellent dark mode support
- No external dependency updates breaking components
- Accessibility built-in (Radix UI)
- Beautiful, modern UI
- Small bundle size (only used components)

### Negative

- Must manually update components (copy new versions)
- Need to learn Tailwind CSS if unfamiliar
- Component code lives in repo (more code to maintain)
- Must set up Tailwind configuration

### Neutral

- Need `components.json` configuration file
- CSS variables for theming (learning curve)
- Component library grows in `apps/web/src/components`

## Action Items

- [x] Install Tailwind CSS and dependencies
- [x] Create `tailwind.config.js`
- [x] Set up `components.json` for Shadcn
- [x] Configure CSS variables in `index.css`
- [x] Create utility function `cn()` for className merging
- [ ] Install initial components (Button, Card, Dialog, etc.)
- [ ] Create dark mode toggle component
- [ ] Document component customization process
- [ ] Set up component library in `packages/ui` if needed

## Follow-up

- Monitor Shadcn UI updates for new components
- Establish process for updating components
- Consider moving components to `packages/ui` for sharing
- Document custom components built on Shadcn
- Create design tokens/theme documentation

## Related Decisions

- ADR-0001: Bun monorepo (components in apps/web or packages/ui)
- ADR-0002: TanStack Router (navigation components)

## References

- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Class Variance Authority](https://cva.style) (used by Shadcn)

---

**Notes**:
- User specifically requested Shadcn UI
- Dark mode is a requirement
- Copy-paste approach preferred for maximum control
