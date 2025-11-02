import type { MDXComponents } from 'mdx/types';
import { Pre, Code } from './CodeBlock';

/**
 * MDX Components Provider
 *
 * Custom components for MDX content rendering.
 * Provides enhanced code blocks with F-008 features.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Override pre and code for enhanced code blocks
    pre: Pre as any,
    code: Code as any,
    ...components,
  };
}

// Export components individually for direct use
export { Pre, Code };
export { CodeBlock } from './CodeBlock';
