## 2024-05-14 - Screen Reader Context for Methodology Accordions
**Learning:** Screen readers reading out "VIEW METHODOLOGY" for multiple identical buttons across a grid of project cards provides no context about *which* project is being expanded. Adding context mapping via `aria-label` is crucial.
**Action:** When implementing repeating interactive components (like cards or list items) with identical visible call-to-actions, always provide disambiguating context using `aria-label` or `aria-describedby` referencing the item's title or ID.

## 2024-06-09 - Accessible Icon Buttons and Toggles
**Learning:** Icon-only buttons with `aria-label` are accessible to screen readers, but sighted keyboard users and mouse users rely on tooltips for intent. A native `title` attribute should always accompany `aria-label` for icon-only interactive elements. Furthermore, buttons that act as toggles must use `aria-pressed` to semantically communicate their state changes to assistive technologies.
**Action:** Always add a native `title` attribute alongside `aria-label` for icon-only buttons. Always ensure toggle buttons include the `aria-pressed` attribute reflecting their active state.
