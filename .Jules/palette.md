## 2024-05-18 - Added aria-hidden to decorative SVGs
**Learning:** Decorative SVGs inside interactive elements like buttons and links with accessible text cause redundant and confusing screen reader announcements.
**Action:** Always add aria-hidden="true" to decorative <svg> icons placed inside interactive elements.
## 2026-06-08 - Native Tooltips for Icon-Only Buttons
**Learning:** While `aria-label` ensures screen readers can interpret icon-only buttons, sighted users without screen readers may struggle to understand ambiguous icons since `aria-label` provides no visual hover feedback. Relying solely on `aria-label` leaves an accessibility gap for sighted users with cognitive impairments or those unfamiliar with specific iconography.
**Action:** When adding `aria-label` to icon-only buttons, always accompany it with a native `title` attribute (or a custom visual tooltip) to ensure the intent is accessible via hover for all users. Additionally, ensure toggle buttons utilize `aria-pressed` to semantically communicate state changes.
