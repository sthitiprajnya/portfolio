"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ScrollReveal, fadeSlideUp } from '@/components/ui/ScrollReveal';
import { useCardTilt } from '@/hooks/useCardTilt';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { PROJECTS } from '@/data/portfolio';
import type { Project } from '@/types';

const FILTERS = [
  { id: 'all', label: 'ALL' },
  { id: 'security', label: 'SECURITY' },
  { id: 'cloud', label: 'CLOUD' },
  { id: 'automation', label: 'AUTOMATION' },
];

export function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');
  const prefersReducedMotion = usePrefersReducedMotion();

  // BOLT: Memoize filtered projects to avoid redundant array filtering on every render
  const filteredProjects = useMemo(() =>
    PROJECTS.filter(p => activeFilter === 'all' ? true : p.category === activeFilter),
  [activeFilter]);

  return (
    <section id="projects" className="py-32 bg-black relative border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle number="04" title="Things I Built." />

        {/* Accessibility: Announce number of filtered results */}
        <div className="sr-only" aria-live="polite">
          Showing {filteredProjects.length} projects in {activeFilter === 'all' ? 'all categories' : activeFilter}
        </div>

        {/* Filter Tabs */}
        <ScrollReveal variants={fadeSlideUp} className="flex flex-wrap gap-3 mb-12">
          {FILTERS.map(filter => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={clsx(
                  "font-mono text-xs uppercase tracking-widest px-5 py-2 transition-all duration-300 rounded-sm border outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                  isActive
                    ? "bg-cyan border-cyan text-black shadow-[var(--glow-cyan-sm)] font-bold"
                    : "bg-transparent border-border text-text-secondary hover:text-cyan hover:border-cyan/50"
                )}
                aria-pressed={isActive}
                aria-label={`Filter by ${filter.label}`}
              >
                {filter.label}
              </button>
            );
          })}
        </ScrollReveal>

        {/* Project Grid */}
        <motion.div
          layout={!prefersReducedMotion}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project, index: number }) {
  const { ref, rotateX, rotateY } = useCardTilt();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <motion.div
      layout={!prefersReducedMotion}
      initial={{ opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.1 // Cinematic stagger reveal based on index
      }}
      className="h-full flex"
    >
      <div
        ref={ref as unknown as React.RefObject<HTMLDivElement>}
        className="w-full flex flex-col group glass rounded-card relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--glass-shadow-hover)] cursor-pointer"
        style={prefersReducedMotion ? {} : { transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, transformStyle: 'preserve-3d' }}
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00F5FF]/50 to-transparent rounded-t-card z-30" />

        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-deep border-b border-[var(--glass-border)]">
          {project.featured && (
            <span className="absolute top-3 left-3 z-20 glass-pill rounded-pill text-xs px-3 py-1 text-[#00F5FF] border-[#00F5FF]/30 mb-3 inline-block">
              FEATURED
            </span>
          )}

          {/* Fallback pattern */}
          <div
            role="img"
            aria-label="Decorative grid pattern"
            aria-hidden="true"
            className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTEwIDBMICAwIDBMMCAxMEwxMCAxMEwxMCAwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')]"
          ></div>

          <div
            role="img"
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            style={{
              backgroundImage: `url(${project.imageUrl})`,
              filter: 'grayscale(30%) contrast(120%) brightness(80%)'
            }}
            aria-label={project.imageAlt}
          />

          {/* Overlay to ensure text readability if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60" />
        </div>

        {/* Content Container */}
        <div className="p-6 flex flex-col flex-grow relative">

          <div className="flex justify-between items-start mb-3">
            <h3 className="font-heading text-lg font-bold text-white leading-tight group-hover:text-cyan transition-colors">
              {project.title}
            </h3>
            {project.githubUrl && project.githubUrl.startsWith('http') ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-white transition-colors ml-4 flex-shrink-0"
                aria-label={`View ${project.title} on GitHub`}
                onClick={(e) => e.stopPropagation()}
              >
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            ) : (
              <div className="group/lock relative ml-4 flex-shrink-0 cursor-help" onClick={(e) => e.stopPropagation()}>
                 <svg className="w-5 h-5 text-text-muted hover:text-amber transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                 </svg>
                 <div className="absolute right-0 bottom-full mb-2 w-max opacity-0 group-hover/lock:opacity-100 transition-opacity bg-black border border-amber text-amber font-mono text-[0.6rem] px-2 py-1 rounded whitespace-nowrap z-50">
                   {project.githubUrl ? project.githubUrl : '🔒 CLASSIFIED'}
                 </div>
              </div>
            )}
          </div>

          <p className="font-body text-sm text-text-secondary leading-relaxed mb-6 flex-grow">
            {project.description}
          </p>

          <div className="mt-auto space-y-4">

            {/* Impact Badge - Redesigned to be highly prominent */}
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-green/20 to-transparent border-l-2 border-green p-3 flex items-center justify-between glass-pill">
              <div className="flex items-center gap-2">
                <span className="text-green animate-pulse">●</span>
                <span className="font-mono text-[0.65rem] text-text-muted tracking-widest uppercase">IMPACT_METRIC</span>
              </div>
              <div className="font-heading font-bold text-green text-sm text-right leading-tight shadow-[var(--glow-green-sm)]">
                {project.impact}
              </div>
            </div>

            {/* Simulated Terminal Output */}
            {project.terminalOutput && (
              <div className="rounded-lg overflow-hidden border border-[var(--glass-border)] bg-[rgba(0,0,0,0.4)] text-xs font-mono glass">
                <div className="flex items-center px-2 py-1 bg-[rgba(0,245,255,0.05)] border-b border-[var(--glass-border)]">
                  <span className="text-text-muted text-[0.55rem] tracking-widest">mock_terminal.sh</span>
                </div>
                <div className="p-3 space-y-2 h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--glass-border)] scrollbar-track-transparent">
                  {project.terminalOutput.map((cmd, i) => (
                    <div key={i} className="space-y-1">
                      <div className="text-cyan"><span className="text-text-muted mr-2">$</span>{cmd.command}</div>
                      {cmd.output.map((line, j) => (
                        <div key={j} className="text-text-secondary/80 pl-2 opacity-80">{line}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Methodology Accordion */}
            {project.methodology && (
              <div className="border border-[var(--glass-border)] rounded-lg overflow-hidden glass">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMethodology(!showMethodology); }}
                  aria-expanded={showMethodology}
                  aria-controls={`methodology-${project.id}`}
                  className="w-full flex items-center justify-between p-2.5 bg-[rgba(0,245,255,0.05)] hover:bg-[rgba(0,245,255,0.1)] transition-colors font-mono text-[0.65rem] text-text-secondary uppercase tracking-widest outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                >
                  <span>{showMethodology ? 'HIDE_METHODOLOGY' : 'VIEW_METHODOLOGY'}</span>
                  <motion.svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" animate={{ rotate: showMethodology ? 180 : 0 }} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {showMethodology && (
                    <motion.div
                      id={`methodology-${project.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-[rgba(0,0,0,0.5)] overflow-hidden"
                    >
                      <div className="p-3 font-mono text-[0.65rem] text-cyan/90 leading-relaxed border-t border-[var(--glass-border)]">
                        {project.methodology.split('→').map((step, i, arr) => (
                          <div key={i} className="flex gap-2">
                            <span className="text-text-muted">{(i + 1).toString().padStart(2, '0')}.</span>
                            <span>{step.trim()}</span>
                            {i < arr.length - 1 && <span className="block my-1 text-border">↓</span>}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {project.tags.map((tag: string, i: number) => (
                <span key={i} className="font-mono text-[0.55rem] text-text-muted bg-[rgba(0,0,0,0.4)] px-2 py-1 rounded-pill border border-[var(--glass-border)] glass-pill">
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}