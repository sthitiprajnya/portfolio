"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const lenis = useSmoothScroll();

  useEffect(() => {
    const toggle = () => setIsVisible(window.scrollY > 400);
    // BOLT: Add passive listener to high-frequency scroll event to improve scroll performance
    window.addEventListener('scroll', toggle, { passive: true });
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  const scroll = () => {
    if (lenis && !reducedMotion) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
    // Accessibility: Transfer focus back to the hero section after scroll completes
    setTimeout(() => {
      document.getElementById('hero')?.focus({ preventScroll: true });
    }, 100);
  };
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={scroll} aria-label="Back to top" title="Back to top"
          className="fixed bottom-24 right-6 z-50 p-3 bg-black/80 border border-cyan shadow-[var(--glow-cyan-sm)] hover:bg-cyan/10 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-card"
        >
          <svg className="h-6 w-6 text-cyan group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
