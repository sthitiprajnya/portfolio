'use client';

import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface OrbState {
  y: number; // Current scroll Y position
  targetY: number; // Target scroll Y
  xOffset: number; // Sinusoidal offset
  glow: number; // Glow multiplier based on proximity
  phase: number; // Sinusoidal phase
  trail: { x: number; y: number }[]; // Circular buffer for trail positions
  trailIndex: number; // Index for circular buffer
}

interface TargetCache {
  centerY: number; // Document-relative center Y
}

const BASE_GLOW = 20;
const MAX_GLOW = 60;

const SECTION_THEMES: Record<string, {
  core: string;       // rgba for the solid inner core
  mid: string;        // rgba for mid-glow ring
  halo: string;       // rgba for outer halo
  specular: string;   // rgba for highlight
}> = {
  hero:           { core: 'rgba(0,245,255,1)',   mid: 'rgba(0,200,255,0.4)', halo: 'rgba(0,245,255,0.08)', specular: 'rgba(255,255,255,0.9)' },
  about:          { core: 'rgba(191,0,255,1)',   mid: 'rgba(160,0,220,0.4)', halo: 'rgba(191,0,255,0.08)', specular: 'rgba(220,180,255,0.8)' },
  skills:         { core: 'rgba(57,255,20,1)',   mid: 'rgba(40,200,10,0.4)', halo: 'rgba(57,255,20,0.08)', specular: 'rgba(200,255,180,0.8)' },
  experience:     { core: 'rgba(255,179,0,1)',   mid: 'rgba(220,150,0,0.4)', halo: 'rgba(255,179,0,0.08)', specular: 'rgba(255,240,180,0.8)' },
  projects:       { core: 'rgba(0,245,255,1)',   mid: 'rgba(0,180,255,0.5)', halo: 'rgba(0,245,255,0.10)', specular: 'rgba(255,255,255,0.9)' },
  writeups:       { core: 'rgba(255,0,85,1)',    mid: 'rgba(220,0,60,0.4)',  halo: 'rgba(255,0,85,0.08)',  specular: 'rgba(255,180,180,0.8)' },
  certifications: { core: 'rgba(0,245,255,1)',   mid: 'rgba(0,200,255,0.4)', halo: 'rgba(0,245,255,0.08)', specular: 'rgba(255,255,255,0.9)' },
  ctf:            { core: 'rgba(255,0,85,1)',    mid: 'rgba(200,0,60,0.5)',  halo: 'rgba(255,0,85,0.10)',  specular: 'rgba(255,200,200,0.8)' },
  github:         { core: 'rgba(57,255,20,1)',   mid: 'rgba(40,200,10,0.4)', halo: 'rgba(57,255,20,0.08)', specular: 'rgba(200,255,180,0.8)' },
  resume:         { core: 'rgba(255,179,0,1)',   mid: 'rgba(220,150,0,0.4)', halo: 'rgba(255,179,0,0.08)', specular: 'rgba(255,240,180,0.8)' },
  contact:        { core: 'rgba(0,245,255,1)',   mid: 'rgba(0,220,255,0.5)', halo: 'rgba(0,245,255,0.12)', specular: 'rgba(255,255,255,0.9)' },
};
function parseRgba(rgba: string) {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return { r: 0, g: 0, b: 0, a: 1 };
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
    a: match[4] !== undefined ? parseFloat(match[4]) : 1,
  };
}

// BOLT: Pre-parse static colors at module level to avoid regex and string parsing in 60fps loop
const PARSED_SECTION_THEMES: Record<string, {
  core: { r: number, g: number, b: number, a: number };
  mid: { r: number, g: number, b: number, a: number };
  halo: { r: number, g: number, b: number, a: number };
  specular: { r: number, g: number, b: number, a: number };
}> = {};

for (const [key, value] of Object.entries(SECTION_THEMES)) {
  PARSED_SECTION_THEMES[key] = {
    core: parseRgba(value.core),
    mid: parseRgba(value.mid),
    halo: parseRgba(value.halo),
    specular: parseRgba(value.specular),
  };
}

const PARSED_VIOLET_THEME = {
  core: parseRgba('rgba(191,0,255,1)'),
  mid: parseRgba('rgba(160,0,220,0.4)'),
  halo: parseRgba('rgba(191,0,255,0.08)'),
  specular: parseRgba('rgba(220,180,255,0.8)'),
};

const DEFAULT_THEME = PARSED_SECTION_THEMES.hero;

function lerpColor(current: number, target: number, factor: number) {
  return current + (target - current) * factor;
}

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
    trail: Array(8).fill({ x: 0, y: 0 }),
    trailIndex: 0,
  });

  const targetThemeRef = useRef(DEFAULT_THEME);
  const colorProximityRef = useRef(0);

  // Day 12: Ring ripple state
  const rippleRef = useRef({
    active: false,
    startTime: 0,
    triggered: false, // Prevents multiple rapid triggers
  });

  const currentColorRef = useRef({
    coreR: 0, coreG: 245, coreB: 255, coreA: 1,
    midR:  0, midG:  200, midB:  255, midA: 0.4,
    haloR: 0, haloG: 245, haloB: 255, haloA: 0.08,
    specR: 255, specG: 255, specB: 255, specA: 0.9,
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

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          const id = entry.target.id;
          if (PARSED_SECTION_THEMES[id]) {
            targetThemeRef.current = PARSED_SECTION_THEMES[id];
          }
        }
      });
    }, { threshold: [0.3, 0.6] });

    document.querySelectorAll('section[id], main[id]').forEach(el => {
      sectionObserver.observe(el);
    });

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

    // Day 8: Proximity for #ctf element specifically to shift color to violet
    const checkCtfProximity = (currentY: number) => {
      const ctfElement = document.getElementById('ctf');
      if (!ctfElement) return 0;

      const rect = ctfElement.getBoundingClientRect();
      const centerY = rect.top + window.scrollY + rect.height / 2;
      const viewportCenterY = currentY + height / 2;
      const dist = Math.abs(centerY - viewportCenterY);

      if (dist < 400) {
        return 1 - (dist / 400);
      }
      return 0;
    };

    // Initial targets update after a short delay to ensure elements are rendered
    const timer = setTimeout(updateTargetCache, 1000);

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

      // Day 12: Trigger ripple if proximity exceeds 0.85
      if (proximity > 0.85 && !rippleRef.current.triggered && !rippleRef.current.active) {
        rippleRef.current.active = true;
        rippleRef.current.startTime = Date.now();
        rippleRef.current.triggered = true;
      } else if (proximity < 0.5) {
        // Reset trigger when moving away
        rippleRef.current.triggered = false;
      }

      // Day 8: Update color proximity specifically for #ctf
      const ctfProx = checkCtfProximity(s.y);
      colorProximityRef.current += (ctfProx - colorProximityRef.current) * LERP_FACTOR;

      // Position: Center X + Sine offset, Center Y
      const cx = width / 2 + s.xOffset;
      const cy = height / 2;

      // Update trail buffer
      s.trail[s.trailIndex] = { x: cx, y: cy + s.y - stateRef.current.targetY }; // Adjusted for visual motion
      s.trailIndex = (s.trailIndex + 1) % 8;

      // Use pre-parsed target colors directly
      const tCore = targetThemeRef.current.core;
      const tMid = targetThemeRef.current.mid;
      const tHalo = targetThemeRef.current.halo;
      const tSpec = targetThemeRef.current.specular;

      const cur = currentColorRef.current;
      const COLOR_LERP = 0.04;

      // Lerp current colors
      cur.coreR = lerpColor(cur.coreR, tCore.r, COLOR_LERP);
      cur.coreG = lerpColor(cur.coreG, tCore.g, COLOR_LERP);
      cur.coreB = lerpColor(cur.coreB, tCore.b, COLOR_LERP);
      cur.coreA = lerpColor(cur.coreA, tCore.a, COLOR_LERP);

      cur.midR = lerpColor(cur.midR, tMid.r, COLOR_LERP);
      cur.midG = lerpColor(cur.midG, tMid.g, COLOR_LERP);
      cur.midB = lerpColor(cur.midB, tMid.b, COLOR_LERP);
      cur.midA = lerpColor(cur.midA, tMid.a, COLOR_LERP);

      cur.haloR = lerpColor(cur.haloR, tHalo.r, COLOR_LERP);
      cur.haloG = lerpColor(cur.haloG, tHalo.g, COLOR_LERP);
      cur.haloB = lerpColor(cur.haloB, tHalo.b, COLOR_LERP);
      cur.haloA = lerpColor(cur.haloA, tHalo.a, COLOR_LERP);

      cur.specR = lerpColor(cur.specR, tSpec.r, COLOR_LERP);
      cur.specG = lerpColor(cur.specG, tSpec.g, COLOR_LERP);
      cur.specB = lerpColor(cur.specB, tSpec.b, COLOR_LERP);
      cur.specA = lerpColor(cur.specA, tSpec.a, COLOR_LERP);

      // Day 8: Apply violet override based on ctf proximity using pre-parsed constants
      const vCore = PARSED_VIOLET_THEME.core;
      const vMid = PARSED_VIOLET_THEME.mid;
      const vHalo = PARSED_VIOLET_THEME.halo;
      const vSpec = PARSED_VIOLET_THEME.specular;
      const p = colorProximityRef.current;

      const finalCoreR = lerpColor(cur.coreR, vCore.r, p);
      const finalCoreG = lerpColor(cur.coreG, vCore.g, p);
      const finalCoreB = lerpColor(cur.coreB, vCore.b, p);
      const finalCoreA = lerpColor(cur.coreA, vCore.a, p);

      const finalMidR = lerpColor(cur.midR, vMid.r, p);
      const finalMidG = lerpColor(cur.midG, vMid.g, p);
      const finalMidB = lerpColor(cur.midB, vMid.b, p);
      const finalMidA = lerpColor(cur.midA, vMid.a, p);

      const finalHaloR = lerpColor(cur.haloR, vHalo.r, p);
      const finalHaloG = lerpColor(cur.haloG, vHalo.g, p);
      const finalHaloB = lerpColor(cur.haloB, vHalo.b, p);
      const finalHaloA = lerpColor(cur.haloA, vHalo.a, p);

      const finalSpecR = lerpColor(cur.specR, vSpec.r, p);
      const finalSpecG = lerpColor(cur.specG, vSpec.g, p);
      const finalSpecB = lerpColor(cur.specB, vSpec.b, p);
      const finalSpecA = lerpColor(cur.specA, vSpec.a, p);

      const coreColor = `rgba(${Math.round(finalCoreR)},${Math.round(finalCoreG)},${Math.round(finalCoreB)},${finalCoreA})`;
      const midColor = `rgba(${Math.round(finalMidR)},${Math.round(finalMidG)},${Math.round(finalMidB)},${finalMidA})`;
      const haloColor = `rgba(${Math.round(finalHaloR)},${Math.round(finalHaloG)},${Math.round(finalHaloB)},${finalHaloA})`;
      const specColor = `rgba(${Math.round(finalSpecR)},${Math.round(finalSpecG)},${Math.round(finalSpecB)},${finalSpecA})`;

      const pulse = 1 + 0.08 * Math.sin(Date.now() * 0.002);
      const r = (s.glow + pulse * 10) * 2; // Making it significantly larger as requested

      // 0. Trail effect
      const trailLen = s.trail.length;
      for (let i = 0; i < trailLen; i++) {
        // Read buffer from newest to oldest
        const idx = (s.trailIndex - 1 - i + trailLen) % trailLen;
        const pt = s.trail[idx];

        // Skip uninitialized points
        if (pt.x === 0 && pt.y === 0) continue;

        const opacity = 0.3 * (1 - i / trailLen);
        if (opacity <= 0) continue;

        ctx.fillStyle = `rgba(0, 245, 255, ${opacity})`;
        ctx.beginPath();
        // The trail is offset slightly based on the current orb movement to visually drag behind
        const trailY = cy - (s.targetY - s.y) * 0.5 * (i + 1);
        ctx.arc(pt.x, trailY, r * 0.15 * (1 - i / trailLen), 0, Math.PI * 2);
        ctx.fill();
      }

      // 1. Outer halo
      const halo = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 1.8);
      halo.addColorStop(0, haloColor);
      halo.addColorStop(1, `rgba(${Math.round(finalHaloR)},${Math.round(finalHaloG)},${Math.round(finalHaloB)},0)`);

      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // 2. Mid glow
      const mid = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      mid.addColorStop(0.35, midColor);
      mid.addColorStop(1, `rgba(${Math.round(finalMidR)},${Math.round(finalMidG)},${Math.round(finalMidB)},0)`);

      ctx.fillStyle = mid;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // 3. Core sphere
      const core = ctx.createRadialGradient(
        cx - r * 0.08, cy - 0.08, 0,
        cx, cy, r * 0.25
      );
      core.addColorStop(0, coreColor);
      core.addColorStop(1, `rgba(${Math.round(finalCoreR)},${Math.round(finalCoreG)},${Math.round(finalCoreB)},0)`);

      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // 4. Specular highlight
      const spec = ctx.createRadialGradient(
        cx - r * 0.06, cy - r * 0.09, 0,
        cx - r * 0.06, cy - r * 0.09, r * 0.08
      );
      spec.addColorStop(0, specColor);
      spec.addColorStop(1, `rgba(${Math.round(finalSpecR)},${Math.round(finalSpecG)},${Math.round(finalSpecB)},0)`);

      ctx.fillStyle = spec;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Day 12: Ring ripple animation
      if (rippleRef.current.active) {
        const elapsed = Date.now() - rippleRef.current.startTime;
        const duration = 800; // 800ms

        if (elapsed >= duration) {
          rippleRef.current.active = false;
        } else {
          const progress = elapsed / duration;
          // Easing out
          const easeOut = 1 - Math.pow(1 - progress, 3);

          const rippleRadius = (BASE_GLOW * 2) + ((MAX_GLOW * 2) - (BASE_GLOW * 2)) * easeOut;
          const rippleOpacity = 1 - easeOut; // Fade out as it expands

          ctx.strokeStyle = `rgba(${Math.round(finalCoreR)},${Math.round(finalCoreG)},${Math.round(finalCoreB)},${rippleOpacity * 0.8})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, rippleRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

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
