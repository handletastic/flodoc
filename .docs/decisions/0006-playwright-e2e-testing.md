---
id: ADR-0006
title: Playwright for E2E Testing with Shared Monorepo Configuration
status: accepted
date: 2025-01-01
deciders: Development Team
consulted: Claude Code
informed: All Contributors
---

# Playwright for E2E Testing with Shared Monorepo Configuration

## Context and Problem Statement

Flodoc requires comprehensive end-to-end testing to ensure the application works correctly across different browsers and devices. As a monorepo that may grow to include multiple applications, we need a testing solution that:

1. Minimizes code duplication across apps
2. Provides comprehensive browser coverage
3. Supports visual regression testing
4. Integrates well with our Bun-based monorepo
5. Offers code coverage reporting
6. Scales efficiently as we add more applications

## Decision Drivers

- **Maintainability**: Shared configuration and utilities across multiple apps
- **Browser Coverage**: Support for Chromium, Firefox, Safari, and mobile viewports
- **Developer Experience**: Fast execution, good debugging tools, easy to write tests
- **Visual Testing**: Built-in screenshot comparison for React Flow visualizations
- **Code Coverage**: Integration with coverage tools for quality metrics
- **TypeScript Support**: First-class TypeScript support for type-safe tests
- **Future-Proof**: Can scale as the monorepo grows

## Considered Options

### Option 1: Playwright with Shared Configuration (Chosen)
**Approach**: Create shared `packages/playwright-config` and `packages/test-utils` for reusability

**Pros**:
- ✅ Minimal code duplication through shared packages
- ✅ Excellent cross-browser support (Chromium, Firefox, WebKit)
- ✅ Built-in visual regression testing
- ✅ Strong TypeScript support
- ✅ Active development and modern API
- ✅ Automatic browser downloads
- ✅ Parallel execution out of the box
- ✅ Great debugging tools (UI Mode, Trace Viewer)

**Cons**:
- ❌ Known compatibility issues with Bun runtime (requires Node.js)
- ❌ Heavier than some alternatives (full browser automation)
- ❌ Learning curve for advanced features

### Option 2: Cypress
**Approach**: Use Cypress with shared commands and fixtures

**Pros**:
- ✅ Excellent developer experience with real-time reload
- ✅ Time-travel debugging
- ✅ Strong community and plugin ecosystem
- ✅ Good documentation

**Cons**:
- ❌ Limited cross-browser support (no Safari on CI)
- ❌ Slower than Playwright for parallel execution
- ❌ More difficult to share configuration across monorepo apps
- ❌ No native visual regression (requires plugins)
- ❌ Heavier dependency chain

### Option 3: Vitest Browser Mode
**Approach**: Use Vitest's experimental browser mode for testing

**Pros**:
- ✅ Integrated with existing Vitest setup
- ✅ Fast execution
- ✅ Good for component testing

**Cons**:
- ❌ Still experimental (as of 2025)
- ❌ Limited E2E capabilities compared to Playwright
- ❌ Less mature ecosystem for full E2E flows
- ❌ No built-in visual regression

### Option 4: Selenium/WebDriver
**Approach**: Traditional WebDriver-based testing

**Pros**:
- ✅ Industry standard, very mature
- ✅ Extensive language support

**Cons**:
- ❌ Older API design, less modern
- ❌ Slower than Playwright
- ❌ More complex setup
- ❌ No built-in visual regression
- ❌ Harder to maintain

## Decision Outcome

**Chosen option**: **Playwright with Shared Configuration** (Option 1)

### Rationale

1. **Monorepo-Friendly Architecture**: By creating `packages/playwright-config` and `packages/test-utils`, we achieve:
   - **Zero duplication**: Base config extended by all apps
   - **Shared utilities**: Page objects, fixtures, and helpers used across apps
   - **Consistent patterns**: All apps follow the same testing structure

2. **Comprehensive Coverage**: Desktop browsers (Chrome, Firefox, Safari) + mobile viewports (Pixel 5, iPhone 12)

3. **Visual Regression Built-In**: Critical for testing React Flow visualizations and responsive layouts

4. **Code Coverage with monocart-reporter**: Full Istanbul-style coverage reports without additional tooling

5. **TypeScript-First**: Type-safe page objects and test utilities that integrate with our TypeScript codebase

### Implementation Strategy

#### Shared Packages Structure
```
packages/
├── playwright-config/
│   └── playwright.base.ts       # Base configuration
└── test-utils/
    ├── src/
    │   ├── fixtures/            # Custom fixtures
    │   ├── page-objects/        # Reusable page objects
    │   └── helpers/             # Test utilities
    └── package.json
```

#### App-Specific Configuration
```typescript
// apps/web/e2e/playwright.config.ts
import { baseConfig } from '@flodoc/playwright-config';

export default defineConfig({
  ...baseConfig,
  testDir: './tests',
  // App-specific overrides
});
```

#### Test Organization
```
apps/web/e2e/tests/
├── navigation/          # Navigation and routing tests
├── documentation/       # MDX rendering and content tests
├── flow-visualization/  # React Flow tests
└── visual/             # Visual regression tests
```

### Runtime Decision: Node.js over Bun

**Critical Finding**: Playwright has **known compatibility issues with Bun**:
- Tests can hang for ~2 minutes
- Potential segfaults and zombie processes
- Playwright is heavily dependent on Node.js internals

**Solution**: Use Node.js to execute Playwright tests while keeping Bun for development:
```json
{
  "scripts": {
    "dev": "bun run dev",
    "test:e2e": "npx playwright test"  // Uses Node.js
  }
}
```

## Consequences

### Positive Consequences

1. **✅ Scalability**: Easy to add new apps with minimal setup
2. **✅ Code Reuse**: Page objects and helpers shared across all tests
3. **✅ Consistency**: All apps follow the same testing patterns
4. **✅ Maintainability**: Single source of truth for configuration
5. **✅ Quality**: Visual regression catches UI regressions automatically
6. **✅ Coverage**: monocart-reporter provides comprehensive coverage metrics

### Negative Consequences

1. **❌ Runtime Complexity**: Must use Node.js for tests, Bun for dev
2. **❌ Initial Setup**: More complex than single-app setup
3. **❌ Learning Curve**: Team needs to learn Page Object pattern
4. **❌ Test Speed**: Full browser automation is slower than unit tests

### Mitigation Strategies

1. **For Runtime Complexity**: Clear documentation and scripts that abstract away the Node/Bun difference
2. **For Setup**: Templates and generators for new apps (future enhancement)
3. **For Learning**: Comprehensive examples and documentation in test-utils
4. **For Speed**: Parallel execution, sharding (for CI), and selective test runs

## Test Coverage Strategy

### Test Types Implemented

1. **E2E Tests** (Priority 1):
   - Navigation and routing
   - MDX document rendering
   - Document connections
   - Code highlighting

2. **Visual Regression Tests** (Priority 2):
   - Page layouts (desktop + mobile)
   - React Flow visualizations
   - Dark mode
   - Responsive breakpoints

3. **Future Considerations**:
   - Accessibility tests (@axe-core/playwright)
   - Component tests (Vitest browser mode)
   - Performance tests (Lighthouse CI)

### Code Coverage

- **Tool**: monocart-reporter
- **Target**: apps/web/src/**
- **Reports**: HTML, JSON, LCOV, text summary
- **Enabled**: On-demand via `COVERAGE=true` flag and in CI

## Browser Coverage Matrix

| Browser  | Desktop | Mobile | Notes |
|----------|---------|--------|-------|
| Chromium | ✅ | ✅ (Pixel 5) | Primary testing browser |
| Firefox  | ✅ | ❌ | Desktop coverage |
| WebKit   | ✅ | ✅ (iPhone 12) | Safari simulation |

## Links and References

- [Playwright Documentation](https://playwright.dev)
- [Playwright Monorepo Best Practices](https://playwright.dev/docs/test-projects)
- [monocart-reporter](https://github.com/cenfun/monocart-reporter)
- [Bun + Playwright Compatibility Issue](https://github.com/microsoft/playwright/issues/27139)

## Related Decisions

- ADR-0001: Bun Monorepo Structure (testing integration)
- ADR-0002: TanStack Router (routing tests)
- ADR-0003: React Flow (visualization tests)
- ADR-0004: MDX (content rendering tests)

## Notes

- Tests are organized by feature, not by type (better maintainability)
- Visual regression baselines should be reviewed before committing
- Some flow visualization tests are marked `.skip()` until routes are implemented
- CI/CD setup (GitHub Actions) deferred to future iteration
