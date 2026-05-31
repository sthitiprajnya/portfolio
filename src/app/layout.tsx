import type { Metadata, Viewport } from 'next';
import '@/index.css';
import '@/animations.css';

export const metadata: Metadata = {
  title: 'Sthitaprajna Biswal — Cybersecurity & Cloud Security Engineer',
  description: 'Sthitaprajna Biswal is an Information Security Engineer and Penetration Tester at iServeU Technology with 2+ years delivering measurable risk reduction.',
  keywords: 'Sthitaprajna Biswal, Sthitaprajna, cybersecurity engineer, penetration tester, VAPT, AppSec, cloud security, GCP security, AWS security, Burp Suite, Kali Linux, application security, Bhubaneswar, India, iServeU',
  authors: [{ name: 'Sthitaprajna Biswal' }],
  robots: 'index, follow, max-image-preview:large',
  alternates: {
    canonical: 'https://sthitiprajnya.github.io/portfolio/',
  },
  referrer: 'strict-origin-when-cross-origin',
  openGraph: {
    type: 'website',
    url: 'https://sthitiprajnya.github.io/portfolio/',
    title: 'Sthitaprajna Biswal — Cybersecurity & Cloud Security Engineer',
    description: 'Information Security Engineer with 2+ years in application VAPT, cloud security, and red team operations for major Indian FinTech and banking clients.',
    siteName: 'Sthitaprajna Biswal Portfolio',
    images: [{
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
    images: ['https://sthitiprajnya.github.io/portfolio/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#00F5FF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://github-readme-stats.vercel.app https://streak-stats.demolab.com https://images.unsplash.com; font-src 'self' data:; connect-src 'self' https://api.github.com https://api.emailjs.com; form-action 'self' https://api.emailjs.com; object-src 'none'; base-uri 'self'; upgrade-insecure-requests; frame-ancestors 'none';"
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-1/2 focus:-translate-x-1/2 focus:z-[10003] focus:bg-surface focus:text-cyan focus:px-6 focus:py-3 focus:border focus:border-cyan focus:border-t-0 focus:rounded-b-md focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:shadow-[var(--glow-cyan-md)] focus:outline-none"
        >
          Skip to content
        </a>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
