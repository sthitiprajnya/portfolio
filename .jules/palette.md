## 2025-05-15 - [Filter Tab Counts and Ambiguous Locators]
**Learning:** In multi-section landing pages with repeating UI patterns (like category filters), using generic labels (e.g., "ALL") can lead to ambiguity for both assistive technologies and automated tests. Furthermore, when implementing hover effects on nested elements using Tailwind `group-hover`, it's easy to forget the `group` class on the parent, breaking the expected visual feedback.

**Action:** Always scope interactive elements using section IDs or specific `aria-label` values. When adding nested hover effects, double-check that the `group` class is present on the trigger container. Ensure small text elements (like badges) maintain a minimum readable size (e.g., >= 0.7rem).
