---
updated: 2025-01-01
---

# Completed Features

Features that have been implemented and shipped.

## ✅ F-001: Initial Project Setup and Infrastructure

**Status**: Completed
**Completed**: 2025-01-01
**Priority**: Critical
**Effort**: Large

### Summary

Set up the foundational project structure, development environment, and core dependencies for Flodoc.

### Deliverables

- [x] Bun monorepo workspace structure
- [x] Vite + React + TypeScript application
- [x] TanStack Router with file-based routing
- [x] MDX support with remark/rehype plugins
- [x] Tailwind CSS + Shadcn UI configuration
- [x] Path aliases and TypeScript configuration
- [x] Sample MDX documentation files
- [x] Development server running successfully

### Related Documentation

- ADR-0001: Bun monorepo
- ADR-0002: TanStack Router
- ADR-0003: React Flow
- ADR-0004: MDX
- ADR-0005: Shadcn UI

---

## ✅ F-018: E2E Testing Suite with Playwright

**Status**: Completed
**Completed**: 2025-01-01
**Priority**: High
**Effort**: Large

### Summary

Implemented comprehensive end-to-end testing infrastructure using Playwright with shared monorepo configuration, visual regression testing, and code coverage reporting.

### Deliverables

- [x] Shared `packages/playwright-config` base configuration
- [x] Shared `packages/test-utils` with fixtures, page objects, and helpers
- [x] Navigation and routing E2E tests
- [x] MDX document rendering tests
- [x] Document connections tests
- [x] Code highlighting tests
- [x] React Flow visualization tests (skeleton, marked .skip())
- [x] Visual regression test suite with responsive breakpoints
- [x] monocart-reporter integration for code coverage
- [x] Cross-browser testing (Chromium, Firefox, WebKit)
- [x] Mobile viewport testing (Pixel 5, iPhone 12)
- [x] Test scripts in package.json (e2e, ui, headed, coverage, update-snapshots)

### Test Coverage

- **E2E Tests**: 15+ tests covering navigation, MDX rendering, and document connections
- **Visual Regression**: 10+ screenshot tests for layouts and responsive design
- **Browser Coverage**: Desktop (Chrome, Firefox, Safari) + Mobile viewports
- **Code Coverage**: Integrated with monocart-reporter for full Istanbul reports

### Related Documentation

- ADR-0006: Playwright E2E Testing
- `.docs/workflows/testing-workflow.md` (created)
- Package READMEs with test instructions

### Technical Highlights

- **Zero duplication**: Shared base config extended by all apps
- **Page Object Model**: Reusable page objects for maintainable tests
- **Custom Fixtures**: DocumentPage, FlowPage, NavigationPage
- **Helper Utilities**: RouterHelpers, MDXHelpers, FlowHelpers
- **Node.js runtime**: Uses Node.js for Playwright (Bun compatibility issues)

---

## Statistics

- **Total Completed**: 2
- **Last Updated**: 2025-01-01
