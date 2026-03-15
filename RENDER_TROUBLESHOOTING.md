# Render Deployment Troubleshooting

## Issue: "vite: Permission denied"

This is a common issue on Render. Here are the solutions:

### Solution 1: Update Your Repository

Commit and push these changes:

```bash
git add .
git commit -m "Fix Render deployment configuration"
git push origin master
```

### Solution 2: Manual Render Configuration

If the render.yaml still doesn't work, configure manually:

1. **Go to Render Dashboard**
2. **Delete the existing service** (if created)
3. **Create New Static Site** (not Blueprint)
4. **Configure these settings:**

   - **Repository**: `pushpendar881/hrsid_ship_detection_SAR`
   - **Branch**: `master`
   - **Build Command**: `npm ci --only=production=false && npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: `18` (in Environment Variables)

### Solution 3: Alternative Build Commands

Try these build commands in order:

1. `npm ci --only=production=false && npm run build`
2. `npm install --production=false && npx vite build`
3. `yarn install && yarn build`
4. `npm install && ./node_modules/.bin/vite build`

### Solution 4: Vercel Deployment (Alternative)

If Render continues to fail, deploy on Vercel:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Or use Vercel Dashboard**:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Auto-detects Vite configuration

### Solution 5: Netlify Deployment (Alternative)

1. **Go to https://netlify.com**
2. **Drag and drop your `dist` folder** (after running `npm run build` locally)
3. **Or connect GitHub repository**:
   - Build command: `npm run build`
   - Publish directory: `dist`

## Current Configuration Files

### render.yaml
```yaml
services:
  - type: web
    name: shipsense-frontend
    env: static
    buildCommand: npm ci --only=production=false && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
    envVars:
      - key: NODE_VERSION
        value: 18
```

### package.json (updated)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "postinstall": "chmod +x node_modules/.bin/vite"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### .nvmrc
```
18
```

## Expected Success Output

```
==> Building...
> shipsense-frontend@0.0.0 build
> vite build

✓ building for production...
✓ 67 modules transformed.
dist/index.html                   0.46 kB
dist/assets/index-[hash].css      8.23 kB │ gzip: 2.31 kB  
dist/assets/index-[hash].js     156.78 kB │ gzip: 50.12 kB
✓ built in 3.45s
==> Build succeeded 🎉
```

## If All Else Fails

### Local Build Test
```bash
# Test locally first
npm install
npm run build
npm run preview
```

### Manual Upload
1. Build locally: `npm run build`
2. Upload `dist` folder to any static hosting
3. Configure SPA routing (redirect all to index.html)

## Alternative Hosting Options

1. **Vercel** - Best for React apps
2. **Netlify** - Great free tier
3. **GitHub Pages** - Free with GitHub
4. **Firebase Hosting** - Google's solution
5. **Surge.sh** - Simple static hosting

Your app should work on any of these platforms!