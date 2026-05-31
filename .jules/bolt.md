# Bolt's Performance Journal

## 2025-05-15 - [IntersectionObserver for Navigation Tracking]
**Learning:** Using raw `scroll` event listeners with `getBoundingClientRect()` in a loop causes frequent layout thrashing and main-thread congestion. For navigation components that track active sections, `IntersectionObserver` is significantly more efficient as it offloads visibility calculations to the browser's compositor thread and only triggers callbacks when thresholds are crossed.
**Action:** Always prefer `IntersectionObserver` over `window.scrollY` or `getBoundingClientRect()` for tracking element visibility or active scroll states. Use a root margin to fine-tune the "active" zone (e.g., `-30% 0px -60% 0px` for top-heavy activation).

## 2025-05-16 - [Visibility-aware Animations & Layout Thrashing]
**Learning:** Heavy background animations (Canvas, Three.js) continue to consume significant CPU/GPU resources even when scrolled out of view. Pausing these loops via `IntersectionObserver` can drastically reduce energy consumption and improve framerates for other page elements. Additionally, calling `getBoundingClientRect()` inside a `mousemove` handler triggers synchronous layout reflows (layout thrashing). Caching the bounding box on `mouseenter` and updating it only on `scroll`/`resize` events keeps the main thread clear.
**Action:** Use `react-intersection-observer` to gate `requestAnimationFrame` or `useFrame` loops. Avoid layout-reading APIs in high-frequency event handlers; cache measurements and update them only when the environment changes.

## 2025-05-17 - [Hot Loop Hoisting and Static Data Caching]
**Learning:** In high-frequency (60fps) animation loops like Canvas or Three.js, property lookups (e.g., `array.length`) and redundant arithmetic (e.g., `value * scale`) can add up to measurable CPU overhead. Hoisting these lookups and caching intermediate calculations as local variables within the loop significantly reduces the number of operations per frame. Furthermore, defining static arrays or performing expensive data transformations (like `.reverse()`) inside a React component causes redundant allocations and potential mutation bugs on every render.
**Action:** Always hoist `.length` lookups and cache repeated calculations in animation loops. Move all static data and non-reactive derived state outside of React components or into `useMemo` to minimize GC pressure and CPU cycles.

## 2026-05-30 - [Hot Loop Hoisting and Static Data Caching]
**Learning:** In high-frequency (60fps) animation loops like Canvas, redundant arithmetic (e.g., `i * fontSize`) can add up to measurable CPU overhead. Pre-calculating these values during resize or hoisting them as local variables within the loop significantly reduces the number of operations per frame. Furthermore, performing expensive data transformations (like `[...array].reverse().concat(array)`) inside a React component causes redundant allocations on every render, which can be avoided by hoisting static derivations to the module level.
**Action:** Always hoist static data and non-reactive derived state outside of React components. In animation loops, use pre-calculated arrays for fixed coordinates and cache intermediate calculations to minimize CPU cycles per frame.

## 2026-06-15 - [Consolidated Static Hoisting Pattern]
**Learning:** React components that consume static configuration (like `HERO_ROLES` or `HERO_TICKER`) often perform expensive prep-work (like `flatMap`, `split`, or array duplication) directly in the render body. While seemingly minor, these allocations trigger unnecessary GC pressure, especially in sections that might re-render frequently due to ambient animations or state updates.
**Action:** Systematically audit components for `split()`, `map()`, or `[...]` spreads that operate on static imports. Move these transformations to the module level to ensure they are calculated exactly once.
