## 2025-02-14 - Visual Rendering of Security Honeypots
**Vulnerability:** Honeypot input field for Contact Form existed in state and submit logic but was missing from DOM.
**Learning:** A honeypot validation is useless if the field only exists in React state. Automated bots interact with the DOM.
**Prevention:** Ensure honeypot input fields are rendered in the DOM, visually hidden via CSS (e.g. `opacity-0 w-0 h-0 absolute pointer-events-none`), and have `tabIndex={-1}` and `aria-hidden="true"`.
