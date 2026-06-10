"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CyberButton } from './CyberButton';

/**
 * 🎨 Palette: Micro-UX Enhancement
 * Provides a floating action button to return to the top of the page
 * after the user has scrolled beyond a specific threshold.
 */
export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after 400px of scrolling
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[49]"
        >
          <CyberButton
            onClick={scrollToTop}
            className="w-12 h-12 !p-0 flex items-center justify-center rounded-pill shadow-[var(--glow-cyan-sm)]"
            aria-label="Scroll back to top"
            title="Scroll back to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
          </CyberButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
