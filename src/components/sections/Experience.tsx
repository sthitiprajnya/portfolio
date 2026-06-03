"use client";
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';
import clsx from 'clsx';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { LogoBadge } from '@/components/ui/LogoBadge';
import { EXPERIENCE } from '@/data/portfolio';


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
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="py-24 bg-deep relative border-t border-border">
      <div className="max-w-5xl mx-auto px-6 relative z-10" ref={containerRef}>
        <SectionTitle number="03" title="Battle Log." />

        <div className="relative mt-16 ml-4 md:ml-8">
          {/* Day 16: Vertical timeline connector */}
          <div
            className="absolute top-0 bottom-0 left-[2px] w-[1px] border-l border-dashed border-cyan/40 z-0 pointer-events-none"
            style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}
          />

          {/* Animated Timeline Line */}
          <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-border z-0">
            {!prefersReducedMotion ? (
              <motion.div
                className="absolute top-0 left-0 w-full h-full origin-top"
                style={{
                  background: 'linear-gradient(to bottom, var(--color-cyan), var(--color-violet))',
                  scaleY
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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const tabs = experience.subsections;
    let newIndex = -1;

    switch (e.key) {
      case 'ArrowRight':
        newIndex = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        newIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    if (newIndex !== -1) {
      e.preventDefault();
      setOpenSection(tabs[newIndex].id);
      tabRefs.current[newIndex]?.focus();
    }
  };

  const cardContent = (
    <div className="relative pl-8 md:pl-12" data-orb-target="experience">
      {/* Timeline Node */}
      <motion.div
        className={clsx(
          "timeline-node absolute left-[-7px] top-1 w-[16px] h-[16px] rounded-full z-10 bg-deep border-2",
          isFirst ? "border-cyan shadow-[var(--glow-cyan-sm)]" : "border-violet shadow-[var(--glow-violet-sm)]"
        )}
        initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        whileInView={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
        viewport={{ once: false, margin: "-40%" }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
      />

      {/* Date Indicator (Mobile primarily, but visible on desktop too) */}
      <div className="font-mono text-[0.7rem] text-cyan mb-3 tracking-widest uppercase">
        {experience.period}
      </div>

      <div className="p-6 md:p-8 w-full max-w-[800px] glass rounded-card relative overflow-hidden transition-all duration-300 hover:shadow-[var(--glass-shadow-hover)]">

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00F5FF]/50 to-transparent rounded-t-card z-30" />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4 relative z-10">
          <div className="flex items-start gap-4">
            {experience.id === 'iserveU' && (
              <div className="hidden sm:block mt-1">
                <LogoBadge
                  src="/portfolio/logos/employer/iserveu.png"
                  alt={experience.company}
                  width={40}
                  height={40}
                  monogram="iU"
                  className="rounded-card bg-surface border border-border p-1"
                />
              </div>
            )}
            <div>
              <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-1">
                {experience.company}
              </h3>
              <p className="font-mono text-xs text-text-muted">
                {experience.location} · {experience.type}
              </p>
            </div>
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
          <div className="flex flex-col sm:flex-row gap-4 mb-8 relative z-10">
            {experience.awards.map((award, i) => (
              <div key={i} className="relative overflow-hidden group/award flex-1 flex flex-col items-center justify-center p-4 glass rounded-card border border-amber/30 hover:border-amber/60 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-amber/10 to-transparent opacity-0 group-hover/award:opacity-100 transition-opacity duration-300" />
                <span className="text-3xl mb-2 drop-shadow-[0_0_8px_rgba(255,179,0,0.5)] transform group-hover/award:scale-110 transition-transform duration-300">🏆</span>
                <span className="font-heading font-bold text-amber text-sm tracking-wide text-center uppercase">{award}</span>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Tabs for Subsections */}
        <div className="mb-8 relative z-10">
          <div className="flex flex-wrap gap-2 mb-4 border-b border-[var(--glass-border)] pb-2" role="tablist" aria-label={`${experience.company} role details`}>
            {experience.subsections.map((sub, idx) => {
              const isOpen = openSection === sub.id;

              return (
                <button
                  key={sub.id}
                  ref={(el) => { tabRefs.current[idx] = el; }}
                  id={`tab-${experience.id}-${sub.id}`}
                  role="tab"
                  aria-selected={isOpen}
                  aria-controls={`panel-${experience.id}-${sub.id}`}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={() => setOpenSection(sub.id)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={clsx(
                    "px-4 py-2 font-mono text-[0.65rem] tracking-widest uppercase transition-all rounded-card border-b-2 outline-none focus-visible:ring-2",
                    isOpen
                      ? ACTIVE_COLOR_MAP[sub.color]
                      : "border-transparent text-text-secondary hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
                  )}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {experience.subsections.map((sub) => {
                if (openSection !== sub.id) return null;

                const getSeverityBadge = (text: string) => {
                  if (CRITICAL_REGEX.test(text)) return <span className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded-card bg-red-500/20 text-red-500 border border-red-500/50 font-mono text-[0.55rem] uppercase font-bold">CRITICAL</span>;
                  if (HIGH_REGEX.test(text)) return <span className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded-card bg-amber-500/20 text-amber-500 border border-amber-500/50 font-mono text-[0.55rem] uppercase font-bold">HIGH</span>;
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
                    className="relative z-10"
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
        <div className="pt-6 border-t border-[var(--glass-border)] flex flex-wrap gap-2 relative z-10">
          {experience.tags.map((tag, i) => (
            <span key={i} className="text-[0.65rem] font-mono text-text-muted px-2 py-1 bg-[rgba(0,0,0,0.4)] rounded-pill border border-[var(--glass-border)] glass-pill">
              {tag}
            </span>
          ))}
        </div>

      </div>
    </div>
  );

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1, y: 0, rotateX: 0, scale: 1 } : { opacity: 0, y: 100, rotateX: 5, scale: 0.95 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: false, margin: "-20%" }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="experience-card-wrapper"
    >
      {cardContent}
    </motion.div>
  );
}
