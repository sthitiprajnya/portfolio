"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface SkillBadgeProps {
  name: string;
  icon: string;
  proficiency: number;
  color: 'cyan' | 'amber' | 'green' | 'violet';
  delay?: number;
}

export function SkillBadge({ name, icon, proficiency, color, delay = 0 }: SkillBadgeProps) {
  const { ref, inView } = useInView({
    threshold: 0.12,
    triggerOnce: true,
  });
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hasAnimated, setHasAnimated] = useState(false);

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (proficiency / 100) * circumference;

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [inView, hasAnimated]);

  const colorMap = {
    cyan:   'var(--color-cyan)',
    amber:  'var(--color-amber)',
    green:  'var(--color-green)',
    violet: 'var(--color-violet)',
  };

  const bgMap = {
    cyan:   'var(--color-cyan-ghost)',
    amber:  'rgba(255, 179, 0, 0.1)',
    green:  'var(--color-green-ghost)',
    violet: 'rgba(191, 0, 255, 0.1)',
  };

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-2 group">
      <div className="relative w-16 h-16 flex items-center justify-center mb-3">
        {/* Background track */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" aria-hidden="true">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill={bgMap[color]}
            stroke="var(--color-border)"
            strokeWidth="2"
          />
          {/* Animated progress ring */}
          <motion.circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={colorMap[color]}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={
              (hasAnimated || prefersReducedMotion)
                ? { strokeDashoffset }
                : { strokeDashoffset: circumference }
            }
            transition={{
              duration: 1.2,
              delay: delay,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="drop-shadow-md"
            style={{ filter: `drop-shadow(0 0 4px ${colorMap[color]}66)` }}
          />
        </svg>

        {/* Icon placeholder - in real app, map icon string to actual SVG components */}
        <div
          className="relative z-10 w-6 h-6 rounded-sm flex items-center justify-center text-[0.6rem] font-bold"
          style={{ color: colorMap[color] }}
        >
          {icon.substring(0, 2).toUpperCase()}
        </div>
      </div>

      <span className="text-center font-mono text-[0.65rem] uppercase tracking-wider text-text-secondary group-hover:text-white transition-colors">
        {name}
      </span>
    </div>
  );
}