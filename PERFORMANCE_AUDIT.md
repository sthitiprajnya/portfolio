# Portfolio Performance Audit

**Audit date:** 2026-10-18

**Site:** <https://sthitiprajnya.github.io/portfolio/>

**Repository:** `sthitiprajnya/portfolio`
**Current frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 3, Framer Motion, custom Canvas 2D effects.

## Executive summary

The reported lag was reproducible as sustained idle CPU use in headless Chromium. The largest measured sources were continuous motion: three hero canvases, a cursor `requestAnimationFrame` loop that did not sleep until a mouse event, and CSS animations running across visible and off-screen sections. The page had 46 CSS animations in the initial browser trace.

Canvas drawing is rate-limited, MatrixRain's resize listener is cleaned up, the custom-cursor loop does not start before pointer input, and a shared activity provider pauses CSS motion and eligible decorative loops after 10 seconds without activity. The hero typewriter no longer depends on a library whose pending RAF work could outlive its React component: it uses finite `setTimeout` steps with cancellation on idle/unmount. Long About paragraphs are static, server-rendered copy with one-shot reveals. Reduced-motion preferences remain honored.

## Findings and changes

1. **Custom cursor spun continuously before first pointer movement.** `CursorProvider` called `wake()` on mount while `isInitial` was still true; its normal stop condition required a mouse move, so an unattended page kept scheduling frames. The mount wake was removed and an initial-state guard added. The custom cursor starts only after real pointer input.

2. **Continuous canvas work was not budgeted.** MatrixRain and NetworkConnector now cap drawing at 24 fps; HeroOrb caps at 30 fps. Observer ref callbacks are stable. HeroOrb no longer asks the browser to promote a full-screen canvas to a transform layer it never transforms.

3. **MatrixRain left an anonymous resize listener attached.** The old registration created a new callback that cleanup could not remove, and repeated glyph-cache work during resize. It now registers and removes the same `resize` function and performs one cache refresh per resize.

4. **Motion was running while the visitor was idle.** A central provider pauses CSS animations—including those in off-screen sections—and shares its active/idle state with visible decorative canvas loops, the ASCII-avatar timers, and GlitchText. It wakes on pointer, keyboard, touch, wheel, or scroll input; it also pauses when the tab is hidden. Motion resumes on the next interaction. A fresh page with no input was verified to enter idle state after the 10-second inactivity timer (observed by 13.1 seconds).

5. **The third-party typewriter could continue work after unmount.** Removing its infinite repeat bounded the old sequence but still left a short RAF tail. The final implementation uses a finite local timer sequence; its pending timeout is cleared immediately on idle/unmount, and its regression tests cover finite completion, cancellation, static idle/reduced-motion fallback, and accessible labeling. The unused `react-type-animation` dependency was removed from both lockfiles. About biography copy is static in the exported HTML rather than typed character-by-character.

## Measurement evidence

The initial CPU comparison below is a historical controlled sandbox diagnostic from the earlier performance pass, before the final custom typewriter replacement. It is not a Lighthouse score or a guarantee for every device.

| Historical state | Sample 1 | Sample 2 |
| --- | ---: | ---: |
| Before performance changes; 15-second idle browser samples | 106.2% | 102.1% |
| After the initial idle/canvas changes; waited 13 seconds, then sampled 15 seconds idle | 15.8% | 15.0% |

The historical two-sample mean fell from 104.15% to 15.4% (about an **85% reduction**). Browser instrumentation observed 46 running CSS animations before the idle pause, zero while idle, and 45 resumed after pointer activity. The current final code received an additional RAF-specific soak rather than claiming those older CPU figures as a new measurement.

| Final production-export check | Result |
| --- | --- |
| Fresh page with no interaction | Idle marker set by 13.1 seconds; hero settled to “Application VAPT Specialist.”; no page errors |
| RAF window immediately after the page entered idle | 0 callbacks over 15 seconds |
| Second settled idle RAF window | 0 callbacks over the next 15 seconds |
| Idle-page content | About biography present; hero role remains legible and complete |

The soak used the local static export served under the same `/portfolio/` subpath as GitHub Pages. It also exercised scroll activity before the idle windows to verify the active-to-idle transition. The untouched-page check separately verified that the timeout starts without a prior interaction.

## Verification

- `npm ci --legacy-peer-deps` — passed from the updated npm lockfile.
- `npm run lint` — passed with zero warnings.
- `npm run type-check` — passed.
- `npm test` — 53 tests passed across 21 files, including finite typewriter completion and immediate timeout-cancellation regressions.
- `npm run build` — passed; static export and image optimization completed.
- `npm audit --omit=dev` — 0 vulnerabilities.
- `npm audit` — 7 development-tool findings remain (5 high, 2 moderate); see below.
- Local static preview at `/portfolio/` returned HTTP 200. The final idle screenshot showed a complete hero, meaningful role text, and no page errors.
- Live Pages smoke check returned HTTP 200, with the hero/About content, `/portfolio/` asset references, favicon, and a referenced JavaScript asset all verified.
- Temporary local preview server and Playwright sessions were stopped after verification.

## CI runner and artifact compatibility

The first successful deployment emitted nonblocking warnings because the workflow's older actions targeted the deprecated Node 20 action runtime and because GitHub is transitioning `ubuntu-latest` to Ubuntu 26. The workflow was refreshed to use Node 24-compatible action definitions (`checkout@v7`, `setup-node@v7`, `deploy-pages@v5`, and the `upload-artifact@v7` dependency of `upload-pages-artifact@v5`) [1] [2] [3] [4] [5]. It pins `ubuntu-24.04` to avoid a silent runner-image change during GitHub's announced migration window [6].

The Pages artifact action defaults to excluding hidden files, so the workflow explicitly sets `include-hidden-files: true`. The static export contains `.well-known/security.txt`; the option preserves that security contact file in the uploaded artifact [3].

## Tailwind 3 / PostCSS development advisories

The full development dependency audit reports **7 findings (5 high, 2 moderate)** in the Tailwind 3/PostCSS toolchain. These are build/development dependencies; the production-only audit is clean. They still matter to developer machines and CI, so keep the full `npm audit` visible rather than suppressing it.

**Preferred durable resolution:** schedule a separate Tailwind CSS 3-to-4 migration. Follow Tailwind's official [upgrade guide](https://tailwindcss.com/docs/upgrade-guide), adopt the v4 PostCSS integration, review custom theme/plugin/config usage, then compare representative pages at desktop and mobile widths and run clean install, lint, tests, static build, and `npm audit`. This is a major CSS-toolchain migration and should not be mixed into a performance patch without visual regression review. See also the [Tailwind CSS v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4).

**Short-term option if remaining on Tailwind 3:** test package-manager overrides for the affected transitive packages against the patched releases identified during the registry/advisory review (`braces` 3.0.4 and `postcss-selector-parser` 7.1.6). First confirm every dependency path with `npm explain`/`pnpm why`; apply only compatible overrides, regenerate both lockfiles, then verify `npm ci --legacy-peer-deps`, lint, tests, build, and the full audit. Do not apply `npm audit fix --force` blindly or assume an override is safe merely because it silences the audit.

**Advisory/source links:** [braces advisory GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [PostCSS selector parser advisory GHSA-rj75-hqrm-r3gf](https://osv.dev/GHSA-rj75-hqrm-r3gf), [NVD CVE-2026-93687](https://nvd.nist.gov/vuln/detail/CVE-2026-93687), and the [Tailwind maintainers' discussion](https://github.com/tailwindlabs/tailwindcss/issues/19327).

## Remaining limitations

The CPU comparison is a controlled local headless-Chromium comparison on this sandbox; it is not a Lighthouse score or a guarantee for every device, so subjective smoothness should also be checked on a normal laptop and phone. The full development dependency advisories remain until either the compatible overrides are validated or the Tailwind 4 migration is completed. No EmailJS values were read or included in this report.

## References

[1]: https://github.com/actions/checkout/blob/v7/action.yml "Checkout v7 action definition"
[2]: https://github.com/actions/setup-node/blob/v7/action.yml "Setup Node v7 action definition"
[3]: https://github.com/actions/upload-pages-artifact/blob/v5/action.yml "Upload Pages artifact v5 action definition"
[4]: https://github.com/actions/upload-artifact/blob/v7/action.yml "Upload artifact v7 action definition"
[5]: https://github.com/actions/deploy-pages/blob/v5/action.yml "Deploy Pages v5 action definition"
[6]: https://github.com/actions/runner-images/issues/14748 "Ubuntu 26.04 latest-runner migration announcement"
