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

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current || !lineRef.current) return;

    // Timeline self-drawing animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 1, // Smooth scrubbing
      }
    });

    tl.to(lineRef.current, {
      scaleY: 1,
      ease: "none"
    });

    // Cinematic staggering for the experience cards using GSAP ScrollTrigger
    const cards = document.querySelectorAll('.experience-card-wrapper');
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
    const nodes = document.querySelectorAll('.timeline-node');
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

  const toggleSection = (id: string) => {
    setOpenSection(prev => prev === id ? null : id);
  };

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
          <div className="flex flex-wrap gap-3 mb-8">
            {experience.awards.map((award, i) => (
              <div key={i} className="flex items-center space-x-2 text-amber text-sm font-body bg-[rgba(255,179,0,0.1)] px-3 py-1.5 rounded-sm border border-[rgba(255,179,0,0.3)]">
                <span>🏆</span>
                <span className="font-semibold text-xs tracking-wide">{award}</span>
              </div>
            ))}
          </div>
        )}

        {/* Expandable Subsections */}
        <div className="space-y-4 mb-8">
          {experience.subsections.map((sub) => {
            const isOpen = openSection === sub.id;

            const colorMap = {
              cyan: 'text-cyan border-cyan/30 bg-cyan-ghost hover:border-cyan',
              amber: 'text-amber border-amber/30 bg-[rgba(255,179,0,0.1)] hover:border-amber',
              violet: 'text-violet border-violet/30 bg-[rgba(191,0,255,0.1)] hover:border-violet',
              green: 'text-green border-green/30 bg-[rgba(57,255,20,0.1)] hover:border-green'
            };

            return (
              <div key={sub.id} className="border border-border rounded-md overflow-hidden bg-black/40">
                <button
                  onClick={() => toggleSection(sub.id)}
                  className={clsx(
                    "w-full flex items-center justify-between p-4 font-mono text-xs tracking-widest uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    colorMap[sub.color],
                    isOpen ? "border-b" : "border-b-0",
                    sub.color === 'cyan' && "focus-visible:ring-cyan",
                    sub.color === 'amber' && "focus-visible:ring-amber",
                    sub.color === 'violet' && "focus-visible:ring-violet",
                    sub.color === 'green' && "focus-visible:ring-green"
                  )}
                  aria-expanded={isOpen}
                  aria-controls={`content-${sub.id}`}
                  aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${sub.label} section`}
                >
                  <span>{sub.label}</span>
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`content-${sub.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ul className="p-5 space-y-4">
                        {sub.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start text-sm text-text-secondary leading-relaxed">
                            <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-border flex-shrink-0" />
                            <span>
                              {/* Highlight specific numbers/percentages for impact */}
                              {bullet.split(/(\d+%|\d+\+? hours|55%|100%|80%|35%|zero)/gi).map((part, pIdx) => {
                                if (part.match(/(\d+%|\d+\+? hours|55%|100%|80%|35%|zero)/i)) {
                                  return <strong key={pIdx} className="text-white font-bold">{part}</strong>;
                                }
                                return part;
                              })}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
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
    <div className={clsx("experience-card-wrapper", prefersReducedMotion ? "" : "opacity-0")}>
      {cardContent}
    </div>
  );
}