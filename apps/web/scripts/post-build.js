#!/usr/bin/env node

/**
 * Post-build script for GitHub Pages deployment
 *
 * This script handles SPA routing for GitHub Pages by creating a 404.html
 * that redirects to index.html, allowing client-side routing to work properly.
 */

import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distPath = join(__dirname, '..', 'dist');
const indexPath = join(distPath, 'index.html');
const notFoundPath = join(distPath, '404.html');

try {
  // Copy index.html to 404.html for SPA routing
  // GitHub Pages will serve 404.html when a route is not found
  // This allows TanStack Router to handle the routing client-side
  console.log('📝 Creating 404.html for SPA routing...');
  copyFileSync(indexPath, notFoundPath);
  console.log('✅ 404.html created successfully');

  // Create .nojekyll file to prevent GitHub Pages from ignoring files with underscores
  const nojekyllPath = join(distPath, '.nojekyll');
  writeFileSync(nojekyllPath, '');
  console.log('✅ .nojekyll file created');

  console.log('🎉 Post-build setup complete!');
} catch (error) {
  console.error('❌ Error during post-build:', error);
  process.exit(1);
}
