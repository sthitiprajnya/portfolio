## 2024-06-04 - [Livie AI Assistant Button Accessibility]
**Learning:** Adding an `aria-label` to custom chat/assistant action buttons (like the "SEND" button in `LiviePanel.tsx`) provides screen readers with more context than just the button text, which can be useful when the button's action isn't clear from context alone. However, some text strings like "COPY_DIRECT_LINK" or "VIEW_METHODOLOGY" inside semantic `button` tags are already sufficiently descriptive for screen readers and do not require redundant `aria-label`s.
**Action:** Always verify if a button already has a descriptive text content or an existing `aria-label`/`aria-expanded` tag before attempting to add one. Prioritize elements like icon-only buttons or generic action words (e.g. "Send") that lack context.

## 2026-06-04 - [Abbreviated Navigation Accessibility]
**Learning:** For navigation menus using abbreviated labels (like 'XP' or 'Certs'), providing an explicit `ariaLabel` property in the navigation data object allows screen readers to announce the full term ('Experience', 'Certifications') while maintaining the design's visual shorthand.
**Action:** Use an `ariaLabel` or similar property for any UI element where the visual text is a shorthand or abbreviation that might be unclear to assistive technologies.
