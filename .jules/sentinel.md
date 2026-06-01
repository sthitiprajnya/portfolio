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
