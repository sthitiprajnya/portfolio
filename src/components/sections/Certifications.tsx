"use client";
import React from 'react';
import clsx from 'clsx';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScrollReveal, fadeSlideUp, containerStagger } from '@/components/ui/ScrollReveal';
import { CERTIFICATIONS } from '@/data/portfolio';

export function Certifications() {
  return (
    <section id="certifications" className="py-24 bg-deep relative border-t border-border">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle number="05" title="Credentials." />

        <ScrollReveal
          variants={containerStagger}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          {CERTIFICATIONS.map((cert) => (
            <ScrollReveal key={cert.id} variants={fadeSlideUp} className="h-full">
              <CertCard cert={cert} />
            </ScrollReveal>
          ))}
        </ScrollReveal>

        <ScrollReveal variants={fadeSlideUp} delay={0.4}>
          <p className="font-mono text-[0.75rem] text-text-muted text-center mt-8">
            All certifications independently verified. Click VERIFY on any badge to confirm credentials.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

function CertCard({ cert }: { cert: typeof CERTIFICATIONS[0] }) {
  const colorMap = {
    cyan:   { bg: 'bg-cyan-ghost',   border: 'border-cyan/30',   text: 'text-cyan',   glow: 'hover:shadow-[var(--glow-cyan-sm)]' },
    green:  { bg: 'bg-[rgba(57,255,20,0.1)]', border: 'border-green/30',  text: 'text-green',  glow: 'hover:shadow-[var(--glow-green-sm)]' },
    amber:  { bg: 'bg-[rgba(255,179,0,0.1)]', border: 'border-amber/30',  text: 'text-amber',  glow: 'hover:shadow-[var(--glow-amber-sm)]' },
    violet: { bg: 'bg-[rgba(191,0,255,0.1)]', border: 'border-violet/30', text: 'text-violet', glow: 'hover:shadow-[var(--glow-violet-sm)]' },
  };

  const style = colorMap[cert.color];

  return (
    <GlassCard className={clsx("p-5 flex flex-col h-full group", style.glow)}>
      <div className="flex justify-between items-start mb-4">
        {/* Icon placeholder area */}
        <div className={clsx(
          "w-12 h-12 rounded flex items-center justify-center font-display text-xl border",
          style.bg, style.border, style.text
        )}>
          {cert.name.charAt(0)}
        </div>

        {cert.status === 'active' && (
          <div className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            <span className="font-mono text-[0.55rem] uppercase text-text-muted">Active</span>
          </div>
        )}
      </div>

      <h3 className="font-heading text-[1rem] font-bold text-white mb-1 leading-tight group-hover:text-cyan transition-colors">
        {cert.name}
      </h3>

      <p className="font-mono text-[0.65rem] text-text-muted mb-6 uppercase tracking-wider">
        {cert.issuer}
      </p>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
        <span className="font-mono text-[0.65rem] text-text-secondary">
          {cert.year}
        </span>

        {cert.verifyUrl ? (
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Verify ${cert.name} certification`}
            className={clsx(
              "font-mono text-[0.65rem] uppercase tracking-widest flex items-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm",
              style.text,
              "hover:text-white",
              cert.color === 'cyan' && "focus-visible:ring-cyan",
              cert.color === 'green' && "focus-visible:ring-green",
              cert.color === 'amber' && "focus-visible:ring-amber",
              cert.color === 'violet' && "focus-visible:ring-violet"
            )}
          >
            VERIFY <span aria-hidden="true" className="ml-1 text-[10px]">↗</span>
          </a>
        ) : (
          <span className="font-mono text-[0.65rem] text-text-muted uppercase tracking-widest flex items-center">
            VERIFY <span aria-hidden="true" className="ml-1 text-[10px]">↗</span>
          </span>
        )}
      </div>
    </GlassCard>
  );
}