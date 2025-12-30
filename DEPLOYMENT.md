# Deployment Guide - Vercel

## Quick Deploy

### Option 1: Vercel Dashboard (Recommended)

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Vite settings
   - Click "Deploy"

3. **Done!** Your app will be live in ~30 seconds

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? tupaci (or your choice)
# - Directory? ./
# - Override settings? No
```

## Environment Variables (if using API)

If you add a live score API later:

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add: `VITE_API_KEY` = `your_api_key_here`
4. Redeploy

## Custom Domain (Optional)

1. Go to your project on Vercel
2. Settings → Domains
3. Add your custom domain
4. Follow DNS instructions

## Build Settings

Vercel automatically detects Vite, but if needed:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

These are already configured in `vercel.json`.
