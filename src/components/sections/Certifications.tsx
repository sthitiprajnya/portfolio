"use client";
import React from 'react';
import clsx from 'clsx';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ScrollReveal, fadeSlideUp, containerStagger } from '@/components/ui/ScrollReveal';
import { CERTIFICATIONS, UPCOMING_CERTIFICATIONS } from '@/data/portfolio';

// BOLT: Hoist static configurations to module level to avoid redundant allocations on every render
const CERT_COLOR_MAP = {
  cyan:   { bg: 'bg-cyan-ghost',   border: 'border-cyan/30',   text: 'text-cyan',   glow: 'hover:shadow-[var(--glow-cyan-sm)]' },
  green:  { bg: 'bg-[rgba(57,255,20,0.1)]', border: 'border-green/30',  text: 'text-green',  glow: 'hover:shadow-[var(--glow-green-sm)]' },
  amber:  { bg: 'bg-[rgba(255,179,0,0.1)]', border: 'border-amber/30',  text: 'text-amber',  glow: 'hover:shadow-[var(--glow-amber-sm)]' },
  violet: { bg: 'bg-[rgba(191,0,255,0.1)]', border: 'border-violet/30', text: 'text-violet', glow: 'hover:shadow-[var(--glow-violet-sm)]' },
};

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
          <div className="mt-16 border-t border-border pt-12">
            <h3 className="font-mono text-sm text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              CERTIFICATION_ROADMAP // IN_PROGRESS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {UPCOMING_CERTIFICATIONS.map((cert) => (
                <div key={cert.id} className="relative overflow-hidden p-5 border border-border bg-black/40 rounded-lg group">
                   <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-20 pointer-events-none" />
                   <div className="flex items-center gap-3 mb-3">
                     <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                     </svg>
                     <span className="font-mono text-[0.6rem] uppercase tracking-widest text-text-muted bg-border/50 px-2 py-0.5 rounded">LOCKED</span>
                   </div>
                   <h4 className="font-heading font-bold text-text-secondary group-hover:text-white transition-colors">{cert.name}</h4>
                   <p className="font-mono text-[0.65rem] text-text-muted mt-2">Target: {cert.year}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal variants={fadeSlideUp} delay={0.6}>
          <p className="font-mono text-[0.75rem] text-text-muted text-center mt-12 opacity-60">
            All certifications independently verified. Click VERIFY on any badge to confirm credentials via issuing authority.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

function CertCard({ cert }: { cert: typeof CERTIFICATIONS[0] }) {
  const style = CERT_COLOR_MAP[cert.color];

  return (
    <div className={clsx("relative p-[1px] rounded-xl overflow-hidden group h-full", style.glow)}>
      <div className={clsx("absolute inset-0 opacity-20 group-hover:opacity-100 transition-opacity duration-500", style.bg)} />
      <div className="relative h-full bg-surface border border-border rounded-xl p-5 flex flex-col z-10 hover-glow-card" style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' }}>

        {/* Hexagonal Shield Icon */}
        <div className="flex justify-between items-start mb-6">
          <div className="relative w-12 h-14 flex items-center justify-center">
            <svg className={clsx("absolute inset-0 w-full h-full drop-shadow-md", style.text)} viewBox="0 0 24 24" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1">
              <polygon points="12 2 22 7 22 17 12 22 2 17 2 7" />
            </svg>
            <span className={clsx("font-display font-bold text-lg relative z-10", style.text)}>
              {cert.name.charAt(0)}
            </span>
          </div>

          {cert.status === 'active' && (
             <div className="flex flex-col items-end gap-1">
               <div className="flex items-center space-x-1 bg-green/10 border border-green/20 px-2 py-0.5 rounded-full">
                 <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                 <span className="font-mono text-[0.55rem] uppercase text-green tracking-widest font-bold">Active</span>
               </div>
               {cert.expiry && (
                 <span className="font-mono text-[0.55rem] text-text-muted mt-1">Exp: {cert.expiry}</span>
               )}
             </div>
          )}
        </div>

        <h3 className="font-heading text-[1rem] font-bold text-white mb-2 leading-tight group-hover:text-cyan transition-colors">
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
                "font-mono text-[0.65rem] uppercase tracking-widest flex items-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm px-3 py-1.5 border",
                style.text, style.border,
                "hover:bg-white/5",
                cert.color === 'cyan' && "focus-visible:ring-cyan",
                cert.color === 'green' && "focus-visible:ring-green",
                cert.color === 'amber' && "focus-visible:ring-amber",
                cert.color === 'violet' && "focus-visible:ring-violet"
              )}
            >
              VERIFY <span aria-hidden="true" className="ml-1.5 text-[10px]">↗</span>
            </a>
          ) : (
            <span className="font-mono text-[0.65rem] text-text-muted uppercase tracking-widest flex items-center px-3 py-1.5 border border-transparent">
              VERIFY <span aria-hidden="true" className="ml-1.5 text-[10px]">↗</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
