## 2024-05-14 - Screen Reader Context for Methodology Accordions
**Learning:** Screen readers reading out "VIEW METHODOLOGY" for multiple identical buttons across a grid of project cards provides no context about *which* project is being expanded. Adding context mapping via `aria-label` is crucial.
**Action:** When implementing repeating interactive components (like cards or list items) with identical visible call-to-actions, always provide disambiguating context using `aria-label` or `aria-describedby` referencing the item's title or ID.

## 2024-05-15 - Standardizing Custom Modal Lifecycle
**Learning:** Custom modals in React often overlook standard OS-level behaviors like Escape key dismissal and background scroll locking, leading to a "trapped" or disorienting feel for users. Explicitly managing these via `useEffect` is a core UX requirement for custom overlays.
**Action:** Always implement a "Modal Lifecycle" logic that handles `Escape` key listeners and body `overflow: hidden` whenever a custom modal state is active, and ensure proper ARIA roles (`dialog`, `aria-modal="true"`) are applied.
