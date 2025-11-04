/**
 * MDX Document Loader
 *
 * Handles loading and parsing MDX documents from the content directory.
 * Uses gray-matter for frontmatter parsing and dynamic imports for MDX components.
 */

import matter from 'gray-matter';
import type { DocumentFrontmatter, DocumentMetadata } from './types';

/**
 * Get all available MDX documents from the content directory
 */
export async function getAllDocuments(): Promise<DocumentMetadata[]> {
  // Use Vite's glob import to get all MDX files
  const modules = import.meta.glob('/content/docs/*.mdx', {
    query: '?raw',
    import: 'default',
  });

  const documents: DocumentMetadata[] = [];

  for (const [path, importFn] of Object.entries(modules)) {
    try {
      const content = await importFn() as string;
      const { data } = matter(content);

      // Extract slug from filename if not in frontmatter
      const fileName = path.split('/').pop()?.replace('.mdx', '') || '';
      const slug = (data.slug as string) || fileName;

      documents.push({
        slug,
        title: data.title as string,
        description: data.description as string | undefined,
        tags: data.tags as string[] | undefined,
        connections: data.connections as any,
        filePath: path,
      });
    } catch (error) {
      console.error(`Error loading document metadata from ${path}:`, error);
    }
  }

  return documents;
}

/**
 * Load a single MDX document by slug
 */
export async function loadDocument(slug: string): Promise<{
  frontmatter: DocumentFrontmatter;
  content: string;
  Component: React.ComponentType;
} | null> {
  try {
    // Try to import the MDX file
    // We need to dynamically import both the raw content and the component
    const modules = import.meta.glob('/content/docs/*.mdx', {
      eager: false,
    });

    const rawModules = import.meta.glob('/content/docs/*.mdx', {
      query: '?raw',
      import: 'default',
      eager: false,
    });

    // Find the matching file
    let matchedPath: string | null = null;

    for (const path of Object.keys(modules)) {
      const fileName = path.split('/').pop()?.replace('.mdx', '') || '';

      // Try to get raw content to check slug in frontmatter
      const rawImport = rawModules[path];
      if (rawImport) {
        const rawContent = await rawImport() as string;
        const { data } = matter(rawContent);
        const fileSlug = (data.slug as string) || fileName;

        if (fileSlug === slug) {
          matchedPath = path;
          break;
        }
      }
    }

    if (!matchedPath) {
      return null;
    }

    // Load both the raw content and the component
    const [rawContent, mdxModule] = await Promise.all([
      rawModules[matchedPath]() as Promise<string>,
      modules[matchedPath]() as Promise<any>,
    ]);

    // Parse frontmatter
    const { data, content } = matter(rawContent);

    // Validate required frontmatter fields
    if (!data.title || !data.slug) {
      throw new Error(`Document ${slug} is missing required frontmatter fields`);
    }

    const frontmatter: DocumentFrontmatter = {
      title: data.title,
      description: data.description,
      slug: data.slug,
      tags: data.tags,
      connections: data.connections,
    };

    return {
      frontmatter,
      content,
      Component: mdxModule.default,
    };
  } catch (error) {
    console.error(`Error loading document ${slug}:`, error);
    return null;
  }
}

/**
 * Check if a document exists
 */
export async function documentExists(slug: string): Promise<boolean> {
  const doc = await loadDocument(slug);
  return doc !== null;
}

/**
 * Get documents by tag
 */
export async function getDocumentsByTag(tag: string): Promise<DocumentMetadata[]> {
  const allDocs = await getAllDocuments();
  return allDocs.filter((doc) => doc.tags?.includes(tag));
}

/**
 * Get connected documents
 */
export async function getConnectedDocuments(
  slug: string
): Promise<Map<string, DocumentMetadata[]>> {
  const doc = await loadDocument(slug);
  if (!doc || !doc.frontmatter.connections) {
    return new Map();
  }

  const allDocs = await getAllDocuments();
  const connections = new Map<string, DocumentMetadata[]>();

  for (const connection of doc.frontmatter.connections) {
    const targetDoc = allDocs.find((d) => d.slug === connection.target);
    if (targetDoc) {
      if (!connections.has(connection.type)) {
        connections.set(connection.type, []);
      }
      connections.get(connection.type)!.push(targetDoc);
    }
  }

  return connections;
}
