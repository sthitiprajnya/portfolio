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
## 2026-07-05 - Character Counter Accessibility
**Learning:** Adding `aria-live` to character counters in text inputs causes significant screen reader spam on every keystroke. Using `aria-describedby` on the input pointing to the counter ID is sufficient and more accessible. Also, dynamic ARIA attributes (like `aria-describedby`) should append `|| undefined` in React to prevent rendering empty strings.
**Action:** When implementing input character counters, rely on `aria-describedby` without `aria-live`. Always append `|| undefined` when conditionally rendering ARIA attributes with tools like `clsx`.

## 2026-07-04 - Prevent aria-describedby DOM errors
**Learning:** When dynamically setting ARIA attributes like `aria-describedby` using conditionals or libraries like `clsx` in React, if the condition fails, it can result in an empty string (`""`) or `"false"` being injected into the DOM. This causes screen reader errors because they try to parse the empty string as a target ID.
**Action:** Always append `|| undefined` (e.g., `aria-describedby={clsx(...) || undefined}`) to ensure the attribute is completely omitted from the DOM when no valid ID is present.
## 2026-07-03 - Dynamic ARIA Attributes with clsx
**Learning:** When dynamically setting ARIA attributes like `aria-describedby` using conditionals or libraries like `clsx` in React, empty strings or 'false' values can cause screen reader errors.
**Action:** Append `|| undefined` (e.g., `aria-describedby={clsx(...) || undefined}`) to ensure the attribute is completely omitted from the DOM when no valid ID is present.
## 2026-06-30 - Native titles for complex dynamic components
**Learning:** Even when standard elements have aria-labels, visually dynamic state-toggling components (like the methodology accordion) often miss corresponding `title` tooltips, leaving mouse users without clear hover feedback.
**Action:** When adding or verifying `aria-label` on dynamic toggle buttons (like expanding sections or modals), dynamically bind the `title` attribute to match the `aria-label` so mouse users see descriptive state changes on hover.
## 2025-07-20 - Character Counters and aria-live
**Learning:** Adding `aria-live="polite"` directly to a character counter element that updates on every keystroke creates severe screen reader spam, completely overwhelming the user experience.
**Action:** Remove `aria-live` from character counters and ensure they are instead linked programmatically to the input field using `aria-describedby`. Also ensure that optional chaining (e.g. `value?.length || 0`) is used to prevent runtime errors on uninitialized state.

## 2024-07-24 - Prevent Screen Reader Spam on Character Counters
**Learning:** Adding `aria-live="polite"` to a character counter span that updates on every keystroke causes extreme verbosity and spam for screen reader users, making the form very difficult to use.
**Action:** Remove `aria-live` from real-time character counters. Instead, ensure the counter is programmatically linked to the input via `aria-describedby` so the limits are announced when the field receives focus, and rely on standard validation for max length.
## 2026-07-24 - Avoid aria-live on visual character counters
**Learning:** Using `aria-live` on visual character counters inside text inputs or textareas causes significant screen reader spam, as it announces every single keystroke.
**Action:** When implementing visual character counters, do not use `aria-live`. Rely on linking the counter visually and programmatically via `aria-describedby` on the input element.
