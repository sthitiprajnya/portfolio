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
