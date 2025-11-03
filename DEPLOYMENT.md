# Deployment Guide

## Prerequisites
- Node.js 18+ installed
- npm installed
- Git repository (optional)

## Building for Production

1. Install dependencies:
```bash
npm install
```

2. Generate PWA icons:
```bash
npm run generate-icons
```

3. Build the production bundle:
```bash
npm run build
```

The built files will be in the `build/` directory.

## Deployment Options

### 1. Netlify (Recommended)

#### Using Netlify CLI:
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=build
```

#### Using Netlify UI:
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the `build/` folder
4. Your site will be live immediately

#### Using Git:
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `build`

### 2. Vercel

#### Using Vercel CLI:
```bash
npm install -g vercel
vercel --prod
```

#### Using Vercel UI:
1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Framework preset: SvelteKit
4. Build command: `npm run build`
5. Output directory: `build`

### 3. GitHub Pages

1. Install gh-pages:
```bash
npm install -D gh-pages
```

2. Add to package.json scripts:
```json
"deploy": "npm run build && gh-pages -d build"
```

3. Deploy:
```bash
npm run deploy
```

4. Configure custom domain (optional) in repository settings

### 4. Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

2. Configure firebase.json:
```json
{
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

3. Deploy:
```bash
npm run build
firebase deploy
```

### 5. Cloudflare Pages

1. Push to Git repository
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
3. Connect repository
4. Build command: `npm run build`
5. Build output directory: `build`

### 6. Static Hosting (Generic)

Any static hosting service works. Just upload the `build/` directory:
- AWS S3 + CloudFront
- DigitalOcean Spaces
- Azure Static Web Apps
- Google Cloud Storage

## Environment Configuration

No environment variables needed! The app is fully client-side.

Users configure their own OpenAI API key through the app's settings.

## HTTPS Requirement

PWAs require HTTPS to work properly. All recommended hosting providers automatically provide SSL certificates.

For local testing, use `localhost` (which is exempt from HTTPS requirement).

## Custom Domain

Most hosting providers support custom domains:

1. Add custom domain in hosting provider dashboard
2. Update DNS records:
   - For Netlify/Vercel: Add CNAME or A record
   - For GitHub Pages: Add CNAME file to repository
3. Enable automatic HTTPS (usually automatic)

## Post-Deployment Checklist

- [ ] Test app on mobile browser
- [ ] Verify "Add to Home Screen" prompt appears
- [ ] Test image upload
- [ ] Verify IndexedDB works
- [ ] Test PWA offline functionality
- [ ] Check service worker registration (DevTools → Application)
- [ ] Verify manifest.json loads correctly
- [ ] Test on both Android and iOS
- [ ] Verify icons display correctly

## Performance Optimization

The app is already optimized:
- ✅ Code splitting
- ✅ Image compression
- ✅ Service worker caching
- ✅ Minimal bundle size
- ✅ Lazy loading

## Monitoring

Since this is a static app with no backend:
- Use browser DevTools for debugging
- Monitor hosting provider for uptime
- Check user feedback for issues

## Updates

To deploy updates:
1. Make changes to code
2. Run `npm run build`
3. Deploy `build/` directory
4. Service worker will update automatically for users

## Troubleshooting

### App not installing as PWA
- Verify HTTPS is enabled
- Check manifest.json is accessible
- Verify icons are generated and accessible
- Check service worker registration in DevTools

### Images not loading
- Check IndexedDB quota (usually 50MB+)
- Verify image compression is working
- Check browser console for errors

### Data not persisting
- Verify IndexedDB is enabled in browser
- Check for Private/Incognito mode (storage may be limited)
- Ensure users aren't clearing browser data

### Service worker not updating
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Unregister old service worker in DevTools
- Clear cache and reload

## Security Notes

- No server-side code to secure
- API keys stored in user's localStorage only
- No authentication needed
- No user data transmitted to your servers
- Users' OpenAI API keys go directly to OpenAI

## Costs

- Hosting: Free for all recommended providers (with generous limits)
- OpenAI API: Users pay for their own API usage
- No ongoing maintenance costs

