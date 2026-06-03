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
          "relative rounded-card overflow-hidden backdrop-blur-md border transition-all duration-300",
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