# Security Policy

## Vulnerability Reporting

If you discover a security vulnerability within this project, please send an e-mail to **sthitabiswal2002@gmail.com**. All security vulnerabilities will be promptly addressed.

Please include the following information in your report:

- Type of issue (e.g., XSS, SQLi, Logic flaw)
- Description of the vulnerability
- Instructions to reproduce the issue (PoC)
- Potential impact

## Security Practices

This project follows several security best practices, including:

- **Content Security Policy (CSP)**: A strict CSP is implemented to mitigate XSS and data injection attacks.
- **Trusted Types**: Enabled to prevent DOM-based XSS by restricting the use of dangerous sinks.
- **Subresource Integrity (SRI)**: Used (where supported by the platform) to ensure third-party scripts haven't been tampered with.
- **Principle of Least Privilege**: Used for IAM roles and resource configurations.
- **Honeypots**: Implemented on contact forms to deter automated bot submissions.

## Security Contact

You can also find security contact information in our `security.txt` file located at `public/.well-known/security.txt`.
