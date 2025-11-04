import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import rehypePrettyCode from 'rehype-pretty-code'
import path from 'path'
import { remarkCodeMeta } from './src/lib/remark-code-meta'
import { readFileSync } from 'fs'

// Custom plugin to handle ?raw imports for MDX files
// This completely bypasses the MDX plugin by converting the file to a virtual module
function mdxRawLoader(): Plugin {
  const virtualModulePrefix = '\0raw-mdx:';

  return {
    name: 'mdx-raw-loader',
    enforce: 'pre',

    resolveId(source, importer) {
      // Convert ?raw MDX requests to virtual modules
      if (source.includes('.mdx?raw')) {
        const [filePath] = source.split('?');
        // Resolve relative paths to absolute
        const resolvedPath = importer
          ? path.resolve(path.dirname(importer), filePath)
          : path.resolve(filePath);
        return virtualModulePrefix + resolvedPath;
      }
      return null;
    },

    load(id) {
      // Handle virtual raw MDX modules
      if (id.startsWith(virtualModulePrefix)) {
        const filePath = id.slice(virtualModulePrefix.length);
        try {
          const content = readFileSync(filePath, 'utf-8');
          // Return as ES module with default export
          return {
            code: `export default ${JSON.stringify(content)}`,
            map: null,
          };
        } catch (error) {
          this.error(`Failed to load ${filePath}: ${error}`);
        }
      }
      return null;
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  // Base path for GitHub Pages
  // For custom domain: use '/'
  // For repository pages: use '/repository-name/'
  base: process.env.VITE_BASE_PATH || '/',

  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    mdxRawLoader(), // MUST come before MDX plugin
    mdx({
      remarkPlugins: [remarkGfm, remarkFrontmatter, remarkCodeMeta],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            // Configure rehype-pretty-code
            theme: {
              dark: 'github-dark',
              light: 'github-light',
            },
            keepBackground: false,
            // Parse custom meta attributes (filename, highlightLines)
            onVisitLine(node: any) {
              // Prevent lines from collapsing
              if (node.children.length === 0) {
                node.children = [{ type: 'text', value: ' ' }];
              }
            },
            onVisitHighlightedLine(node: any) {
              // Add class to highlighted lines
              node.properties.className = node.properties.className || [];
              node.properties.className.push('highlighted');
            },
            onVisitHighlightedChars(node: any) {
              // Add class to highlighted chars
              node.properties.className = ['highlighted-chars'];
            },
          },
        ],
      ],
      // Provide JSX runtime for MDX compilation
      jsxImportSource: 'react',
      providerImportSource: undefined,
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@flodoc/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@flodoc/types': path.resolve(__dirname, '../../packages/types/src'),
    },
  },
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Generate source maps for debugging
    sourcemap: true,
    // Optimize build with esbuild (faster than terser)
    minify: 'esbuild',
  },
  optimizeDeps: {
    // Ensure react/jsx-runtime is pre-bundled for dev
    include: ['react/jsx-runtime'],
  },
})
