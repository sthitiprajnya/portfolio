"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { CyberButton } from '@/components/ui/CyberButton';
import { PERSONAL }    from '@/data/portfolio';
import { useAudio }    from '@/components/providers/AudioProvider';

export const NAV_LINKS = [
  { label: 'About',    id: 'about'    },
  { label: 'Skills',   id: 'skills'   },
  { label: 'XP',       id: 'experience'},
  { label: 'Projects', id: 'projects' },
  { label: 'Certs',    id: 'certifications' },
  { label: 'War Games',id: 'ctf'      },
  { label: 'GitHub',   id: 'github'   },
  { label: 'Resume',   id: 'resume'   },
  { label: 'Contact',  id: 'contact'  },
];

export function Navigation() {
  const [scrolled,       setScrolled]       = useState(false);
  const [activeSection,  setActiveSection]  = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // UX Enhancement: Handle Escape key to close mobile menu & prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    // BOLT: Use IntersectionObserver instead of scroll listeners and getBoundingClientRect
    // for much better performance (avoids main-thread layout thrashing)
    const sections = ['hero', ...NAV_LINKS.map(l => l.id)];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Separate observer for the navbar "scrolled" state
    const heroEl = document.getElementById('hero');
    const scrolledObserver = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      { rootMargin: '-80px 0px 0px 0px', threshold: 0 }
    );

    if (heroEl) scrolledObserver.observe(heroEl);

    return () => {
      observer.disconnect();
      scrolledObserver.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <>
      {/* BOLT: Sentinel element to detect scroll position without scroll event listeners */}
      <div ref={sentinelRef} className="absolute top-0 left-0 w-px h-px pointer-events-none" />
      <nav
        aria-label="Main navigation"
        className={clsx(
          'fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300 flex items-center px-4 md:px-8',
          'glass-heavy rounded-b-xl border-t-0 border-l-0 border-r-0 border-b',
          scrolled ? 'bg-[rgba(0,0,0,0.75)] backdrop-blur-glass-heavy border-[rgba(0,245,255,0.25)]' : 'border-[var(--glass-border)]'
        )}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => scrollTo('hero')}
            className="flex items-center space-x-2 group outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-card"
            aria-label="Scroll to top"
          >
            <span className="text-cyan font-mono font-bold">{'>_'}</span>
            <span className="font-display font-bold text-white tracking-widest text-sm md:text-base group-hover:text-cyan transition-colors">
              {PERSONAL.nameShort}
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <AudioToggle />

            <button
              onClick={openSearch}
              className="flex items-center gap-3 px-3 py-1.5 rounded-card border border-border text-text-secondary hover:text-cyan hover:border-cyan hover:shadow-[var(--glow-cyan-sm)] transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black group"
              aria-label="Search sections"
              aria-keyshortcuts="/"
            >
              <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="font-mono text-[0.65rem] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Search</span>
              <kbd className="font-mono text-[0.6rem] bg-black/50 px-1.5 py-0.5 rounded border border-border/50 opacity-40 group-hover:opacity-100 transition-opacity">[/]</kbd>
            </button>

            <ul className="flex items-center space-x-4 xl:space-x-6">
              {NAV_LINKS.map(link => {
                const isActive = activeSection === link.id;
                return (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollTo(link.id)}
                      className={clsx(
                        'relative font-mono text-[0.72rem] uppercase tracking-widest py-2 px-3 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black',
                        isActive ? 'text-cyan glass-pill rounded-pill border-b-2 border-cyan' : 'text-text-secondary hover:text-cyan rounded-pill border-b-2 border-transparent'
                      )}
                      aria-label={`Scroll to ${link.label} section`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            <CyberButton as="a" href={PERSONAL.resumeUrl} download color="green" className="py-2 px-4 text-[0.7rem]">
              <span className="flex items-center gap-2">
                CV
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
              </span>
            </CyberButton>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <AudioToggle mobile />

            <button
              onClick={openSearch}
              className="text-text-secondary p-2 outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-card"
              aria-label="Search sections"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <button
              className="text-cyan p-2 outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-card"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-black border-l border-border flex flex-col p-8 lg:hidden overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <span className="font-display font-bold text-white tracking-widest text-sm">SYSTEM_MENU</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-cyan p-2 outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-card" aria-label="Close menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <ul className="flex flex-col space-y-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.li key={link.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                    <button
                      onClick={() => scrollTo(link.id)}
                      className={clsx(
                        'group flex items-center w-full p-4 rounded-card outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black font-mono transition-all',
                        activeSection === link.id ? 'bg-cyan/10 text-cyan border border-cyan/20' : 'hover:bg-white/5 text-text-secondary hover:text-white border border-transparent'
                      )}
                      aria-label={`Scroll to ${link.label} section`}
                      aria-current={activeSection === link.id ? 'page' : undefined}
                    >
                      <span className="opacity-40 mr-4 text-xs w-8 group-hover:text-cyan transition-colors">
                        {activeSection === link.id ? '>>' : `$`}
                      </span>
                      <span className="text-lg uppercase tracking-widest">{link.label}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.div className="mt-auto pt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              <CyberButton as="a" href={PERSONAL.resumeUrl} download color="green" className="w-full">
                DOWNLOAD_CV
              </CyberButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AudioToggle({ mobile = false }: { mobile?: boolean }) {
  const { audioEnabled, setAudioEnabled, isSpeaking } = useAudio();

  return (
    <button
      onClick={() => setAudioEnabled(!audioEnabled)}
      className={clsx(
        "relative flex items-center justify-center transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-card",
        mobile ? "p-2 text-text-secondary" : "p-2 border border-border text-text-secondary hover:text-cyan hover:border-cyan hover:shadow-[var(--glow-cyan-sm)]"
      )}
      aria-label={audioEnabled ? "Mute audio" : "Unmute audio"}
    >
      {isSpeaking && audioEnabled && (
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan"></span>
        </span>
      )}
      {audioEnabled ? (
        <svg className={mobile ? "w-6 h-6" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      ) : (
        <svg className={mobile ? "w-6 h-6" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      )}
    </button>
  );
}
