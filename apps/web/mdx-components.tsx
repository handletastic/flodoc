import type { MDXComponents } from 'mdx/types';
import { useMDXComponents as getComponents } from './src/components/mdx/MDXComponents';

/**
 * This file allows you to provide custom React components
 * to be used in MDX files. You can import and use any
 * React component you want, including components from
 * other libraries.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return getComponents(components);
}
