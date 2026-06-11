# Sentinel's Journal - Critical Security Learnings

## 2025-05-14 - Dependency Supply Chain Hardening
**Vulnerability:** Command injection in `glob` (<10.5.0) and XSS in `postcss` (<8.5.10) in transitive dependencies.
**Learning:** Even if direct dependencies are updated, transitive dependencies can remain vulnerable unless explicitly overridden in the package manager configuration.
**Prevention:** Regularly run `pnpm audit` and use `pnpm.overrides` to enforce secure versions of transitive dependencies that aren't being updated by parent packages.

## 2026-05-31 - Accuracy in Security Integrity Claims
**Vulnerability:** Displaying a placeholder SHA256 hash (empty file hash) for a resume file, which undermines the credibility of the "Integrity OK" status in a security portfolio.
**Learning:** Security-themed UX elements (like integrity checks) must be backed by accurate data; otherwise, they become "security theater" that can be easily spotted by technical reviewers, damaging trust.
**Prevention:** Always verify and automate (if possible) the generation of integrity hashes for files referenced in the UI. Additionally, use `sandbox` attributes on iframes displaying external or uploaded content to maintain strict isolation.

## 2025-05-20 - JSON-LD XSS Prevention
**Vulnerability:** XSS via JSON-LD script tag breakout when using `dangerouslySetInnerHTML`.
**Learning:** Using `JSON.stringify()` directly inside a `<script type="application/ld+json">` tag via `dangerouslySetInnerHTML` is dangerous if the JSON contains `</script>`. The browser parses the closing tag and breaks out of the script context.
**Prevention:** Always escape the serialized JSON string by replacing `<` with `\u003c`. This prevents the browser from finding a closing script tag while remaining valid JSON for search engines.

## 2026-06-02 - Defense-in-Depth for Static Assets
**Vulnerability:** Overly permissive iframe sandboxing and missing restrictive Permissions Policy on static asset viewers (like PDF resumes).
**Learning:** Even if a file is trusted, providing `allow-scripts` in a sandbox when not strictly required (e.g., for PDF.js vs native browser viewer) violates the principle of least privilege. Additionally, the lack of a Permissions Policy (the `allow` attribute) on iframes leaves the door open for hardware API abuse if the source is compromised.
**Prevention:** Always use the most restrictive `sandbox` possible (e.g., omit `allow-scripts` for static documents) and explicitly block hardware/geolocation APIs using the `allow` attribute on all iframes. Position the CSP meta tag as the first child of `<head>` to ensure policies are active before secondary resources are parsed.

## 2025-05-25 - Client-Side DoS via Animation State
**Vulnerability:** Unbounded memory growth in high-frequency Canvas animation loops.
**Learning:** Performance optimizations that reuse global arrays (like buckets for connection drawing) can introduce security risks if the state is not reset every frame. In this case, `NetworkConnector.tsx` was pushing to arrays without clearing them, leading to an O(n*frames) memory leak that could crash the tab.
**Prevention:** Ensure all state used within `requestAnimationFrame` or high-frequency intervals is strictly bounded or explicitly cleared at the start of every iteration. Use `array.length = 0` as an efficient way to clear reused arrays while avoiding GC pressure.

## 2026-06-04 - Client-Side DoS via Terminal State
**Vulnerability:** Unbounded growth of React state arrays representing terminal output lines and command history.
**Learning:** Interactive components that simulate long-running processes (like a terminal or chat bot) can lead to browser memory exhaustion if users or malicious scripts flood them with entries.
**Prevention:** Always cap state arrays that are updated via user input or automated responses using `.slice(-LIMIT)`. This ensures the application remains responsive and stable regardless of interaction volume.

## 2026-06-05 - Hardened Trusted Types Policies
**Vulnerability:** XSS bypasses in Trusted Types default policies due to incomplete regex patterns (e.g., missing whitespace around event handler assignments) or missing URL origin validation.
**Learning:** A "default" Trusted Types policy is a powerful defense-in-depth layer, but it must be robust against common bypasses. Simply checking for `onclick=` isn't enough if an attacker uses `onclick =`. Additionally, an open `createScriptURL` policy defeats the purpose of restricting external scripts via CSP.
**Prevention:** Use `\\s*` in regex for event handlers to account for whitespace. Enforce same-origin checks in `createScriptURL` within the default policy to prevent cross-origin script injection through standard DOM sinks.

## 2026-06-07 - Robust Origin Validation in Trusted Types
**Vulnerability:** Insecure origin validation in `createScriptURL` using simple string prefix matching (e.g., `startsWith('http')`), which can be bypassed by protocol-relative URLs or specially crafted strings.
**Learning:** Security-critical origin checks should rely on built-in parser logic like the `URL` constructor rather than manual string manipulation to ensure consistent behavior across all edge cases (e.g., handling port numbers, trailing slashes, and protocol variations).
**Prevention:** Always use `new URL(input, window.location.origin)` and compare the resulting `.origin` property against `window.location.origin` for robust same-origin enforcement. Additionally, expand HTML sanitization policies to cover modern and legacy embedding tags like `<embed>`, `<object>`, and `<applet>`.

## 2026-06-10 - Resilient Trusted Types Configuration
**Vulnerability:** Broken script loading due to missing return statements in Trusted Types callbacks and incomplete sanitization of `javascript:` URIs.
**Learning:** Security-critical callbacks (like `createScriptURL`) must return the validated value; otherwise, they implicitly return `undefined`, which the browser treats as a block, breaking application functionality. Furthermore, sanitization regexes should be case-insensitive and account for whitespace to prevent trivial bypasses (e.g., `javaScript  :`).
**Prevention:** Always ensure every branch of a Trusted Types policy returns a value. Use the `/i` flag and `\\s*` in sanitization regexes. Periodically audit policies to include modern and legacy sinks like `<applet>`, `<meta>`, and `<form>` to maintain a strong defense-in-depth posture.

## 2026-06-12 - Self-Intercepting Trusted Types Policies
**Vulnerability:** XSS bypasses in Trusted Types default policies due to incomplete regex patterns.
**Learning:** A robust Trusted Types policy that blocks strings like '<script' will inevitably intercept its own source code when that code is injected into the DOM via sinks like `dangerouslySetInnerHTML`. This leads to "Blocked dangerous HTML pattern" warnings in the console even if no actual attack is occurring.
**Prevention:** This behavior is expected in a secure-by-default environment. Developers should be aware that these console warnings during initialization are evidence that the policy is functioning correctly and self-testing its own enforcement logic.

## 2026-06-15 - Hardening Trusted Types against mXSS and Exfiltration
**Vulnerability:** Potential XSS bypasses via SVG animation tags and data exfiltration through injected style/link tags.
**Learning:** A standard Trusted Types policy often focuses on <script>, but attackers can use SVG tags like <animate> or <use> to achieve XSS (mXSS). Furthermore, even without executing scripts, injecting <link> or <style> can be used for CSS-based data exfiltration.
**Prevention:** Extend Trusted Types createHTML policies to include a broader set of dangerous tags and use the URL object's protocol property in createScriptURL for case-insensitive, normalized scheme validation.
