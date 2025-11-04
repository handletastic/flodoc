import { useState, useCallback, useRef, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  filename?: string;
  highlightLines?: string;
  showLineNumbers?: boolean;
  language?: string;
}

/**
 * Enhanced Code Block Component (F-008)
 *
 * Features:
 * - Copy button with feedback
 * - Line numbers
 * - Line highlighting (syntax: {1,3-5})
 * - Filename display
 * - Language badge
 */
export function CodeBlock({
  children,
  className = '',
  filename,
  highlightLines,
  showLineNumbers = true,
  language,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  // Parse highlight lines syntax (e.g., "1,3-5" -> [1, 3, 4, 5])
  const parseHighlightLines = (lines?: string): Set<number> => {
    if (!lines) return new Set();

    const lineNumbers = new Set<number>();
    const parts = lines.split(',').map(p => p.trim());

    parts.forEach(part => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          lineNumbers.add(i);
        }
      } else {
        lineNumbers.add(Number(part));
      }
    });

    return lineNumbers;
  };

  const highlightedLines = parseHighlightLines(highlightLines);

  // Extract language from className (e.g., "language-typescript" -> "typescript")
  const extractLanguage = (cls: string): string => {
    const match = cls.match(/language-(\w+)/);
    return match ? match[1] : language || 'text';
  };

  const detectedLanguage = extractLanguage(className);

  // Copy code to clipboard
  const handleCopy = useCallback(async () => {
    if (!codeRef.current) return;

    try {
      // Get text content, excluding line numbers
      const codeElement = codeRef.current.querySelector('code');
      if (!codeElement) return;

      const text = codeElement.textContent || '';
      await navigator.clipboard.writeText(text.trim());

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }, []);

  // Handle keyboard activation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleCopy();
      }
    },
    [handleCopy]
  );

  // Split code into lines for line numbering and highlighting
  const processCodeLines = () => {
    const codeElement = codeRef.current?.querySelector('code');
    if (!codeElement || !showLineNumbers) return;

    const text = codeElement.textContent || '';
    const lines = text.split('\n');

    // Add line attributes for styling
    lines.forEach((_, index) => {
      const lineNumber = index + 1;
      const lineElement = codeElement.querySelector(`[data-line="${lineNumber}"]`);
      if (lineElement && highlightedLines.has(lineNumber)) {
        lineElement.setAttribute('data-highlighted', 'true');
      }
    });
  };

  useEffect(() => {
    processCodeLines();
  }, [children, showLineNumbers, highlightedLines]);

  return (
    <div
      data-testid="code-block"
      data-filename={filename}
      data-language={detectedLanguage}
      className="relative group my-6 rounded-lg overflow-hidden border border-border bg-muted/30"
    >
      {/* Header with filename and language badge */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        {filename ? (
          <div
            data-testid="code-filename"
            className="text-sm font-mono text-muted-foreground font-medium"
          >
            {filename}
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          {/* Language badge */}
          <span
            data-testid="language-badge"
            className="text-xs font-mono px-2 py-1 rounded bg-primary/10 text-primary font-medium"
          >
            {detectedLanguage}
          </span>

          {/* Copy button */}
          <button
            data-testid="copy-button"
            onClick={handleCopy}
            onKeyDown={handleKeyDown}
            aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium',
              'transition-all duration-200',
              'hover:bg-primary/10 focus:bg-primary/10',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              'text-muted-foreground hover:text-primary',
              copied && 'text-green-600 dark:text-green-400'
            )}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span data-testid="copy-feedback" aria-live="polite">
                  Copied
                </span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code content with line numbers */}
      <div className="relative">
        <pre
          ref={codeRef}
          className={cn(
            'overflow-x-auto p-4 text-sm',
            showLineNumbers && 'grid grid-cols-[auto_1fr] gap-4',
            className
          )}
        >
          {showLineNumbers && (
            <LineNumbers
              count={children?.toString().split('\n').length || 1}
              highlightedLines={highlightedLines}
            />
          )}
          <code className={className}>{children}</code>
        </pre>
      </div>
    </div>
  );
}

// Line numbers component
function LineNumbers({
  count,
  highlightedLines,
}: {
  count: number;
  highlightedLines: Set<number>;
}) {
  return (
    <div className="select-none text-right text-muted-foreground/60 pr-4 border-r border-border">
      {Array.from({ length: count }, (_, i) => {
        const lineNumber = i + 1;
        const isHighlighted = highlightedLines.has(lineNumber);

        return (
          <div
            key={lineNumber}
            data-testid="line-number"
            data-line={lineNumber}
            data-highlighted={isHighlighted}
            className={cn(
              'leading-6 font-mono text-xs',
              isHighlighted && 'font-bold text-primary'
            )}
          >
            {lineNumber}
          </div>
        );
      })}
    </div>
  );
}

// Pre component wrapper for MDX
export function Pre({
  children,
  filename,
  highlightLines,
  showLineNumbers = true,
}: Omit<React.HTMLAttributes<HTMLPreElement>, 'children'> & {
  children?: React.ReactNode;
  filename?: string;
  highlightLines?: string;
  showLineNumbers?: boolean;
}) {
  // Extract className from code child
  const childProps = (children as any)?.props;
  const className = childProps?.className || '';
  const codeChildren = childProps?.children;

  return (
    <CodeBlock
      className={className}
      filename={filename}
      highlightLines={highlightLines}
      showLineNumbers={showLineNumbers}
    >
      {codeChildren}
    </CodeBlock>
  );
}

// Code component for inline code
export function Code({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  // Inline code (not in pre tag)
  if (!className?.includes('language-')) {
    return (
      <code
        className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono text-foreground"
        {...props}
      >
        {children}
      </code>
    );
  }

  // Block code (in pre tag) - handled by Pre component
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}
