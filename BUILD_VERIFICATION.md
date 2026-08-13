# Build Verification Guide

This guide ensures your build configuration is working correctly and tests it both locally and in production.

## Quick Start

### 1. Local Build Verification

Verify the build works on your machine:

```bash
# Install dependencies
pnpm install

# Run type checking
pnpm check

# Run tests
pnpm test

# Build the application
pnpm build

# Verify build outputs
ls -la dist/
```

**Expected Outputs:**
- `dist/index.js` - Server executable (esbuild output)
- `dist/public/` - Client assets (Vite output)

### 2. Local Server Test

Test the built application locally:

```bash
# Set production environment
export NODE_ENV=production

# Start the server
node dist/index.js

# Visit in browser
# http://localhost:3000 (or your configured port)
```

### 3. Verify Build Configuration

```bash
# Check vercel.json exists and is valid
test -f vercel.json && echo "✅ vercel.json found"

# Validate JSON syntax
pnpm json-validate vercel.json 2>/dev/null || cat vercel.json | jq .

# Check package.json build script
cat package.json | jq '.scripts.build'
```

---

## Build Configuration Checklist

### ✅ vercel.json Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `buildCommand` | `pnpm build` | Installs deps and creates optimized bundle |
| `installCommand` | `pnpm install` | Uses pnpm lock file for reproducible builds |
| `devCommand` | `pnpm dev` | Development server command |
| `framework` | `other` | Custom Express server (not standard framework) |
| `outputDirectory` | `dist` | Final build artifacts location |
| `env.NODE_ENV` | `production` | Sets environment to production |

### ✅ URL Rewrites

```json
"rewrites": [
  {
    "source": "/api/(.*)",
    "destination": "/api/$1"
  },
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

**Why These Rewrites?**
- API requests go to Express server (`/api/*`)
- Client routes fall back to `index.html` for React Router
- Enables Single Page Application (SPA) behavior

### ✅ Build Pipeline

```
vercel.json (build instructions)
    ↓
pnpm install (dependencies)
    ↓
pnpm build (runs build script from package.json)
    ├─ vite build (React app → dist/public/)
    └─ esbuild (Express server → dist/index.js)
    ↓
Node.js Runtime
    ↓
dist/index.js (entry point)
```

---

## Deployment Workflow

### Phase 1: GitHub Push

```bash
git add .
git commit -m "feat: your feature"
git push origin main
```

### Phase 2: Vercel Detection

Vercel automatically:
1. Clones repository
2. Reads `vercel.json`
3. Runs build commands in sequence

**Build Output Example:**
```
Installing dependencies...
> pnpm install

Building...
> pnpm build

Building client...
✓ built in 4.23s

Building server...
✓ built in 2.15s

Build completed successfully!
Duration: 87s
```

### Phase 3: Deploy to Production

```
Deployment URL: https://skonesgh.vercel.app
Preview URLs: https://skonesgh-{hash}.vercel.app
```

---

## Verifying Production Build

### 1. Check Deployment on Vercel

Go to: https://vercel.com/skonesghairport/skonesgh/deployments

**Look for:**
- ✅ Most recent deployment shows **READY**
- ✅ Build took < 2 minutes
- ✅ No build errors in logs

### 2. Test Production URL

```bash
# Check if site is accessible
curl -I https://skonesgh.vercel.app

# Expected: HTTP/2 200 OK
```

### 3. Verify API Routes Work

```bash
# Test API route (adjust to your actual API)
curl https://skonesgh.vercel.app/api/health

# Should return valid JSON or expected response
```

### 4. Check Network Tab

In browser DevTools (F12):
1. Go to **Network** tab
2. Reload page
3. Verify:
   - Initial HTML loads
   - JavaScript bundles load
   - API calls succeed (status 200)
   - No 404s on assets

### 5. Performance Check

Run Lighthouse:
```bash
# Using Chrome DevTools
1. F12 → Lighthouse tab
2. Click "Analyze page load"
3. Review metrics
```

Or use PageSpeed Insights: https://pagespeed.web.dev/

---

## Environment Variables Verification

### Required Environment Variables

Add these in Vercel project settings:

```env
DATABASE_URL=mysql://user:password@host:3306/db
NODE_ENV=production
```

### Verify Variables Are Set

1. Vercel Dashboard → Project Settings → Environment Variables
2. Confirm variables are listed and set to correct values
3. **Note:** Values are hidden after creation for security

### Test Variable Access in Code

In your Express server:
```typescript
console.log("Database URL:", process.env.DATABASE_URL);
console.log("Node Env:", process.env.NODE_ENV);
```

Check Vercel logs to confirm values are accessible.

---

## Common Build Issues

### Issue: Build Timeout

**Symptoms:**
- Build takes > 15 minutes
- Times out before completion

**Solutions:**
1. Reduce bundle size
2. Remove unused dependencies
3. Cache dependencies in `vercel.json`:
   ```json
   {
     "cacheDirectories": ["node_modules", "dist"]
   }
   ```

### Issue: Out of Memory

**Symptoms:**
- Error: `JavaScript heap out of memory`

**Solutions:**
1. Increase Node.js memory limit:
   ```json
   {
     "buildCommand": "NODE_OPTIONS=--max-old-space-size=4096 pnpm build"
   }
   ```
2. Reduce bundle size

### Issue: TypeScript Compilation Errors

**Symptoms:**
- Build fails with TypeScript errors
- Example: `Type 'X' is not assignable to type 'Y'`

**Solutions:**
1. Run locally: `pnpm check`
2. Fix TypeScript errors
3. Verify `tsconfig.json` is correct
4. Check path aliases match actual file structure

### Issue: Missing Dependencies

**Symptoms:**
- Error: `Cannot find module '@vercel/speed-insights'`

**Solutions:**
1. Run: `pnpm install @vercel/speed-insights`
2. Verify in `package.json` (should be in `dependencies`)
3. Commit `pnpm-lock.yaml`

---

## Monitoring Build Performance

### Build Metrics

Track these on Vercel dashboard:

1. **Build Duration** - Should be < 2 minutes
2. **Build Success Rate** - Should be 100%
3. **File Size** - Monitor bundle size growth
4. **Memory Usage** - Should stay < 1GB

### Optimize Build Speed

| Optimization | Benefit | Effort |
|--------------|---------|--------|
| Enable Vercel cache | 30-50% faster | ⭐ Easy |
| Remove unused deps | 20-30% smaller | ⭐ Easy |
| Enable SWC/esbuild | 40-60% faster | ⭐⭐ Medium |
| Tree-shake unused code | 15-25% smaller | ⭐⭐ Medium |
| Lazy load routes | Better LCP | ⭐⭐⭐ Hard |

---

## Continuous Verification

### Automated Checks

Set up GitHub Actions to verify builds locally before pushing:

```yaml
name: Build Check
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm check
      - run: pnpm test
      - run: pnpm build
```

### Pre-commit Hooks

Verify builds before committing:

```bash
# Install husky
pnpm add -D husky

# Add pre-commit hook
npx husky add .husky/pre-commit "pnpm check && pnpm build"
```

---

## Deployment Status Dashboard

### Access Points

| Resource | URL |
|----------|-----|
| Main Site | https://skonesgh.vercel.app |
| Deployments | https://vercel.com/skonesghairport/skonesgh/deployments |
| Build Logs | https://vercel.com/skonesghairport/skonesgh/deployments (select deployment) |
| Speed Insights | https://vercel.com/skonesghairport/skonesgh/speed-insights |
| Analytics | https://vercel.com/skonesghairport/skonesgh/analytics |

---

## Rollback Procedure

If deployment fails:

1. **Check Logs:** View build error in Vercel dashboard
2. **Fix Locally:** Reproduce issue with `pnpm build`
3. **Commit Fix:** Push corrected code to `main`
4. **Redeploy:** Vercel will automatically rebuild
5. **Verify:** Check deployment status and test site

---

## Testing Checklist

Before considering deployment successful:

- [ ] ✅ Local build succeeds (`pnpm build`)
- [ ] ✅ No TypeScript errors (`pnpm check`)
- [ ] ✅ Tests pass (`pnpm test`)
- [ ] ✅ Server starts without errors (`node dist/index.js`)
- [ ] ✅ Vercel deployment shows READY status
- [ ] ✅ Site loads at https://skonesgh.vercel.app
- [ ] ✅ API endpoints respond correctly
- [ ] ✅ No console errors in browser
- [ ] ✅ Database connections work
- [ ] ✅ Speed Insights data collecting (after traffic)

---

## Support & Resources

- **Vercel CLI Docs:** https://vercel.com/docs/cli
- **Build Configuration:** https://vercel.com/docs/projects/project-configuration
- **Common Issues:** https://vercel.com/help
- **Status Page:** https://www.vercelstatus.com

Last Updated: 2026-08-13
