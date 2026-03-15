# Deployment Guide for Render

## Prerequisites
- GitHub repository with your code
- Render account (free tier available)

## Step 1: Commit and Push Changes

```bash
# Add all changes
git add .

# Commit with message
git commit -m "Add SAR info section and prepare for deployment"

# Push to GitHub
git push origin master
```

## Step 2: Deploy on Render

### Option A: Using render.yaml (Recommended)

1. **Go to Render Dashboard**
   - Visit https://render.com
   - Sign in with your GitHub account

2. **Create New Service**
   - Click "New +" button
   - Select "Blueprint"
   - Connect your GitHub repository: `pushpendar881/hrsid_ship_detection_SAR`

3. **Configure Blueprint**
   - Render will automatically detect your `render.yaml` file
   - Service name: `shipsense-frontend`
   - Environment: `static`
   - Build command: `npm install && npm run build`
   - Publish directory: `./dist`

4. **Deploy**
   - Click "Apply" to start deployment
   - Wait for build to complete (usually 2-5 minutes)

### Option B: Manual Setup

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Connect GitHub repository

2. **Configure Settings**
   - **Name**: `shipsense-frontend`
   - **Branch**: `master`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Environment Variables** (if needed)
   - No environment variables required for this project

4. **Deploy**
   - Click "Create Static Site"

## Step 3: Custom Domain (Optional)

1. **Free Subdomain**
   - Render provides: `https://shipsense-frontend.onrender.com`

2. **Custom Domain**
   - Go to Settings → Custom Domains
   - Add your domain
   - Update DNS records as instructed

## Step 4: Automatic Deployments

- **Auto-deploy**: Enabled by default
- **Branch**: `master`
- Every push to master will trigger a new deployment

## Troubleshooting

### Build Fails
```bash
# Check package.json scripts
npm run build

# Ensure all dependencies are in package.json
npm install
```

### 404 Errors on Refresh
- The `render.yaml` includes SPA routing configuration
- All routes redirect to `/index.html`

### Environment Variables
```yaml
# Add to render.yaml if needed
services:
  - type: web
    name: shipsense-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_API_URL
        value: https://your-api-url.com
```

## Expected Build Output

```
✓ Building for production...
✓ 67 modules transformed.
dist/index.html                   0.46 kB
dist/assets/index-[hash].css      8.23 kB │ gzip: 2.31 kB
dist/assets/index-[hash].js     156.78 kB │ gzip: 50.12 kB
✓ built in 3.45s
```

## Post-Deployment

1. **Test the Application**
   - Visit your Render URL
   - Test image upload functionality
   - Verify all sections load correctly

2. **Monitor Performance**
   - Check Render dashboard for metrics
   - Monitor build times and errors

3. **Update DNS** (if using custom domain)
   - Point your domain to Render's servers
   - Enable HTTPS (automatic with Render)

## Render.yaml Configuration Explained

```yaml
services:
  - type: web              # Static web service
    name: shipsense-frontend  # Service name
    env: static             # Static site environment
    buildCommand: npm install && npm run build  # Build process
    staticPublishPath: ./dist  # Vite output directory
    routes:
      - type: rewrite       # SPA routing support
        source: /*          # All routes
        destination: /index.html  # Redirect to index.html
```

## Cost

- **Free Tier**: 750 hours/month (sufficient for most projects)
- **Paid Plans**: Start at $7/month for unlimited hours
- **Bandwidth**: 100GB/month on free tier

## Support

- **Documentation**: https://render.com/docs
- **Community**: https://community.render.com
- **Status**: https://status.render.com

Your application will be available at:
`https://shipsense-frontend.onrender.com`