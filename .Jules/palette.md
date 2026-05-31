## 2026-05-29 - Accessible loading state
**Learning:** The loading states in the async components (like GitHubStats.tsx) missed screen reader announcements.
**Action:** To ensure loading states are perceived by screen readers without interrupting the user unnecessarily, adding `role="status"`, `aria-live="polite"`, and an `.sr-only` screen reader string helps significantly.

## 2026-05-30 - Interactive Redacted Elements
**Learning:** Decorative elements like "redacted" text can be turned into delightful micro-interactions. However, when making them interactive, it's critical to provide clear feedback (toasts) and full keyboard accessibility (Enter/Space support with preventDefault).
**Action:** Always use `role="button"` and `aria-label` for interactive non-button elements, and ensure both mouse and keyboard users receive consistent visual and functional feedback.

## 2026-05-31 - SPA Navigation Accessibility and Keyboard Interactivity
**Learning:** For Single Page Applications (SPAs) with smooth scrolling, `aria-current="page"` is a critical accessibility pattern to let screen readers know which nav link corresponds to the currently visible section. Additionally, whenever implementing a custom `role="dialog"` (like the mobile menu), an `Escape` key listener is mandatory for keyboard users to easily dismiss the menu.
**Action:** Always verify that active navigation links convey their state to assistive tech via `aria-current`, and ensure custom modals/dialogs can be exited via the `Escape` key.
