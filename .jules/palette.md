## 2025-07-24 - [Accessible Tooltips for Decorative Icons]
**Learning:** Decorative or informative icons that trigger tooltips on hover are often missed in keyboard navigation. Providing `tabIndex={0}` and linking content via `aria-describedby` is essential for WCAG compliance.
**Action:** Always verify that informative tooltips are triggerable via `:focus-visible` and have appropriate ARIA roles and descriptions. Use the array index for unique IDs when rendering in loops to ensure stable ARIA links.

## 2025-07-25 - [Command Palette Discoverability]
**Learning:** "Power user" features like Command Palettes or keyboard-driven navigation are often underutilized if they lack a visible entry point. Providing a "Search" button in the main navigation with keyboard shortcut hints significantly increases engagement and accessibility for non-power users.
**Action:** Always include a visible UI element (e.g., a search icon or button) to trigger hidden interactive features, and label them with their corresponding keyboard shortcuts (e.g., `[/]`) to bridge the gap between GUI and CLI patterns.

## 2025-05-15 - [Audio Toggle & Feedback]
**Learning:** Users need clear control over automated audio/speech features. Persistent audio settings (via localStorage) and an easily accessible toggle improve the user experience significantly. Furthermore, providing visual feedback (like a pulse indicator) when the system is "speaking" helps users understand the state of the application even when muted or in noisy environments.
**Action:** Implement global audio toggles for applications with speech synthesis. Use visual indicators to represent non-visual output states and ensure immediate cancellation of output upon muting.

## 2026-06-03 - [Search Interface Polish & A11y]
**Learning:** Providing a conditional "Clear search" button in filtered interfaces significantly reduces friction for users, especially when paired with automatic re-focusing of the input. Additionally, for screen reader accessibility, dynamic result lists must be accompanied by `aria-live` announcements of the result count to ensure users are aware of the system's state changes.
**Action:** Always include a reset mechanism for search/filter inputs and use `aria-live="polite"` regions to announce filtered result counts.
