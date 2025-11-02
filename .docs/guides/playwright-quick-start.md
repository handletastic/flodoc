# Playwright Quick Start Guide

## 🎯 Your Most Common Commands

```bash
# 1. Interactive UI Mode (BEST for development)
bun run test:e2e:ui

# 2. Run all tests (headless)
bun run test:e2e

# 3. Run with coverage
bun run test:e2e:coverage

# 4. View HTML report after tests
bun run test:e2e:report

# 5. Run specific test file
cd apps/web/e2e
npx playwright test tests/navigation/routing.spec.ts
```

## 📊 Viewing Test Results

### Method 1: HTML Report (After Running Tests)

```bash
bun run test:e2e:report
# Opens: apps/web/e2e/playwright-report/index.html
```

**Shows:**

- ✅ Pass/fail for every test
- ⏱️ Duration
- 🖼️ Screenshots
- 🎬 Videos (on failure)
- 📋 Clickable traces

### Method 2: Trace Viewer (Time-Travel Debugging)

```bash
# Find trace files
ls apps/web/e2e/test-results/**/trace.zip

# View a trace
npx playwright show-trace apps/web/e2e/test-results/path-to-trace/trace.zip
```

**Trace Viewer Features:**

- 🕰️ **Time-travel** through test execution
- 📸 Screenshot at every step
- 🌐 Network requests
- 💬 Console logs
- 🔍 DOM snapshots
- 🎯 Locator picker tool

**Pro Tip:** Traces open at https://trace.playwright.dev - everything runs in your browser, no data leaves your machine!

### Method 3: UI Mode (RECOMMENDED for Development)

```bash
bun run test:e2e:ui
```

**Why UI Mode is Amazing:**

- ⚡ **Watch mode**: Auto-reruns tests when you save files
- 🎯 **Locator picker**: Click elements to generate selectors
- 🐛 **Built-in debugging**: Step through tests
- 📊 **Live results**: See tests pass/fail in real-time
- 🔄 **Re-run single tests**: Click any test to run it

### Method 4: Coverage Reports

```bash
bun run test:e2e:coverage

# View monocart report (includes coverage + test results)
open apps/web/e2e/test-results/monocart-report.html

# View detailed coverage
open apps/web/e2e/test-results/coverage/index.html
```

## 🎬 Videos and Screenshots

### Where Are They?

```bash
# Videos (only saved on failure by default)
apps/web/e2e/test-results/**/*.webm

# Screenshots (only on failure)
apps/web/e2e/test-results/**/*.png

# View a video (macOS)
open apps/web/e2e/test-results/test-name-browser/video.webm
```

### Change Video Settings

In `apps/web/e2e/playwright.config.ts`:

```typescript
use: {
  video: 'on',               // Always record
  video: 'retain-on-failure', // Only on failure (default)
  video: 'off',              // Never record

  screenshot: 'on',          // Always capture
  screenshot: 'only-on-failure', // Only on failure (default)
  screenshot: 'off',         // Never capture
}
```

## 📝 What to Commit to Git

### ✅ ALWAYS Commit

```
✓ Test files (*.spec.ts)
✓ Configuration (playwright.config.ts)
✓ Page objects (packages/test-utils/src/page-objects/)
✓ Helpers (packages/test-utils/src/helpers/)
✓ Visual regression baselines (*-linux.png)
✓ Package files (package.json, bun.lockb)
```

### ❌ NEVER Commit

```
✗ test-results/          # Test artifacts
✗ playwright-report/     # HTML reports
✗ blob-report/           # Blob reports
✗ **/*.webm              # Videos
✗ **/trace.zip           # Trace files
✗ **/*-darwin.png        # macOS screenshots
✗ **/*-win32.png         # Windows screenshots
✗ coverage/              # Coverage reports
```

**Why ignore platform-specific screenshots?**
Screenshots differ slightly between macOS, Windows, and Linux. Always generate baselines on Linux (same as CI) and only commit `*-linux.png` files.

## 🤔 Bun vs Node.js for Playwright

### TL;DR: Use Node.js (via `npx`)

**Why not Bun?**

- ❌ Browser launch hangs (~2 minutes)
- ❌ Zombie processes
- ❌ Potential segfaults
- ❌ Component testing doesn't work
- ⚠️ Still experimental support

**Why Node.js?**

- ✅ Stable and reliable
- ✅ Official Playwright support
- ✅ All features work perfectly
- ✅ No performance difference for E2E tests

### Can I Use Bun for Anything?

**YES! Use Bun for:**

```bash
# Package management (much faster)
bun install
bun add -D some-package

# Running dev server
bun run dev

# Build
bun run build

# Workspace commands
bun --filter web dev
```

**Use Node.js for:**

```bash
# Playwright tests (via npx or scripts)
bun run test:e2e        # ✅ Script uses npx internally
npx playwright test     # ✅ Direct npx call

# DON'T DO THIS:
bunx playwright test    # ❌ Will have issues
```

### What About `bunx`?

`bunx` is Bun's equivalent of `npx`, but for Playwright it's problematic:

```bash
# ❌ DON'T USE
bunx playwright test
bunx playwright show-trace

# ✅ USE INSTEAD
npx playwright test
npx playwright show-trace

# ✅ OR USE SCRIPTS (recommended)
bun run test:e2e
bun run test:e2e:ui
```

**Why your scripts work:** They use `npx` internally:

```json
{
  "scripts": {
    "test:e2e": "cd e2e && npx playwright test" // ← npx, not bunx!
  }
}
```

## 🎓 Common Workflows

### Workflow 1: Write New Tests

```bash
# 1. Start UI Mode
bun run test:e2e:ui

# 2. Write test in apps/web/e2e/tests/
# 3. UI Mode auto-runs it
# 4. Use locator picker to find selectors
# 5. Fix failing tests
# 6. Commit when passing
```

### Workflow 2: Debug Failing Test

```bash
# 1. Run test to generate trace
npx playwright test tests/my-test.spec.ts

# 2. View trace
npx playwright show-trace test-results/path-to-trace/trace.zip

# 3. Or use UI Mode for live debugging
bun run test:e2e:ui
```

### Workflow 3: Update Visual Regression Baselines

```bash
# 1. Make intentional UI change
# 2. Run visual tests (they'll fail)
bun run test:e2e tests/visual

# 3. Review diffs in HTML report
bun run test:e2e:report

# 4. If changes look good, update baselines
bun run test:e2e:update-snapshots

# 5. Re-run to verify
bun run test:e2e tests/visual

# 6. Commit new baselines
git add apps/web/e2e/tests/**/*-linux.png
git commit -m "Update visual regression baselines"
```

### Workflow 4: Run Before Commit

```bash
# Quick validation
bun run test:e2e

# Full validation with coverage
bun run test:e2e:coverage

# Type checking
bun run typecheck

# Linting
bun run lint
```

## 🐛 Troubleshooting

### Tests Hang or Timeout

```bash
# Ensure dev server is running
bun run dev

# Or check webServer config in playwright.config.ts
```

### Can't Find Playwright Command

```bash
# Install browsers first
npx playwright install --with-deps chromium

# Or all browsers
npx playwright install --with-deps
```

### Visual Regression Tests Failing

```bash
# Different OS? Generate baselines on Linux (CI)
# For local dev, update snapshots:
bun run test:e2e:update-snapshots

# Threshold too strict? Adjust in playwright.config.ts:
expect: {
  toHaveScreenshot: {
    maxDiffPixels: 200,  // Increase tolerance
  }
}
```

### Videos Not Saving

Check `playwright.config.ts`:

```typescript
use: {
  video: 'on',  // Force video recording
}
```

## 📚 Learn More

- **Playwright Docs**: https://playwright.dev
- **Trace Viewer**: https://trace.playwright.dev
- **UI Mode Guide**: https://playwright.dev/docs/test-ui-mode
- **Testing Workflow**: `.docs/workflows/testing-workflow.md`
- **ADR-0006**: `.docs/decisions/0006-playwright-e2e-testing.md`

## 🎉 Quick Wins

1. **Use UI Mode** - It's like magic for development
2. **Use Trace Viewer** - Time-travel debugging is incredible
3. **Use Page Objects** - From `@flodoc/test-utils`
4. **Commit \*-linux.png only** - Ignore platform-specific screenshots
5. **Use npx, not bunx** - For Playwright commands

---

**Need Help?**

- Check HTML report: `bun run test:e2e:report`
- View traces for failed tests
- Use UI Mode for interactive debugging
- Read `.docs/workflows/testing-workflow.md`
