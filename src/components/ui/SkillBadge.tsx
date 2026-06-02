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

export function SkillBadge({ name, icon, proficiency, color, delay = 0, description, experience }: SkillBadgeProps) {
  const { ref, inView } = useInView({
    threshold: 0.12,
    triggerOnce: true,
  });
  const prefersReducedMotion = usePrefersReducedMotion();
  const tooltipId = React.useId();

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (proficiency / 100) * circumference;

  const getStyle = () => {
    if (proficiency >= 80) {
      return { boxShadow: '0 0 8px rgba(0,245,255,0.4)', borderColor: 'rgba(0,245,255,0.4)' };
    }
    if (proficiency < 50) {
      return { opacity: 0.6 };
    }
    return {};
  };

  const getBadgeStyle = () => {
    if (proficiency >= 80) return "border border-transparent";
    return "";
  }

  return (
    <div
      ref={ref}
      tabIndex={0}
      aria-label={`Skill: ${name}`}
      aria-describedby={tooltipId}
      className={`relative flex flex-col items-center justify-center p-2 group skill-tag outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-card transition-all ${getBadgeStyle()}`}
      style={getStyle()}
      data-orb-target="true"
    >
      <div className="relative w-16 h-16 flex items-center justify-center mb-3">
        {/* Background track */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" aria-hidden="true">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill={BG_MAP[color]}
            stroke="var(--color-border)"
            strokeWidth="2"
          />
          {/* Animated progress ring */}
          <motion.circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={COLOR_MAP[color]}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={
              (inView || prefersReducedMotion)
                ? { strokeDashoffset }
                : { strokeDashoffset: circumference }
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
          {['burpsuite', 'nessus', 'kali', 'metasploit', 'nmap', 'nuclei', 'wireshark', 'frida', 'zap', 'postman', 'gcp', 'aws', 'kubernetes', 'docker', 'python', 'bash', 'powershell', 'owasp', 'mitre', 'pcidss', 'nist', 'wazuh', 'zabbix'].includes(icon) ? (
            <LogoBadge
              src={`/portfolio/logos/${
                icon === 'burpsuite' ? 'tools/burp-suite.svg' :
                icon === 'nessus' ? 'tools/nessus.svg' :
                icon === 'kali' ? 'tools/kalilinux.svg' :
                icon === 'metasploit' ? 'tools/metasploit.svg' :
                icon === 'nmap' ? 'tools/nmap.png' :
                icon === 'nuclei' ? 'tools/nuclei.svg' :
                icon === 'wireshark' ? 'tools/wireshark.svg' :
                icon === 'frida' ? 'tools/frida.png' :
                icon === 'zap' ? 'tools/owasp.svg' :
                icon === 'postman' ? 'tools/postman.svg' :
                icon === 'gcp' ? 'cloud/gcp.svg' :
                icon === 'aws' ? 'cloud/aws.svg' :
                icon === 'kubernetes' ? 'cloud/kubernetes.svg' :
                icon === 'docker' ? 'cloud/docker.svg' :
                icon === 'python' ? 'scripting/python.svg' :
                icon === 'bash' ? 'scripting/bash.svg' :
                icon === 'powershell' ? 'scripting/powershell.svg' :
                icon === 'owasp' ? 'tools/owasp.svg' :
                icon === 'mitre' ? 'frameworks/mitre.png' :
                icon === 'pcidss' ? 'frameworks/pcidss.jpg' :
                icon === 'nist' ? 'frameworks/nist.png' :
                icon === 'wazuh' ? 'siem/wazuh.svg' :
                icon === 'zabbix' ? 'siem/zabbix.png' :
                ''
              }`}
              alt={name}
              width={20}
              height={20}
              className={`invert dark:invert-0 drop-shadow-lg ${['nmap', 'frida', 'mitre', 'pcidss', 'nist', 'zabbix'].includes(icon) ? 'invert dark:invert-0' : 'fill-current opacity-90'} `}
            />
          ) : (
            <div
              className="w-6 h-6 rounded-card flex items-center justify-center text-[0.65rem] font-bold tracking-widest bg-black/40 border border-border backdrop-blur-sm"
              style={{ color: COLOR_MAP[color], borderColor: `${COLOR_MAP[color]}40` }}
            >
              {icon.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <span className={`text-center font-mono text-[0.65rem] uppercase tracking-wider transition-colors ${proficiency < 50 ? 'text-text-muted group-hover:text-text-secondary' : 'text-text-secondary group-hover:text-white'}`}>
        {name}
      </span>

      {/* Tooltip */}
      <div
        id={tooltipId}
        role="tooltip"
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 glass rounded-card opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-visible:opacity-100 group-focus-visible:visible transition-all duration-200 z-50 pointer-events-none translate-y-2 group-hover:translate-y-0 group-focus-visible:translate-y-0 relative overflow-hidden"
      >
        <div className="font-mono text-[0.6rem] text-cyan font-bold mb-1 tracking-widest">{name}</div>
        <div className="flex justify-between items-center mb-2 font-mono text-[0.6rem]">
           <span className="text-text-secondary">EXP: <span className="text-white">{experience || 'N/A'}</span></span>
           <span className="text-text-secondary">LVL: <span className="text-white">{proficiency}%</span></span>
        </div>
        <p className="font-body text-xs text-text-secondary leading-snug">
          {description || 'No description available.'}
        </p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-border" />
      </div>
    </div>
  );
}
