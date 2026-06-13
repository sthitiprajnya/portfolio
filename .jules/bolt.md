## 2026-05-31 - RequestAnimationFrame Battery Drain Anti-Pattern
**Learning:** When migrating from `framer-motion` to a vanilla JS `requestAnimationFrame` loop (e.g. for scroll progress bars), it is critical to explicitly stop the `raf` loop when the animation reaches its resting state (`Math.abs(diff) <= 0.0001`). `framer-motion` handles this "sleeping" automatically. A continuous, unconditional `requestAnimationFrame` loop on an idle component will cause significant CPU overhead and drain mobile batteries.
**Action:** Always include an `else { cancelAnimationFrame(rafId); rafId = null; }` condition in vanilla animation loops to sleep the thread once the target state is reached, and wake it back up only when new input (e.g., a scroll event) occurs.

## 2026-05-31 - Turbopack Configuration Warning
**Learning:** Adding `turbopack: {}` to `next.config.mjs` in a Next.js 16 environment triggers a build error if not properly configured or if there are conflicting Webpack plugins, breaking Turbopack compilation.
**Action:** Avoid out-of-scope modifications to build configurations (`next.config.mjs`, `webpack`) when performing isolated component-level performance optimizations unless explicitly required to resolve an issue.
