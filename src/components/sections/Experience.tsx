"use client";
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GlassCard } from '@/components/ui/GlassCard';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { EXPERIENCE } from '@/data/portfolio';

gsap.registerPlugin(ScrollTrigger);

// BOLT: Hoist static configurations and regexes to module level to avoid redundant allocations on every render
const ACTIVE_COLOR_MAP = {
  cyan: 'bg-cyan/10 text-cyan border-cyan',
  amber: 'bg-amber/10 text-amber border-amber',
  violet: 'bg-violet/10 text-violet border-violet',
  green: 'bg-green/10 text-green border-green'
};

const CRITICAL_REGEX = /SQL Injection|RCE|critical/i;
const HIGH_REGEX = /privilege escalation|high/i;
const METRIC_REGEX = /(\d+%|\d+\+? hours|55%|100%|80%|35%|zero)/gi;
const METRIC_MATCH_REGEX = /(\d+%|\d+\+? hours|55%|100%|80%|35%|zero)/i;

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current || !lineRef.current) return;

    const container = containerRef.current;

    // Timeline self-drawing animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top center",
        end: "bottom center",
        scrub: 1, // Smooth scrubbing
      }
    });

    tl.to(lineRef.current, {
      scaleY: 1,
      ease: "none"
    });

    // BOLT: Scope GSAP queries to the container to avoid scanning the entire document
    // Cinematic staggering for the experience cards using GSAP ScrollTrigger
    const cards = container.querySelectorAll('.experience-card-wrapper');
    cards.forEach((card) => {
      gsap.fromTo(card,
        { opacity: 0, y: 100, rotateX: 5, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Animate nodes popping in when line reaches them
    const nodes = container.querySelectorAll('.timeline-node');
    nodes.forEach((node) => {
      gsap.fromTo(node,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: node,
            start: "top 60%", // Triggers slightly before reaching center
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [prefersReducedMotion]);

  return (
    <section id="experience" className="py-24 bg-deep relative border-t border-border">
      <div className="max-w-5xl mx-auto px-6 relative z-10" ref={containerRef}>
        <SectionTitle number="03" title="Battle Log." />

        <div className="relative mt-16 ml-4 md:ml-8">
          {/* Animated Timeline Line */}
          <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-border z-0">
            {!prefersReducedMotion ? (
              <div
                ref={lineRef}
                className="absolute top-0 left-0 w-full h-full origin-top"
                style={{
                  background: 'linear-gradient(to bottom, var(--color-cyan), var(--color-violet))',
                  transform: 'scaleY(0)'
                }}
              />
            ) : (
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{ background: 'linear-gradient(to bottom, var(--color-cyan), var(--color-violet))' }}
              />
            )}
          </div>

          {/* Experience Items */}
          <div className="space-y-24">
            {EXPERIENCE.map((exp, idx) => (
              <ExperienceCard key={exp.id} experience={exp} isFirst={idx === 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({ experience, isFirst }: { experience: typeof EXPERIENCE[0], isFirst: boolean }) {
  const [openSection, setOpenSection] = useState<string | null>(experience.subsections[0]?.id || null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const cardContent = (
    <div className="relative pl-8 md:pl-12">
      {/* Timeline Node */}
      <div
        className={clsx(
          "timeline-node absolute left-[-7px] top-1 w-[16px] h-[16px] rounded-full z-10 bg-deep border-2",
          isFirst ? "border-cyan shadow-[var(--glow-cyan-sm)]" : "border-violet shadow-[var(--glow-violet-sm)]"
        )}
      />

      {/* Date Indicator (Mobile primarily, but visible on desktop too) */}
      <div className="font-mono text-[0.7rem] text-cyan mb-3 tracking-widest uppercase">
        {experience.period}
      </div>

      <GlassCard className="p-6 md:p-8 w-full max-w-[800px]" withTilt={false}>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
          <div>
            <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-1">
              {experience.company}
            </h3>
            <p className="font-mono text-xs text-text-muted">
              {experience.location} · {experience.type}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {experience.role.split(' / ').map((r, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-cyan-ghost border border-cyan/30 text-cyan font-mono text-[0.65rem] uppercase tracking-wider">
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Awards */}
        {experience.awards && experience.awards.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {experience.awards.map((award, i) => (
              <div key={i} className="relative overflow-hidden group/award flex-1 flex flex-col items-center justify-center p-4 bg-surface border border-amber/30 rounded-lg shadow-[0_4px_20px_rgba(255,179,0,0.05)] hover:shadow-[0_4px_20px_rgba(255,179,0,0.15)] hover:border-amber/60 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-amber/10 to-transparent opacity-0 group-hover/award:opacity-100 transition-opacity duration-300" />
                <span className="text-3xl mb-2 drop-shadow-[0_0_8px_rgba(255,179,0,0.5)] transform group-hover/award:scale-110 transition-transform duration-300">🏆</span>
                <span className="font-heading font-bold text-amber text-sm tracking-wide text-center uppercase">{award}</span>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Tabs for Subsections */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4 border-b border-border pb-2" role="tablist" aria-label={`${experience.company} role details`}>
            {experience.subsections.map((sub) => {
              const isOpen = openSection === sub.id;

              return (
                <button
                  key={sub.id}
                  id={`tab-${experience.id}-${sub.id}`}
                  role="tab"
                  aria-selected={isOpen}
                  aria-controls={`panel-${experience.id}-${sub.id}`}
                  onClick={() => setOpenSection(sub.id)}
                  className={clsx(
                    "px-4 py-2 font-mono text-[0.65rem] tracking-widest uppercase transition-all rounded-t-md border-b-2 outline-none focus-visible:ring-2",
                    isOpen
                      ? ACTIVE_COLOR_MAP[sub.color]
                      : "border-transparent text-text-secondary hover:text-white hover:bg-surface"
                  )}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>

          <div className="relative min-h-[150px]">
            <AnimatePresence mode="wait">
              {experience.subsections.map((sub) => {
                if (openSection !== sub.id) return null;

                const getSeverityBadge = (text: string) => {
                  if (CRITICAL_REGEX.test(text)) return <span className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 border border-red-500/50 font-mono text-[0.55rem] uppercase font-bold">CRITICAL</span>;
                  if (HIGH_REGEX.test(text)) return <span className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/50 font-mono text-[0.55rem] uppercase font-bold">HIGH</span>;
                  return null;
                };

                return (
                  <motion.div
                    key={sub.id}
                    id={`panel-${experience.id}-${sub.id}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${experience.id}-${sub.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    <ul className="space-y-4">
                      {sub.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start text-sm text-text-secondary leading-relaxed group/bullet">
                          <span className="mr-3 mt-1.5 text-cyan opacity-50 group-hover/bullet:opacity-100 transition-opacity">▹</span>
                          <span>
                            {bullet.split(METRIC_REGEX).map((part, pIdx) => {
                              if (METRIC_MATCH_REGEX.test(part)) {
                                return <strong key={pIdx} className="text-white font-bold">{part}</strong>;
                              }
                              return part;
                            })}
                            {getSeverityBadge(bullet)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Tech Tags Footer */}
        <div className="pt-6 border-t border-border flex flex-wrap gap-2">
          {experience.tags.map((tag, i) => (
            <span key={i} className="text-[0.65rem] font-mono text-text-muted px-2 py-1 bg-surface rounded border border-border">
              {tag}
            </span>
          ))}
        </div>

      </GlassCard>
    </div>
  );

  return (
    <div className={clsx("experience-card-wrapper", prefersReducedMotion ? "" : "opacity-0")} data-orb-target="experience">
      {cardContent}
    </div>
  );
}
