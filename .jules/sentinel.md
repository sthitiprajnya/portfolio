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
