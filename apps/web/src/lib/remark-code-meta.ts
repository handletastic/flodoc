import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root } from 'mdast';

/**
 * Remark plugin to parse code block meta strings
 *
 * Supports:
 * - filename="path/to/file.ts"
 * - highlightLines="1,3-5"
 * - showLineNumbers (default: true)
 */
export const remarkCodeMeta: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'code', (node: any) => {
      const meta = node.meta || '';

      // Parse filename
      const filenameMatch = meta.match(/filename="([^"]+)"/);
      if (filenameMatch) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.filename = filenameMatch[1];
      }

      // Parse highlightLines
      const highlightMatch = meta.match(/highlightLines="([^"]+)"/);
      if (highlightMatch) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.highlightLines = highlightMatch[1];
      }

      // Parse showLineNumbers
      if (meta.includes('showLineNumbers=false')) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.showLineNumbers = false;
      }
    });
  };
};
