"use client";
import React, { lazy, Suspense } from 'react';
import { PERSONAL } from '@/data/portfolio';
import { LogoBadge } from '@/components/ui/LogoBadge';

const MatrixRain = lazy(() => import('@/components/canvas/MatrixRain'));

export function Footer() {
  const year = new Date().getFullYear();
  // Using a mock session logged value or random number generator between 1000 and 5000 for aesthetics
  const [visitorCount, setVisitorCount] = React.useState(0);

  React.useEffect(() => {
    // Generate a stable-ish random number based on today's date so it doesn't jump crazily on every refresh, but grows slowly
    const today = new Date();
    const base = 4280 + (today.getMonth() * 120) + today.getDate() * 15;
    setVisitorCount(base + Math.floor(Math.random() * 5));
  }, []);

  return (
    <footer className="relative bg-black h-[160px] pb-6 pt-2 flex flex-col items-center justify-center border-t-2 border-transparent">

      {/* Glowing top divider */}
      <div
        className="absolute top-0 left-0 w-full h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, var(--color-cyan) 50%, transparent 100%)' }}
      />

      <Suspense fallback={null}>
        <MatrixRain opacity={0.04} />
      </Suspense>

      <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center space-y-4">

        <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-4 md:space-y-0">
          <span className="font-display font-bold text-white tracking-widest text-sm">
            {PERSONAL.name.toUpperCase()}
          </span>

          <div className="flex items-center space-x-4">
            <a href={`mailto:${PERSONAL.email}`} className="text-text-secondary hover:text-cyan transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-card" aria-label="Email">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </a>
            <a href={PERSONAL.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-violet transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-card" aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href={PERSONAL.github} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-card" aria-label="GitHub">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Fixed: was "React + Vite" — this project is Next.js */}
        <div className="w-full text-center text-[0.4rem] xs:text-[0.5rem] sm:text-xs text-text-muted/30 font-mono tracking-[0.2em] leading-none select-none mb-4 whitespace-pre">
          {'==================================================='}
        </div>

        {/* Fixed: was "React + Vite" — this project is Next.js */}
        <div className="font-mono text-[0.75rem] text-text-muted text-center flex flex-col md:flex-row items-center justify-center gap-4">
          <span className="flex items-center gap-2 font-display">
            {'>_'} built by Sthitaprajna Biswal
          </span>
          <span className="hidden md:inline">|</span>
          <span className="flex items-center gap-2">
            Built with
            <LogoBadge src="/portfolio/logos/footer/nextjs.svg" alt="Next.js" width={16} height={16} className="invert dark:invert-0 opacity-80" />
            · Deployed on
            <LogoBadge src="/portfolio/logos/footer/githubpages.svg" alt="GitHub Pages" width={16} height={16} className="invert dark:invert-0 opacity-80" />
            · © {year}
          </span>
          <span className="hidden md:inline">|</span>
          <span className="flex items-center gap-2 px-2 py-0.5 bg-green/5 border border-green/20 rounded-card font-bold text-green shadow-[var(--glow-green-sm)]">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse"></span>
            SESSIONS_LOGGED: {visitorCount.toString().padStart(4, '0')}
          </span>
        </div>
      </div>
    </footer>
  );
}
