## 2026-05-31 - [ARIA Tabs Pattern for Experience Section]
**Learning:** Implementing the WAI-ARIA Tabs pattern (role="tablist", role="tab", role="tabpanel") significantly improves the discoverability and usability of nested information for screen reader users, especially in complex components like professional experience logs.
**Action:** Always verify that interactive tab-like elements use semantic ARIA roles and proper ID cross-linking (aria-controls/aria-labelledby) to maintain a high accessibility standard.

## 2026-05-31 - [Dynamic Labels and Disclosure Pattern for Accordions]
**Learning:** Disclosure components (like project methodology accordions) require dynamic text labels (e.g., 'VIEW' vs 'HIDE') and proper ARIA attributes (`aria-expanded`, `aria-controls`) to provide clear feedback to both sighted and screen reader users about the current state of the content.
**Action:** Implement the W3C disclosure pattern for all toggleable content areas, ensuring button labels update dynamically and are correctly associated with their content via unique IDs.
