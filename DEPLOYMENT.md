# Deployment Guide

## Quick Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Prerequisites
- GitHub/GitLab/Bitbucket account
- Code pushed to a repository

### Steps

1. **Push Your Code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Portfolio OS"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings
   - Click "Deploy"

3. **Done!** Your site will be live at `your-project.vercel.app`

### Custom Domain

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

---

## Deploy to Netlify

### Using Git

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Deploy**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Configure build settings (see above)
   - Deploy

### Manual Deploy

```bash
# Build the project
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

---

## Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Next.js
5. Deploy

---

## Deploy to DigitalOcean App Platform

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your repository
4. Configure:
   - Build Command: `npm run build`
   - Run Command: `npm start`
5. Deploy

---

## Deploy to AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your repository
4. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
5. Deploy

---

## Docker Deployment

### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build image
docker build -t portfolio-os .

# Run container
docker run -p 3000:3000 portfolio-os
```

### Deploy to Docker Hub

```bash
# Tag image
docker tag portfolio-os yourusername/portfolio-os

# Push to Docker Hub
docker push yourusername/portfolio-os
```

---

## Environment Variables

If you add features requiring environment variables (analytics, APIs, etc.):

### Vercel
1. Go to Project Settings → Environment Variables
2. Add your variables
3. Redeploy

### Netlify
1. Go to Site Settings → Environment Variables
2. Add your variables
3. Redeploy

### Other Platforms
Check their documentation for environment variable setup.

**Example `.env.local` (not committed to Git):**
```bash
NEXT_PUBLIC_ANALYTICS_ID=your-id
NEXT_PUBLIC_API_URL=https://api.example.com
```

---

## Post-Deployment Checklist

- [ ] Test all pages and app views
- [ ] Verify PWA installation works (mobile)
- [ ] Check responsiveness on multiple devices
- [ ] Test all links and contact forms
- [ ] Verify animations are smooth
- [ ] Run Lighthouse audit in Chrome DevTools
- [ ] Set up analytics (Google Analytics, Plausible, etc.)
- [ ] Add custom domain (if applicable)
- [ ] Set up SSL certificate (automatic on most platforms)
- [ ] Configure error tracking (Sentry, LogRocket)

---

## Performance Optimization

### Enable Compression

Most platforms enable this by default. Verify:
- Gzip or Brotli compression enabled
- Asset caching configured

### CDN Configuration

Vercel, Netlify, and others use global CDNs by default. No configuration needed.

### Image Optimization

Next.js handles this automatically, but ensure:
- Images are properly sized
- Use WebP/AVIF formats
- Lazy loading is enabled

---

## Monitoring

### Analytics

**Google Analytics:**
```bash
npm install @next/third-parties
```

**Plausible (privacy-friendly):**
```bash
npm install next-plausible
```

### Error Tracking

**Sentry:**
```bash
npm install @sentry/nextjs
```

**LogRocket:**
```bash
npm install logrocket
```

### Performance Monitoring

Use built-in tools:
- Vercel Analytics (automatic on Vercel)
- Chrome DevTools Lighthouse
- WebPageTest.org

---

## Continuous Deployment

All Git-based deployments (Vercel, Netlify, etc.) support automatic deployments:

1. Push to `main` branch → Auto-deploy to production
2. Push to other branches → Auto-deploy to preview URLs
3. Pull requests → Auto-generate preview deployments

---

## Rollback

### Vercel
1. Go to Deployments tab
2. Find previous successful deployment
3. Click "Promote to Production"

### Netlify
1. Go to Deploys tab
2. Find previous deployment
3. Click "Publish deploy"

### Git-based Rollback
```bash
git revert HEAD
git push origin main
```

---

## Troubleshooting

### Build Fails

**Check build logs:**
- Ensure all dependencies are in `package.json`
- Verify Node.js version (18+)
- Check for TypeScript errors

**Common fixes:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### 404 Errors

Ensure your platform supports Next.js dynamic routing:
- Vercel: Automatic
- Netlify: Add `netlify.toml`
- Others: Check documentation

### Slow Load Times

- Enable edge caching
- Optimize images
- Reduce JavaScript bundle size
- Enable compression

### PWA Not Installing

- Verify `manifest.json` is accessible
- Check icon files exist
- Ensure HTTPS is enabled
- Test on different browsers

---

## Support & Resources

- **Next.js Deployment Docs:** [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)

---

**Your Portfolio OS is ready for the world! 🚀**
