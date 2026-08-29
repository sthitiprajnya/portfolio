"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { LogoBadge } from '@/components/ui/LogoBadge';

interface SkillBadgeProps {
  name: string;
  icon: string;
  proficiency: number;
  color: 'cyan' | 'amber' | 'green' | 'violet';
  delay?: number;
  description?: string;
  experience?: string;
}

// BOLT: Hoist static configurations to module level to avoid redundant allocations on every render
const COLOR_MAP = {
  cyan:   'var(--color-cyan)',
  amber:  'var(--color-amber)',
  green:  'var(--color-green)',
  violet: 'var(--color-violet)',
};

const BG_MAP = {
  cyan:   'var(--color-cyan-ghost)',
  amber:  'rgba(255, 179, 0, 0.1)',
  green:  'var(--color-green-ghost)',
  violet: 'rgba(191, 0, 255, 0.1)',
};

const IN_VIEW_OPTIONS = { threshold: 0.12, triggerOnce: true };
const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ICON_PATHS: Record<string, string> = {
  burpsuite:   'tools/burp-suite.svg',
  nessus:      'tools/nessus.svg',
  kali:        'tools/kalilinux.svg',
  metasploit:  'tools/metasploit.svg',
  nmap:        'tools/nmap.png',
  nuclei:      'tools/nuclei.svg',
  wireshark:   'tools/wireshark.svg',
  frida:       'tools/frida.png',
  zap:         'tools/owasp.svg',
  owasp:       'tools/owasp.svg',
  postman:     'tools/postman.svg',
  gcp:         'cloud/gcp.svg',
  aws:         'cloud/aws.svg',
  kubernetes:  'cloud/kubernetes.svg',
  docker:      'cloud/docker.svg',
  python:      'scripting/python.svg',
  bash:        'scripting/bash.svg',
  powershell:  'scripting/powershell.svg',
  mitre:       'frameworks/mitre.png',
  pcidss:      'frameworks/pcidss.jpg',
  nist:        'frameworks/nist.png',
  wazuh:       'siem/wazuh.svg',
  zabbix:      'siem/zabbix.png',
};

const KNOWN_ICONS = new Set(Object.keys(ICON_PATHS));
const INVERTED_ICONS = new Set(['nmap', 'frida', 'mitre', 'pcidss', 'nist', 'zabbix']);

export const SkillBadge = React.memo(function SkillBadge({
  name, icon, proficiency, color, delay = 0, description, experience
}: SkillBadgeProps) {
  const { ref, inView } = useInView(IN_VIEW_OPTIONS);
  const prefersReducedMotion = usePrefersReducedMotion();
  const tooltipId = React.useId();

  const strokeDashoffset = CIRCUMFERENCE - (proficiency / 100) * CIRCUMFERENCE;

  // BOLT: Pre-calculate styles to avoid function creation and redundant logic on every render
  const isHighProficiency = proficiency >= 80;
  const isLowProficiency = proficiency < 50;

  const badgeStyle = isHighProficiency
    ? { boxShadow: '0 0 8px rgba(0,245,255,0.4)', borderColor: 'rgba(0,245,255,0.4)' }
    : isLowProficiency ? { opacity: 0.6 } : {};

  const badgeClassName = isHighProficiency ? "border border-transparent" : "";

  return (
    <div
      ref={ref}
      tabIndex={0}
      aria-label={`Skill: ${name}`}
      title={`Skill: ${name}`}
      aria-describedby={tooltipId}
      className={`relative flex flex-col items-center justify-center p-2 group skill-tag outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-card transition-all ${badgeClassName}`}
      style={badgeStyle}
      data-orb-target="true"
    >
      <div className="relative w-16 h-16 flex items-center justify-center mb-3">
        {/* Background track */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" aria-hidden="true">
          <circle
            cx="32"
            cy="32"
            r={RADIUS}
            fill={BG_MAP[color]}
            stroke="var(--color-border)"
            strokeWidth="2"
          />
          {/* Animated progress ring */}
          <motion.circle
            cx="32"
            cy="32"
            r={RADIUS}
            fill="none"
            stroke={COLOR_MAP[color]}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={
              (inView || prefersReducedMotion)
                ? { strokeDashoffset }
                : { strokeDashoffset: CIRCUMFERENCE }
            }
            transition={{
              duration: 1.2,
              delay: delay,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="drop-shadow-md"
            style={{ filter: `drop-shadow(0 0 4px ${COLOR_MAP[color]}66)` }}
          />
        </svg>

        {/* Icon / Monogram */}
        <div className="relative z-10 flex items-center justify-center pointer-events-none">
          {KNOWN_ICONS.has(icon) ? (
            <LogoBadge
              src={`/portfolio/logos/${ICON_PATHS[icon]}`}
              alt={name}
              width={20}
              height={20}
              className={`invert dark:invert-0 drop-shadow-lg ${INVERTED_ICONS.has(icon) ? 'invert dark:invert-0' : 'fill-current opacity-90'} `}
            />
          ) : (
            <div
              className="w-10 h-10 rounded-card flex items-center justify-center text-xs font-mono font-bold tracking-widest bg-black/80 border border-dashed backdrop-blur-sm transition-all"
              style={{ color: COLOR_MAP[color], borderColor: `${COLOR_MAP[color]}80`, boxShadow: `inset 0 0 10px ${COLOR_MAP[color]}20` }}
            >
              {icon.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <span className={`text-center font-mono text-[0.65rem] uppercase tracking-wider transition-colors ${proficiency < 50 ? 'text-text-muted group-hover:text-text-secondary' : 'text-text-secondary group-hover:text-white'}`}>
        {name}
      </span>

      {/* Tooltip (Desktop Hover / Mobile Static) */}
      <div
        id={tooltipId}
        role="tooltip"
        className="mt-3 md:mt-0 md:absolute md:bottom-full md:left-1/2 md:-translate-x-1/2 md:mb-2 w-full md:w-48 p-3 glass md:rounded-card md:opacity-0 md:invisible md:group-hover:opacity-100 md:group-hover:visible md:group-focus-visible:opacity-100 md:group-focus-visible:visible transition-all duration-200 z-50 md:pointer-events-none md:translate-y-2 md:group-hover:translate-y-0 md:group-focus-visible:translate-y-0 relative overflow-hidden border border-[var(--glass-border)] md:border-none rounded-sm"
      >
        <div className="font-mono text-[0.6rem] text-cyan font-bold mb-1 tracking-widest hidden md:block">{name}</div>
        <div className="flex justify-between items-center mb-2 md:mb-2 font-mono text-[0.6rem]">
           <span className="text-text-secondary">EXP: <span className="text-white">{experience || 'N/A'}</span></span>
           <span className="text-text-secondary">LVL: <span className="text-white">{proficiency}%</span></span>
        </div>
        <p className="font-body text-xs text-text-secondary leading-snug hidden md:block">
          {description || 'No description available.'}
        </p>
        <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-border" />
      </div>
    </div>
  );
});
