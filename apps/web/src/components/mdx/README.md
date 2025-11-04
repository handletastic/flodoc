# MDX Components

Enhanced MDX components for Flodoc documentation with rich code block features.

## Overview

This directory contains custom MDX components that enhance the documentation experience, particularly for code blocks (Feature F-008).

## Components

### CodeBlock

The main enhanced code block component with the following features:

#### Features

1. **Copy Button**
   - One-click copy to clipboard
   - Visual feedback ("Copied!")
   - Keyboard accessible (Enter/Space)
   - ARIA labels for screen readers

2. **Line Numbers**
   - Sequential numbering
   - Aligned with code lines
   - Non-selectable (don't interfere with copying)
   - Highlighted for emphasized lines

3. **Line Highlighting**
   - Syntax: `highlightLines="1,3-5"`
   - Supports single lines, ranges, and combinations
   - Visual distinction with background color

4. **Filename Display**
   - Syntax: `filename="path/to/file.ts"`
   - Shown in header bar
   - Provides file context

5. **Language Badge**
   - Auto-detected from code fence
   - Displayed in header bar
   - Shows programming language

#### Usage

In MDX files, use standard code fences with optional meta attributes:

**Basic:**
````markdown
```javascript
const hello = "world";
```
````

**With filename:**
````markdown
```typescript filename="src/utils.ts"
export function add(a: number, b: number) {
  return a + b;
}
```
````

**With line highlighting:**
````markdown
```tsx highlightLines="2,4-6"
import React from 'react';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```
````

**All features:**
````markdown
```typescript filename="api.ts" highlightLines="1-3"
interface User {
  id: string;
  name: string;
}
```
````

### Pre

Wrapper component for `<pre>` tags that provides the enhanced code block functionality.

### Code

Component for both inline and block code:
- Inline code: `code text` (styled differently)
- Block code: handled by Pre/CodeBlock

### MDXComponents

Provider function that exports all custom MDX components. This is the main export used in `mdx-components.tsx`.

## Architecture

```
MDX File
  ↓
remark-code-meta (parse meta)
  ↓
rehype-pretty-code (syntax highlighting)
  ↓
CodeBlock Component (render with enhancements)
  ↓
Browser
```

## Props

### CodeBlock Props

```typescript
interface CodeBlockProps {
  children: React.ReactNode;        // Code content
  className?: string;               // Language class (e.g., "language-typescript")
  filename?: string;                // File path to display
  highlightLines?: string;          // Lines to highlight (e.g., "1,3-5")
  showLineNumbers?: boolean;        // Show line numbers (default: true)
  language?: string;                // Override language detection
}
```

## Styling

Components use Tailwind CSS with design tokens:
- `bg-muted`: Background colors
- `text-primary`: Primary text color
- `border-border`: Border colors
- Dark mode support via `dark:` variants

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- ARIA labels and roles
- Focus indicators
- Screen reader announcements

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 13.4+)
- Clipboard API requires HTTPS or localhost

## Performance

- Efficient rendering with React hooks
- No unnecessary re-renders
- CSS-based styling (no runtime JS)
- Small bundle size impact (~5KB)

## Testing

E2E tests in `apps/web/e2e/tests/documentation/code-block-enhancements.spec.ts`:

```bash
# Run tests
bun test:e2e code-block-enhancements

# Run with UI
bun test:e2e:ui
```

## Configuration

MDX components are configured in `apps/web/vite.config.ts`:

```typescript
mdx({
  remarkPlugins: [
    remarkGfm,
    remarkFrontmatter,
    remarkCodeMeta,  // Parse meta attributes
  ],
  rehypePlugins: [
    [rehypePrettyCode, {
      theme: {
        dark: 'github-dark',
        light: 'github-light',
      },
    }],
  ],
})
```

## Examples

See `content/docs/code-examples.mdx` for comprehensive examples of all features.

## Development

### Adding New Features

1. Update `CodeBlock.tsx` with new feature
2. Add tests in `code-block-enhancements.spec.ts`
3. Update this README
4. Add examples in `code-examples.mdx`

### Debugging

Enable debug mode in browser console:
```javascript
localStorage.debug = 'codeblock:*'
```

## Future Enhancements

Potential improvements:
- Diff highlighting (added/removed lines)
- Custom titles separate from filename
- Terminal prompt styling
- Code tabs for multiple examples
- Line focus (fade non-highlighted)
- Collapsible long blocks
- Download code as file

## Related Files

- `apps/web/src/lib/remark-code-meta.ts` - Meta parser plugin
- `apps/web/mdx-components.tsx` - Root MDX config
- `apps/web/vite.config.ts` - Build configuration
- `content/docs/code-examples.mdx` - Usage examples

## References

- [MDX Documentation](https://mdxjs.com/)
- [rehype-pretty-code](https://rehype-pretty-code.netlify.app/)
- [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)

---

**Feature ID**: F-008
**Status**: ✅ Completed
**Last Updated**: 2025-01-03
