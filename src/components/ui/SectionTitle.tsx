"use client";
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import clsx from 'clsx';
import { ScrollReveal, fadeSlideLeft } from './ScrollReveal';

interface SectionTitleProps {
  number: string;
  title: string;
  id?: string;
  className?: string;
}

export function SectionTitle({ number, title, id, className }: SectionTitleProps) {
  const [copied, setCopied] = useState(false);
  const sectionId = id || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  const handleCopy = () => {
    try {
      // Security: Use the URL API for robust link construction instead of string concatenation.
      // We link to the section container ID (e.g., #about) instead of the heading ID
      // to ensure consistent scroll behavior and deep-linking reliability.
      const url = new URL(window.location.href);
      url.hash = `#${sectionId}`;
      navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Failed to copy section link:', e);
    }
  };

  return (
    <ScrollReveal
      variants={fadeSlideLeft}
      className={clsx("mb-12 md:mb-16", className)}
      data-orb-target="true"
    >
      <div className="flex flex-col items-start group">
        <span className="font-mono text-label text-cyan mb-3 px-3 py-1 inline-block glass-pill rounded-pill">
          // {number}
        </span>
        <div className="flex items-center">
          <h2 id={`section-title-${sectionId}`} className="font-heading text-section font-bold text-white tracking-tight">
            {title}
          </h2>
          <div className="relative flex items-center">
            <button
              onClick={handleCopy}
              aria-label={`Copy link to ${title} section`}
              className="ml-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-cyan rounded-card outline-none"
            >
              <svg className="w-5 h-5 text-text-muted hover:text-cyan transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute left-full ml-2 px-2 py-1 bg-cyan text-black font-mono text-[0.6rem] rounded-card font-bold shadow-[var(--glow-cyan-sm)] z-20 pointer-events-none whitespace-nowrap"
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
