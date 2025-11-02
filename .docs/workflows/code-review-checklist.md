# Code Review Checklist

Use this checklist when reviewing pull requests for Flodoc.

## 📋 General

- [ ] PR has clear title and description
- [ ] PR is linked to relevant issue or feature spec
- [ ] Changes align with feature spec acceptance criteria
- [ ] Commit messages follow conventional commits format
- [ ] No unnecessary files included (logs, IDE config, etc.)

## 🎯 Code Quality

- [ ] Code follows project patterns and conventions
- [ ] No code duplication (DRY principle)
- [ ] Functions/components have single responsibility
- [ ] Complex logic has explanatory comments
- [ ] No commented-out code or TODO comments without issues
- [ ] No console.log statements in production code

## 📘 TypeScript

- [ ] All code is properly typed (no `any` without justification)
- [ ] Types are imported from `@flodoc/types` if shared
- [ ] No TypeScript errors (`bun run typecheck` passes)
- [ ] Generic types used appropriately
- [ ] Type inference used where possible (not over-typed)

## ⚛️ React

- [ ] Components are functional (not class-based)
- [ ] Hooks are used correctly (rules of hooks followed)
- [ ] No unnecessary re-renders (proper memoization)
- [ ] Props are properly typed
- [ ] Component names are descriptive and PascalCase

## 🎨 Styling

- [ ] Uses Tailwind utilities (no inline styles)
- [ ] Uses `cn()` helper for conditional classes
- [ ] Follows Shadcn UI patterns for components
- [ ] Responsive design considered (mobile, tablet, desktop)
- [ ] Dark mode works correctly
- [ ] No magic numbers (uses theme variables)

## 🔍 Routing & Navigation

- [ ] Routes follow TanStack Router conventions
- [ ] Route parameters are typed
- [ ] Navigation uses `<Link>` components
- [ ] Loading states handled
- [ ] Error states handled

## 📝 MDX & Content

- [ ] MDX frontmatter schema is correct
- [ ] Document connections are valid
- [ ] Code blocks have language specified
- [ ] Images have alt text
- [ ] Links are valid

## ♿ Accessibility

- [ ] Semantic HTML used appropriately
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader compatible

## ⚡ Performance

- [ ] No unnecessary API calls or data fetching
- [ ] Large lists use virtualization if needed
- [ ] Images are optimized
- [ ] Code splitting used for large features
- [ ] No performance regressions (check bundle size)

## 🔒 Security

- [ ] No hardcoded secrets or API keys
- [ ] User input is sanitized
- [ ] No XSS vulnerabilities
- [ ] Dependencies don't have known vulnerabilities
- [ ] No eval() or dangerous patterns

## 🧪 Testing

- [ ] New features have tests (when testing is set up)
- [ ] Existing tests still pass
- [ ] Edge cases are considered
- [ ] Error handling is tested

## 📚 Documentation

- [ ] CLAUDE.md updated if architecture changed
- [ ] Feature spec updated with actual implementation
- [ ] Complex features have code comments
- [ ] Breaking changes documented
- [ ] Migration guide if needed

## 🚀 Build & Deploy

- [ ] Code builds successfully (`bun run build`)
- [ ] Type checking passes (`bun run typecheck`)
- [ ] Linting passes (`bun run lint`)
- [ ] No warnings in build output
- [ ] Bundle size is reasonable

## 🔄 Git & Version Control

- [ ] Branch is up-to-date with main
- [ ] No merge conflicts
- [ ] Commits are logical and focused
- [ ] No sensitive information in git history

---

## Severity Levels

Use these labels when leaving review comments:

**🔴 Blocking**: Must be fixed before merge
- Security vulnerabilities
- Type errors
- Breaking changes without migration
- Accessibility violations

**🟡 Important**: Should be fixed before merge
- Code quality issues
- Performance problems
- Missing error handling
- Documentation gaps

**🟢 Suggestion**: Nice to have, not blocking
- Code style preferences
- Naming improvements
- Optimization opportunities
- Refactoring ideas

**💡 Question**: Needs clarification
- Unclear intent
- Alternative approaches
- Design decisions

---

## Review Response Templates

### Approve
```
✅ LGTM!

Changes look good. Tested locally and everything works as expected.

Key points:
- Feature works as specified
- Code quality is good
- Tests pass
- No concerns
```

### Request Changes
```
📝 Changes Requested

Overall approach looks good, but found a few issues that need addressing:

🔴 Blocking:
- [Issue 1]

🟡 Important:
- [Issue 2]

🟢 Suggestions:
- [Issue 3]

Let me know if you have questions!
```

### Ask Questions
```
💡 Questions

Code looks reasonable, but I have a few questions before approving:

1. [Question 1]
2. [Question 2]

Once these are clarified, should be good to merge.
```

---

## Self-Review Before Requesting Review

Before requesting review, check:

1. Review your own changes in GitHub
2. Run all checks locally
3. Test the feature yourself
4. Check against this checklist
5. Write a good PR description
6. Link to relevant issues/specs

---

**Last Updated**: 2025-01-01
