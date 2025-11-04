/**
 * Type definitions for document templates
 */

export interface TemplateMetadata {
  id: string;
  title: string;
  description: string;
  slug: string;
  tags?: string[];
  filePath: string;
}

export interface Template {
  metadata: TemplateMetadata;
  content: string;
  frontmatter: Record<string, any>;
}

export interface TemplateCustomization {
  title: string;
  description: string;
  slug: string;
  tags?: string[];
}
