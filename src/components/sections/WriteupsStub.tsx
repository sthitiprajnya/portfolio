"use client";
import React from 'react';
import { ScrollReveal, fadeSlideUp } from '@/components/ui/ScrollReveal';
import { SectionTitle } from '@/components/ui/SectionTitle';

const MOCK_WRITEUPS = [
  { title: "CVE-2024-XXXX: Exploiting Deserialization in Java Enterprise", type: "CVE Breakdown", date: "TBD" },
  { title: "HTB Cyber Apocalypse 2024: Web Category Write-ups", type: "CTF Walkthrough", date: "TBD" },
  { title: "Bypassing WAFs with Exotic Encoding Techniques", type: "Research", date: "TBD" }
];

export function WriteupsStub() {
  return (
    <section id="writeups" className="py-24 bg-deep relative border-t border-border overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--color-amber) 0, var(--color-amber) 2px, transparent 2px, transparent 10px)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle number="04.5" title="Writeups." />

        <ScrollReveal variants={fadeSlideUp} className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber/10 border border-amber/30 text-amber font-mono text-[0.6rem] uppercase tracking-widest rounded shadow-[var(--glow-amber-sm)]">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            CLASSIFIED — PENDING DECLASSIFICATION
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_WRITEUPS.map((wu, idx) => (
            <ScrollReveal key={idx} variants={fadeSlideUp} delay={idx * 0.1}>
              <div className="group relative p-6 border border-border bg-black/40 rounded-lg overflow-hidden h-full flex flex-col">
                <div className="absolute inset-0 bg-amber/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-10 -right-10 text-border opacity-20 transform rotate-12 group-hover:text-amber/10 transition-colors">
                  <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>

                <div className="relative z-10 flex-grow">
                  <div className="font-mono text-[0.6rem] text-amber uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                    {wu.type}
                  </div>
                  <h3 className="font-heading font-bold text-text-secondary group-hover:text-white transition-colors text-lg leading-tight mb-4 blur-[2px] group-hover:blur-0 transition-all duration-300 select-none">
                    {wu.title}
                  </h3>
                </div>

                <div className="relative z-10 mt-auto pt-4 border-t border-border/50 flex justify-between items-center">
                   <span className="font-mono text-[0.6rem] text-text-muted uppercase">EST. RELEASE: {wu.date}</span>
                   <span className="font-mono text-[0.6rem] bg-surface px-2 py-0.5 rounded text-text-muted border border-border">COMING SOON</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
