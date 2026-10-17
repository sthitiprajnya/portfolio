# Portfolio Re-audit and Optimization

**Audited project:** `sthitiprajnya/portfolio`  
**Published URL:** <https://sthitiprajnya.github.io/portfolio/>  
**Audit date:** 2026-10-17

## Work completed

Fixed GitHub Pages subpath handling for profile, technology, certification, employer, social, résumé, and footer assets/actions. Added a central public-asset URL helper and regression tests. Fixed the Sentinel canvas initialization-time crash and effect cleanup, corrected stale audio callbacks and accessibility/test typing issues, and replaced the non-functional radar-chart placeholder with a lightweight accessible SVG visualization.

Removed fabricated GitHub repository cards and hard-coded activity counts. GitHub data now comes from the public API/cache and reports an unavailable state instead of invented metrics when the API cannot be reached. Removed the unfinished write-up block with mock CVE titles and placeholder dates/statuses. Corrected credential expiration/status copy, removed a broken verification URL, and fixed résumé download/copy links for the Pages prefix.

Improved the mobile navigation as a keyboard-contained dialog with Escape dismissal, focus wrapping, and focus restoration. Fixed the interactive terminal's mount-time scroll that moved visitors away from the hero. Added an explicit SVG favicon, removed an ineffective `frame-ancestors` directive from the meta CSP, and corrected the footer status accessibility text.

Updated Next.js and Sharp, corrected the React Hooks lint toolchain, removed the unused image-optimizer configuration and deprecated IntersectionObserver polyfill, and synchronized npm/pnpm lockfiles. Added CI gates for lint, tests, and production dependency audit. The workflow accepts EmailJS settings from GitHub Actions Secrets or Variables under either `NEXT_PUBLIC_EMAILJS_*` or the supplied `VITE_EMAILJS_*` names; it maps the latter into Next.js build variables and checks all three values before build/deploy.

## Verification

| Check | Result |
| --- | --- |
| Clean install (`npm ci --legacy-peer-deps`) | Passed |
| Strict lint (`npm run lint`) | Passed, zero warnings |
| Type check (`npm run type-check`) | Passed |
| Unit tests (`npm test`) | 37 passed across 14 files |
| Static export (`npm run build`) | Passed, including image optimization |
| Production dependency audit (`npm audit --omit=dev`) | 0 vulnerabilities |
| Built-site browser checks | 200 response, no runtime/hydration errors or HTTP 404s; remains at hero on load; both radar charts render; mobile dialog focus wraps and restores correctly |
| Static asset/accessibility checks | Local paths resolve; image alt text and external-link protections pass |
| GitHub Pages CI and deployment | Run [39035356190](https://github.com/sthitiprajnya/portfolio/actions/runs/39035356190) passed all checks, EmailJS validation, build, and deploy |

## Outstanding items / limitations

The full development-dependency audit still reports **7 issues (5 high, 2 moderate)** in the Tailwind 3/PostCSS-related toolchain. npm's available fix is a Tailwind 4 major upgrade, requiring a separate CSS/config migration and visual regression pass; it was not applied as a drive-by change. Production dependencies audit cleanly.

I did not inspect or expose any EmailJS values. After mapping the supplied `VITE_EMAILJS_PUBLIC_KEY`, `VITE_EMAILJS_SERVICE_ID`, and `VITE_EMAILJS_TEMPLATE_ID` names, the workflow's validation step passed and the deployment completed successfully.

Changes were pushed to `main` (latest workflow change: commit `08da709`) and deployed. The live URL <https://sthitiprajnya.github.io/portfolio/> returned HTTP 200 after deployment.
