"use client";
import React, { useState, useEffect } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useInView } from 'react-intersection-observer';
import clsx from 'clsx';

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glitchIntensity?: 'low' | 'medium' | 'high'; // Day 45
  reducedMotion?: boolean; // Day 45
  triggerOnHover?: boolean; // Day 54
}

export function GlitchText({
  children,
  className,
  style,
  glitchIntensity = 'medium',
  reducedMotion,
  triggerOnHover = false
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const systemPrefersReducedMotion = usePrefersReducedMotion();
  const prefersReducedMotion = reducedMotion !== undefined ? reducedMotion : systemPrefersReducedMotion;
  const { ref, inView } = useInView({ threshold: 0 });

  // BOLT: Only schedule background glitches when the component is in the viewport
  // to prevent unnecessary state updates and re-renders when the user has scrolled past.
  useEffect(() => {
    if (prefersReducedMotion || !inView || triggerOnHover) return;

    const scheduleNextGlitch = () => {
      let minDelay = 8000;
      let maxDelay = 15000;
      let duration = 200;

      // Day 45: Adjust timing based on intensity
      if (glitchIntensity === 'low') {
        minDelay = 12000;
        maxDelay = 20000;
        duration = 100;
      } else if (glitchIntensity === 'high') {
        minDelay = 3000;
        maxDelay = 6000;
        duration = 400;
      }

      const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      return setTimeout(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), duration);
        timeoutId = scheduleNextGlitch();
      }, delay);
    };

    let timeoutId = scheduleNextGlitch();

    return () => clearTimeout(timeoutId);
  }, [prefersReducedMotion, inView, triggerOnHover, glitchIntensity]);

  if (prefersReducedMotion) {
    return <span className={className} style={style}>{children}</span>;
  }

  // Define glitch styles based on intensity
  const getGlitchStyles = () => {
    if (glitchIntensity === 'low') {
      return {
        layer1: { animation: 'glitch-layer-1 0.4s linear infinite', transform: 'translate(-1px, 1px)' },
        layer2: { animation: 'glitch-layer-2 0.4s linear infinite', transform: 'translate(1px, -1px)' }
      };
    } else if (glitchIntensity === 'high') {
      return {
        layer1: { animation: 'glitch-layer-1 0.1s linear infinite', transform: 'translate(-4px, 2px)' },
        layer2: { animation: 'glitch-layer-2 0.15s linear infinite', transform: 'translate(4px, -2px)' }
      };
    }
    // medium (default)
    return {
      layer1: { animation: 'glitch-layer-1 0.2s linear infinite' },
      layer2: { animation: 'glitch-layer-2 0.3s linear infinite' }
    };
  };

  const glitchStyles = getGlitchStyles();

  return (
    <div
      ref={ref}
      className={clsx('relative inline-block', className)}
      style={style}
      onMouseEnter={() => {
        setIsGlitching(true);
        if (!triggerOnHover) {
           setTimeout(() => setIsGlitching(false), 300);
        }
      }}
      onMouseLeave={() => {
        if (triggerOnHover) {
          setIsGlitching(false);
        }
      }}
    >
      <span className="relative z-10 inherit-text-styles">{children}</span>
      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 z-0 opacity-80"
            style={glitchStyles.layer1}
            aria-hidden="true"
          >
            {children}
          </span>
          <span
            className="absolute top-0 left-0 z-0 opacity-80"
            style={glitchStyles.layer2}
            aria-hidden="true"
          >
            {children}
          </span>
        </>
      )}
    </div>
  );
}