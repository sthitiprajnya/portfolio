# Portfolio Re-audit and Optimization

**Audited project:** `sthitiprajnya/portfolio`

**Published URL:** <https://sthitiprajnya.github.io/portfolio/>

**Audit date:** 2026-10-19

## Work completed

Fixed GitHub Pages subpath handling for profile, technology, certification, employer, social, résumé, and footer assets/actions. Added a central public-asset URL helper and regression tests. Fixed the Sentinel canvas initialization-time crash and effect cleanup, corrected stale audio callbacks and accessibility/test typing issues, and replaced the non-functional radar-chart placeholder with a lightweight accessible SVG visualization.

Removed fabricated GitHub repository cards and hard-coded activity counts. GitHub data now comes from the public API/cache and reports an unavailable state instead of invented metrics when the API cannot be reached. Removed the unfinished write-up block with mock CVE titles and placeholder dates/statuses. Corrected credential expiration/status copy, removed a broken verification URL, and fixed résumé download/copy links for the Pages prefix.

Improved the mobile navigation as a keyboard-contained dialog with Escape dismissal, focus wrapping, and focus restoration. Fixed the interactive terminal's mount-time scroll that moved visitors away from the hero. Added an explicit SVG favicon, removed an ineffective `frame-ancestors` directive from the meta CSP, and corrected footer status accessibility text.

Updated Next.js and Sharp, corrected the React Hooks lint toolchain, removed the unused image-optimizer configuration and deprecated IntersectionObserver polyfill, and synchronized npm/pnpm lockfiles. The Pages workflow enforces type-check, lint, tests, and production dependency audit. It accepts EmailJS settings from GitHub Actions Secrets or Variables under either `NEXT_PUBLIC_EMAILJS_*` or the supplied `VITE_EMAILJS_*` names, maps the latter into Next.js build variables, and checks all three values before build/deploy. The workflow now uses Node 24 for the project build and Node 24-compatible official action majors (`checkout@v7`, `setup-node@v7`, `upload-pages-artifact@v5`, and `deploy-pages@v5`), pins `ubuntu-24.04`, and includes hidden files so `out/.well-known/security.txt` is preserved.

For the reported idle lag, fixed a cursor animation loop that started on mount, capped continuous canvas effects at 24–30 fps, fixed MatrixRain's resize-listener leak, and introduced a page-level activity provider. After 10 seconds without activity it pauses CSS motion and stops eligible decorative canvas/avatar/glitch work; pointer, keyboard, touch, wheel, or scroll input resumes motion. Reduced-motion preferences remain supported.

The hero typewriter now uses a finite, timer-driven implementation that clears its pending timeout immediately when the page becomes idle or the component unmounts. The uninterruptible `react-type-animation` dependency was removed and both lockfiles were updated. The About biography is static, server-rendered text with a one-shot reveal rather than long character-by-character animations. This preserves a complete, meaningful hero role while avoiding a lingering animation callback.

The contact form announces send success and failure through accessible status/alert regions, uses factual success copy, and clears temporary UI timers when replaced or unmounted. The current live main form also includes hidden `reply_to` and `cc_email` fields populated from the visitor-entered email. The EmailJS dashboard mapping for these fields was not verified; `cc_email` is visitor-controlled and is not a safe destination by itself.

## Verification

The clean npm install (`npm ci --legacy-peer-deps`), strict lint, TypeScript check, and static production build passed. The final Vitest run passed **54 tests across 21 files**. `npm audit --omit=dev` found **0 production vulnerabilities**. The full audit still reports **7 development-tool findings (5 high, 2 moderate)** in the Tailwind 3/PostCSS toolchain; see [PERFORMANCE_AUDIT.md](./PERFORMANCE_AUDIT.md).

The final local production-export RAF soak exercised a scroll wake-up, then two 15-second idle windows. It recorded zero RAF callbacks and zero pending handles in both settled windows. The hero remained on “Application VAPT Specialist.” and the About text was present.

GitHub Actions run [39110848700](https://github.com/sthitiprajnya/portfolio/actions/runs/39110848700) completed successfully for current main commit `6a95f80`; build and deploy passed, including Node 24, type-check, lint, tests, production dependency audit, EmailJS configuration validation, and static export. A read-only live browser smoke check found the homepage and all 25 loaded Next.js JavaScript assets returning HTTP 200. The contact fields and submit button rendered; hidden `reply_to` and `cc_email` were present, while `to_email` was absent. The updated success copy was present in a loaded client chunk, with no failed responses or page errors. No message was submitted.

Accessibility and mobile checks cover keyboard-contained navigation, Escape dismissal, focus wrapping/restoration, reduced-motion fallback, the accessible chart, and base-path behavior. Temporary local preview servers and Playwright sessions were stopped after verification.

## Outstanding items and limitations

The full development-dependency audit reports **7 issues (5 high, 2 moderate)** in the Tailwind 3/PostCSS-related toolchain. These affect development/build tooling; the production dependency audit is clean. The recommended durable resolution is a planned Tailwind 4 migration with visual regression tests. A short-term alternative is carefully tested overrides for the affected transitive packages. See the detailed steps and advisory links in [PERFORMANCE_AUDIT.md](./PERFORMANCE_AUDIT.md).

EmailJS uses browser-side `sendForm`. The current form submits hidden `reply_to` and `cc_email` fields, both populated from the visitor-entered address. The actual EmailJS template `To`/`CC`/`Reply-To` mappings and domain allowlist are dashboard settings and were not inspected. If the template maps `cc_email` to a recipient, a visitor can supply an arbitrary address; do not use that field as `To` or `CC` without server-side verification and abuse controls. The safer default is a fixed owner inbox for `To` and the visitor address only for `Reply-To`. The current honeypot and 60-second `localStorage` cooldown are client-side and can be bypassed. A visitor receipt requires a protected server-side flow with rate limits and address verification; the user's preferred flow is pending clarification. See [PERFORMANCE_AUDIT.md](./PERFORMANCE_AUDIT.md).

Values named `NEXT_PUBLIC_EMAILJS_*` or `VITE_EMAILJS_*` are build-time client configuration in a static export; GitHub Secrets protect build inputs but do not make emitted browser values secret. EmailJS's public key is designed for client use. No actual EmailJS values were inspected or copied, no tracked `.env` files were found, and no `privateKey` or `accessToken` references were found in tracked app source or workflow files. Confirm the dashboard allowlist and template routing directly in the EmailJS account.

The portfolio also contains named organizations and specific vulnerability/exposure claims. This code audit did not verify authorization to disclose client-identifiable details; confirm any NDA/client permissions and anonymize sensitive findings if needed. Consider a brief privacy note describing contact-form data handling if applicable.
