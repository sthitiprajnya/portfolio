import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Orbitron, Inter } from 'next/font/google';
import '@/index.css';
import '@/animations.css';

const jbm = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-loaded',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body-loaded',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sthitaprajna Biswal — Cybersecurity & Cloud Security Engineer',
  description: 'Sthitaprajna Biswal is an Information Security Engineer and Penetration Tester at iServeU Technology with 2+ years delivering measurable risk reduction.',
  keywords: 'Sthitaprajna Biswal, Sthitaprajna, cybersecurity engineer, penetration tester, VAPT, AppSec, cloud security, GCP security, AWS security, Burp Suite, Kali Linux, application security, Bhubaneswar, India, iServeU',
  authors: [{ name: 'Sthitaprajna Biswal' }],
  robots: 'index, follow, max-image-preview:large',
  alternates: {
    canonical: 'https://sthitiprajnya.github.io/portfolio/',
  },
  openGraph: {
    type: 'website',
    url: 'https://sthitiprajnya.github.io/portfolio/',
    title: 'Sthitaprajna Biswal — Cybersecurity & Cloud Security Engineer',
    description: 'Information Security Engineer with 2+ years in application VAPT, cloud security, and red team operations for major Indian FinTech and banking clients.',
    siteName: 'Sthitaprajna Biswal Portfolio',
    images: [{
      url: 'https://sthitiprajnya.github.io/portfolio/og-image.webp',
      width: 1200,
      height: 630,
    }, {
      url: 'https://sthitiprajnya.github.io/portfolio/og-image.png',
      width: 1200,
      height: 630,
    }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sthitaprajna Biswal — Cybersecurity Engineer',
    description: '50+ pen tests · 230+ vulnerabilities · NPCI · UIDAI · Axis Bank · Kotak Mahindra',
    images: ['https://sthitiprajnya.github.io/portfolio/og-image.webp'],
  },
  referrer: 'strict-origin-when-cross-origin',
};

export const viewport: Viewport = {
  themeColor: '#00F5FF',
};

import { FaviconBlinkProvider } from '@/components/providers/FaviconBlinkProvider';
import { VisibilityOptimiserProvider } from '@/components/providers/VisibilityOptimiserProvider';
import Sentinel from '@/components/canvas/Sentinel';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sthitaprajna Biswal',
    description: 'Information Security Engineer and Penetration Tester specializing in FinTech and Cloud Security.',
    jobTitle: 'Information Security Engineer',
    url: 'https://sthitiprajnya.github.io/portfolio/',
    sameAs: [
      'https://www.linkedin.com/in/sthitaprajna-biswal-0175b7171/',
      'https://github.com/sthitiprajnya',
      'https://profile.hackthebox.com/profile/019db8ae-9364-73ed-bb47-1336835663a7'
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'iServeU Technology'
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Veer Surendra Sai University of Technology (VSSUT)'
    },
    knowsAbout: [
      'Cybersecurity',
      'Penetration Testing',
      'Cloud Security',
      'Application Security',
      'GCP',
      'AWS',
      'VAPT'
    ]
  };

  // Security: Escape JSON-LD to prevent XSS via script tag breakout.
  // Specifically, replacing '<', '>', '/', and '&' prevents script tag breakout and provides defense-in-depth.
  const jsonLdString = JSON.stringify(jsonLd)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\//g, '\\u002f')
    .replace(/&/g, '\\u0026');

  return (
    <html lang="en" className={`${jbm.variable} ${inter.variable} ${orbitron.variable}`}>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline'; script-src-attr 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com https://ghchart.rshah.org; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.github.com https://api.emailjs.com; form-action 'self' https://api.emailjs.com; object-src 'none'; base-uri 'none'; manifest-src 'self'; worker-src 'none'; upgrade-insecure-requests; frame-ancestors 'none'; require-trusted-types-for 'script'; trusted-types default;"
        />
        {/* Security: Define a default Trusted Types policy to satisfy the CSP and prevent DOM XSS sinks. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.trustedTypes && window.trustedTypes.createPolicy) {
                if (!window.trustedTypes.defaultPolicy) {
                  window.trustedTypes.createPolicy('default', {
                    createHTML: (s) => {
                      if (typeof s === 'string') {
                        // Security: Defense-in-depth against DOM XSS.
                        // We block known dangerous tags and all inline event handlers (on*).
                        // Note: Our own Trusted Types policy script below triggers this check
                        // because it contains the strings we are searching for (e.g., '<script').
                        // This is expected and serves as a self-test for the policy.
                        const lower = s.toLowerCase();
                        if (
                          lower.includes('<script') ||
                          lower.includes('<base') ||
                          lower.includes('<embed') ||
                          lower.includes('<object') ||
                          lower.includes('<applet') ||
                          lower.includes('<meta') ||
                          lower.includes('<form') ||
                          lower.includes('<iframe') ||
                          lower.includes('<frame') ||
                          lower.includes('<frameset') ||
                          lower.includes('<template') ||
                          lower.includes('<math') ||
                          lower.includes('<svg') ||
                          lower.includes('<details') ||
                          lower.includes('<animate') ||
                          lower.includes('<animatemotion') ||
                          lower.includes('<mpath') ||
                          lower.includes('<discard') ||
                          lower.includes('<set') ||
                          lower.includes('<use') ||
                          lower.includes('<portal') ||
                          lower.includes('<link') ||
                          lower.includes('<style') ||
                          lower.includes('<audio') ||
                          lower.includes('<video') ||
                          lower.includes('<source') ||
                          lower.includes('<track') ||
                          lower.includes('<img') ||
                          lower.includes('<picture') ||
                          lower.includes('<area') ||
                          lower.includes('<map') ||
                          lower.includes('<input') ||
                          lower.includes('<keygen') ||
                          lower.includes('<isindex') ||
                          lower.includes('<layer') ||
                          lower.includes('<basefont') ||
                          lower.includes('<blink') ||
                          lower.includes('<dialog') ||
                          lower.includes('<marquee') ||
                          lower.includes('<isindex') ||
                          lower.includes('<layer') ||
                          lower.includes('<basefont') ||
                          lower.includes('<blink') ||
                          /(javascript|data|vbscript|file)[\\s\\x00-\\x1f]*:/i.test(lower) ||
                          /on[a-z]+\\s*=/i.test(lower) ||
                          /\\s+(formaction|srcdoc|srcset|style|action|background|bgcolor|xlink:href|autofocus|contenteditable)(\\s*=|\\s|>|$)/i.test(lower)
                        ) {
                          console.warn('Blocked dangerous HTML pattern in Trusted Types default policy:', s.slice(0, 50) + '...');
                          return s
                            .replace(/<(script|base|embed|object|applet|meta|form|iframe|frame|frameset|template|math|svg|details|animate|animatemotion|mpath|discard|set|use|portal|link|style|audio|video|source|track|img|picture|area|map|input|keygen|dialog|marquee|isindex|layer|basefont|blink)/gi, '<blocked-$1')
                            .replace(/(javascript|data|vbscript|file)[\\s\\x00-\\x1f]*:/gi, 'blocked-$1:')
                            .replace(/on[a-z]+\\s*=/gi, (match) => 'blocked-' + match)
                            .replace(/(\\s+)(formaction|srcdoc|srcset|style|action|background|bgcolor|xlink:href|autofocus|contenteditable)([\\s\\x00-\\x1f]*=|\\s|>|$)/gi, '$1blocked-$2$3');
                        }
                      }
                      return s;
                    },
                    createScript: (s) => s,
                    createScriptURL: (s) => {
                      // Security: Robust origin and protocol validation using the URL constructor.
                      // Enforces same-origin policy and blocks dangerous schemes like blob:, data:, and javascript:.
                      try {
                        const url = new URL(s, window.location.origin);
                        const isSameOrigin = url.origin === window.location.origin;
                        const isHttpOrHttps = url.protocol === 'http:' || url.protocol === 'https:';

                        if (!isSameOrigin || !isHttpOrHttps) {
                          console.warn('Blocked dangerous or cross-origin script URL in Trusted Types policy:', s);
                          return '/blocked-script-url';
                        }
                        return url.href;
                      } catch (e) {
                        console.warn('Blocked invalid script URL in Trusted Types policy:', s);
                        return '/blocked-invalid-script';
                      }
                    },
                  });
                }
              }
            `
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
        <link rel="security" href="/portfolio/.well-known/security.txt" />
        <link rel="preload" href="/portfolio/og-image.webp" as="image" />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-1/2 focus:-translate-x-1/2 focus:z-[10003] focus:bg-surface focus:text-cyan focus:px-6 focus:py-3 focus:border focus:border-cyan focus:border-t-0 focus:rounded-b-md focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:shadow-[var(--glow-cyan-md)] focus:outline-none"
        >
          Skip to content
        </a>
        <div id="root">
          <VisibilityOptimiserProvider>
            <FaviconBlinkProvider>
              <Sentinel />
              {children}
            </FaviconBlinkProvider>
          </VisibilityOptimiserProvider>
        </div>
      </body>
    </html>
  );
}
