import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import rehypePrettyCode from 'rehype-pretty-code'
import path from 'path'
import { remarkCodeMeta } from './src/lib/remark-code-meta'

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
    // Optimize build
    minify: 'terser',
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
})
