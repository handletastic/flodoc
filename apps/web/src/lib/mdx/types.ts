/**
 * Type definitions for MDX documents and frontmatter
 */

export interface DocumentConnection {
  type: 'prerequisite' | 'next' | 'related' | 'seealso';
  target: string;
}

export interface DocumentFrontmatter {
  title: string;
  description?: string;
  slug: string;
  tags?: string[];
  connections?: DocumentConnection[];
}

export interface MDXDocument {
  frontmatter: DocumentFrontmatter;
  content: string;
  Component: React.ComponentType;
}

export interface DocumentMetadata {
  slug: string;
  title: string;
  description?: string;
  tags?: string[];
  connections?: DocumentConnection[];
  filePath: string;
}
