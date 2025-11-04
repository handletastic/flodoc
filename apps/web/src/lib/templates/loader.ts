/**
 * Template Loader
 *
 * Handles loading and processing document templates
 */

import matter from 'gray-matter';
import type { TemplateMetadata, Template, TemplateCustomization } from './types';

/**
 * Template configurations
 */
const TEMPLATE_CONFIGS: Record<string, Omit<TemplateMetadata, 'filePath'>> = {
  guide: {
    id: 'guide',
    title: 'Guide Template',
    description: 'Step-by-step instructional content for procedural documentation',
    slug: 'guide-template',
    tags: ['guide', 'documentation'],
  },
  tutorial: {
    id: 'tutorial',
    title: 'Tutorial Template',
    description: 'Hands-on learning experience with practical examples and exercises',
    slug: 'tutorial-template',
    tags: ['tutorial', 'hands-on'],
  },
  'api-reference': {
    id: 'api-reference',
    title: 'API Reference Template',
    description: 'Technical API documentation with methods, parameters, and examples',
    slug: 'api-reference-template',
    tags: ['api', 'reference', 'documentation'],
  },
  changelog: {
    id: 'changelog',
    title: 'Changelog Template',
    description: 'Version release notes following Keep a Changelog format',
    slug: 'changelog-template',
    tags: ['changelog', 'releases', 'updates'],
  },
  faq: {
    id: 'faq',
    title: 'FAQ Template',
    description: 'Common questions and answers for user support',
    slug: 'faq-template',
    tags: ['faq', 'help', 'support'],
  },
};

/**
 * Get all available templates
 */
export async function getAllTemplates(): Promise<TemplateMetadata[]> {
  const modules = import.meta.glob('/templates/*.mdx', {
    query: '?raw',
    import: 'default',
  });

  const templates: TemplateMetadata[] = [];

  for (const [path, importFn] of Object.entries(modules)) {
    const fileName = path.split('/').pop()?.replace('.mdx', '') || '';
    const config = TEMPLATE_CONFIGS[fileName];

    if (config) {
      templates.push({
        ...config,
        filePath: path,
      });
    }
  }

  // Sort templates by a predefined order
  const order = ['guide', 'tutorial', 'api-reference', 'changelog', 'faq'];
  return templates.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}

/**
 * Load a single template by ID
 */
export async function loadTemplate(templateId: string): Promise<Template | null> {
  try {
    const modules = import.meta.glob('/templates/*.mdx', {
      query: '?raw',
      import: 'default',
      eager: false,
    });

    const path = `/templates/${templateId}.mdx`;
    const importFn = modules[path];

    if (!importFn) {
      return null;
    }

    const rawContent = (await importFn()) as string;
    const { data, content } = matter(rawContent);

    const config = TEMPLATE_CONFIGS[templateId];
    if (!config) {
      return null;
    }

    return {
      metadata: {
        ...config,
        filePath: path,
      },
      content: rawContent,
      frontmatter: data,
    };
  } catch (error) {
    console.error(`Error loading template ${templateId}:`, error);
    return null;
  }
}

/**
 * Apply customizations to a template
 */
export function customizeTemplate(
  template: Template,
  customizations: TemplateCustomization
): string {
  const { data, content } = matter(template.content);

  // Update frontmatter with customizations
  const updatedFrontmatter = {
    ...data,
    title: customizations.title,
    description: customizations.description,
    slug: customizations.slug,
    tags: customizations.tags || data.tags || [],
  };

  // Replace title in content if it matches the template title
  let updatedContent = content;

  // Replace the first H1 heading with the custom title
  const h1Regex = /^#\s+.+$/m;
  if (h1Regex.test(updatedContent)) {
    updatedContent = updatedContent.replace(h1Regex, `# ${customizations.title}`);
  }

  // Rebuild the MDX file with updated frontmatter
  return matter.stringify(updatedContent, updatedFrontmatter);
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

/**
 * Download template as file
 */
export function downloadTemplate(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy template to clipboard
 */
export async function copyTemplateToClipboard(content: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(content);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw error;
  }
}
