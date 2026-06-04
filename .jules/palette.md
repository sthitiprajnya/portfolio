## 2024-06-04 - [Livie AI Assistant Button Accessibility]
**Learning:** Adding an `aria-label` to custom chat/assistant action buttons (like the "SEND" button in `LiviePanel.tsx`) provides screen readers with more context than just the button text, which can be useful when the button's action isn't clear from context alone. However, some text strings like "COPY_DIRECT_LINK" or "VIEW_METHODOLOGY" inside semantic `button` tags are already sufficiently descriptive for screen readers and do not require redundant `aria-label`s.
**Action:** Always verify if a button already has a descriptive text content or an existing `aria-label`/`aria-expanded` tag before attempting to add one. Prioritize elements like icon-only buttons or generic action words (e.g. "Send") that lack context.

## 2025-05-20 - [Abbreviated Navigation Label Accessibility]
**Learning:** Using abbreviations like "XP" or "Certs" in navigation menus saves visual space but is ambiguous for screen reader users. Attaching an `ariaLabel` property to the navigation data object allows for descriptive announcements (e.g., "Experience") without compromising the "security-engineer" aesthetic of the UI.
**Action:** When implementing menus with technical shorthand or abbreviations, always provide a full-term alternative via ARIA labels to ensure the interface remains accessible to all users.
