# Development Workflow

Standard development processes for Flodoc.

## Daily Development Cycle

### 1. Starting Work

```bash
# Update repository
git pull origin main

# Install any new dependencies
bun install

# Start development server
bun run dev

# Open http://localhost:5173
```

### 2. Creating a Feature

**Step 1: Plan**
- Review existing ADRs and architecture docs
- Check `.docs/features/backlog.md` for feature spec
- If no spec exists, create one using `feature-template.md`
- Discuss approach in GitHub issue if needed

**Step 2: Branch**
```bash
# Create feature branch
git checkout -b feature/your-feature-name
```

**Step 3: Implement**
- Write code following project patterns
- Use TypeScript strictly
- Follow Tailwind/Shadcn patterns for UI
- Add types to `packages/types` if shared
- Use path aliases (`@/`, `@flodoc/`)

**Step 4: Test**
- Test manually in browser
- Run type checking: `bun run typecheck`
- Run linting: `bun run lint`
- (Future) Run unit tests: `bun test`

**Step 5: Document**
- Update CLAUDE.md if architectural changes
- Update feature status in `.docs/features/`
- Add comments for complex logic
- Update changelog if significant

**Step 6: Commit**
```bash
# Stage changes
git add .

# Commit with conventional commits format
git commit -m "feat: add dark mode toggle

- Implement theme context with persistence
- Add toggle button in header
- Support system preference detection

Closes #123"
```

**Conventional Commit Types**:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style (formatting, no logic change)
- `refactor:` - Code restructuring
- `perf:` - Performance improvement
- `test:` - Adding tests
- `chore:` - Maintenance (deps, config)

**Step 7: Push & PR**
```bash
# Push branch
git push origin feature/your-feature-name

# Create PR via GitHub UI or CLI
gh pr create --title "Add dark mode" --body "See feature spec F-005"
```

### 3. Code Review Process

**For PR Author**:
- Ensure CI passes
- Self-review changes in GitHub
- Respond to review comments
- Update based on feedback

**For Reviewer**:
- Check against `.docs/workflows/code-review-checklist.md`
- Verify feature spec acceptance criteria met
- Test locally if significant changes
- Approve when ready

### 4. Merging

```bash
# After approval, squash and merge
# Use PR title as commit message
# Delete branch after merge
```

### 5. Post-Merge

- Move feature from `in-progress.md` to `completed.md`
- Update `changelog.md`
- Close related issues
- Deploy (automatic via GitHub Actions when set up)

---

## File Organization

### Where to Put New Code

**React Components**
- App-specific: `apps/web/src/components/`
- Shared/reusable: `packages/ui/src/`
- Routes: `apps/web/src/routes/`

**TypeScript Types**
- App-specific: `apps/web/src/types/`
- Shared: `packages/types/src/`

**Utilities**
- App-specific: `apps/web/src/lib/`
- Shared: Create `packages/utils/` if needed

**MDX Content**
- All documentation: `content/docs/`
- Images/assets: `apps/web/public/`

**Configuration**
- Vite: `apps/web/vite.config.ts`
- TypeScript: `apps/web/tsconfig.app.json`
- Tailwind: `apps/web/tailwind.config.js`

---

## Coding Standards

### TypeScript

```typescript
// ✅ Do: Use strict types
interface DocumentProps {
  frontmatter: DocumentFrontmatter
  content: string
}

// ❌ Don't: Use any
const data: any = ...
```

### React Components

```typescript
// ✅ Do: Use function components with TypeScript
export function DocumentCard({ document }: { document: Document }) {
  return <div>...</div>
}

// ❌ Don't: Use class components or implicit any
export function DocumentCard({ document }) { // Type missing!
```

### Styling

```typescript
// ✅ Do: Use Tailwind utilities
<div className="flex items-center gap-4 p-4">

// ✅ Do: Use cn() for conditional classes
<div className={cn("base-class", isActive && "active-class")}>

// ❌ Don't: Inline styles
<div style={{ display: 'flex' }}>
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `DocumentCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `parseDocument.ts`)
- Hooks: `use*.ts` (e.g., `useDocuments.ts`)
- Types: `*.types.ts` or in `types/` directory
- Routes: `kebab-case.tsx` (e.g., `docs/$slug.tsx`)

---

## Common Tasks

### Adding a New Route

1. Create file in `apps/web/src/routes/`
2. Use TanStack Router conventions
3. Route tree auto-generates on save

Example:
```typescript
// apps/web/src/routes/docs/$slug.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/docs/$slug')({
  component: DocumentPage,
})

function DocumentPage() {
  const { slug } = Route.useParams()
  return <div>Document: {slug}</div>
}
```

### Adding a Shadcn Component

```bash
# Not yet implemented - manual copy for now
# 1. Go to https://ui.shadcn.com
# 2. Find component (e.g., Button)
# 3. Copy code to apps/web/src/components/ui/
# 4. Import and use
```

### Adding MDX Content

1. Create `content/docs/your-doc.mdx`
2. Add frontmatter:
```yaml
---
title: Your Doc
description: Brief description
slug: your-doc
tags: [tag1, tag2]
connections:
  - type: next
    target: next-doc
---
```
3. Write content
4. Test at `/docs/your-doc` (when feature is built)

### Updating Dependencies

```bash
# Check for updates
bun update --latest

# Or update specific package
bun update package-name

# Always test after updating!
bun run dev
bun run typecheck
```

---

## Troubleshooting

### Dev Server Won't Start

```bash
# Clear cache and reinstall
rm -rf node_modules bun.lockb
bun install
bun run dev
```

### Type Errors

```bash
# Check TypeScript errors
bun run typecheck

# If route tree is stale
rm apps/web/src/routeTree.gen.ts
bun run dev  # Will regenerate
```

### Build Fails

```bash
# Try clean build
bun run clean
bun install
bun run build
```

---

## Best Practices

### Performance

- Use React.memo for expensive components
- Lazy load routes with React.lazy
- Optimize images (use WebP, proper sizing)
- Monitor bundle size
- Use code splitting for large features

### Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios

### Git Practices

- Commit frequently with meaningful messages
- Keep commits focused (one concern per commit)
- Write descriptive PR descriptions
- Link to issues and feature specs
- Squash WIP commits before merging

### Documentation

- Document complex logic with comments
- Update ADRs for significant decisions
- Keep CLAUDE.md current
- Add JSDoc for public APIs
- Update user docs when adding features

---

## Getting Help

1. Check `.docs/` for relevant documentation
2. Review existing code for patterns
3. Check ADRs for why things are done a certain way
4. Ask in GitHub Discussions
5. Create issue for bugs or unclear documentation

---

**Last Updated**: 2025-01-01
