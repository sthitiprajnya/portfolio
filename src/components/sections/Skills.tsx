"use client";
import React from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { ScrollReveal, fadeSlideUp, containerStagger } from '@/components/ui/ScrollReveal';
import { SKILLS } from '@/data/portfolio';

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
const MARQUEE_ROW_1 = [...MARQUEE_TAGS, ...MARQUEE_TAGS];
// Create reversed copy first to match original behavior (reversed sequence doubled for seamless loop)
const REVERSED_TAGS = [...MARQUEE_TAGS].reverse();
const MARQUEE_ROW_2 = [...REVERSED_TAGS, ...REVERSED_TAGS];

export function Skills() {
  return (
    <section id="skills" className="py-24 bg-black overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle number="02" title="Tech Arsenal." />

        {/* Skill Rings Grid */}
        <div className="space-y-16 mb-24">
          {SKILLS.map((category, catIdx) => (
            <ScrollReveal key={catIdx} variants={containerStagger} className="space-y-6">
              <h3 className="font-mono text-sm text-white border-b border-border pb-2 inline-block">
                {category.category}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-8 gap-x-4">
                {category.skills.map((skill, skillIdx) => (
                  <ScrollReveal key={skillIdx} variants={fadeSlideUp}>
                    <SkillBadge
                      name={skill.name}
                      icon={skill.icon}
                      proficiency={skill.proficiency}
                      color={category.color}
                      delay={skillIdx * 0.1}
                    />
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
          ))}
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
          {MARQUEE_ROW_1.map((tag, i) => (
            <div
              key={`row1-${i}`}
              className="mx-3 px-4 py-1.5 rounded-sm bg-surface border border-border font-mono text-[0.75rem] text-text-secondary whitespace-nowrap"
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
          {MARQUEE_ROW_2.map((tag, i) => (
            <div
              key={`row2-${i}`}
              className="mx-3 px-4 py-1.5 rounded-sm bg-surface border border-border font-mono text-[0.75rem] text-text-secondary whitespace-nowrap"
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
