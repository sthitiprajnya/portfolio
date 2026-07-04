## 2026-05-31 - RequestAnimationFrame Battery Drain Anti-Pattern
**Learning:** When migrating from `framer-motion` to a vanilla JS `requestAnimationFrame` loop (e.g. for scroll progress bars), it is critical to explicitly stop the `raf` loop when the animation reaches its resting state (`Math.abs(diff) <= 0.0001`). `framer-motion` handles this "sleeping" automatically. A continuous, unconditional `requestAnimationFrame` loop on an idle component will cause significant CPU overhead and drain mobile batteries.
**Action:** Always include an `else { cancelAnimationFrame(rafId); rafId = null; }` condition in vanilla animation loops to sleep the thread once the target state is reached, and wake it back up only when new input (e.g., a scroll event) occurs.

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

## 2025-05-18 - [Deferring Expensive Math with Squared Distance Comparisons]
**Learning:** In 60fps animation loops, `Math.sqrt()` is a relatively expensive operation that often occurs unnecessarily when checking if an object (like the mouse) is within an influence radius. By comparing the squared distance (`dx*dx + dy*dy`) against a squared threshold (`radius*radius`), we can skip the square root calculation entirely for any frame where the target is outside the radius.
**Action:** Always use squared distance comparisons for proximity checks in hot loops. Only compute the actual distance with `Math.sqrt()` if the squared check confirms the target is within the active range and the linear distance is strictly required for further math (like normalization).

## 2026-07-20 - [Opacity Bucketing for Canvas Batching]
**Learning:** In complex particle systems where connection opacity varies by distance, calling `stroke()` for every single edge ($O(E)$) is a major performance bottleneck due to excessive draw calls and state changes. By grouping connections into a small number of discrete "opacity buckets" (e.g., 6 levels), we can batch draw calls into a fixed $O(1)$ number of `stroke()` operations per frame. Additionally, reusing the coordinate arrays for these buckets avoids per-frame allocations and reduces GC pressure.
**Action:** When drawing many elements with varying properties in a hot loop, discretize the property space into buckets and batch the draw calls. Reuse static or pre-allocated arrays to store intermediate coordinates.
**Learning:** In 60fps animation loops, `Math.sqrt()` is a relatively expensive operation that often occurs unnecessarily when checking if an object (like the mouse) is within an influence radius. By comparing the squared distance (`dx*dx + dy*dy`) against a squared threshold (`radius*radius`), we can skip the square root calculation entirely for any frame where the target is outside the radius.
**Action:** Always use squared distance comparisons for proximity checks in hot loops. Only compute the actual distance with `Math.sqrt()` if the squared check confirms the target is within the active range and the linear distance is strictly required for further math (like normalization).

## 2026-07-01 - [Eliminating Layout Thrashing in Animation Loops]
**Learning:** Performing DOM queries (`querySelectorAll`) and layout measurements (`getBoundingClientRect`) inside a `requestAnimationFrame` loop causes "Layout Thrashing", forcing the browser to recalculate styles and layout on every frame. This drastically increases CPU usage and can cause visual stuttering.
**Action:** Refactor animation loops to be "layout-free". Use a `useRef` to cache document-relative positions and update that cache only during `resize` or `mount` events. Any proximity checks within the loop should then use the cached values.

## 2026-07-05 - [Batching Canvas Paths and Eliminating String Allocations]
**Learning:** In high-frequency (60fps) Canvas 2D loops, individual `fill()` calls for dozens of elements and per-frame RGBA string template literals (`rgba(...)`) cause significant CPU overhead and trigger frequent Garbage Collection (GC) pauses. Batching similar shapes into a single path and using `ctx.globalAlpha` for transparency allows the browser and GPU to process the frame much more efficiently.
**Action:** Always batch primitive shapes (like `arc`) into a single path before calling `fill()` or `stroke()`. Avoid dynamic color string generation in hot loops; use a static color and control opacity via `globalAlpha`.

## 2026-07-10 - [Pausing Background Timers When Off-screen]
**Learning:** Periodic interval timers (like those driving typing effects or UI animations) inside components like `AsciiAvatar` run perpetually and consume CPU/trigger React renders even when the component is scrolled entirely out of view.
**Action:** Always combine `setInterval` calls with `IntersectionObserver` (e.g. `useInView` hook from `react-intersection-observer`) to ensure timers are paused when the element is not visible on-screen, preventing needless main thread congestion and battery drain.

## 2026-07-15 - [Batching Canvas stroke() calls via Opacity Bucketing]
**Learning:** In high-frequency (60fps) Canvas 2D animation loops, individual `stroke()` calls for every line segment (edges $E$) create significant CPU overhead due to the large number of state changes and draw commands sent to the GPU. By grouping lines into discrete "opacity buckets" (e.g., 6 levels) and using `ctx.globalAlpha`, the number of `stroke()` calls can be reduced from $O(E)$ to a small constant (e.g., 6), drastically improving rendering efficiency with minimal visual impact.
**Action:** Always audit animation loops for per-element `stroke()` or `fill()` calls. Batch elements with similar styles into a single path and perform one draw call. Use `globalAlpha` with buckets to handle variable transparency without breaking the batch.

## 2025-05-19 - [Eliminating Layout Thrashing and Per-Frame Color Parsing]
**Learning:** Calling `getBoundingClientRect()` inside a 60fps loop causes forced synchronous layouts (layout thrashing), which is a major performance bottleneck. Furthermore, repeatedly parsing RGBA strings using Regular Expressions and `parseInt` adds measurable CPU overhead in hot loops.
**Action:** Cache element positions in `resize` and `mount` handlers. Pre-parse all static color themes at the module level into numeric objects to avoid string manipulation and regex execution during animation frames.

## 2025-05-20 - [Memory Leak in Reused Canvas Buckets]
**Learning:** Reusing pre-allocated arrays (buckets) to minimize GC pressure is effective, but failing to clear them at the start of every frame (e.g., via `array.length = 0`) causes coordinate data to accumulate infinitely. This leads to a massive memory leak and linear performance degradation as the number of elements to draw increases every frame.
**Action:** Always ensure reused arrays in animation loops are reset at the start of each frame. Setting `.length = 0` is the most efficient way to clear an array while retaining the underlying memory allocation.

## 2025-05-21 - [Hoisting and Memoization for List Items]
**Learning:** In components that are rendered frequently or in large lists (like `SkillBadge` within the `Skills` section), redundant arithmetic, object allocations, and (N)$ array lookups inside the render body accumulate significant overhead. Furthermore, when parent components trigger re-renders due to filtering or layout updates, all children re-render by default even if their props are unchanged.
**Action:** Hoist all static configurations, `useInView` options, geometric constants, and lookup logic (preferring `Map`/`Set` for (1)$) to the module level. Wrap list item components in `React.memo` to ensure they only re-render when their specific data actually changes, drastically reducing the total work React performs during filter transitions.

## 2025-06-04 - [Eliminating Layout Thrashing and Per-Frame Color Parsing in Sentinel]
**Learning:** In high-frequency (60fps) Canvas 2D animation loops, repeatedly calling `getBoundingClientRect()` and `window.scrollY` for proximity checks causes significant layout thrashing. Furthermore, parsing RGBA strings using regex inside the `draw` loop adds unnecessary CPU overhead.
**Action:** Always cache vertical positions of target elements (like `#ctf`) in a `useRef` and update them only during `resize` or specific events. Pre-parse all static color themes at the module level into numeric objects to eliminate string manipulation and regex execution during animation frames.

## 2026-08-01 - [Minimizing Idle Timer Overheads]
**Learning:** Polling mechanisms running via `setInterval` in global providers (like `AudioProvider.tsx`) or hooks (like `useFaviconBlink.ts`) consume background CPU cycles and cause React renders/DOM updates indefinitely, even when audio is not playing or the tab is inactive.
**Action:** Always wrap background polling intervals or visual updates with visibility checks (e.g. `document.addEventListener('visibilitychange')`) or conditional state (only trigger when `isSpeaking === true`) to pause execution when idle or hidden.

## 2026-06-22 - [Idle Performance Optimization via Sleepy Loops]
**Learning:** For interactive custom cursors or similar UI followers, a continuous `requestAnimationFrame` loop drains significant CPU/battery even when the user is idle. Implementing a "Sleepy" pattern—where the loop cancels itself when target deltas are negligible and visual states (scale/hover) are stable—reduces idle CPU usage to 0%. The loop must be re-awakened via a `wake()` helper called by all relevant input listeners (`mousemove`, `mousedown`, `mouseover`).
**Action:** Implement self-canceling `requestAnimationFrame` loops for all UI-following effects. Use a `dx < 0.1` threshold to determine stability and ensure the "wake" signal is propagated from all interactive event handlers.

## 2026-05-31 - Passive Event Listeners for High-Frequency Events
**Learning:** High-frequency global event listeners (like `mousemove`, `mouseover`, `mousedown`, `mouseup`, `touchstart`, `touchmove`, `scroll`) can block the main thread and cause layout jank, especially during scroll or animations, because the browser waits to see if `preventDefault()` will be called.
**Action:** Always add `{ passive: true }` to these listeners when `preventDefault()` is not needed, so the browser can continue rendering/scrolling without waiting for the JavaScript event handler to finish.

## 2025-06-04 - [Sleepy Animation Loop Pattern]
**Learning:** High-frequency animation loops (like custom cursors) that run perpetually at 60fps consume significant CPU and battery even when the UI is stationary. Implementing a "Sleepy" loop that only runs during active interaction (moving, clicking) and sleeps when the interpolated state settles drastically reduces idle overhead.
**Action:** Always implement a `wake()` mechanism for non-essential animation loops. Halts the `requestAnimationFrame` once the delta between current and target state falls below a threshold (e.g., `< 0.1`).

## 2025-06-05 - [Active Set Optimization for Sparse Animations]
**Learning:** In high-frequency effects like the Matrix Rain glitch burst, iterating through the entire column set ( \approx 100$) for every trail level (=13$) to render a few active glitch columns (=3$) results in significant redundant work ((N \times T)$). By maintaining an "active set" array of glitch indices, we can reduce complexity to (G \times T)$, saving over 1,200 iterations per frame during bursts.
**Action:** For animations that target a sparse subset of elements, maintain an array of active indices or objects instead of scanning the full state space with conditional checks in hot loops.

## 2026-08-15 - [Sprite-based Caching for Expensive Orbs]
**Learning:** In high-frequency (60fps) Canvas 2D animation loops, re-calculating multiple complex radial gradients every frame is extremely expensive and causes high CPU/GPU load. By pre-rendering the orb into a small, fixed-size "sprite" offscreen canvas, we can replace the expensive vector draw calls with a single hardware-accelerated `drawImage()` blit. Pulse and breathing effects can then be efficiently applied during the blit stage using scaling.
**Action:** For complex, semi-static visual elements (like glow orbs or particles with gradients), implement sprite-based caching. Pre-render the element once and only update the cache when its visual properties (like color) change beyond a noticeable threshold.
## 2026-08-15 - [Sprite-based Caching for Expensive Orbs]
**Learning:** In high-frequency (60fps) Canvas 2D animation loops, re-calculating multiple complex radial gradients every frame is extremely expensive and causes high CPU/GPU load. By pre-rendering the orb into a small, fixed-size "sprite" offscreen canvas, we can replace the expensive vector draw calls with a single hardware-accelerated `drawImage()` blit. Pulse and breathing effects can then be efficiently applied during the blit stage using scaling. A key lesson here is cache invalidation: ensure the "hash" or check function used to decide if the sprite needs redrawing includes *all* visual variables (like core, mid, halo, and specular colors), not just a subset, to avoid subtle visual bugs during state transitions.
**Action:** For complex, semi-static visual elements (like glow orbs or particles with gradients), implement sprite-based caching. Pre-render the element once and only update the cache when its visual properties (like color) change beyond a noticeable threshold. Hash all properties when determining if the cache is dirty.

## 2025-06-06 - [Layered Animation Early-Exits]
**Learning:** In complex visual components like the Sentinel orb that feature layered state transitions (e.g., base scroll following vs. proximity-based color overrides), unconditional execution of Stage-2 logic adds unnecessary CPU overhead. By gating secondary lerp operations behind a proximity threshold check (e.g. `if (p > 0.001)`), we can skip dozens of floating-point operations per frame when the effect is not visible.
**Action:** Always implement early-exits for secondary or "override" animation states in hot loops. Only execute math and state updates when the trigger condition (proximity, interaction, or timer) is active.

## 2025-06-10 - [Sleepy RAF Loops and Optimized Interaction Checks]
**Learning:** Global animation loops (like custom cursors) that run `requestAnimationFrame` perpetually cause constant CPU overhead even when the interface is idle. Implementing a "sleepy" mechanism that stops the loop when the cursor is stationary and its visual state (scale, hover classes) is stable can drastically reduce background battery drain. Additionally, checking for interactive elements in a high-frequency `mouseover` handler using iterative `closest()` calls or multiple `tagName` checks is inefficient; a single consolidated selector (`target.closest('a, button, ...')`) is significantly faster.
**Action:** Always include a sleep condition in vanilla `raf` loops that cancels the frame when the delta is negligible. Consolidate interaction detection into a single optimized query to minimize per-event processing time.

## 2025-06-01 - Animation Loop Consolidation
**Learning:** Multiple RAF loops for the same interaction (e.g., cursor) can lead to redundant calculations and inconsistent states. Consolidating into a single "sleepy" loop improves CPU efficiency.
**Action:** Ensure high-frequency UI components use a centralized animation controller or stable RAF state management.
## 2026-07-04 - [Dynamic Module Importing for Heavy SDKs]
**Learning:** Statically importing heavy third-party SDKs (like `@emailjs/browser`) at the module level unnecessarily increases the initial Next.js JavaScript bundle size, which delays hydration and Time to Interactive (TTI) for the entire application.
**Action:** Use dynamic imports (e.g., `const module = (await import('lib')).default;`) inside event handlers (like form submissions) to defer loading of large dependencies until they are strictly required by the user.
