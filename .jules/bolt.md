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

## 2026-06-20 - [Interaction-Induced Layout Thrashing & Loop Symmetry]
**Learning:** Calling `getBoundingClientRect()` inside a `mousemove` handler triggers forced synchronous layouts (layout thrashing) on every frame of user interaction, which is a major performance bottleneck. Furthermore, particle "connection" logic that checks distances between all points using a simple nested loop ($n^2$) often double-processes pairs (e.g., A to B and B to A) and includes redundant self-comparisons.
**Action:** Always cache bounding boxes in `resize` or `scroll` handlers to keep interactive loops layout-free. Optimize symmetric interaction loops by starting the inner index at `i + 1`, reducing iterations from $O(n^2)$ to $O(n(n-1)/2)$.

## 2026-06-25 - [Optimizing High-Frequency Hooks with useSyncExternalStore]
**Learning:** React hooks that subscribe to browser-native state (like `window.matchMedia`) and are consumed by many components (27+ in this case) can cause significant overhead when implemented with `useState` + `useEffect`. Each instance incurs a second render on mount and multiple effect cycles. Transitioning to `useSyncExternalStore` allows for hoisting the subscription and snapshot logic to the module level, providing a single source of truth that is both SSR-safe and highly efficient.
**Action:** Use `useSyncExternalStore` for all browser-native state subscriptions. Hoist `subscribe` and `getSnapshot` to module scope to ensure identity stability across all consuming components.

## 2026-06-27 - [Hoisting Component Constants & Scoped DOM Queries]
**Learning:** Redundant object allocations (e.g., color maps) and regex re-compilation inside React render functions contribute to GC pressure and unnecessary CPU work, especially for list items or components that update frequently. Additionally, using global `document.querySelectorAll` in GSAP effects is inefficient and violates component encapsulation, potentially causing performance hits as the DOM grows.
**Action:** Hoist all static object maps and Regular Expressions to the module level. Scope GSAP and other DOM-direct queries to the component's `ref` using `container.querySelectorAll` to minimize search space and prevent cross-component interference.
