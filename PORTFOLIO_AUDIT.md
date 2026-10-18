# Portfolio Re-audit and Optimization

**Audited project:** `sthitiprajnya/portfolio`  
**Published URL:** <https://sthitiprajnya.github.io/portfolio/>  
**Audit date:** 2026-10-18

## Work completed

Fixed GitHub Pages subpath handling for profile, technology, certification, employer, social, résumé, and footer assets/actions. Added a central public-asset URL helper and regression tests. Fixed the Sentinel canvas initialization-time crash and effect cleanup, corrected stale audio callbacks and accessibility/test typing issues, and replaced the non-functional radar-chart placeholder with a lightweight accessible SVG visualization.

Removed fabricated GitHub repository cards and hard-coded activity counts. GitHub data now comes from the public API/cache and reports an unavailable state instead of invented metrics when the API cannot be reached. Removed the unfinished write-up block with mock CVE titles and placeholder dates/statuses. Corrected credential expiration/status copy, removed a broken verification URL, and fixed résumé download/copy links for the Pages prefix.

Improved the mobile navigation as a keyboard-contained dialog with Escape dismissal, focus wrapping, and focus restoration. Fixed the interactive terminal's mount-time scroll that moved visitors away from the hero. Added an explicit SVG favicon, removed an ineffective `frame-ancestors` directive from the meta CSP, and corrected footer status accessibility text.

Updated Next.js and Sharp, corrected the React Hooks lint toolchain, removed the unused image-optimizer configuration and deprecated IntersectionObserver polyfill, and synchronized npm/pnpm lockfiles. The Pages workflow enforces type-check, lint, tests, and production dependency audit. It accepts EmailJS settings from GitHub Actions Secrets or Variables under either `NEXT_PUBLIC_EMAILJS_*` or the supplied `VITE_EMAILJS_*` names, maps the latter into Next.js build variables, and checks all three values before build/deploy. The workflow now uses Node 24-compatible official action majors (`checkout@v7`, `setup-node@v7`, `upload-pages-artifact@v5`, and `deploy-pages@v5`) and pins the runner to `ubuntu-24.04`. Artifact upload explicitly includes hidden files so `out/.well-known/security.txt` is preserved.

For the reported idle lag, fixed a cursor animation loop that started on mount, capped continuous canvas effects at 24–30 fps, fixed MatrixRain's resize-listener leak, and introduced a page-level activity provider. After 10 seconds without activity it pauses CSS motion and stops eligible decorative canvas/avatar/glitch work; pointer, keyboard, touch, wheel, or scroll input resumes motion. Reduced-motion preferences remain supported.

The hero typewriter now uses a finite, timer-driven implementation that clears its pending timeout immediately when the page becomes idle or the component unmounts. The uninterruptible `react-type-animation` dependency was removed and both lockfiles were updated. The About biography is static, server-rendered text with a one-shot reveal rather than long character-by-character animations. This preserves a complete, meaningful hero role while avoiding a lingering animation callback.

## Verification

| Check | Result |
| --- | --- |
| Clean dependency install (`npm ci --legacy-peer-deps`) | Passed |
| Strict lint (`npm run lint`) | Passed, zero warnings |
| Type check (`npm run type-check`) | Passed |
| Unit tests (`npm test`) | 53 passed across 21 files |
| Static export (`npm run build`) | Passed, including image optimization |
| Production dependency audit (`npm audit --omit=dev`) | 0 vulnerabilities |
| Full dependency audit (`npm audit`) | 7 development-tool findings remain (5 high, 2 moderate); see recommendations below and in [PERFORMANCE_AUDIT.md](./PERFORMANCE_AUDIT.md) |
| Pages subpath and prerendered content | Local production export returned HTTP 200 at `/portfolio/`; About biography is present in exported HTML |
| Live public smoke check | Homepage returned HTTP 200; the updated hero role and About text were present; 45 Next.js asset references used `/portfolio/`; favicon and a referenced JavaScript bundle returned HTTP 200 |
| Hidden Pages metadata | Export contains `out/.well-known/security.txt`; the artifact settings include hidden files, and a local packaging simulation confirmed it is retained |
| Fresh, untouched-page idle check | At 13.1 seconds with no input, idle state was active, hero showed “Application VAPT Specialist.”, About text was present, and there were no page errors |
| Production RAF soak | 0 callbacks in both 15-second windows after idle; hero remained on the meaningful first role |
| Accessibility and mobile checks | Keyboard-contained navigation, Escape dismissal, focus wrapping/restoration, reduced-motion fallback, static accessible chart, and base-path behavior covered by checks/tests |
| Process cleanup | Temporary local preview servers and Playwright sessions were closed after verification |

## Outstanding items / limitations

The full development-dependency audit reports **7 issues (5 high, 2 moderate)** in the Tailwind 3/PostCSS-related toolchain. Production dependencies audit cleanly. These advisories affect development/build tooling and still matter to developer machines and CI. The recommended resolution is a planned Tailwind 4 migration with visual regression tests; a short-term alternative is carefully tested overrides for the affected transitive packages. See the exact steps and advisory source links in [PERFORMANCE_AUDIT.md](./PERFORMANCE_AUDIT.md).

No EmailJS secret values were inspected or copied. The supplied names `VITE_EMAILJS_PUBLIC_KEY`, `VITE_EMAILJS_SERVICE_ID`, and `VITE_EMAILJS_TEMPLATE_ID` are mapped at build time to the Next.js client variables.
