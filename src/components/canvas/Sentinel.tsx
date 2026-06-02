'use client';

import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface OrbState {
  y: number; // Current scroll Y position
  targetY: number; // Target scroll Y
  xOffset: number; // Sinusoidal offset
  glow: number; // Glow multiplier based on proximity
  phase: number; // Sinusoidal phase
}

interface TargetCache {
  centerY: number; // Document-relative center Y
}

const ORB_RADIUS = 12;
const BASE_GLOW = 20;
const MAX_GLOW = 60;
const SWEEP_AMPLITUDE = 60; // Max horizontal pixel offset
const SWEEP_FREQUENCY = 0.005; // Frequency of sine wave relative to scroll
const LERP_FACTOR = 0.1; // Smoothness of scroll follow

export default function Sentinel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const prefersReducedMotion = usePrefersReducedMotion();
  // BOLT: Cache target positions to avoid layout thrashing (getBoundingClientRect) in the 60fps loop
  const targetCacheRef = useRef<TargetCache[]>([]);

  const stateRef = useRef<OrbState>({
    y: 0,
    targetY: 0,
    xOffset: 0,
    glow: BASE_GLOW,
    phase: 0,
  });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // BOLT: Centralized cache update to keep the animation loop layout-free
    const updateTargetCache = () => {
      const targets = document.querySelectorAll('[data-orb-target]');
      const scrollY = window.scrollY;
      targetCacheRef.current = Array.from(targets).map(target => {
        const rect = target.getBoundingClientRect();
        return {
          centerY: rect.top + scrollY + rect.height / 2
        };
      });
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      updateTargetCache();
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();

    const onScroll = () => {
      stateRef.current.targetY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial sync

    const checkProximity = (currentY: number) => {
      let maxProximity = 0;
      const viewportCenterY = currentY + height / 2;

      // BOLT: Iterate over cached positions instead of querying the DOM every frame
      const cache = targetCacheRef.current;
      for (let i = 0; i < cache.length; i++) {
        const dist = Math.abs(cache[i].centerY - viewportCenterY);

        // If within 300px, increase glow
        if (dist < 300) {
          const proximity = 1 - (dist / 300);
          if (proximity > maxProximity) maxProximity = proximity;
        }
      }

      return maxProximity;
    };

    // Initial targets update after a short delay to ensure elements are rendered
    const timer = setTimeout(updateTargets, 1000);

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const s = stateRef.current;

      // Smoothly follow scroll
      s.y += (s.targetY - s.y) * LERP_FACTOR;

      // Calculate phase based on scroll position
      s.phase = s.y * SWEEP_FREQUENCY;
      s.xOffset = Math.sin(s.phase) * SWEEP_AMPLITUDE;

      // Calculate proximity glow
      const proximity = checkProximity(s.y);
      const targetGlow = BASE_GLOW + (MAX_GLOW - BASE_GLOW) * proximity;
      s.glow += (targetGlow - s.glow) * LERP_FACTOR;

      // Position: Center X + Sine offset, Center Y
      const cx = width / 2 + s.xOffset;
      const cy = height / 2;

      // Draw Orb Glow
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, s.glow);
      gradient.addColorStop(0, 'rgba(0, 245, 255, 0.8)');
      gradient.addColorStop(0.4, 'rgba(0, 245, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 245, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, s.glow, 0, Math.PI * 2);
      ctx.fill();

      // Draw Orb Core
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(cx, cy, ORB_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[50]"
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    />
  );
}
