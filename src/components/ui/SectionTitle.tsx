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

export function SectionTitle({ number, title, id, className }: SectionTitleProps) {
  const [copied, setCopied] = useState(false);
  const sectionId = id || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  const handleCopy = () => {
    // UX: Copy the URL with the section title hash to ensure the link works
    const url = new URL(window.location.href);
    url.hash = `section-title-${sectionId}`;
    navigator.clipboard.writeText(url.toString());

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollReveal
      variants={fadeSlideLeft}
      className={clsx("mb-12 md:mb-16", className)}
      data-orb-target="true"
    >
      <div className="flex flex-col items-start gap-4">
        <span className="font-mono text-label text-cyan px-3 py-1 inline-block glass-pill rounded-pill">
          // {number}
        </span>

        <div className="flex items-center group relative">
          <h2 id={`section-title-${sectionId}`} className="font-heading text-section font-bold text-white tracking-tight">
            {title}
          </h2>

          <div className="ml-4 flex items-center">
            <button
              onClick={handleCopy}
              aria-label={`Copy link to ${title} section`}
              className="p-1.5 rounded-card bg-surface border border-border text-text-muted hover:text-cyan hover:border-cyan/50 transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:opacity-100 md:opacity-0 group-hover:opacity-100"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>

            <AnimatePresence>
              {copied && (
                <motion.span
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3 font-mono text-[0.65rem] text-cyan font-bold tracking-widest uppercase"
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
