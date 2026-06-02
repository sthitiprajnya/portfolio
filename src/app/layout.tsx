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
import { AudioProvider } from '@/components/providers/AudioProvider';
import { VisibilityOptimiserProvider } from '@/components/providers/VisibilityOptimiserProvider';
import LivieBot from '@/components/livie/LivieBot';
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
  // Specifically, replacing '<' with '\u003c' prevents '</script>' from being parsed as a closing tag.
  const jsonLdString = JSON.stringify(jsonLd).replace(/</g, '\\u003c');

  return (
    <html lang="en" className={`${jbm.variable} ${inter.variable} ${orbitron.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://github-readme-stats.vercel.app https://streak-stats.demolab.com https://images.unsplash.com https://ghchart.rshah.org; font-src 'self' data:; connect-src 'self' https://api.github.com https://api.emailjs.com; form-action 'self' https://api.emailjs.com; object-src 'none'; base-uri 'self'; upgrade-insecure-requests; frame-ancestors 'none';"
        />
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
            <AudioProvider>
              <FaviconBlinkProvider>
                <Sentinel />
                {children}
                <LivieBot />
              </FaviconBlinkProvider>
            </AudioProvider>
          </VisibilityOptimiserProvider>
        </div>
      </body>
    </html>
  );
}
