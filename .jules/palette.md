## 2025-07-24 - [Accessible Tooltips for Decorative Icons]
**Learning:** Decorative or informative icons that trigger tooltips on hover are often missed in keyboard navigation. Providing `tabIndex={0}` and linking content via `aria-describedby` is essential for WCAG compliance.
**Action:** Always verify that informative tooltips are triggerable via `:focus-visible` and have appropriate ARIA roles and descriptions. Use the array index for unique IDs when rendering in loops to ensure stable ARIA links.
