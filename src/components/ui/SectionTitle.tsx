"use client";
import toast from 'react-hot-toast';
import React from 'react';
import clsx from 'clsx';
import { ScrollReveal, fadeSlideLeft } from './ScrollReveal';

interface SectionTitleProps {
  number: string;
  title: string;
  id?: string;
  className?: string;
}

export function SectionTitle({ number, title, id, className }: SectionTitleProps) {
  const sectionId = id || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

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
        <h2 id={`section-title-${sectionId}`} className="font-heading text-section font-bold text-white tracking-tight">
          {title}
        </h2>
        <button
          onClick={() => { navigator.clipboard.writeText(window.location.origin + window.location.pathname + "#section-title-" + sectionId); toast.success('SECTION_LINK_COPIED'); }}
          aria-label={`Copy link to ${title} section`}
          className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
        >
          <svg className="w-5 h-5 text-text-muted hover:text-cyan transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
      </div>
    </ScrollReveal>
  );
}