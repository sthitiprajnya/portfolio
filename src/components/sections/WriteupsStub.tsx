"use client";
import React, { useState, useEffect } from 'react';
import { ScrollReveal, fadeSlideUp } from '@/components/ui/ScrollReveal';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useInView } from 'react-intersection-observer';

const MOCK_WRITEUPS = [
  { title: "CVE-2024-XXXX: Exploiting Deserialization in Java Enterprise", type: "CVE Breakdown", date: "TBD" },
  { title: "HTB Cyber Apocalypse 2024: Web Category Write-ups", type: "CTF Walkthrough", date: "TBD" },
  { title: "Bypassing WAFs with Exotic Encoding Techniques", type: "Research", date: "TBD" }
];

export function WriteupsStub() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="writeups" ref={ref} className="py-24 bg-deep relative border-t border-border overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--color-amber) 0, var(--color-amber) 2px, transparent 2px, transparent 10px)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle number="04.5" title="Writeups." />

        <ScrollReveal variants={fadeSlideUp} className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber/10 border border-amber/30 text-amber font-mono text-[0.6rem] uppercase tracking-widest rounded-card shadow-[var(--glow-amber-sm)]">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            CLASSIFIED — PENDING DECLASSIFICATION
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_WRITEUPS.map((wu, idx) => (
            <ScrollReveal key={idx} variants={fadeSlideUp} delay={idx * 0.1}>
              <div className="group relative p-6 border border-border bg-black/40 rounded-card overflow-hidden h-full flex flex-col">
                <div className="absolute inset-0 bg-amber/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-10 -right-10 text-border opacity-20 transform rotate-12 group-hover:text-amber/10 transition-colors">
                  <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>

                <div className="relative z-10 flex-grow">
                  <div className="font-mono text-[0.6rem] text-amber uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                    {wu.type}
                  </div>
                  <DecryptingTitle text={wu.title} trigger={inView} delay={idx * 200 + 500} />
                </div>

                <div className="relative z-10 mt-auto pt-4 border-t border-border/50 flex justify-between items-center">
                   <span className="font-mono text-[0.6rem] text-text-muted uppercase">EST. RELEASE: {wu.date}</span>
                   <span className="font-mono text-[0.6rem] bg-surface px-2 py-0.5 rounded-card text-text-muted border border-border">COMING SOON</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function DecryptingTitle({ text, trigger, delay }: { text: string; trigger: boolean; delay: number }) {
  const [displayText, setDisplayText] = useState('');
  const [isDecrypted, setIsDecrypted] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@&$%!<>?';

  useEffect(() => {
    if (!trigger) return;

    const timeoutId: NodeJS.Timeout = setTimeout(() => {
      let iteration = 0;
    const maxIterations = 15;

      const interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (index < (iteration / maxIterations) * text.length) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );

        if (iteration >= maxIterations) {
          clearInterval(interval);
          setDisplayText(text);
          setIsDecrypted(true);
        }
        iteration += 1;
      }, 50);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [trigger, text, delay]);

  return (
    <h3
      className={`font-heading font-bold text-lg leading-tight mb-4 transition-all duration-500 select-none ${
        isDecrypted ? 'text-white blur-0' : 'text-text-secondary blur-[2px] font-mono'
      } group-hover:blur-0 group-hover:text-white`}
    >
      {displayText || text.replace(/./g, () => chars[Math.floor(Math.random() * chars.length)])}
    </h3>
  );
}
