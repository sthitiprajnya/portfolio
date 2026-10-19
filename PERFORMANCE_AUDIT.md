# Portfolio Performance and Security Audit

**Audit date:** 2026-10-19

**Site:** <https://sthitiprajnya.github.io/portfolio/>

**Repository:** `sthitiprajnya/portfolio`

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 3, Framer Motion, and custom Canvas 2D effects.

The reported lag was reproducible as sustained idle CPU use in headless Chromium. The largest measured sources were continuous motion: three hero canvases, a cursor `requestAnimationFrame` loop that did not sleep until a mouse event, and CSS animations running across visible and off-screen sections. The page had 46 CSS animations in the initial browser trace.

Canvas drawing is rate-limited, MatrixRain's resize listener is cleaned up, the custom-cursor loop does not start before pointer input, and a shared activity provider pauses CSS motion and eligible decorative loops after 10 seconds without activity. The hero typewriter no longer depends on a library whose pending RAF work could outlive its React component: it uses finite `setTimeout` steps with cancellation on idle/unmount. Long About paragraphs are static, server-rendered copy with one-shot reveals. Reduced-motion preferences remain honored.

## Findings and changes

1. **Custom cursor spun continuously before first pointer movement.** `CursorProvider` called `wake()` on mount while `isInitial` was still true; its normal stop condition required a mouse move, so an unattended page kept scheduling frames. The mount wake was removed and an initial-state guard added. The custom cursor starts only after real pointer input.

2. **Continuous canvas work was not budgeted.** MatrixRain and NetworkConnector now cap drawing at 24 fps; HeroOrb caps at 30 fps. Observer ref callbacks are stable. HeroOrb no longer asks the browser to promote a full-screen canvas to a transform layer it never transforms.

3. **MatrixRain left an anonymous resize listener attached.** The old registration created a new callback that cleanup could not remove, and repeated glyph-cache work during resize. It now registers and removes the same `resize` function and performs one cache refresh per resize.

4. **Motion was running while the visitor was idle.** A central provider pauses CSS animations—including those in off-screen sections—and shares its active/idle state with visible decorative canvas loops, the ASCII-avatar timers, and GlitchText. It wakes on pointer, keyboard, touch, wheel, or scroll input; it also pauses when the tab is hidden. Motion resumes on the next interaction. A fresh page with no input was verified to enter idle state after the 10-second inactivity timer (observed by 13.1 seconds).

5. **The third-party typewriter could continue work after unmount.** Removing its infinite repeat bounded the old sequence but still left a short RAF tail. The final implementation uses a finite local timer sequence; its pending timeout is cleared immediately on idle/unmount, and its regression tests cover finite completion, cancellation, static idle/reduced-motion fallback, and accessible labeling. The unused `react-type-animation` dependency was removed from both lockfiles. About biography copy is static in the exported HTML rather than typed character-by-character.

## Measurement evidence

The initial CPU comparison is a historical controlled sandbox diagnostic from the earlier performance pass, before the final custom typewriter replacement. It is not a Lighthouse score or a guarantee for every device. Before the performance changes, two 15-second idle samples measured 106.2% and 102.1% CPU. After the initial idle/canvas changes, the corresponding samples were 15.8% and 15.0%. Their means fell from 104.15% to 15.4%, an approximately 85% reduction. Browser instrumentation observed 46 running CSS animations before the idle pause, zero while idle, and 45 resumed after pointer activity. The final code received an additional RAF-specific soak; the older CPU figures are not presented as a new measurement.

The final production-export soak used the local export under the `/portfolio/` path. It exercised scroll activity before the idle windows and returned HTTP 200. The activity marker transitioned from active to idle, remained idle through both 15-second windows, and the hero stayed on “Application VAPT Specialist.” The About text was present. There were zero RAF callbacks and zero pending handles during both settled idle windows. A separate untouched-page check confirmed that the inactivity timer starts without a prior interaction.

## Verification

`npm ci --legacy-peer-deps`, `npm run lint` (zero warnings), `npm run type-check`, and `npm run build` passed. `npm test` passed **54 tests across 21 files**. `npm audit --omit=dev` found **0 production vulnerabilities**. The full `npm audit` still reports **7 development-tool findings (5 high, 2 moderate)**.

GitHub Actions run [39103195461](https://github.com/sthitiprajnya/portfolio/actions/runs/39103195461) completed successfully for commit `9774475`. Both build and deploy jobs passed, and the `Setup Node.js 24` step completed successfully. The live homepage, favicon, `.well-known/security.txt`, and all 25 JavaScript assets loaded by Chromium returned HTTP 200. The contact section rendered its name, email, and message fields and submit button; no network failures or page errors were observed. The updated contact success copy was found in the loaded client bundle, and the old “securely delivered” overclaim was absent. No email was submitted in the live check.

## GitHub Pages runtime and artifact

The workflow uses Node 24 for the project build and Node 24-compatible official action versions (`checkout@v7`, `setup-node@v7`, `upload-pages-artifact@v5`, and `deploy-pages@v5`). It pins `ubuntu-24.04` and sets `include-hidden-files: true` so `.well-known/security.txt` is included in the Pages artifact. The official Node.js release schedule lists Node 24 as LTS and Node 20 as EOL; production applications should use Active or Maintenance LTS releases [7].

## EmailJS client exposure and safe recipient routing

The contact form calls EmailJS `sendForm` in the browser. `NEXT_PUBLIC_EMAILJS_*` and the supplied `VITE_EMAILJS_*` build variables become client-side configuration in a static export; GitHub Secrets protect the build inputs, not the emitted browser bundle. EmailJS explicitly describes its public key as public and says it can invoke configured templates, so template design and domain restrictions matter [8]. No `privateKey` or `accessToken` references were found in tracked app source or workflow files, and no tracked `.env` files were found.

The application validates a basic email format and includes a hidden honeypot plus a 60-second `localStorage` cooldown. Those checks run in the visitor's browser and can be bypassed; they are not a server-enforced abuse limit. EmailJS supports an account-level domain allowlist; for this GitHub Pages site, the origin is `https://sthitiprajnya.github.io` without the `/portfolio` path [9]. Its browser SDK also exposes `blockHeadless` and `limitRate`, but these browser-side options are supplementary rather than server-side controls [10]. The REST API documents a request rate limit of one request per second; that provider limit does not establish that a particular person controls a recipient address [11].

For the safe default, configure the EmailJS template's **To** as the fixed portfolio-owner inbox and set **Reply-To** to the visitor's validated email. Do not place a visitor-controlled address in **To**, and do not use the owner's address as a spoofable form-controlled sender. The template mappings and account allowlist were not inspected because they are configured in the EmailJS dashboard. Verify them there. If the desired flow also sends an acknowledgement to the visitor, use a server-side handler with CAPTCHA verification and server-enforced rate limiting; do not treat a browser-only `to_email` field as protection. The user has been asked to choose between owner-only delivery and a protected visitor receipt, so no recipient-routing change has been made yet.

## Tailwind 3 / PostCSS development advisories

The full development dependency audit reports **7 findings (5 high, 2 moderate)** in the Tailwind 3/PostCSS toolchain. These are build/development dependencies; the production-only audit is clean. They still matter to developer machines and CI, so keep the full `npm audit` visible rather than suppressing it.

**Preferred durable resolution:** schedule a separate Tailwind CSS 3-to-4 migration. Follow Tailwind's official [upgrade guide](https://tailwindcss.com/docs/upgrade-guide), adopt the v4 PostCSS integration, review custom theme/plugin/config usage, then compare representative pages at desktop and mobile widths and run clean install, lint, tests, static build, and `npm audit`. This is a major CSS-toolchain migration and should not be mixed into a performance patch without visual regression review. See also the [Tailwind CSS v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4).

**Short-term option if remaining on Tailwind 3:** test package-manager overrides for the affected transitive packages against the patched releases identified during the registry/advisory review (`braces` 3.0.4 and `postcss-selector-parser` 7.1.6). First confirm every dependency path with `npm explain`/`pnpm why`; apply only compatible overrides, regenerate both lockfiles, then verify clean install, lint, tests, build, and the full audit. Do not apply `npm audit fix --force` blindly or assume an override is safe merely because it silences the audit.

## Remaining limitations

The CPU comparison is a controlled local headless-Chromium comparison on this sandbox; it is not a Lighthouse score or a guarantee for every device, so subjective smoothness should also be checked on a normal laptop and phone. The full development dependency advisories remain until either compatible overrides are validated or the Tailwind 4 migration is completed. The live EmailJS template and account security settings cannot be verified from this static-site repository; check the `To`, `Reply-To`, and allowed-origin settings in the EmailJS dashboard before relying on them. The contact form has not been exercised against a real email account during this audit.

## References

[1]: https://github.com/actions/checkout/blob/v7/action.yml "Checkout v7 action definition"
[2]: https://github.com/actions/setup-node/blob/v7/action.yml "Setup Node v7 action definition"
[3]: https://github.com/actions/upload-pages-artifact/blob/v5/action.yml "Upload Pages artifact v5 action definition"
[4]: https://github.com/actions/upload-artifact/blob/v7/action.yml "Upload artifact v7 action definition"
[5]: https://github.com/actions/deploy-pages/blob/v5/action.yml "Deploy Pages v5 action definition"
[6]: https://github.com/actions/runner-images/issues/14748 "Ubuntu 26.04 latest-runner migration announcement"
[7]: https://nodejs.org/en/about/previous-releases "Official Node.js release schedule"
[8]: https://www.emailjs.com/docs/faq/is-it-okay-to-expose-my-public-key/ "EmailJS public key FAQ"
[9]: https://www.emailjs.com/docs/faq/can-i-add-my-domain-to-allowlist/ "EmailJS domain allowlist FAQ"
[10]: https://www.emailjs.com/docs/sdk/options/ "EmailJS SDK options"
[11]: https://www.emailjs.com/docs/rest-api/send/ "EmailJS REST API send endpoint"
