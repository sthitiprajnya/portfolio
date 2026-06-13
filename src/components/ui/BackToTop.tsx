"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  useEffect(() => {
    const toggle = () => setIsVisible(window.scrollY > 400);
    window.addEventListener('scroll', toggle);
    return () => window.removeEventListener('scroll', toggle);
  }, []);
  const scroll = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
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
          className="fixed bottom-24 right-6 z-50 p-3 bg-black/80 border border-cyber-cyan shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:bg-cyber-cyan/10 transition-colors group"
        >
          <svg className="h-6 w-6 text-cyber-cyan group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
