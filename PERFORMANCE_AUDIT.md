# Portfolio Performance Audit

**Audit date:** 2026-10-17
**Site:** <https://sthitiprajnya.github.io/portfolio/>
**Repository:** `sthitiprajnya/portfolio`
**Current frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 3, Framer Motion, custom Canvas 2D effects.

## Executive summary

The reported lag was reproducible as sustained idle CPU use in headless Chromium. The largest measured source was continuous motion: three hero canvases, a cursor `requestAnimationFrame` loop that did not sleep until a mouse event, and dozens of CSS animations running across both visible and off-screen sections. The page had 46 CSS animations in the initial browser trace.

The site now caps canvas drawing, cancels a leaked MatrixRain resize handler, avoids starting the custom-cursor loop before pointer movement, and uses one page-level activity provider. After 10 seconds without pointer, keyboard, touch, wheel, or scroll input, that provider suspends CSS animation and the decorative canvas/avatar/glitch work. Any new activity resumes it. The user's `prefers-reduced-motion` setting remains honored.

## Findings and changes

1. **Custom cursor spun continuously before first pointer movement.** `CursorProvider` called `wake()` on mount while `isInitial` was still true; its normal stop condition required a mouse move, so an unattended page kept scheduling frames. The mount wake was removed and an initial-state guard added. The custom cursor starts only after real pointer input.

2. **Continuous canvas work was not budgeted.** MatrixRain and NetworkConnector now cap drawing at 24 fps; HeroOrb caps at 30 fps. Observer ref callbacks are stable. HeroOrb no longer asks the browser to promote a full-screen canvas to a transform layer it never transforms.

3. **MatrixRain left an anonymous resize listener attached.** The old registration created a new callback that cleanup could not remove, and repeated glyph-cache work during resize. It now registers and removes the same `resize` function and performs one cache refresh per resize.

4. **Motion was running while the visitor was idle.** A central provider pauses all CSS animations—including those in off-screen sections—and shares its active/idle state with visible decorative canvas loops, the ASCII-avatar timers, and GlitchText. It wakes on pointer, keyboard, touch, wheel, or scroll input; it also pauses when the tab is hidden. Motion resumes on the next interaction.

## Measurement evidence

The same local static export, served at the GitHub Pages `/portfolio/` base path, was opened in clean headless Chromium sessions. Browser-process CPU is reported as percent of one logical CPU core; these figures are a comparative sandbox diagnostic, not a Lighthouse score or a promise for every device.

| State | Sample 1 | Sample 2 |
| --- | ---: | ---: |
| Before changes; 15-second idle browser samples | 106.2% | 102.1% |
| After changes; waited 13 seconds, then sampled 15 seconds idle | 15.8% | 15.0% |

The two-sample mean fell from 104.15% to 15.4% (about an **85% reduction**). Browser instrumentation also observed 46 running CSS animations before the idle pause, zero while idle, and 45 resumed after pointer activity. The local browser session produced no uncaught page errors during the instrumentation pass.

## Verification

- `npm run lint` — passed with zero warnings.
- `npm run type-check` — passed.
- `npm test` — 44 tests passed across 18 files, including frame-budget, cursor-startup, idle-wakeup, and resize-listener cleanup regressions.
- `npm run build` — passed; static export and image optimization completed.
- [GitHub Pages run 39039455182](https://github.com/sthitiprajnya/portfolio/actions/runs/39039455182) — type, lint, tests, production audit, EmailJS validation, export, and deployment all passed. The live homepage and bundle containing the idle-provider marker returned HTTP 200.
- Local preview and Chromium processes used for measurement were stopped after the checks; no preview service remains running.

The repository's previous production-only audit was clean (`npm audit --omit=dev`: 0 vulnerabilities). This performance change did not modify dependencies.

## Tailwind 3 / PostCSS development advisories

The full development dependency audit previously reported **7 findings (5 high, 2 moderate)** in the Tailwind 3/PostCSS toolchain. These are build/development dependencies; the production-only audit was clean. They still matter to developer machines and CI, so keep the full `npm audit` visible rather than suppressing it.

**Preferred durable resolution:** schedule a separate Tailwind CSS 3-to-4 migration. Follow Tailwind's official [upgrade guide](https://tailwindcss.com/docs/upgrade-guide), adopt the v4 PostCSS integration, review custom theme/plugin/config usage, then compare representative pages at desktop and mobile widths and run clean install, lint, tests, static build, and `npm audit`. This is a major CSS-toolchain migration and should not be mixed into a performance patch without visual regression review. See also the [Tailwind CSS v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4).

**Short-term option if remaining on Tailwind 3:** test package-manager overrides for the affected transitive packages against the patched releases identified during the registry/advisory review (`braces` 3.0.4 and `postcss-selector-parser` 7.1.6). First confirm every dependency path with `npm explain`/`pnpm why`; apply only compatible overrides, regenerate both lockfiles, then verify `npm ci --legacy-peer-deps`, lint, tests, build, and the full audit. Do not apply `npm audit fix --force` blindly or assume an override is safe merely because it silences the audit.

**Advisory/source references:** [braces advisory GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [PostCSS selector parser advisory GHSA-rj75-hqrm-r3gf](https://osv.dev/GHSA-rj75-hqrm-r3gf), [NVD CVE-2026-93687](https://nvd.nist.gov/vuln/detail/CVE-2026-93687), and the [Tailwind maintainers' discussion](https://github.com/tailwindlabs/tailwindcss/issues/19327).

## Remaining limitations

The CPU comparison is a controlled local headless-Chromium comparison on this sandbox; it is not a Lighthouse score or a guarantee for every device, so subjective smoothness should also be checked on a normal laptop and phone. The full development dependency advisories remain until either the compatible overrides are validated or the Tailwind 4 migration is completed. No EmailJS values were read or included in this report.
