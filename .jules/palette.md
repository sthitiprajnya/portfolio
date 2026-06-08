## 2024-05-14 - Screen Reader Context for Methodology Accordions
**Learning:** Screen readers reading out "VIEW METHODOLOGY" for multiple identical buttons across a grid of project cards provides no context about *which* project is being expanded. Adding context mapping via `aria-label` is crucial.
**Action:** When implementing repeating interactive components (like cards or list items) with identical visible call-to-actions, always provide disambiguating context using `aria-label` or `aria-describedby` referencing the item's title or ID.

## 2026-06-08 - Desktop Tooltip Discoverability & State-Aware Feedback
**Learning:** While `aria-label` provides accessibility for screen readers, desktop mouse users often lack visual affordance for icon-only interactive elements. Adding matching `title` attributes ensures discoverability via native tooltips. Additionally, multi-state visual feedback (e.g., character counters turning amber at 90%) provides proactive UX preventing validation errors before submission.
**Action:** Always pair `aria-label` with `title` for icon-only triggers. Implement progressive visual warnings for constrained inputs to guide user behavior.
