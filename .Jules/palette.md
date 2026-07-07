## 2024-05-18 - Added aria-hidden to decorative SVGs
**Learning:** Decorative SVGs inside interactive elements like buttons and links with accessible text cause redundant and confusing screen reader announcements.
**Action:** Always add aria-hidden="true" to decorative <svg> icons placed inside interactive elements.
## 2026-06-08 - Native Tooltips for Icon-Only Buttons
**Learning:** While `aria-label` ensures screen readers can interpret icon-only buttons, sighted users without screen readers may struggle to understand ambiguous icons since `aria-label` provides no visual hover feedback. Relying solely on `aria-label` leaves an accessibility gap for sighted users with cognitive impairments or those unfamiliar with specific iconography.
**Action:** When adding `aria-label` to icon-only buttons, always accompany it with a native `title` attribute (or a custom visual tooltip) to ensure the intent is accessible via hover for all users. Additionally, ensure toggle buttons utilize `aria-pressed` to semantically communicate state changes.
## 2026-06-11 - [Aria Current For Single Page Scrollers]
**Learning:** When building a single-page scrolling application (like this portfolio), using `aria-current="page"` on active navigation buttons can mislead screen reader users into thinking they have navigated to a new page document. Using `aria-current="true"` accurately conveys the 'active' state within the current document context.
**Action:** Use `aria-current="true"` (or `aria-selected="true"` for tabs) instead of `"page"` for on-page anchor links or scroll sections.

## 2026-06-15 - Focus Management for Dynamic Terminal States
**Learning:** In terminal-style UIs or forms with "success" states that replace the original interactive elements, keyboard users can easily lose their focus position. Programmatically moving focus to a "Reset" or "Next Action" button within the new state ensures a continuous and accessible user journey.
**Action:** When an async operation completes and replaces the UI, use a React ref and useEffect to immediately transfer focus to the primary interactive element in the success state.
## 2026-06-19 - [Added aria-pressed to AsciiAvatar toggle button]
**Learning:** Found an accessibility issue where the 'isHuman' / 'isScan' toggle button lacked the `aria-pressed` attribute, missing a crucial state representation for screen reader users on this interactive element.
**Action:** Always ensure toggle buttons that represent binary states use `aria-pressed` to semantically communicate their state to assistive technologies.
## 2026-06-22 - Native titles for aria-labels
**Learning:** When using `aria-label` for screen readers on interactive elements (like inputs) or icon-only buttons, it is important to provide a native `title` attribute to ensure the intent is accessible via hover for sighted users.
**Action:** Always verify elements with an `aria-label` have a matching `title` attribute.

## 2024-06-27 - Linking Modals and Toggles with ARIA
**Learning:** For accessibility in custom toggle components, floating widgets, and overlays, it is critical to explicitly link the toggle button to its target container using `aria-controls` (matching the container's `id`) and dynamically manage the `aria-expanded` state. This was missing for the methodology and intel modals.
**Action:** When adding modal toggles or expanding sections, always ensure the button has `aria-expanded` reflecting the state, and `aria-controls` pointing to the `id` of the content block it toggles.

## 2024-07-07 - Accessible Character Counters
**Learning:** When building character counters for text inputs (`maxLength`), using `aria-live` on the counter element itself creates significant screen reader spam (announcing on every single keystroke). Furthermore, dynamically generating ARIA attributes like `aria-describedby` using libraries like `clsx` can result in an empty string if no conditions are met, which causes screen reader parsing issues. Finally, reading string lengths directly can crash the app if the field's initial state is undefined.
**Action:** Always provide a visual character counter and logically link it to the input using `aria-describedby` rather than `aria-live`. Use `|| undefined` to ensure empty strings are omitted from the DOM (`aria-describedby={clsx(...) || undefined}`). Always use optional chaining with a fallback for calculating counts (`value?.length || 0`) to avoid runtime crashes.
