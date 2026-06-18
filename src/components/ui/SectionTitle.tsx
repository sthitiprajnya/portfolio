"use client";
import React from 'react';
import clsx from 'clsx';
import { ScrollReveal, fadeSlideLeft } from './ScrollReveal';

interface SectionTitleProps {
  number: string;
  title: string;
  className?: string;
}

export function SectionTitle({ number, title, className }: SectionTitleProps) {
  const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  return (
    <ScrollReveal
      variants={fadeSlideLeft}
      className={clsx("mb-12 md:mb-16", className)}
      data-orb-target="true"
    >
      <div className="flex flex-col items-start">
        <span className="font-mono text-label text-cyan mb-3 px-3 py-1 inline-block glass-pill rounded-pill">
          // {number}
        </span>
        <h2 id={`section-title-${id}`} className="font-heading text-section font-bold text-white tracking-tight">
          {title}
        </h2>
      </div>
    </ScrollReveal>
  );
}