"use client";
import React from 'react';
import clsx from 'clsx';
import { SectionTitle }  from '@/components/ui/SectionTitle';
import { ScrollReveal, fadeSlideUp, fadeSlideLeft } from '@/components/ui/ScrollReveal';
import { useInView }     from 'react-intersection-observer';
import { CTF_PROFILE }   from '@/data/portfolio';
import { Radar } from 'react-chartjs-2';
import { LogoBadge } from '@/components/ui/LogoBadge';

// BOLT: Hoist static configurations and data transformations to module level
const HTB_STATS = [
  { label: 'Points',        value: CTF_PROFILE.htbPoints.toLocaleString() },
  { label: 'Top',           value: `${CTF_PROFILE.globalPercentile}%` },
  { label: 'User Owns',     value: CTF_PROFILE.htbUserOwns },
  { label: 'Root Owns',     value: CTF_PROFILE.htbRootOwns },
  { label: 'Challenges',    value: CTF_PROFILE.htbChallengesSolved },
  { label: 'Competitions',  value: CTF_PROFILE.competitions.length },
];

const RADAR_DATA = {
  labels: CTF_PROFILE.attackCategories.map(c => c.label.split(' ')[0]),
  datasets: [{
    label: 'Proficiency',
    data: CTF_PROFILE.attackCategories.map(c => c.level),
    backgroundColor: 'rgba(57, 255, 20, 0.2)',
    borderColor: 'rgba(57, 255, 20, 0.8)',
    pointBackgroundColor: 'rgba(57, 255, 20, 1)',
    pointBorderColor: '#fff',
  }]
};

const RADAR_OPTIONS = {
  scales: {
    r: {
      angleLines: { color: 'rgba(255,255,255,0.1)' },
      grid: { color: 'rgba(255,255,255,0.1)' },
      pointLabels: { color: '#7FA8C4', font: { family: 'JetBrains Mono', size: 9 } },
      ticks: { display: false },
      suggestedMin: 0,
      suggestedMax: 100
    }
  },
  plugins: { legend: { display: false } },
  maintainAspectRatio: false
};

function RadarChartWrapper({ data, options }: { data: any, options: any }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <div ref={ref} className="w-full h-full flex justify-center items-center">
      {inView && <Radar data={data} options={{...options, animation: {duration: 2000}}} />}
    </div>
  );
}

export function CTFStats() {
  return (
    <section id="ctf" className="py-24 bg-black relative border-t border-border overflow-hidden">

      {/* Subtle hex-grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34z' fill='none' stroke='%2300F5FF' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle number="06" title="War Games." />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ── Left: HackTheBox profile card ── */}
          <ScrollReveal variants={fadeSlideUp} className="lg:col-span-4">
            <div className="p-6 h-full border-cyan/20 hover:shadow-[var(--glow-cyan-sm)] glass rounded-card relative overflow-hidden">

              {/* HTB logo row */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <LogoBadge
                    src="/portfolio/logos/wargames/hackthebox.svg"
                    alt="HackTheBox"
                    width={32}
                    height={32}
                  />
                  <div>
                    <div className="font-mono text-[0.6rem] text-text-muted uppercase tracking-widest mb-1">
                      Platform
                    </div>
                    <div className="font-display text-lg text-white font-bold tracking-widest leading-none">
                      HackTheBox
                    </div>
                  </div>
                </div>
                {/* Rank badge */}
                <div className="px-3 py-1.5 glass-pill rounded-pill text-cyan font-mono text-xs font-bold uppercase tracking-wider shadow-[var(--glow-cyan-sm)] border-cyan/40">
                  {CTF_PROFILE.htbRank}
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-6" >
                {HTB_STATS.map(({ label, value }) => (
                  <div key={label} className="p-3 glass rounded-card bg-[rgba(0,0,0,0.4)]">
                    <div className="font-display text-xl text-cyan font-bold">{value}</div>
                    <div className="font-mono text-[0.6rem] text-text-muted uppercase tracking-widest mt-0.5">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Owns visual bars */}
              <div className="space-y-3">
                <OwnsBar label="User Owns" value={CTF_PROFILE.htbUserOwns} max={50} color="cyan" />
                <OwnsBar label="Root Owns" value={CTF_PROFILE.htbRootOwns} max={50} color="green" />
              </div>

              {/* HTB profile link */}
              <a
                href={`https://profile.hackthebox.com/profile/019db8ae-9364-73ed-bb47-1336835663a7`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View HackTheBox Profile in a new tab"
                className="mt-6 flex items-center justify-center space-x-2 w-full py-2.5 border border-cyan/30 text-cyan font-mono text-xs uppercase tracking-widest rounded-pill hover:bg-cyan hover:text-black transition-all hover:shadow-[var(--glow-cyan-sm)]"
              >
                <span>VIEW HTB PROFILE</span>
                <span aria-hidden="true" className="text-[10px]">↗</span>
              </a>
            </div>
          </ScrollReveal>

          {/* ── Right: Attack category proficiency & Recent Activity ── */}
          <ScrollReveal variants={fadeSlideLeft} className="lg:col-span-8 space-y-6">
            <div className="p-6 glass rounded-card">
              <h3 className="font-mono text-sm text-white mb-6 border-b border-[var(--glass-border)] pb-3">
                // ATTACK_CATEGORY_PROFICIENCY
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                 <div className="space-y-4">
                  {CTF_PROFILE.attackCategories.slice(0, 4).map((cat) => (
                    <SkillBar key={cat.label} label={cat.label} level={cat.level} />
                  ))}
                  <div className="pt-2">
                     <p className="font-mono text-[0.65rem] text-text-muted leading-relaxed">Proficiency measured across HTB matrices and real-world VAPT engagements.</p>
                  </div>
                 </div>

                 {/* Hexagonal Radar Chart mapped from same data */}
                 <div className="h-[240px] relative flex justify-center items-center">
                   <RadarChartWrapper data={RADAR_DATA} options={RADAR_OPTIONS} />
                 </div>
              </div>
            </div>

            <div className="p-6 glass rounded-card">
               <h3 className="font-mono text-sm text-white mb-4 border-b border-[var(--glass-border)] pb-3 flex justify-between items-end">
                 <span>// RECENT_ACTIVITY</span>
                 <span className="text-[0.6rem] text-text-muted">Live Feed (Mock)</span>
               </h3>
               <div className="space-y-3">
                 {CTF_PROFILE.recentActivity.map((act, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-card glass bg-[rgba(0,0,0,0.4)] hover:border-green/30 transition-colors">
                      <div className="flex items-center gap-3">
                         <span className={clsx("w-2 h-2 rounded-full", act.type === 'machine' ? 'bg-green shadow-[var(--glow-green-sm)]' : 'bg-amber shadow-[var(--glow-amber-sm)]')} />
                         <div>
                            <div className="font-heading font-bold text-sm text-white">{act.title}</div>
                            <div className="font-mono text-[0.6rem] text-text-muted uppercase tracking-widest">{act.type}</div>
                         </div>
                      </div>
                      <div className="text-right">
                        <div className={clsx("font-mono text-[0.65rem] uppercase tracking-widest mb-1",
                          act.difficulty === 'Easy' ? 'text-green' : act.difficulty === 'Medium' ? 'text-amber' : 'text-red-500'
                        )}>
                           {act.difficulty}
                        </div>
                        <div className="font-mono text-[0.6rem] text-text-secondary">{act.date}</div>
                      </div>
                    </div>
                 ))}
               </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ── CTF competition history ── */}
        <ScrollReveal variants={fadeSlideUp} delay={0.3} className="mt-10">
          <div className="p-6 glass rounded-card">
            <h3 className="font-mono text-sm text-white mb-6 border-b border-[var(--glass-border)] pb-3">
              // CTF_COMPETITION_HISTORY
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CTF_PROFILE.competitions.map((comp, i) => (
                <div
                  key={i}
                  className="p-4 glass rounded-card bg-[rgba(0,0,0,0.5)] hover:border-[rgba(0,245,255,0.4)] transition-colors group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="font-mono text-[0.6rem] text-text-muted uppercase tracking-widest">
                      {comp.year}
                    </div>
                    <div className="px-2 py-0.5 rounded-pill glass-pill border border-green/30 font-mono text-[0.6rem] text-green uppercase tracking-widest">
                      {comp.placement}
                    </div>
                  </div>

                  <h4 className="font-heading text-sm font-bold text-white mb-2 leading-snug group-hover:text-cyan transition-colors">
                    {comp.name}
                  </h4>

                  <div className="flex items-center justify-between">
                    <div className="font-mono text-[0.65rem] text-text-secondary">
                      {comp.solved} challenges solved
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {comp.tags.map(tag => (
                      <span key={tag} className="font-mono text-[0.55rem] text-text-muted px-2 py-0.5 rounded-pill glass-pill border border-[var(--glass-border)] uppercase tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function SkillBar({ label, level }: { label: string; level: number }) {
  const { ref, inView } = useInView({ threshold: 0.12, triggerOnce: true });

  const colorClass =
    level >= 85 ? 'bg-cyan shadow-[var(--glow-cyan-sm)]'  :
    level >= 65 ? 'bg-green shadow-[var(--glow-green-sm)]' :
                  'bg-violet shadow-[var(--glow-violet-sm)]';

  return (
    <div ref={ref}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-mono text-[0.7rem] text-text-secondary uppercase tracking-wider">
          {label}
        </span>
        <span className="font-display text-sm text-white font-bold">{level}%</span>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]', colorClass)}
          style={{ width: inView ? `${level}%` : '0%' }}
        />
      </div>
    </div>
  );
}

function OwnsBar({ label, value, max, color }: { label: string; value: number; max: number; color: 'cyan' | 'green' }) {
  const { ref, inView } = useInView({ threshold: 0.12, triggerOnce: true });
  const pct = Math.min(100, (value / max) * 100);

  const barClass = color === 'cyan'
    ? 'bg-cyan shadow-[var(--glow-cyan-sm)]'
    : 'bg-green shadow-[var(--glow-green-sm)]';

  const textClass = color === 'cyan' ? 'text-cyan' : 'text-green';

  return (
    <div ref={ref}>
      <div className="flex justify-between mb-1">
        <span className="font-mono text-[0.65rem] text-text-muted uppercase tracking-widest">{label}</span>
        <span className={clsx('font-mono text-[0.65rem] font-bold', textClass)}>{value}</span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]', barClass)}
          style={{ width: inView ? `${pct}%` : '0%' }}
        />
      </div>
    </div>
  );
}
