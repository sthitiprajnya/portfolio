"use client";
import React from 'react';
import CountUp from 'react-countup';
import { AsciiAvatar }   from '@/components/ui/AsciiAvatar';
import { TerminalWindow } from '@/components/ui/TerminalWindow';
import { SectionTitle }  from '@/components/ui/SectionTitle';
import { ScrollReveal, fadeSlideUp, containerStagger } from '@/components/ui/ScrollReveal';
import { ABOUT_BIO, ABOUT_STATS, PERSONAL } from '@/data/portfolio';
import { useInView } from 'react-intersection-observer';
import { CyberButton } from '@/components/ui/CyberButton';
import { TypewriterText } from '@/components/ui/TypewriterText';

export function About() {
  const { ref: bioRef, inView: bioInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="about" className="py-24 bg-deep relative border-t border-border">

      {/* Decorative dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle number="01" title="Who I Am." />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── Left column: terminal biometric avatar ── */}
          <ScrollReveal variants={fadeSlideUp} className="order-2 lg:order-1">
            <AsciiAvatar className="w-full max-w-sm mx-auto lg:mx-0" />

            {/* Availability badge beneath avatar */}
            <div className="mt-6 flex items-center space-x-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green" />
              </span>
              <span className="font-mono text-[0.7rem] text-green uppercase tracking-widest">
                OPEN TO OPPORTUNITIES — CLOUD SEC · APPSEC · RED TEAM
              </span>
            </div>
          </ScrollReveal>

          {/* ── Right column: bio + terminal + stats ── */}
          <div className="order-1 lg:order-2 space-y-8">
            <div ref={bioRef} className="space-y-6">
              {bioInView && ABOUT_BIO.map((paragraph, i) => (
                <p key={i} className="font-body text-text-secondary leading-relaxed">
                  <TypewriterText sequence={[paragraph]} speed={10} cursor={i === ABOUT_BIO.length - 1} />
                </p>
              ))}
            </div>

            <ScrollReveal variants={fadeSlideUp} delay={0.2} className="flex gap-4">
              <CyberButton as="a" href={PERSONAL.resumeUrl} download color="cyan">
                DOWNLOAD_CV
              </CyberButton>
            </ScrollReveal>

            <ScrollReveal variants={fadeSlideUp} delay={0.3}>
              <TerminalWindow lines={[
                { prompt: 'sthitaprajna@kali:~$', command: 'whoami' },
                { prompt: '', output: 'infosec-engineer' },
                { prompt: 'sthitaprajna@kali:~$', command: 'cat highlights.txt' },
                { prompt: '', output: '> 50+ Full-scope pen tests executed' },
                { prompt: '', output: '> 230+ Unique vulnerabilities documented' },
                { prompt: '', output: '> Specialised in Cloud Security & AppSec' },
                { prompt: 'sthitaprajna@kali:~$', command: '', cursor: true }
              ]} />
            </ScrollReveal>

            {/* Animated stat counters */}
            <ScrollReveal
              variants={containerStagger}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border"
            >
              {ABOUT_STATS.map((stat, i) => (
                <ScrollReveal key={i} variants={fadeSlideUp} className="flex flex-col">
                  <div className="font-display text-3xl md:text-4xl text-cyan mb-2">
                    <CountUp
                      end={stat.value}
                      duration={2.5}
                      enableScrollSpy
                      scrollSpyOnce
                      separator=","
                    />
                    {stat.suffix}
                  </div>
                  <div className="font-mono text-[0.65rem] text-text-muted uppercase tracking-widest leading-snug">
                    {stat.label}
                  </div>
                </ScrollReveal>
              ))}
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
