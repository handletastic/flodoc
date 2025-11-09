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

// Custom plugin to help resolve React imports for MDX files outside the app directory
function resolveReactForContent(): Plugin {
  return {
    name: 'resolve-react-for-content',
    enforce: 'pre',

    resolveId(source, importer) {
      // If import is from content directory and trying to import react
      if (importer?.includes('/content/docs/')) {
        if (source === 'react/jsx-runtime') {
          // Resolve to the actual jsx-runtime.js file
          return path.resolve(__dirname, 'node_modules/react/jsx-runtime.js');
        }
        if (source === 'react/jsx-dev-runtime') {
          // Resolve to the actual jsx-dev-runtime.js file
          return path.resolve(__dirname, 'node_modules/react/jsx-dev-runtime.js');
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
    resolveReactForContent(), // MUST come first to resolve React for content files
    mdxRawLoader(), // MUST come before MDX plugin
    // MDX plugin MUST come before React plugin to transform MDX to JSX first
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
      // Use automatic JSX runtime (React 17+)
      jsxImportSource: 'react',
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@flodoc/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@flodoc/types': path.resolve(__dirname, '../../packages/types/src'),
      // Polyfill Node.js Buffer for browser
      buffer: 'buffer/',
    },
  },
  define: {
    // Define global Buffer for browser compatibility with gray-matter
    global: 'globalThis',
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
    // Include buffer polyfill for gray-matter (frontmatter parser)
    include: ['react/jsx-runtime', 'react', 'react-dom', 'buffer'],
  },
  server: {
    // CRITICAL: Allow Vite to serve files outside the project root
    // This enables import.meta.glob to access content directory in monorepo
    fs: {
      // Allow serving files from up to the monorepo root
      allow: ['../..'],
    },
  },
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Generate source maps for debugging
    sourcemap: true,
    // Optimize build
    minify: 'terser',
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
})
