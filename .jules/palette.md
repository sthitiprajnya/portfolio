## 2026-05-31 - [ARIA Tabs Pattern for Experience Section]
**Learning:** Implementing the WAI-ARIA Tabs pattern (role="tablist", role="tab", role="tabpanel") significantly improves the discoverability and usability of nested information for screen reader users, especially in complex components like professional experience logs.
**Action:** Always verify that interactive tab-like elements use semantic ARIA roles and proper ID cross-linking (aria-controls/aria-labelledby) to maintain a high accessibility standard.

## 2026-05-31 - [Dynamic Labels and Disclosure Pattern for Accordions]
**Learning:** Disclosure components (like project methodology accordions) require dynamic text labels (e.g., 'VIEW' vs 'HIDE') and proper ARIA attributes (`aria-expanded`, `aria-controls`) to provide clear feedback to both sighted and screen reader users about the current state of the content.
**Action:** Implement the W3C disclosure pattern for all toggleable content areas, ensuring button labels update dynamically and are correctly associated with their content via unique IDs.

## 2026-05-31 - [Keyboard-Accessible Tooltips and Filter Announcements]
**Learning:** Interactive elements that only reveal information on hover (like skill badges with tooltips) are invisible to keyboard users and screen readers unless explicitly made focusable (`tabIndex={0}`) and coupled with CSS that responds to focus (`focus-visible`). Additionally, dynamic filtering requires `aria-live` regions to announce state changes to assistive technologies.
**Action:** Always ensure hover-only information is reachable via keyboard focus and that dynamic UI updates (like filtering) are announced via `aria-live` regions.

## 2026-06-01 - [Keyboard-Accessible Tooltips via ARIA Describedby]
**Learning:** Making hover-only information (like tooltips) accessible to keyboard users requires more than just `tabIndex={0}`. To ensure screen readers announce the supplemental information, the interactive element should use `aria-describedby` to link to a container marked with `role="tooltip"`. Additionally, `role="button"` should be avoided if the element is purely informative and doesn't trigger a state change or navigation, as it creates false expectations for keyboard users (who would expect 'Enter' or 'Space' to perform an action).
**Action:** Implement focusable informative elements with `aria-describedby` pointing to a `role="tooltip"` container to provide a semantic and predictable experience for assistive technology.

## 2026-06-02 - [Keyboard-Accessible Tabs for Experience Section]
**Learning:** Implementing the WAI-ARIA Tabs pattern with keyboard navigation (Arrow keys, Home, End) and roving tabindex significantly improves the accessibility of multi-tabbed content like role descriptions. It allows users to navigate logical groupings of information without excessive tabbing.
**Action:** Use roving tabindex (`tabIndex={isOpen ? 0 : -1}`) and manage focus programmatically via refs to ensure a seamless keyboard navigation experience for tab lists.
