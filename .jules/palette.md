## 2024-05-14 - Screen Reader Context for Methodology Accordions
**Learning:** Screen readers reading out "VIEW METHODOLOGY" for multiple identical buttons across a grid of project cards provides no context about *which* project is being expanded. Adding context mapping via `aria-label` is crucial.
**Action:** When implementing repeating interactive components (like cards or list items) with identical visible call-to-actions, always provide disambiguating context using `aria-label` or `aria-describedby` referencing the item's title or ID.

## 2026-06-07 - Accessible Modal Lifecycle Pattern
**Learning:** Modals require a trifecta of accessibility: WAI-ARIA roles/attributes (dialog, aria-modal, aria-labelledby), keyboard support (Escape key), and layout management (body scroll locking). Without these, the interaction feels disconnected and creates friction for users with assistive technology or those navigating via keyboard.
**Action:** When implementing any overlay or modal component, always use a useEffect hook to synchronize visibility with the Escape key listener and document.body.style.overflow state. Ensure titles use semantic heading tags (h2-h4) with unique IDs.

## 2026-06-08 - Motion-Aware Global Navigation
**Learning:** Utilities like "Back to Top" buttons must balance presence and performance. Using a scroll threshold (e.g., 400px) prevents unnecessary DOM noise on shorter screens, while integrating with `usePrefersReducedMotion` ensures that the resulting scroll-to-top action matches user expectations for system accessibility.
**Action:** Always wrap global navigation utilities in a visibility threshold based on scroll position and use a unified motion hook to toggle between smooth and instant scrolling behavior.

## 2026-06-12 - Roving Tabindex for Filter Groups
**Learning:** Filter buttons that act as tabs should follow the WAI-ARIA Tabs pattern to be truly accessible to keyboard and screen reader users. Implementing a roving tabindex (where only the active item is focusable via Tab, and others are reached via Arrow keys) reduces keyboard noise and matches OS-level tab behaviors.
**Action:** When implementing a group of toggle/filter buttons, use `role="tablist"` on the container and `role="tab"` on the buttons. Use a `useRef` array to manage focus programmatically during arrow key navigation and sync `tabIndex` with the active state.

## 2026-06-15 - Localized Feedback over Global Toasts
**Learning:** For interactions that happen within a specific UI context (like clicking a copy button next to an email or a section title), global toast notifications can be disconnected from the user's focus. Localized, contextual feedback (e.g., a "COPIED!" badge appearing right next to the button) provides immediate, clear confirmation without cluttering the screen or requiring the user to shift their gaze.
**Action:** Prefer localized AnimatePresence-based feedback for micro-interactions. Reserve global toasts only for application-wide events or asynchronous processes that might finish when the trigger is no longer in view.

## 2025-06-01 - Heading Hierarchy Stability
**Learning:** Decorative typography (like glitch text) often breaks the logical document structure for screen readers if not properly hidden and complemented with SR-only headings.
**Action:** Use `sr-only` classes for H1s when the visual primary title is highly stylized or animated.
