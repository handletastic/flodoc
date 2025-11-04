/**
 * MDX Components Provider
 *
 * Custom components to use in MDX documents.
 * These components replace the default HTML elements in MDX.
 */

import { Link } from '@tanstack/react-router';
import type { ComponentPropsWithoutRef } from 'react';

type HeadingProps = ComponentPropsWithoutRef<'h1'>;
type AnchorProps = ComponentPropsWithoutRef<'a'>;
type CodeProps = ComponentPropsWithoutRef<'code'>;
type PreProps = ComponentPropsWithoutRef<'pre'>;

/**
 * Custom heading components with anchor links
 */
function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Component = ({ children, ...props }: HeadingProps) => {
    const Tag = `h${level}` as const;
    return <Tag {...props}>{children}</Tag>;
  };
  Component.displayName = `Heading${level}`;
  return Component;
}

/**
 * Custom link component that uses TanStack Router for internal links
 */
function CustomLink({ href, children, ...props }: AnchorProps) {
  // Check if it's an internal link
  const isInternalLink = href?.startsWith('/') || href?.startsWith('#');

  if (isInternalLink && href?.startsWith('/')) {
    return (
      <Link to={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} {...props} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>
      {children}
    </a>
  );
}

/**
 * Custom code block component
 */
function Pre({ children, ...props }: PreProps) {
  return (
    <pre {...props} className="overflow-x-auto">
      {children}
    </pre>
  );
}

/**
 * Custom inline code component
 */
function Code({ children, className, ...props }: CodeProps) {
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

/**
 * MDX Components mapping
 *
 * Maps HTML element names to custom React components
 */
export const mdxComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  a: CustomLink,
  pre: Pre,
  code: Code,
};

export type MDXComponents = typeof mdxComponents;
