"use client";
import React, { useState, useMemo } from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { ScrollReveal, fadeSlideUp, containerStagger } from '@/components/ui/ScrollReveal';
import { SKILLS } from '@/data/portfolio';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

const Radar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Radar), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center font-mono text-[0.6rem] text-text-muted animate-pulse">LOADING_DATA_VIZ...</div>
});

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { useInView } from 'react-intersection-observer';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// BOLT: Move static data outside component to avoid redundant allocations on every render
const MARQUEE_TAGS = [
  'Burp Suite Pro', 'Nessus', 'IDOR/BOLA', 'Auth Bypass', 'SSRF', 'XSS',
  'SQL Injection', 'XXE', 'Business Logic Flaws', 'API Pentesting', 'Android VAPT',
  'Certificate Pinning Bypass', 'GCP Hardening', 'IAM Least-Privilege', 'CMEK',
  'K8s Security', 'Docker Scanning', 'Wazuh Rules', 'Python Automation',
  'JIRA REST API', 'DLP API', 'SpiderFoot', 'OSINT', 'Red Team', 'Threat Modeling',
  'PCI DSS', 'ISO 27001', 'SOC 2', 'MITRE ATT&CK', 'PTES', 'Privilege Escalation',
  'Lateral Movement', 'MQTT Attack Chain', 'Cryptojacking Response', 'CVE Triage', 'PoC Writing'
];

// BOLT: Pre-calculate doubled and reversed arrays to avoid O(n) work and mutation bugs during render
const DOUBLED_MARQUEE_ROW_1 = [...MARQUEE_TAGS, ...MARQUEE_TAGS];
const DOUBLED_MARQUEE_ROW_2 = [...MARQUEE_TAGS].reverse().concat([...MARQUEE_TAGS].reverse());

// BOLT: Hoist static data and configurations to avoid redundant allocations on every render
const RADAR_DATA = {
  labels: ['Offensive', 'Cloud Security', 'Automation', 'Compliance', 'Network Analysis', 'Incident Response'],
  datasets: [
    {
      label: 'Proficiency',
      data: [90, 85, 88, 80, 85, 82], // Aggregated scores
      backgroundColor: 'rgba(0, 245, 255, 0.2)',
      borderColor: 'rgba(0, 245, 255, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(0, 245, 255, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0, 245, 255, 1)',
    },
  ],
};

const RADAR_OPTIONS = {
  scales: {
    r: {
      angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
      pointLabels: { color: '#7FA8C4', font: { family: 'JetBrains Mono', size: 10 } },
      ticks: { display: false, min: 0, max: 100 },
    },
  },
  plugins: { legend: { display: false } },
  maintainAspectRatio: false,
  animation: { duration: 2000 }
};

const SKILLS_TABS: ('ALL' | 'OFFENSIVE' | 'CLOUD' | 'AUTOMATION' | 'COMPLIANCE')[] = ['ALL', 'OFFENSIVE', 'CLOUD', 'AUTOMATION', 'COMPLIANCE'];

export function Skills() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'OFFENSIVE' | 'CLOUD' | 'AUTOMATION' | 'COMPLIANCE'>('ALL');
  const { ref: chartRef, inView: chartInView } = useInView({ triggerOnce: true, threshold: 0.5 });

  const { totalFilteredSkills, filteredCategories } = useMemo(() => {
    let count = 0;
    const categories = SKILLS.map(category => {
      const filteredSkills = category.skills.filter(s => activeTab === 'ALL' || s.domain === activeTab);
      count += filteredSkills.length;
      return { ...category, filteredSkills };
    }).filter(cat => cat.filteredSkills.length > 0);
    return { totalFilteredSkills: count, filteredCategories: categories };
  }, [activeTab]);

  return (
    <section id="skills" className="py-24 bg-black overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle number="02" title="Tech Arsenal." />

        {/* Accessibility: Announce number of filtered results */}
        <div className="sr-only" aria-live="polite">
          Showing {totalFilteredSkills} skills in {activeTab === 'ALL' ? 'all categories' : activeTab}
        </div>

        {/* Filter Tabs & Radar Chart Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
          <div className="flex-1 w-full">
             <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
              {SKILLS_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    'px-4 py-2 font-mono text-[0.7rem] uppercase tracking-widest transition-all rounded-card border outline-none focus-visible:ring-2 focus-visible:ring-cyan',
                    activeTab === tab
                      ? 'border-cyan bg-cyan/10 text-cyan shadow-[var(--glow-cyan-sm)]'
                      : 'border-border text-text-secondary hover:border-cyan/50 hover:text-white'
                  )}
                  aria-pressed={activeTab === tab}
                  aria-label={`Filter by ${tab}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <p className="font-mono text-sm text-text-secondary leading-relaxed max-w-2xl">
              Explore my technical capabilities across various domains. Hover over individual tools for detailed proficiency and professional context.
            </p>
          </div>

          <div
            ref={chartRef}
            className="w-full lg:w-[400px] h-[300px] glass rounded-card p-4 flex items-center justify-center relative group"
            role="img"
            aria-label="Skill proficiency radar chart showing expertise in Offensive Security, Cloud Security, Automation, Compliance, Network Analysis, and Incident Response"
          >
             <div className="absolute top-2 left-4 font-mono text-[0.6rem] text-cyan tracking-widest">
               [ DOMAIN_PROFICIENCY_RADAR ]
             </div>
             {chartInView && (
               <Radar
                 data={RADAR_DATA}
                 options={RADAR_OPTIONS}
               />
             )}
          </div>
        </div>

        {/* Skill Rings Grid */}
        <div className="space-y-16 mb-24">
          {filteredCategories.map((category) => {
            return (
              <ScrollReveal key={category.category} variants={containerStagger} className="space-y-6">
                <h3 className="font-mono text-sm text-white border-b border-border pb-2 inline-block">
                  {category.category}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-8 gap-x-4">
                  {category.filteredSkills.map((skill, skillIdx) => (
                    <ScrollReveal key={skill.name} variants={fadeSlideUp}>
                      <SkillBadge
                        name={skill.name}
                        icon={skill.icon}
                        proficiency={skill.proficiency}
                        color={category.color}
                        delay={skillIdx * 0.1}
                        description={skill.description}
                        experience={skill.experience}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Marquee Tags */}
      <div
        className="relative w-full border-y border-border bg-deep py-6 overflow-hidden flex flex-col space-y-4 group/marquee outline-none focus-within:ring-1 focus-within:ring-cyan/30"
        role="region"
        aria-label="Technologies and skills marquee"
        tabIndex={0}
      >
        {/* Left/Right fading edges */}
        <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-deep to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-deep to-transparent z-10 pointer-events-none" />

        {/* Row 1 - scrolling left */}
        <div
          className="flex w-max animate-marquee-left"
          tabIndex={0}
          role="region"
          aria-label="Skills marquee row 1"
        >
          {DOUBLED_MARQUEE_ROW_1.map((tag, i) => (
            <div
              key={`row1-${i}-${tag}`}
              className="mx-3 px-4 py-1.5 rounded-card bg-surface border border-border font-mono text-[0.75rem] text-text-secondary whitespace-nowrap"
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Row 2 - scrolling right */}
        <div
          className="flex w-max animate-marquee-right"
          tabIndex={0}
          role="region"
          aria-label="Skills marquee row 2"
        >
          {DOUBLED_MARQUEE_ROW_2.map((tag, i) => (
            <div
              key={`row2-${i}-${tag}`}
              className="mx-3 px-4 py-1.5 rounded-card bg-surface border border-border font-mono text-[0.75rem] text-text-secondary whitespace-nowrap"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marqueeLeft 35s linear infinite;
        }
        .animate-marquee-right {
          animation: marqueeRight 40s linear infinite;
        }
        .animate-marquee-left:hover, .animate-marquee-left:focus-within,
        .animate-marquee-right:hover, .animate-marquee-right:focus-within {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-left, .animate-marquee-right {
            animation: none;
            flex-wrap: wrap;
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
