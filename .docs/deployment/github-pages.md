# GitHub Pages Deployment Guide

This document provides comprehensive instructions for deploying the Flodoc documentation app to GitHub Pages.

## Overview

The Flodoc app is built with Vite + React + TanStack Router and configured for automated deployment to GitHub Pages using GitHub Actions.

## Prerequisites

- GitHub repository with admin access
- GitHub Actions enabled
- GitHub Pages available (free on public repositories)

## Deployment Architecture

```
┌─────────────────┐
│   Push to main  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │
│   Build Job     │
│   1. Checkout   │
│   2. Setup Bun  │
│   3. Install    │
│   4. Build      │
│   5. Upload     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │
│  Deploy Job     │
│ Deploy to Pages │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  GitHub Pages   │
│   Live Site     │
└─────────────────┘
```

## Setup Instructions

### Step 1: Enable GitHub Pages

1. Navigate to your repository on GitHub
2. Go to **Settings** > **Pages**
3. Under "Build and deployment", set **Source** to **GitHub Actions**
4. Save the changes

![GitHub Pages Source Setting](https://docs.github.com/assets/cb-47298/images/help/pages/publishing-source-drop-down.png)

### Step 2: Configure Base Path (Optional)

The deployment is configured to work with both custom domains and repository-based URLs.

**For Custom Domain** (e.g., `docs.example.com`):
- No changes needed
- The default `VITE_BASE_PATH: '/'` is correct
- Configure custom domain in GitHub Pages settings

**For Repository Pages** (e.g., `username.github.io/repository-name`):
- Edit `.github/workflows/deploy.yml`
- Change line 45 to: `VITE_BASE_PATH: '/your-repository-name/'`
- Example: `VITE_BASE_PATH: '/flodoc/'`

```yaml
# .github/workflows/deploy.yml
env:
  # For custom domain:
  VITE_BASE_PATH: '/'

  # For repository pages (replace with your repo name):
  VITE_BASE_PATH: '/your-repository-name/'
```

### Step 3: Push to Main Branch

Once configured, any push to the `main` branch will automatically trigger deployment:

```bash
git push origin main
```

### Step 4: Monitor Deployment

1. Go to your repository's **Actions** tab
2. Find the latest workflow run
3. Monitor the build and deploy jobs
4. Check for any errors in the logs

### Step 5: Access Your Site

After successful deployment:

**Custom Domain**: `https://your-domain.com`
**Repository Pages**: `https://username.github.io/repository-name/`

## Configuration Files

### Vite Configuration

**File**: `apps/web/vite.config.ts`

Key configurations for GitHub Pages:

```typescript
export default defineConfig({
  // Base path for asset loading
  base: process.env.VITE_BASE_PATH || '/',

  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
  },
})
```

### GitHub Actions Workflow

**File**: `.github/workflows/deploy.yml`

The workflow consists of two jobs:

1. **Build Job**
   - Checks out code
   - Sets up Bun runtime
   - Installs dependencies
   - Builds the application
   - Uploads build artifact

2. **Deploy Job**
   - Downloads build artifact
   - Deploys to GitHub Pages
   - Provides deployment URL

### Post-Build Script

**File**: `apps/web/scripts/post-build.js`

Automatically runs after build to:
- Create `404.html` from `index.html` for SPA routing
- Add `.nojekyll` file to prevent Jekyll processing

## SPA Routing Support

GitHub Pages doesn't natively support client-side routing. The deployment handles this by:

1. **404.html Redirect**: Copying `index.html` to `404.html`
2. **Client-Side Routing**: TanStack Router handles all routing client-side
3. **No Jekyll**: `.nojekyll` file prevents GitHub from processing files with underscores

This means:
- Direct navigation to `/docs/getting-started` works
- Browser refresh on any route works
- Deep linking works
- All routes are handled by the React application

## Environment Variables

Configure in GitHub Actions workflow or repository secrets:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_BASE_PATH` | Base path for assets | `/` | No |

## Custom Domain Setup

To use a custom domain:

1. **Add CNAME file** (in `apps/web/public/CNAME`):
   ```
   docs.example.com
   ```

2. **Configure DNS** at your domain provider:
   - Add A records pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - OR add CNAME record pointing to `username.github.io`

3. **Enable HTTPS** in GitHub Pages settings

4. **Wait for DNS propagation** (can take up to 24 hours)

## Manual Deployment

To manually trigger deployment:

1. Go to repository's **Actions** tab
2. Select "Deploy to GitHub Pages" workflow
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow** button

## Troubleshooting

### Build Failures

**Problem**: Build fails with TypeScript errors

**Solution**:
- Check build logs in Actions tab
- Fix TypeScript errors locally
- Run `bun run build` locally to test
- Note: Current build skips TypeScript checking; use `build:with-typecheck` to include it

**Problem**: Build fails with dependency errors

**Solution**:
```bash
# Update lockfile
bun install

# Commit changes
git add bun.lockb
git commit -m "chore: update dependencies"
git push
```

### Deployment Failures

**Problem**: Deployment job fails with permissions error

**Solution**:
- Ensure GitHub Pages source is set to "GitHub Actions"
- Check repository settings > Actions > General > Workflow permissions
- Set to "Read and write permissions"

**Problem**: 404 errors on routes

**Solution**:
- Verify `404.html` exists in deployment
- Check browser console for errors
- Ensure base path is correctly configured

### Asset Loading Issues

**Problem**: CSS/JS files return 404

**Solution**:
- Verify `VITE_BASE_PATH` matches your deployment URL
- For repo pages: must include leading and trailing slashes
- For custom domain: should be `/`
- Rebuild and redeploy after changing

### Styling Issues

**Problem**: Site displays without styles

**Solution**:
```bash
# Check if Tailwind CSS is building correctly
bun run build

# Verify dist/assets contains CSS files
ls -la apps/web/dist/assets/*.css
```

### Performance Issues

**Problem**: Large bundle size warnings

**Solution**:
- Check `chunkSizeWarningLimit` in vite.config.ts
- Consider code splitting
- Optimize dependencies
- Use dynamic imports for large components

## Build Optimization

### Production Build

The build process includes:

- **TypeScript Compilation**: Type checking (optional)
- **Vite Build**: Bundle and minify
- **Terser Minification**: JavaScript compression
- **Source Maps**: Generated for debugging
- **Asset Optimization**: Images and static files
- **Post-Build**: SPA routing setup

### Bundle Analysis

To analyze bundle size:

```bash
# Install bundle analyzer
bun add -d vite-bundle-analyzer

# Add to vite.config.ts
import { visualizer } from 'vite-bundle-analyzer'

plugins: [
  // ... other plugins
  visualizer({ open: true })
]

# Build and view report
bun run build
```

## Monitoring & Analytics

### GitHub Actions Monitoring

Monitor deployment health:

1. Actions tab > All workflows
2. Check success/failure rates
3. Review build times
4. Set up status badges

### Adding Status Badge

Add to README.md:

```markdown
[![Deploy Status](https://github.com/username/repository/actions/workflows/deploy.yml/badge.svg)](https://github.com/username/repository/actions/workflows/deploy.yml)
```

### Performance Monitoring

Consider adding:

- Google Analytics
- Vercel Analytics
- Sentry error tracking
- Web Vitals reporting

## Security Considerations

### Source Maps

Production builds include source maps for debugging. To disable:

```typescript
// vite.config.ts
build: {
  sourcemap: false, // Disable source maps
}
```

### Dependency Security

Regularly update dependencies:

```bash
# Check for updates
bun outdated

# Update dependencies
bun update

# Audit for vulnerabilities
bun audit
```

### Content Security Policy

Consider adding CSP headers via meta tag:

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

## Rollback Procedure

If a deployment causes issues:

1. **Via GitHub UI**:
   - Go to repository > Deployments
   - Click on previous successful deployment
   - Click "Re-deploy"

2. **Via Git**:
   ```bash
   # Revert to previous commit
   git revert HEAD
   git push origin main

   # Or reset to specific commit
   git reset --hard <commit-hash>
   git push --force origin main
   ```

3. **Disable Auto-Deploy**:
   - Delete `.github/workflows/deploy.yml`
   - Deploy manually when ready

## Advanced Configuration

### Branch-Based Deployments

Deploy different branches to different environments:

```yaml
# Deploy preview for pull requests
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy-preview:
    # Deploy to preview URL
```

### Caching

Speed up builds with dependency caching:

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.bun/install/cache
    key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lockb') }}
```

### Matrix Builds

Test across multiple environments:

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, macos-latest]
    bun-version: [latest, 1.0.0]
```

## Limitations & Known Issues

### GitHub Pages Limitations

- **File Size**: Individual files limited to 100MB
- **Repository Size**: Soft limit of 1GB
- **Bandwidth**: 100GB per month soft limit
- **Builds**: 10 per hour

### TanStack Router Considerations

- Client-side only routing (no SSR)
- Initial page load includes full JavaScript bundle
- SEO requires additional configuration
- Deep links work but may have slower initial load

### Vite Build Considerations

- Code splitting may create many small chunks
- Source maps increase deployment size
- Build time increases with project size

## Migration Guide

### From Vercel/Netlify

1. Remove platform-specific configuration files
2. Update build commands in package.json
3. Configure VITE_BASE_PATH if needed
4. Test build locally
5. Push to GitHub

### From Traditional Hosting

1. Set up GitHub repository
2. Add GitHub Actions workflow
3. Configure GitHub Pages
4. Update DNS (if using custom domain)
5. Push code to GitHub

## Support & Resources

### Documentation

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Documentation](https://vitejs.dev)
- [TanStack Router Documentation](https://tanstack.com/router)

### Community

- GitHub Discussions
- Stack Overflow (tag: github-pages, vite)
- Discord communities

### Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Review GitHub Actions logs
3. Search existing issues
4. Create new issue with:
   - Error messages
   - Build logs
   - Configuration files
   - Steps to reproduce

## Conclusion

The Flodoc GitHub Pages deployment is fully automated and production-ready. After initial setup, all deployments happen automatically on push to main branch. The configuration supports both custom domains and repository-based hosting, with comprehensive SPA routing support and build optimization.

For questions or issues, refer to the troubleshooting section or create an issue in the repository.
