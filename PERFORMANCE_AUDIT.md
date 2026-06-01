# Portfolio Performance Audit & Optimization Roadmap

**Date:** May 31, 2026  
**Current Stack:** Next.js 16 + TypeScript + React 19 + Tailwind CSS + Three.js + GSAP + Framer Motion

---

## Executive Summary

Your portfolio is built with modern, performant technologies. However, several optimization opportunities exist to improve loading speeds, Core Web Vitals, and overall user experience—especially given the heavy dependencies (3D graphics, animations, email service).

**Current Metrics to Target:**
- Lighthouse Score: 90+ (Core Web Vitals)
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s
- Bundle Size: < 250KB (gzipped)

---

## 🔴 Critical Issues

### 1. **Heavy Animation Libraries (GSAP + Framer Motion + Three.js)**
- **Problem:** Three.js alone adds ~150KB (gzipped). GSAP (~35KB) and Framer Motion (~40KB) are duplicative for many effects.
- **Impact:** Significant JavaScript payload increases FCP/LCP.
- **Priority:** HIGH

**Solutions:**
- Use Framer Motion as the primary animation library (more React-friendly, smaller ecosystem).
- Replace GSAP with Framer Motion where possible.
- Lazy-load Three.js only on sections that need 3D (e.g., background effect, specific component).
- Consider lightweight alternatives: `react-spring`, `motion` (Framer's core).

### 2. **No Image Optimization**
- **Problem:** If using external images (portfolio previews, profile pics), no next/image component detected.
- **Impact:** Unoptimized images = slower LCP, higher bandwidth.
- **Priority:** HIGH

**Solutions:**
- Audit all image usage in `src/components/sections/`.
- Replace all `<img>` with `<Image>` from `next/image`.
- Set `priority` for above-the-fold images.
- Use WebP/AVIF with fallbacks.

### 3. **Client-Side Heavy Rendering**
- **Problem:** No evidence of Server Components or SSG optimization for static sections.
- **Impact:** Higher hydration time, potential layout shifts.
- **Priority:** MEDIUM-HIGH

**Solutions:**
- Migrate static sections to Server Components.
- Use `'use client'` only where interactivity is essential.
- Leverage `Suspense` for streaming static content.

### 4. **Oversized Chart Library (Chart.js)**
- **Problem:** chart.js + react-chartjs-2 = ~50KB gzipped (if used).
- **Impact:** Unnecessary bloat if charts are simple.
- **Priority:** MEDIUM

**Solutions:**
- Audit actual chart usage.
- Consider SVG-based charts or `recharts` (more tree-shakeable).
- Lazy-load chart components on demand.

---

## 🟡 High-Priority Optimizations

### 5. **CSS Bundle Optimization**
- **Problem:** Tailwind CSS may have unused utility classes in production build.
- **Impact:** Larger CSS payload.
- **Priority:** MEDIUM-HIGH

**Solutions:**
- Ensure Tailwind purging is aggressive in `tailwind.config.ts`.
- Use CSS Modules for component-scoped styles.
- Audit global CSS for duplicates/unused rules.

### 6. **Font Loading (No `next/font` Detected)**
- **Problem:** Using system fonts or potentially slow external fonts without optimization.
- **Impact:** Potential layout shift (CLS), slower FCP.
- **Priority:** MEDIUM

**Solutions:**
- Use `next/font` for local or Google Fonts with `font-display: swap`.
- Preload critical fonts in `<head>`.
- Subset fonts to used characters only.

### 7. **Lenis Smooth Scroll Library**
- **Problem:** Smooth scroll adds ~10KB, can conflict with native scroll performance.
- **Impact:** Minor bundle impact; potential jank on low-end devices.
- **Priority:** LOW-MEDIUM

**Solutions:**
- Measure actual impact on CLS/FCP before removing.
- Consider CSS `scroll-behavior: smooth` as a lightweight alternative if smooth scroll is secondary.
- Ensure Lenis is lazy-loaded if not on all pages.

### 8. **EmailJS Dependency**
- **Problem:** Adds network overhead for contact form validation.
- **Impact:** Contact form may cause network waterfall.
- **Priority:** MEDIUM

**Solutions:**
- Lazy-load EmailJS only on the contact section.
- Prefetch/preconnect to EmailJS CDN.
- Add request debouncing/throttling.

---

## 🟢 Medium-Priority Improvements

### 9. **SEO & Metadata**
- **Status:** ✅ Good! Layout.tsx has comprehensive metadata + JSON-LD.
- **Opportunity:** Add dynamic Open Graph images, structured data for skills/experience.
- **Priority:** LOW-MEDIUM

**Solutions:**
- Add `next-sitemap` for automatic sitemap generation.
- Generate dynamic OG images for social sharing.
- Validate structured data with Google Rich Results Test.

### 10. **Build Output & Static Export**
- **Status:** ✅ Good! Using `output: 'export'` for GitHub Pages.
- **Opportunity:** Verify all API calls are eliminated; no fallback to SSR.
- **Priority:** LOW

**Solutions:**
- Audit `next.config.ts` for non-static routes.
- Test build output in `out/` directory locally.
- Ensure no dynamic routes breaking static export.

### 11. **Accessibility & Core Web Vitals**
- **Status:** Partially good (skip-to-content link present).
- **Opportunity:** Audit focus management, ARIA labels, keyboard navigation.
- **Priority:** MEDIUM

**Solutions:**
- Run axe DevTools audit.
- Ensure all interactive elements are keyboard-accessible.
- Test with screen readers (NVDA, VoiceOver).

### 12. **Caching & CDN**
- **Status:** Deploying to GitHub Pages (limited caching control).
- **Opportunity:** Use Cloudflare as CDN reverse proxy for better caching, edge optimization, and performance analytics.
- **Priority:** MEDIUM

**Solutions:**
- Add custom `_headers` or `_redirects` for GitHub Pages caching.
- Consider Cloudflare free tier for DDoS protection + caching.
- Set aggressive HTTP cache headers (`Cache-Control: max-age=31536000` for immutable assets).

---

## 📊 Bundle Size Analysis Recommendations

**Current Estimated Bundle Breakdown:**
```
three.js:                 ~150 KB (gzipped)
gsap:                      ~35 KB (gzipped)
framer-motion:            ~40 KB (gzipped)
react-three-fiber:        ~20 KB (gzipped)
@react-three/drei:        ~30 KB (gzipped)
chart.js + react-chartjs: ~50 KB (gzipped)
emailjs:                  ~15 KB (gzipped)
Lenis:                    ~10 KB (gzipped)
React + React-DOM:       ~115 KB (gzipped)
Tailwind CSS (purged):   ~15-25 KB (gzipped)
────────────────────────────────────
TOTAL ESTIMATE:          ~480-520 KB (gzipped)

**Goal:** < 250 KB (gzipped) for fast initial load
```

---

## 🎯 Optimization Priorities (Ranked)

| Priority | Task | Effort | Impact | Timeline |
|----------|------|--------|--------|----------|
| 🔴 P1    | Lazy-load Three.js + consolidate animation libraries | Medium | HIGH | 1-2 days |
| 🔴 P1    | Audit & optimize all images with next/image | Medium | HIGH | 1 day |
| 🔴 P1    | Migrate to Server Components where possible | Medium | MEDIUM-HIGH | 2 days |
| 🟡 P2    | Optimize Tailwind CSS & audit unused utilities | Low | MEDIUM | 2-4 hours |
| 🟡 P2    | Implement next/font for typography | Low | MEDIUM | 1 hour |
| 🟡 P2    | Lazy-load EmailJS & chart libraries | Low | MEDIUM | 2 hours |
| 🟢 P3    | Migrate Lenis to CSS scroll-behavior (if possible) | Low | LOW | 1 hour |
| 🟢 P3    | Add Cloudflare CDN reverse proxy | Low | LOW | 30 min |
| 🟢 P3    | Generate dynamic OG images & sitemap | Low | MEDIUM | 2-3 hours |
| 🟢 P4    | Full accessibility audit | Medium | MEDIUM | 3-4 hours |

---

## 📝 Next Steps

1. **Run Lighthouse & Pagespeed Insights** on current portfolio.
2. **Profile bundle size** using `@next/bundle-analyzer`.
3. **Implement P1 optimizations** (animation consolidation + image optimization).
4. **Re-audit** and measure improvements.
5. **Iterate** through P2 & P3 optimizations based on impact.

---

## 🔗 Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Pagespeed Insights](https://pagespeed.web.dev/)

---

**Next Action:** Review recommendations and prioritize based on current Lighthouse scores. Suggest starting with **Lazy-loading Three.js** and **Image Optimization** for the fastest wins.
