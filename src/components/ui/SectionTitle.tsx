"use client";
import React from 'react';
import clsx from 'clsx';
import { ScrollReveal, fadeSlideLeft } from './ScrollReveal';
import toast from 'react-hot-toast';

interface SectionTitleProps {
  number: string;
  title: string;
  id?: string;
  className?: string;
}

export function SectionTitle({ number, title, id: idProp, className }: SectionTitleProps) {
  const generatedId = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  const id = idProp ? `section-title-${idProp}` : `section-title-${generatedId}`;

  const copyLink = () => {
    const url = new URL(window.location.href);
    url.hash = id;
    navigator.clipboard.writeText(url.toString());
    toast.success('SECTION_LINK_COPIED');
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
        <div className="flex items-center gap-4">
          <h2 id={id} className="font-heading text-section font-bold text-white tracking-tight">
            {title}
          </h2>
          {idProp && (
            <button
              onClick={copyLink}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:text-cyan text-gray-500"
              aria-label={`Copy link to ${title} section`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}
