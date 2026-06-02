## 2026-06-02 - Modal Accessibility
**Learning:** Icon-only close buttons in modals (Methodology and Intel modals) lacked ARIA labels, making them invisible to screen readers. They also missed focus rings, making keyboard navigation difficult to track.
**Action:** Always verify that 'X' or SVG-based close buttons include `aria-label='Close [context]'` and `focus-visible` styles matching the design system (e.g., `outline-none focus-visible:ring-2 focus-visible:ring-[color]`).
