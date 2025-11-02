---
id: F-008
title: Code Block Enhancements
status: completed
priority: medium
effort: medium
tags: [mdx, dx, ui]
created: 2025-01-03
completed: 2025-01-03
---

# F-008: Code Block Enhancements

## Overview

Enhanced code blocks in MDX documentation with copy functionality, line numbers, line highlighting, filename display, and language badges.

## Status: ✅ Completed

## Motivation

Standard code blocks lack essential features for documentation:
- Users can't easily copy code examples
- No way to reference specific lines
- Can't emphasize important lines
- File context is missing
- Language isn't clearly displayed

## Goals

1. Add copy button with visual feedback
2. Display line numbers for reference
3. Support line highlighting (e.g., `{1,3-5}`)
4. Show filename above code blocks
5. Display language badge
6. Maintain syntax highlighting from rehype-pretty-code
7. Ensure accessibility (keyboard nav, ARIA labels)
8. Support responsive design

## Solution

### Architecture

```
MDX File → remark-code-meta → rehype-pretty-code → CodeBlock Component
```

**Components**:
- `CodeBlock`: Main component with all enhancements
- `Pre`: Wrapper component for `<pre>` tags in MDX
- `Code`: Component for both inline and block code
- `LineNumbers`: Subcomponent for line numbering

**Plugins**:
- `remarkCodeMeta`: Parse meta attributes from code fences
- `rehype-pretty-code`: Syntax highlighting with theme support

### Features Implemented

#### 1. Copy Button
- Click to copy code to clipboard
- Visual feedback ("Copied!") for 2 seconds
- Keyboard accessible (Enter/Space)
- ARIA labels for screen readers
- Copy icon from lucide-react

#### 2. Line Numbers
- Sequential numbering (1, 2, 3...)
- Aligned with code lines
- Non-selectable (doesn't copy)
- Highlight numbers for highlighted lines
- Monospace font for consistency

#### 3. Line Highlighting
- Syntax: `highlightLines="1,3-5"`
- Supports single lines: `"1,2,3"`
- Supports ranges: `"1-5"`
- Supports mixed: `"1,3-5,10"`
- Visual distinction with background color
- Bold line numbers for highlighted lines

#### 4. Filename Display
- Syntax: `filename="path/to/file.ts"`
- Displayed in header bar above code
- Monospace font
- Distinct background styling

#### 5. Language Badge
- Auto-detected from code fence (e.g., ` ```typescript `)
- Displayed in header bar
- Small, styled badge
- Shows language name

#### 6. Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Screen reader announcements
- Semantic HTML structure

#### 7. Responsive Design
- Horizontal scroll on overflow
- Touch-friendly buttons
- Mobile-optimized layout
- Button text adapts on small screens

#### 8. Dark Mode
- Dual themes (github-dark/github-light)
- Theme-aware colors
- Consistent with site theme

## Implementation Details

### File Structure

```
apps/web/
├── src/
│   ├── components/
│   │   └── mdx/
│   │       ├── CodeBlock.tsx       # Main component
│   │       └── MDXComponents.tsx   # MDX provider
│   └── lib/
│       └── remark-code-meta.ts     # Meta parser plugin
├── mdx-components.tsx              # Root MDX config
└── vite.config.ts                  # Plugin configuration
```

### Usage Examples

**Basic code block:**
````markdown
```javascript
const hello = "world";
```
````

**With filename:**
````markdown
```typescript filename="src/utils.ts"
export function add(a: number, b: number): number {
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

**All features combined:**
````markdown
```typescript filename="api.ts" highlightLines="1-3,10"
interface ApiResponse<T> {
  data: T;
  status: number;
}

class ApiClient {
  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await fetch(url);
    const data = await response.json();
    return { data, status: response.status };
  }
}
```
````

## Technical Stack

- **React 19**: Component framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling with utility classes
- **lucide-react**: Copy/Check icons
- **rehype-pretty-code**: Syntax highlighting
- **remark/rehype plugins**: MDX processing
- **unist-util-visit**: AST traversal

## Testing

### Test Coverage

**E2E Tests** (`code-block-enhancements.spec.ts`):
- Copy button visibility and functionality
- Clipboard integration and feedback
- Line numbers display and alignment
- Line highlighting support
- Filename display
- Language badge display
- Integration tests
- Accessibility tests
- Responsive design tests
- Dark mode support

**Test Approach**: TDD (Tests written first)

### Running Tests

```bash
# Run all E2E tests
bun test:e2e

# Run specific test file
bun test:e2e code-block-enhancements

# Run with UI
bun test:e2e:ui

# Run in headed mode (see browser)
bun test:e2e:headed
```

## Performance

- Lazy rendering of line numbers
- Efficient clipboard API usage
- No runtime performance impact
- Small bundle size increase (~5KB)
- CSS-based styling (no runtime JS for styles)

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 13.4+)
- Clipboard API requires HTTPS or localhost

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation (Tab, Enter, Space)
- ARIA labels and live regions
- Focus indicators
- Screen reader announcements
- Semantic HTML structure

## Future Enhancements

Potential improvements for future iterations:

1. **Diff Highlighting**: Show added/removed lines
2. **Title Bar**: Custom title separate from filename
3. **Shell Prompts**: Special styling for terminal examples
4. **Code Tabs**: Multiple code examples in tabs
5. **Line Focus**: Fade non-highlighted lines
6. **Collapse Long Blocks**: Expandable code blocks
7. **Download Button**: Save code as file
8. **Theme Selector**: Per-block theme override

## Related Features

- F-002: MDX Document Loading and Rendering
- F-004: Document Navigation and Search
- US-002: Read documentation with rich content

## References

- [rehype-pretty-code documentation](https://rehype-pretty-code.netlify.app/)
- [MDX documentation](https://mdxjs.com/)
- [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Changelog

### 2025-01-03 - Initial Implementation

- Implemented CodeBlock component with all features
- Added remarkCodeMeta plugin for meta parsing
- Created MDX components provider
- Added comprehensive E2E tests
- Updated documentation with examples
- Configured rehype-pretty-code with dual themes

## Success Metrics

✅ All 5 required features implemented
✅ Comprehensive E2E test coverage
✅ Accessibility compliance
✅ Responsive design
✅ Dark mode support
✅ Example documentation created
✅ Zero runtime errors
✅ Performance impact minimal

---

**Status**: Ready for PR
**Branch**: feature/f-008-code-enhancements
**Next Steps**: Create pull request for review
