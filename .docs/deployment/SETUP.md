# GitHub Pages Setup - Quick Start

Follow these steps to enable GitHub Pages deployment for your Flodoc repository.

## Step 1: Enable GitHub Pages (Required)

1. Go to your repository on GitHub
2. Click **Settings** (top navigation)
3. Click **Pages** (left sidebar under "Code and automation")
4. Under "Build and deployment":
   - **Source**: Select **GitHub Actions** (NOT "Deploy from a branch")
5. Click **Save**

## Step 2: Configure Base Path (Required for Repository Pages)

**Option A: Custom Domain** (e.g., `docs.example.com`)
- No changes needed
- Skip to Step 3

**Option B: Repository Pages** (e.g., `username.github.io/flodoc`)

Edit `.github/workflows/deploy.yml` line 45:

```yaml
# Change from:
VITE_BASE_PATH: '/'

# To (replace 'flodoc' with your repository name):
VITE_BASE_PATH: '/flodoc/'
```

**Important**: Include both leading and trailing slashes!

## Step 3: Push to Main

```bash
git add .
git commit -m "feat: enable GitHub Pages deployment"
git push origin main
```

## Step 4: Verify Deployment

1. Go to **Actions** tab in your repository
2. Watch the "Deploy to GitHub Pages" workflow
3. Wait for both "build" and "deploy" jobs to complete (green checkmark)
4. Click on the workflow run to see the deployment URL

## Step 5: Access Your Site

Your site will be available at:

- **Custom Domain**: `https://your-domain.com`
- **Repository Pages**: `https://username.github.io/repository-name/`

## Troubleshooting

### "Deploy to GitHub Pages" workflow not found

- Ensure you've pushed the `.github/workflows/deploy.yml` file
- Check that the file is on the `main` branch

### Deployment fails with "Permission denied"

1. Go to **Settings** > **Actions** > **General**
2. Scroll to "Workflow permissions"
3. Select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

### Site shows 404

- Verify GitHub Pages source is set to "GitHub Actions" (not a branch)
- Check that `VITE_BASE_PATH` matches your deployment URL
- Wait 5-10 minutes for deployment to propagate

### Routes return 404 when refreshed

- This should be handled automatically by the `404.html` file
- Verify the build created `apps/web/dist/404.html`
- Check browser console for errors

## Custom Domain Setup (Optional)

### Add CNAME File

Create `apps/web/public/CNAME`:

```
docs.example.com
```

### Configure DNS

At your domain provider, add:

**Option A: A Records**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**Option B: CNAME Record**
```
username.github.io
```

### Enable in GitHub

1. Go to **Settings** > **Pages**
2. Under "Custom domain", enter: `docs.example.com`
3. Click **Save**
4. Wait for DNS check (can take 24-48 hours)
5. Check **Enforce HTTPS** once DNS is verified

## Manual Deployment

To deploy without pushing to main:

1. Go to **Actions** tab
2. Click "Deploy to GitHub Pages"
3. Click **Run workflow** (right side)
4. Select branch: `main`
5. Click **Run workflow**

## Next Steps

- Read the comprehensive guide: `.docs/deployment/github-pages.md`
- Set up custom domain (optional)
- Configure monitoring and analytics
- Add deployment status badge to README

## Support

For detailed documentation and troubleshooting:
- See: `.docs/deployment/github-pages.md`
- GitHub Pages Docs: https://docs.github.com/en/pages
- GitHub Actions Docs: https://docs.github.com/en/actions
