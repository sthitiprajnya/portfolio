"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { ScrollReveal, fadeSlideLeft } from './ScrollReveal';

interface SectionTitleProps {
  number: string;
  title: string;
  id?: string;
  className?: string;
}

/**
 * SectionTitle component providing a numbered heading and a deep-link copy button.
 * Uses the URL API for robust link construction and localized 'COPIED!' feedback.
 */
export function SectionTitle({ number, title, id, className }: SectionTitleProps) {
  const [copied, setCopied] = useState(false);
  const sectionId = id || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  const handleCopy = async () => {
    try {
      // Security: Use the URL API for robust link construction instead of string concatenation.
      // We link to the heading ID (pattern: section-title-${sectionId}) for precision,
      // ensuring consistency with target elements referenced by aria-labelledby.
      const url = new URL(window.location.href);
      url.hash = `#${sectionId}`;
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy section link:', err);
    }
  };

  return (
    <ScrollReveal
      variants={fadeSlideLeft}
      className={clsx("mb-12 md:mb-16 group", className)}
      data-orb-target="true"
    >
      <div className="flex flex-col items-start group">
        <span className="font-mono text-label text-cyan mb-3 px-3 py-1 inline-block glass-pill rounded-pill">
          // {number}
        </span>
        <div className="flex items-center relative group">
          <h2 id={`section-title-${sectionId}`} className="font-heading text-section font-bold text-white tracking-tight">
            {title}
          </h2>
          <div className="relative">
            <button
              onClick={handleCopy}
              aria-label={`Copy link to ${title} section`}
              title={`Copy link to ${title} section`}
              className="ml-4 opacity-20 md:opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black p-1 rounded-card"
            >
              <svg aria-hidden="true" className="w-5 h-5 text-text-muted hover:text-cyan transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 10, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: 10, x: '-50%' }}
                  role="status"
                  aria-live="polite"
                  className="absolute bottom-full left-1/2 mb-2 px-2 py-1 bg-cyan text-black font-mono text-[0.6rem] rounded-card font-bold shadow-[var(--glow-cyan-sm)] z-20 pointer-events-none whitespace-nowrap"
                >
                  COPIED!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
