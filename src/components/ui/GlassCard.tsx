"use client";
import React from 'react';
import { cn } from '@/lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'green' | 'amber' | 'violet';
  withTilt?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, glowColor = 'cyan', withTilt = false, style, ...props }, ref) => {

    return (
      <motion.div
        ref={ref}
        className={cn(
          "group relative rounded-card overflow-hidden backdrop-blur-md border transition-all duration-300",
          "bg-[var(--gradient-card)] border-border hover:border-border-glow",
          {
            'hover:shadow-[var(--glow-cyan-sm)]': glowColor === 'cyan',
            'hover:shadow-[var(--glow-green-sm)]': glowColor === 'green',
            'hover:shadow-[var(--glow-amber-sm)]': glowColor === 'amber',
            'hover:shadow-[var(--glow-violet-sm)]': glowColor === 'violet',
          },
          className
        )}
        style={{
          ...style,
        }}
        {...props}
      >
        {/* Day 44: Hover Shine Sweep Effect */}
        <div
          className="pointer-events-none absolute inset-0 z-40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.06) 50%, transparent 75%)',
            backgroundSize: '200% 200%',
            backgroundPosition: '-100% -100%',
            transition: 'background-position 0.6s var(--ease-out-expo), opacity 0.3s ease',
          }}
          aria-hidden="true"
          // We use a small hack here to trigger the animation on hover by defining a pseudo class via tailwind in the parent or inline style trick,
          // but since inline styles don't support pseudo selectors well, we rely on a custom utility class added below or standard CSS.
          ref={(el) => {
            if (el) {
              const parent = el.parentElement;
              if (parent) {
                parent.addEventListener('mouseenter', () => { el.style.backgroundPosition = '200% 200%'; }, { passive: true });
                parent.addEventListener('mouseleave', () => { el.style.backgroundPosition = '-100% -100%'; }, { passive: true });
              }
            }
          }}
        />

        {/* Specular Highlight layer for tilt effect */}
        {withTilt && (
          <div
            className="pointer-events-none absolute inset-0 z-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: 'radial-gradient(circle 250px at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(255,255,255,0.08), transparent 80%)'
            }}
            aria-hidden="true"
          />
        )}

        <div className="relative z-10 h-full">
          {children}
        </div>
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';