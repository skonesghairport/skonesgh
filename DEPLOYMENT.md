# Deployment Guide

This document provides comprehensive information about deploying and monitoring the skonesgh security management application on Vercel.

## Table of Contents

1. [Overview](#overview)
2. [Deployment Status](#deployment-status)
3. [Build Configuration](#build-configuration)
4. [Vercel Speed Insights](#vercel-speed-insights)
5. [Monitoring & Debugging](#monitoring--debugging)
6. [Troubleshooting](#troubleshooting)

---

## Overview

**Project Name:** skonesgh (Security Management App)  
**Framework:** Vite + React + Express (Custom Node.js server)  
**Hosting:** Vercel  
**Production URL:** https://skonesgh.vercel.app  
**Repository:** https://github.com/skonesghairport/skonesgh

### Technology Stack

- **Frontend:** React 19, TypeScript, Vite
- **Backend:** Express.js (Node.js)
- **Database:** MySQL (Drizzle ORM)
- **Package Manager:** pnpm
- **Performance Monitoring:** Vercel Speed Insights
- **Build Tool:** Vite + esbuild

---

## Deployment Status

### Latest Deployment

- **Status:** ⚠️ Action Required
- **Last Build:** 2026-08-13 18:09 UTC (5 minutes ago)
- **Commit:** `2fa247ad` (Merge PR #3 - Install Vercel Speed Insights)
- **Branch:** main
- **Result:** Build completed, code changes merged

### Recent Workflow Runs

| Run | Commit | Status | Date | Issue |
|-----|--------|--------|------|-------|
| #3 | 2fa247ad | ❌ Failed | Aug 13, 18:09 | GitHub Actions permission error |
| #2 | d3e2215b | ❌ Failed | Aug 9, 05:30 | GitHub Actions permission error |
| #1 | 460d52ec | ❌ Failed | Aug 8, 17:18 | GitHub Actions permission error |

### Issue: GitHub Actions Permission Error

**Error Message:**
```
remote: Permission to skonesghairport/skonesgh.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/skonesghairport/skonesgh.git/': The requested URL returned error: 403
```

**Root Cause:** The GitHub Actions workflow (`push-to-github.yml`) attempts to push code back to GitHub but lacks proper authentication credentials.

**Solution:**
The workflow is unnecessary for Vercel deployments. Vercel automatically triggers deployments when you push to the main branch. **This workflow can be disabled or removed.**

---

## Build Configuration

### vercel.json Configuration

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "other",
  "outputDirectory": "dist",
  "env": {
    "NODE_ENV": "production"
  },
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
}
```

### Build Process

1. **Install:** `pnpm install`
2. **Build:** 
   ```bash
   vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
   ```
3. **Output Directory:** `dist/`
4. **Start Command:** `NODE_ENV=production node dist/index.js`

### Key Build Considerations

✅ **Vite Client Build:**
- Bundles React application
- Outputs to `dist/public/`
- Includes all client assets and CSS

✅ **esbuild Server Build:**
- Bundles Express server
- Outputs to `dist/index.js`
- External dependencies preserved for Node.js runtime

✅ **URL Rewrites:**
- API routes (`/api/*`) proxied to Express server
- All other routes fall back to `index.html` for client-side routing

---

## Vercel Speed Insights

### What is Speed Insights?

Vercel Speed Insights is a Real User Monitoring (RUM) solution that collects Web Vitals data from your production application:

- **Core Web Vitals:**
  - Largest Contentful Paint (LCP)
  - Cumulative Layout Shift (CLS)
  - Interaction to Next Paint (INP)
  - Time to First Byte (TTFB)

- **Additional Metrics:**
  - First Paint (FP)
  - First Contentful Paint (FCP)
  - Time to Interactive (TTI)

### Integration Status

✅ **Package Installed:** `@vercel/speed-insights@^2.0.0`  
✅ **Component Added:** `<SpeedInsights />` in `client/src/App.tsx`  
✅ **Deployment Config:** Configured in `vercel.json`

### Accessing Speed Insights Dashboard

1. Go to your Vercel project: https://vercel.com/skonesghairports-projects/skonesgh
2. Navigate to the **Speed Insights** tab
3. View real-time metrics and performance trends

**Note:** Data appears after your application receives traffic from production users.

### Speed Insights Limitations

- ⏱️ Real User Monitoring (requires actual user traffic)
- 📊 Data appears after ~5-10 minutes of initial traffic
- 🔍 Cannot be seen in local development or preview deployments until they receive traffic
- 📈 Historical data retained for 90 days

---

## Monitoring & Debugging

### 1. Check Deployment Status on Vercel

```bash
# Using Vercel CLI (if installed)
vercel projects list
vercel deployment list
```

Or access directly: https://vercel.com/skonesghairport/skonesgh/deployments

### 2. View Build Logs

**On Vercel Dashboard:**
1. Go to your project
2. Click **Deployments**
3. Select the most recent deployment
4. Click **View Build Logs**

### 3. Monitor Application Logs

**Production Errors:**
- Check Vercel project logs: https://vercel.com/skonesghairport/skonesgh/logs

**Client-side Errors:**
- Browser console (F12 in production)
- Check Speed Insights for performance bottlenecks

### 4. Database Connectivity

The app uses MySQL with Drizzle ORM. Ensure:
- ✅ Database URL is set in Vercel environment variables
- ✅ MySQL connection credentials are correct
- ✅ Firewall rules allow connections from Vercel's IP ranges

Set environment variable in Vercel:
```
DATABASE_URL=mysql://user:password@host:3306/database
```

### 5. Performance Analysis

Use Lighthouse (Chrome DevTools) on production:
1. Visit https://skonesgh.vercel.app
2. Open Chrome DevTools (F12)
3. Go to **Lighthouse** tab
4. Click **Analyze page load**

Compare results with Speed Insights data.

---

## Troubleshooting

### Issue: "Build failed" on Vercel

**Check:**
1. Verify `vercel.json` is at root of repository
2. Ensure all dependencies are in `package.json`
3. Check for TypeScript compilation errors: `pnpm check`
4. Run build locally: `pnpm build`

**Local Build Test:**
```bash
pnpm install
pnpm build
NODE_ENV=production node dist/index.js
```

### Issue: "Cannot find module" errors

**Solutions:**
1. Ensure all imports use correct paths relative to `tsconfig.json` path aliases
2. Check that external dependencies are listed in `dependencies` (not `devDependencies`)
3. Run `pnpm install` and verify lock file is committed

### Issue: Speed Insights not collecting data

**Check:**
1. Is `<SpeedInsights />` component rendering? (Look in React DevTools)
2. Is app deployed to Vercel production (not preview)?
3. Does production URL have actual user traffic?
4. Check browser console for errors related to `@vercel/speed-insights`

**Enable in Vercel Dashboard:**
1. Go to Project Settings
2. Navigate to **Analytics** section
3. Ensure Speed Insights is **enabled**

### Issue: Slow Build Time

**Optimization Tips:**
1. Reduce bundle size (split code, remove unused dependencies)
2. Use `pnpm` instead of npm (faster)
3. Enable Vercel cache for dependencies
4. Check for large files in source code

Set cache in `vercel.json`:
```json
{
  "buildCommand": "pnpm build",
  "cacheDirectories": ["node_modules", ".next", "dist"]
}
```

### Issue: Environment Variables Not Available

**Set in Vercel Dashboard:**
1. Go to Project Settings
2. Click **Environment Variables**
3. Add variables for:
   - `DATABASE_URL`
   - `NODE_ENV` (should be `production`)
   - Any other API keys or secrets

**Local Testing:**
Create `.env.local` with variables, then run `pnpm dev`

---

## Deployment Checklist

Before deploying to production:

- [ ] Run `pnpm check` (TypeScript type checking)
- [ ] Run `pnpm test` (unit tests)
- [ ] Run `pnpm build` locally (verify build succeeds)
- [ ] Verify `vercel.json` is at repository root
- [ ] Confirm all environment variables are set in Vercel
- [ ] Test database connection strings
- [ ] Review Git commit history (no sensitive data in code)
- [ ] Merge PR to `main` branch
- [ ] Monitor Vercel build logs after push

---

## Environment Variables Required

Add these to Vercel project settings:

```
DATABASE_URL=<mysql-connection-string>
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://skonesgh.vercel.app
```

Customize based on your application needs.

---

## Useful Resources

- **Vercel Docs:** https://vercel.com/docs
- **Speed Insights:** https://vercel.com/docs/speed-insights
- **Vite Guide:** https://vitejs.dev
- **Express.js:** https://expressjs.com
- **Drizzle ORM:** https://orm.drizzle.team

---

## Support

For issues:
1. Check this guide's Troubleshooting section
2. Review Vercel build logs
3. Check GitHub Actions logs
4. Contact Vercel support at https://vercel.com/support

Last Updated: 2026-08-13
