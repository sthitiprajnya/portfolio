"use client";
import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { GlitchText }    from '@/components/ui/GlitchText';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { CyberButton }   from '@/components/ui/CyberButton';
import { PERSONAL, HERO_ROLES, HERO_STATS, HERO_TICKER } from '@/data/portfolio';

const ParticleField = lazy(() => import('@/components/canvas/ParticleField'));
const MatrixRain    = lazy(() => import('@/components/canvas/MatrixRain'));

// BOLT: Hoist static data transformations to module level to avoid redundant allocations on every render
const TICKER_CONTENT = [...HERO_TICKER, ...HERO_TICKER];
const PRIMARY_ROLE = PERSONAL.title.split(' · ')[0];
const NAME_CHARS = PERSONAL.nameShort.split('');
const TYPEWRITER_SEQUENCE = HERO_ROLES.flatMap(role => [role, 2000]);

export function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center pt-16 bg-[var(--gradient-hero)] overflow-hidden"
    >
      {/* Background effects */}
      <Suspense fallback={null}>
        <MatrixRain opacity={0.055} />
        <ParticleField />
      </Suspense>
      <div className="absolute inset-0 scan-line-effect z-0" />

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-[900px] px-6 flex flex-col items-center text-center flex-1 justify-center">

        {/* Role badge */}
        <motion.div
          initial={{ opacity: 0, x: -80, filter: 'blur(6px)' }}
          animate={{ opacity: 1, x: 0,  filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 px-5 py-1.5 rounded-full border border-cyan/30 bg-cyan-ghost text-cyan font-mono text-[0.7rem] uppercase tracking-wider"
        >
          // {PRIMARY_ROLE}
        </motion.div>

        {/* Name with per-character cinematic reveal */}
        <div className="mb-4 overflow-hidden w-full text-center">
          <GlitchText
            className="font-display font-black text-hero tracking-[-0.03em] leading-none z-20"
            style={{ perspective: '1000px' }}
          >
            {NAME_CHARS.map((char, i) => (
              <motion.span
                key={i}
                className="inline-block overflow-hidden"
                initial={{ opacity: 0, rotateX: 90, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, rotateX: 0,  y: 0,  scale: 1 }}
                transition={{ duration: 1.2, delay: 0.5 + i * 0.08, ease: [0.175, 0.885, 0.32, 1.1] }}
              >
                <motion.span
                  className="inline-block text-gradient-shimmer hover:scale-110 transition-transform duration-300"
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              </motion.span>
            ))}
          </GlitchText>
        </div>

        {/* Typewriter roles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="h-[2em] mb-6"
        >
          <TypewriterText
            sequence={TYPEWRITER_SEQUENCE}
            className="font-heading font-bold text-[clamp(1.1rem,2.5vw,1.7rem)] text-text-secondary"
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="font-body text-base text-text-secondary mb-12 max-w-lg"
        >
          &ldquo;{PERSONAL.tagline}&rdquo;
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.0 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12"
        >
          {HERO_STATS.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="font-display text-2xl text-cyan mb-1">
                {stat.value}{stat.suffix}
              </span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-text-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.4 }}
          className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <CyberButton onClick={() => scrollTo('projects')}>VIEW_PROJECTS</CyberButton>
          <CyberButton color="green" onClick={() => scrollTo('contact')}>CONTACT_ME</CyberButton>

          <div className="flex space-x-4 pt-4 sm:pt-0 sm:ml-4">
            <a href={PERSONAL.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
               className="p-3 border border-border rounded-sm text-text-secondary hover:text-cyan hover:border-cyan hover:shadow-[var(--glow-cyan-sm)] transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href={PERSONAL.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
               className="p-3 border border-border rounded-sm text-text-secondary hover:text-cyan hover:border-cyan hover:shadow-[var(--glow-cyan-sm)] transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </motion.div>
      </div>

      {/* ── Threat intel ticker ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0, duration: 0.8 }}
        className="relative z-10 w-full mt-auto border-t border-cyan/15 bg-black/40 backdrop-blur-sm py-3 overflow-hidden"
      >
        {/* Fade edges */}
        <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        {/* ALERT label */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 font-mono text-[0.6rem] text-black bg-cyan px-2 py-0.5 rounded-sm tracking-widest font-bold">
          INTEL
        </div>

        {/* Scrolling messages */}
        <div className="pl-20 flex whitespace-nowrap overflow-hidden">
          <div className="ticker-track flex gap-12">
            {TICKER_CONTENT.map((msg, i) => (
              <span key={i} className="font-mono text-[0.65rem] text-text-secondary tracking-wide">
                {msg}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.5 }}
        onClick={() => scrollTo('about')}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-cyan flex flex-col items-center group p-4 outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-md"
        aria-label="Scroll to About section"
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-widest mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
          SCROLL
        </span>
        <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </motion.button>

      <style>{`
        @keyframes pulse-glow {
          from { box-shadow: none; }
          to   { box-shadow: var(--glow-cyan-sm); }
        }
      `}</style>
    </section>
  );
}
