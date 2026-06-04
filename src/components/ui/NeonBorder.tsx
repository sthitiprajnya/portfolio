"use client";
import React from 'react';
import clsx from 'clsx';

interface NeonBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: 'cyan' | 'green' | 'amber' | 'violet';
  animated?: boolean; // Day 53
}

export function NeonBorder({ children, className, color = 'cyan', animated = false }: NeonBorderProps) {
  const glowVar = `var(--glow-${color}-sm)`;
  const borderColorVar = `var(--color-${color})`;

  if (animated) {
    return (
      <div className={clsx('relative p-[1px] overflow-hidden rounded-card group', className)}>
        {/* Animated Background layer for marching ants / conic rotation effect */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, transparent 60%, ${borderColorVar} 100%)`,
            animation: 'spin 3s linear infinite',
          }}
        />
        {/* Inner Content overlay that masks the center of the conic gradient, leaving only the border visible */}
        <div
          className="relative z-10 w-full h-full bg-deep rounded-[inherit]"
          style={{ boxShadow: glowVar }}
        >
          {children}
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className={clsx('relative', className)}
      style={{
        boxShadow: glowVar,
        border: `1px solid ${borderColorVar}`,
      }}
    >
      {children}
    </div>
  );
}