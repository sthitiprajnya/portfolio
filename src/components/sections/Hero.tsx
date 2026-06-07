"use client";
import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { GlitchText }    from '@/components/ui/GlitchText';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { CyberButton }   from '@/components/ui/CyberButton';
import { PERSONAL, HERO_ROLES, HERO_STATS, HERO_TICKER } from '@/data/portfolio';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const MatrixRain = lazy(() => import('@/components/canvas/MatrixRain'));
const NetworkConnector = lazy(() => import('@/components/canvas/NetworkConnector'));
const HeroOrb = dynamic(() => import('@/components/canvas/HeroOrb'), {
  ssr: false,
  loading: () => null,
});

// BOLT: Hoist static data transformations to module level to avoid redundant allocations on every render
const TICKER_CONTENT = [...HERO_TICKER, ...HERO_TICKER];
const PRIMARY_ROLE = PERSONAL.title.split(' · ')[0];
const NAME_CHARS = PERSONAL.nameShort.split('');
const TYPEWRITER_SEQUENCE = HERO_ROLES.flatMap(role => [role, 2000]);

export function Hero() {
  const { ref: statsRef } = useInView({ triggerOnce: true, threshold: 0.5 });
  const [activeIntel, setActiveIntel] = React.useState<string | null>(null);
  const [showMethodology, setShowMethodology] = React.useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // UX Enhancement: Handle Escape key to close modals & manage body scroll locking
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowMethodology(false);
        setActiveIntel(null);
      }
    };

    if (showMethodology || activeIntel !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMethodology, activeIntel]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center pt-16 bg-[var(--gradient-hero)] overflow-hidden"
    >
      <HeroOrb />
      {/* Background effects */}
      <Suspense fallback={null}>
        <MatrixRain opacity={0.055} />
        <NetworkConnector />
      </Suspense>
      <div className="absolute inset-0 scan-line-effect z-0" />

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-[900px] px-6 flex flex-col items-center text-center flex-1 justify-center">

        {/* Role & Availability badge */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -80, filter: 'blur(6px)' }}
            animate={{ opacity: 1, x: 0,  filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="px-5 py-1.5 rounded-full border border-cyan/30 bg-cyan-ghost text-cyan font-mono text-[0.7rem] uppercase tracking-wider"
          >
            // {PRIMARY_ROLE}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 80, filter: 'blur(6px)' }}
            animate={{ opacity: 1, x: 0,  filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-green/30 bg-green-ghost text-green font-mono text-[0.7rem] uppercase tracking-wider shadow-[var(--glow-green-sm)]"
          >
            <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
            AVAILABLE_FOR_HIRE
          </motion.div>
        </div>

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
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.0 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12"
        >
          {HERO_STATS.map((stat, i) => {
            const numericValue = parseInt(stat.value.toString().replace(/[^0-9]/g, ''), 10);
            return (
              <div key={i} className="flex flex-col items-center xs:px-2">
                <span className="font-display text-xl xs:text-2xl text-cyan mb-1 flex items-center">
                  <CountUp end={numericValue} duration={2.5} separator="," enableScrollSpy={true} scrollSpyOnce={true} />
                  {stat.suffix}
                </span>
                <span className="font-mono text-[0.55rem] xs:text-[0.6rem] uppercase tracking-widest text-text-muted text-center max-w-[80px] xs:max-w-none">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.4 }}
          className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <CyberButton onClick={() => scrollTo('projects')}>VIEW_PROJECTS</CyberButton>
          <CyberButton color="amber" onClick={() => setShowMethodology(true)}>VIEW_METHODOLOGY</CyberButton>
          <CyberButton color="green" onClick={() => scrollTo('contact')}>CONTACT_ME</CyberButton>

          <div className="flex space-x-4 pt-4 sm:pt-0 sm:ml-4">
            <a href={PERSONAL.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Visit LinkedIn profile"
               className="p-3 border border-border rounded-card text-text-secondary hover:text-cyan hover:border-cyan hover:shadow-[var(--glow-cyan-sm)] transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href={PERSONAL.github} target="_blank" rel="noopener noreferrer" aria-label="Visit GitHub profile"
               className="p-3 border border-border rounded-card text-text-secondary hover:text-cyan hover:border-cyan hover:shadow-[var(--glow-cyan-sm)] transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black">
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
        className="relative z-10 w-full mt-auto border-t border-[var(--glass-border)] py-3 overflow-hidden glass rounded-t-card"
        role="marquee"
        aria-label="Security intelligence ticker"
        aria-live="off"
        aria-atomic="false"
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00F5FF]/50 to-transparent z-30 pointer-events-none" />

        {/* Fade edges */}
        <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        {/* ALERT label */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 font-mono text-[0.6rem] text-black bg-cyan px-2 py-0.5 rounded-pill tracking-widest font-bold glass-pill">
          INTEL
        </div>

        {/* Scrolling messages */}
        <div className="pl-20 flex whitespace-nowrap overflow-hidden relative z-10">
          <div className="ticker-track flex gap-12">
            {TICKER_CONTENT.map((msg, i) => (
              <button
                key={i}
                onClick={() => setActiveIntel(msg)}
                className="font-mono text-[0.65rem] text-text-secondary tracking-wide hover:text-cyan hover:underline cursor-pointer outline-none focus-visible:text-cyan focus-visible:underline glass-pill px-3 py-1 border-[var(--glass-border)]"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Methodology Modal */}
      <AnimatePresence>
        {showMethodology && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowMethodology(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="methodology-modal-title"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-surface border border-amber/30 rounded-card p-6 max-w-4xl w-full shadow-[var(--glow-amber-md)] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-border"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <h2 id="methodology-modal-title" className="font-mono text-amber text-lg font-bold tracking-widest flex items-center gap-3">
                  <svg className="w-5 h-5 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  PENTEST_METHODOLOGY // LIFECYCLE
                </h2>
                <button
                  onClick={() => setShowMethodology(false)}
                  className="text-text-secondary hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-card"
                  aria-label="Close methodology modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-4 font-mono">
                {/* Pipeline visual */}
                <div className="hidden md:flex items-center justify-between px-2 mb-8 text-[0.6rem] text-text-muted">
                  <span>RECON</span><span className="text-border">→</span>
                  <span>SCAN</span><span className="text-border">→</span>
                  <span>EXPLOIT</span><span className="text-border">→</span>
                  <span>POC CHAIN</span><span className="text-border">→</span>
                  <span>REPORT</span><span className="text-border">→</span>
                  <span className="text-amber">CLOSURE</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border bg-black/40 rounded-card">
                    <h4 className="text-amber font-bold mb-2 flex items-center gap-2"><span className="text-xs">01</span> RECONNAISSANCE</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">OSINT gathering, subdomain enumeration, and attack surface mapping using tools like SpiderFoot, Subfinder, and Nmap.</p>
                  </div>
                  <div className="p-4 border border-border bg-black/40 rounded-card">
                    <h4 className="text-amber font-bold mb-2 flex items-center gap-2"><span className="text-xs">02</span> SCANNING & ENUMERATION</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">Automated and manual discovery of misconfigurations and known CVEs using Burp Suite Pro, Nessus, and custom Nuclei templates.</p>
                  </div>
                  <div className="p-4 border border-border bg-black/40 rounded-card">
                    <h4 className="text-amber font-bold mb-2 flex items-center gap-2"><span className="text-xs">03</span> EXPLOITATION</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">Active exploitation of identified flaws (SQLi, IDOR, SSRF, etc.) to assess real-world business impact and data risk.</p>
                  </div>
                  <div className="p-4 border border-border bg-black/40 rounded-card">
                    <h4 className="text-amber font-bold mb-2 flex items-center gap-2"><span className="text-xs">04</span> POC CHAINING</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">Linking multiple low-severity vulnerabilities to demonstrate critical impact, creating reliable and reproducible Proof of Concepts.</p>
                  </div>
                  <div className="p-4 border border-border bg-black/40 rounded-card">
                    <h4 className="text-amber font-bold mb-2 flex items-center gap-2"><span className="text-xs">05</span> REPORTING</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">Delivering comprehensive reports mapped to OWASP/MITRE frameworks, including executive summaries and technical remediation steps.</p>
                  </div>
                  <div className="p-4 border border-amber/30 bg-amber/5 rounded-card">
                    <h4 className="text-amber font-bold mb-2 flex items-center gap-2"><span className="text-xs">06</span> REMEDIATION TRACKING</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">Collaborating directly with engineering teams, automating JIRA tracking, and validating patches to achieve 100% closure.</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-xs text-text-muted mb-4 uppercase tracking-widest">See it in practice ↴</p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => { setShowMethodology(false); scrollTo('projects'); }} className="px-3 py-1.5 border border-cyan/30 text-cyan text-xs rounded-card hover:bg-cyan/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black">DLP Pipeline</button>
                    <button onClick={() => { setShowMethodology(false); scrollTo('projects'); }} className="px-3 py-1.5 border border-cyan/30 text-cyan text-xs rounded-card hover:bg-cyan/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black">GCP Hardening</button>
                    <button onClick={() => { setShowMethodology(false); scrollTo('projects'); }} className="px-3 py-1.5 border border-cyan/30 text-cyan text-xs rounded-card hover:bg-cyan/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black">MQTT Attack Chain</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intel Modal */}
      <AnimatePresence>
        {activeIntel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveIntel(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="intel-modal-title"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-surface border border-cyan/30 rounded-card p-6 max-w-md w-full shadow-[var(--glow-cyan-md)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                <h2 id="intel-modal-title" className="font-mono text-cyan text-sm font-bold tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  INTEL_EXPANDED
                </h2>
                <button
                  onClick={() => setActiveIntel(null)}
                  className="text-text-secondary hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-card p-1"
                  aria-label="Close intel details"
                >
                  [X]
                </button>
              </div>
              <p className="font-mono text-sm text-text-primary leading-relaxed">
                {activeIntel}
              </p>
              <div className="mt-6 flex justify-end">
                <span className="text-xs text-text-muted font-mono">STATUS: CLASSIFIED</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.5 }}
        onClick={() => scrollTo('about')}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-cyan flex flex-col items-center group p-4 outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-card"
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
