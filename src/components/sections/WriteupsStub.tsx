"use client";
import React, { useState, useEffect } from 'react';
import { ScrollReveal, fadeSlideUp } from '@/components/ui/ScrollReveal';
import { SectionTitle } from '@/components/ui/SectionTitle';

const MOCK_WRITEUPS = [
  { title: "CVE-2024-XXXX: Exploiting Deserialization in Java Enterprise", type: "CVE Breakdown", date: "TBD" },
  { title: "HTB Cyber Apocalypse 2024: Web Category Write-ups", type: "CTF Walkthrough", date: "TBD" },
  { title: "Bypassing WAFs with Exotic Encoding Techniques", type: "Research", date: "TBD" }
];

export function WriteupsStub() {
  const [loadingText, setLoadingText] = useState("LOADING INTEL.");

  // Day 41: Animated Loader
  useEffect(() => {
    const texts = ["LOADING INTEL.", "LOADING INTEL..", "LOADING INTEL..."];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      setLoadingText(texts[i]);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="writeups" className="py-24 bg-deep relative border-t border-border overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--color-amber) 0, var(--color-amber) 2px, transparent 2px, transparent 10px)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle number="04.5" title="Writeups." />

        <ScrollReveal variants={fadeSlideUp} className="mb-12 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber/10 border border-amber/30 text-amber font-mono text-[0.6rem] uppercase tracking-widest rounded-card shadow-[var(--glow-amber-sm)]">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            CLASSIFIED — PENDING DECLASSIFICATION
          </div>

          {/* Day 27: CTF Platform Badges */}
          <div className="flex gap-3 mt-4 md:mt-0">
            <a href="https://profile.hackthebox.com/profile/019db8ae-9364-73ed-bb47-1336835663a7" target="_blank" rel="noopener noreferrer" className="font-mono text-[0.6rem] px-3 py-1 border border-[#9FEF00]/30 hover:border-[#9FEF00] text-[#9FEF00] rounded-pill hover:shadow-[0_0_8px_rgba(159,239,0,0.5)] transition-all uppercase tracking-widest flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[#9FEF00]">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M11.96 0L.92 6.38V17.62L11.96 24l11.04-6.38V6.38L11.96 0zm-1.07 15.68V8.32L4.62 11.9v2.16l6.27-1.68v3.3l-5.32 1.45v2.1l5.32-1.45v1.84l-1.05.57V12.1l6.25 1.68v2.16L10.89 19.3v-3.62zM21.94 11.9l-6.27 1.68v-3.3l5.32-1.45V6.73l-5.32 1.45V6.34l1.05-.57v8.13l-6.25-1.68V9.92L17.7 6.45v3.62l-5.74 3.32v-2.16l6.27-1.68v2.3zM2.87 5.25l9.09-5.25 9.09 5.25v1.23l-9.09 5.25-9.09-5.25V5.25z" /></svg>
              HTB
            </a>
            <a href="https://tryhackme.com" target="_blank" rel="noopener noreferrer" className="font-mono text-[0.6rem] px-3 py-1 border border-[#FF0000]/30 hover:border-[#FF0000] text-[#FF0000] rounded-pill hover:shadow-[0_0_8px_rgba(255,0,0,0.5)] transition-all uppercase tracking-widest flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[#FF0000]">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 24c-6.617 0-12-5.383-12-12S5.383 0 12 0s12 5.383 12 12-5.383 12-12 12zm0-2.4c5.293 0 9.6-4.307 9.6-9.6S17.293 2.4 12 2.4 2.4 6.707 2.4 12s4.307 9.6 9.6 9.6zm.545-12.756v8.441l6.002-3.411-6.002-5.03zm-1.09 0L5.453 13.873l6.002 3.412v-8.44z"/></svg>
              THM
            </a>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_WRITEUPS.map((wu, idx) => (
            <ScrollReveal key={idx} variants={fadeSlideUp} delay={idx * 0.1}>
              <div className="group relative p-6 border border-border bg-black/40 rounded-card overflow-hidden h-full flex flex-col">
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
                   <span className="font-mono text-[0.6rem] bg-surface px-2 py-0.5 rounded-card text-cyan border border-border w-[100px] text-center">{loadingText}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
