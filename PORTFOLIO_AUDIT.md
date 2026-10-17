# Portfolio Re-audit and Optimization

**Audited project:** `sthitiprajnya/portfolio`  
**Published URL:** <https://sthitiprajnya.github.io/portfolio/>  
**Audit date:** 2026-10-17

## Work completed

Fixed GitHub Pages subpath handling for profile, technology, certification, employer, social, résumé, and footer assets/actions. Added a central public-asset URL helper and regression tests. Fixed the Sentinel canvas initialization-time crash and effect cleanup, corrected stale audio callbacks and accessibility/test typing issues, and replaced the non-functional radar-chart placeholder with a lightweight accessible SVG visualization.

Removed fabricated GitHub repository cards and hard-coded activity counts. GitHub data now comes from the public API/cache and reports an unavailable state instead of invented metrics when the API cannot be reached. Removed the unfinished write-up block with mock CVE titles and placeholder dates/statuses. Corrected credential expiration/status copy, removed a broken verification URL, and fixed résumé download/copy links for the Pages prefix.

Improved the mobile navigation as a keyboard-contained dialog with Escape dismissal, focus wrapping, and focus restoration. Fixed the interactive terminal's mount-time scroll that moved visitors away from the hero. Added an explicit SVG favicon, removed an ineffective `frame-ancestors` directive from the meta CSP, and corrected footer status accessibility text.

Updated Next.js and Sharp, corrected the React Hooks lint toolchain, removed the unused image-optimizer configuration and deprecated IntersectionObserver polyfill, and synchronized npm/pnpm lockfiles. Added CI gates for lint, tests, and production dependency audit. The workflow accepts EmailJS settings from GitHub Actions Secrets or Variables under either `NEXT_PUBLIC_EMAILJS_*` or the supplied `VITE_EMAILJS_*` names; it maps the latter into Next.js build variables and checks all three values before build/deploy.

For the reported idle lag, fixed a cursor animation loop that started on mount, capped the continuous canvas effects at 24–30 fps, fixed MatrixRain's resize-listener leak, and introduced a page-level idle activity provider. After 10 seconds without user input it pauses CSS motion and stops eligible decorative canvas/avatar/glitch work; pointer, keyboard, touch, wheel, or scroll input resumes motion. Reduced-motion preferences remain supported. Detailed methodology and Tailwind advisory guidance are in [PERFORMANCE_AUDIT.md](./PERFORMANCE_AUDIT.md).

## Verification

| Check | Result |
| --- | --- |
| Strict lint (`npm run lint`) | Passed, zero warnings |
| Type check (`npm run type-check`) | Passed |
| Unit tests (`npm test`) | 44 passed across 18 files |
| Static export (`npm run build`) | Passed, including image optimization |
| Production dependency audit (`npm audit --omit=dev`) | Previously passed with 0 vulnerabilities; no dependencies changed in the performance patch |
| Built-site browser checks | Pages subpath loads; idle state pauses CSS animations (46 to 0 in browser instrumentation), pointer activity resumes motion; mobile dialog and base-path checks passed in the earlier site audit |
| Idle CPU comparison | Two 15-second Chromium samples after 13 seconds idle fell from 106.2% / 102.1% to 15.8% / 15.0% of one logical CPU core, about 85% lower; sandbox diagnostic, not a Lighthouse/device guarantee |
| Background process cleanup | Local preview server and browser measurement processes stopped; no active background task remains |
| GitHub Pages deployment | The latest performance changes are being published through the repository's normal GitHub Actions workflow; verify its run before treating them as live |

## Outstanding items / limitations

The full development-dependency audit previously reported **7 issues (5 high, 2 moderate)** in the Tailwind 3/PostCSS-related toolchain. Production dependencies audited cleanly. The recommended resolution is a planned Tailwind 4 migration with visual regression tests; a short-term alternative is carefully tested overrides for the affected transitive packages. See the exact steps and advisory source links in [PERFORMANCE_AUDIT.md](./PERFORMANCE_AUDIT.md).

No EmailJS secret values were inspected or copied. The provided names `VITE_EMAILJS_PUBLIC_KEY`, `VITE_EMAILJS_SERVICE_ID`, and `VITE_EMAILJS_TEMPLATE_ID` are mapped at build time to the Next.js client variables.
