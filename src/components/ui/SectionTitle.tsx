"use client";
import React from 'react';
import clsx from 'clsx';
import { useInView } from 'react-intersection-observer';
import { ScrollReveal, fadeSlideLeft } from './ScrollReveal';

interface SectionTitleProps {
  number: string;
  title: string;
  className?: string;
}

export function SectionTitle({ number, title, className }: SectionTitleProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <ScrollReveal
      variants={fadeSlideLeft}
      className={clsx("mb-12 md:mb-16", className)}
      data-orb-target="true"
    >
      <div ref={ref} className="flex flex-col items-start relative group inline-block">
        <span className="font-mono text-label text-cyan mb-3 px-3 py-1 inline-block glass-pill rounded-pill">
          // {number}
        </span>
        <h2 className={clsx(
          "font-heading text-section font-bold text-white tracking-tight relative pb-2",
          "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-cyan after:transition-all after:duration-1000 after:ease-out",
          inView ? "after:w-full" : "after:w-0"
        )}>
          {title}
        </h2>
      </div>
    </ScrollReveal>
  );
}