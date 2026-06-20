'use client';

import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface OrbState {
  y: number; // Current scroll Y position
  targetY: number; // Target scroll Y
  xOffset: number; // Sinusoidal offset
  glow: number; // Glow multiplier based on proximity
  phase: number; // Sinusoidal phase
  trail: Float32Array; // BOLT: Float32Array for O(1) trail updates without GC pressure
  trailIndex: number; // Index for circular buffer
}

const TRAIL_SIZE = 8;

interface TargetCache {
  centerY: number; // Document-relative center Y
}

interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface ParsedTheme {
  core: RgbaColor;
  mid: RgbaColor;
  halo: RgbaColor;
  specular: RgbaColor;
}

const BASE_GLOW = 5; // Minimalistic base glow
const MAX_GLOW = 20; // Only glow heavily when targeted/scrolled near

function lerpColor(current: number, target: number, factor: number) {
  return current + (target - current) * factor;
}

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

const PARSED_SECTION_THEMES = Object.fromEntries(
  Object.entries(SECTION_THEMES).map(([key, theme]) => [
    key,
    {
      core: parseRgba(theme.core),
      mid: parseRgba(theme.mid),
      halo: parseRgba(theme.halo),
      specular: parseRgba(theme.specular),
    }
  ])
) as Record<string, ParsedTheme>;

const DEFAULT_THEME = PARSED_SECTION_THEMES.hero;
const VIOLET_THEME = PARSED_SECTION_THEMES.about;

const SWEEP_AMPLITUDE = 60; // Max horizontal pixel offset
const SWEEP_FREQUENCY = 0.005; // Frequency of sine wave relative to scroll
const LERP_FACTOR = 0.1; // Smoothness of scroll follow

export default function Sentinel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(undefined);
  const prefersReducedMotion = usePrefersReducedMotion();
  const targetCacheRef = useRef<TargetCache[]>([]);
  const ctfCenterYRef = useRef<number | null>(null);
  const lastYRef = useRef<number>(0);

  const stateRef = useRef<OrbState>({
    y: 0,
    targetY: 0,
    xOffset: 0,
    glow: BASE_GLOW,
    phase: 0,
    trail: new Float32Array(16), // 8 points * 2 (x, y)
    trailIndex: 0,
  });

  const targetThemeRef = useRef<ParsedTheme>(DEFAULT_THEME);
  const colorProximityRef = useRef(0);

  const rippleRef = useRef({
    active: false,
    startTime: 0,
    triggered: false,
  });

  const currentColorRef = useRef({
    coreR: DEFAULT_THEME.core.r, coreG: DEFAULT_THEME.core.g, coreB: DEFAULT_THEME.core.b, coreA: DEFAULT_THEME.core.a,
    midR:  DEFAULT_THEME.mid.r,  midG:  DEFAULT_THEME.mid.g,  midB:  DEFAULT_THEME.mid.b,  midA:  DEFAULT_THEME.mid.a,
    haloR: DEFAULT_THEME.halo.r, haloG: DEFAULT_THEME.halo.g, haloB: DEFAULT_THEME.halo.b, haloA: DEFAULT_THEME.halo.a,
    specR: DEFAULT_THEME.specular.r, specG: DEFAULT_THEME.specular.g, specB: DEFAULT_THEME.specular.b, specA: DEFAULT_THEME.specular.a,
  });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // BOLT: Performance Optimization - Sprite Caching
    const SPRITE_SIZE = 256;
    const spriteCanvas = typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(SPRITE_SIZE, SPRITE_SIZE)
      : document.createElement('canvas');

    if (spriteCanvas instanceof HTMLCanvasElement) {
      spriteCanvas.width = SPRITE_SIZE;
      spriteCanvas.height = SPRITE_SIZE;
    }
    const spriteCtx = spriteCanvas.getContext('2d') as CanvasRenderingContext2D;
    // eslint-disable-next-line prefer-const, @typescript-eslint/no-unused-vars
      let lastRenderedColor = { r: -1, g: -1, b: -1, a: -1 };

    let width = window.innerWidth;
    let height = window.innerHeight;

    const updateTargetCache = () => {
      const scrollY = window.scrollY;
      const targets = document.querySelectorAll('[data-orb-target]');
      targetCacheRef.current = Array.from(targets).map(target => {
        const rect = target.getBoundingClientRect();
        return { centerY: rect.top + scrollY + rect.height / 2 };
      });

      const ctfElement = document.getElementById('ctf');
      if (ctfElement) {
        const rect = ctfElement.getBoundingClientRect();
        ctfCenterYRef.current = rect.top + scrollY + rect.height / 2;
      }
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
    onScroll();

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

    let lastR = -1; let lastG = -1; let lastB = -1; let lastA = -1;
    const updateSprite = (
      fCR: number, fCG: number, fCB: number, fCA: number,
      fMR: number, fMG: number, fMB: number, fMA: number,
      fHR: number, fHG: number, fHB: number, fHA: number,
      fSR: number, fSG: number, fSB: number, fSA: number
    ) => {
      if (Math.abs(fCR - lastR) < 1 && Math.abs(fCG - lastG) < 1 && Math.abs(fCB - lastB) < 1 && Math.abs(fCA - lastA) < 0.01) return;
      lastR = fCR; lastG = fCG; lastB = fCB; lastA = fCA;

      const center = SPRITE_SIZE / 2;
      const r = 60;
      const r_base = 60;

      spriteCtx.clearRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

      // 1. Outer halo
      const halo = spriteCtx.createRadialGradient(center, center, r_base * 0.6, center, center, r_base * 1.8);
      halo.addColorStop(0, `rgba(${Math.round(fHR)}, ${Math.round(fHG)}, ${Math.round(fHB)}, ${fHA})`);
      halo.addColorStop(1, `rgba(${Math.round(fHR)}, ${Math.round(fHG)}, ${Math.round(fHB)}, 0)`);
      spriteCtx.fillStyle = halo;
      spriteCtx.beginPath();
      spriteCtx.arc(center, center, r_base * 1.8, 0, Math.PI * 2);
      spriteCtx.fill();

      // 2. Mid glow
      const mid = spriteCtx.createRadialGradient(center, center, 0, center, center, r_base);
      mid.addColorStop(0.35, `rgba(${Math.round(fMR)}, ${Math.round(fMG)}, ${Math.round(fMB)}, ${fMA})`);
      mid.addColorStop(1, `rgba(${Math.round(fMR)}, ${Math.round(fMG)}, ${Math.round(fMB)}, 0)`);
      spriteCtx.fillStyle = mid;
      spriteCtx.beginPath();
      spriteCtx.arc(center, center, r_base, 0, Math.PI * 2);
      spriteCtx.fill();

      // 3. Core sphere
      const coreGrad = spriteCtx.createRadialGradient(
        center - r_base * 0.08, center - r_base * 0.08, 0,
        center, center, r_base * 0.25
      );
      coreGrad.addColorStop(0, `rgba(${Math.round(fCR)}, ${Math.round(fCG)}, ${Math.round(fCB)}, ${fCA})`);
      coreGrad.addColorStop(1, `rgba(${Math.round(fCR)}, ${Math.round(fCG)}, ${Math.round(fCB)}, 0)`);
      spriteCtx.fillStyle = coreGrad;
      spriteCtx.beginPath();
      spriteCtx.arc(center, center, r_base * 0.25, 0, Math.PI * 2);
      spriteCtx.fill();

      // 4. Specular highlight
      const specX = center - r * 0.06;
      const specY = center - r * 0.09;
      const spec = spriteCtx.createRadialGradient(
        specX, specY, 0,
        specX, specY, r_base * 0.08
      );
      spec.addColorStop(0, `rgba(${Math.round(fSR)}, ${Math.round(fSG)}, ${Math.round(fSB)}, ${fSA})`);
      spec.addColorStop(1, `rgba(${Math.round(fSR)}, ${Math.round(fSG)}, ${Math.round(fSB)}, 0)`);
      spriteCtx.fillStyle = spec;
      spriteCtx.beginPath();
      spriteCtx.arc(specX, specY, r_base * 0.08, 0, Math.PI * 2);
      spriteCtx.fill();
    };

    const checkProximity = (currentY: number) => {
      let maxProximity = 0;
      const viewportCenterY = currentY + height / 2;
      const cache = targetCacheRef.current;
      for (let i = 0; i < cache.length; i++) {
        const dist = Math.abs(cache[i].centerY - viewportCenterY);
        if (dist < 300) {
          const proximity = 1 - (dist / 300);
          if (proximity > maxProximity) maxProximity = proximity;
        }
      }
      return maxProximity;
    };

    const checkCtfProximity = (currentY: number) => {
      if (ctfCenterYRef.current === null) return 0;
      const viewportCenterY = currentY + height / 2;
      const dist = Math.abs(ctfCenterYRef.current - viewportCenterY);
      if (dist < 400) return 1 - (dist / 400);
      return 0;
    };

    const timer = setTimeout(updateTargetCache, 1000);

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const s = stateRef.current;

      s.y += (s.targetY - s.y) * LERP_FACTOR;
      s.phase = s.y * SWEEP_FREQUENCY;
      s.xOffset = Math.sin(s.phase) * SWEEP_AMPLITUDE;

      // BOLT: Performance Implementation - Scroll Stability Check
      // Skip expensive proximity calculations and glow physics if the scroll position hasn't moved significantly.
      const isStationary = Math.abs(s.y - lastYRef.current) < 0.1;
      if (!isStationary) {
        const proximity = checkProximity(s.y);
        const targetGlow = BASE_GLOW + (MAX_GLOW - BASE_GLOW) * proximity;
        s.glow += (targetGlow - s.glow) * LERP_FACTOR;

        if (proximity > 0.85 && !rippleRef.current.triggered && !rippleRef.current.active) {
          rippleRef.current.active = true;
          rippleRef.current.startTime = Date.now();
          rippleRef.current.triggered = true;
        } else if (proximity < 0.5) {
          rippleRef.current.triggered = false;
        }

        const ctfProx = checkCtfProximity(s.y);
        colorProximityRef.current += (ctfProx - colorProximityRef.current) * LERP_FACTOR;
        lastYRef.current = s.y;
      }

      const cx = width / 2 + s.xOffset;
      const cy = height / 2;

      s.trail[s.trailIndex * 2] = cx;
      s.trail[s.trailIndex * 2 + 1] = cy + s.y - stateRef.current.targetY;
      s.trailIndex = (s.trailIndex + 1) % 8;

      const tTheme = targetThemeRef.current;
      const cur = currentColorRef.current;
      const COLOR_LERP = 0.04;

      cur.coreR = lerpColor(cur.coreR, tTheme.core.r, COLOR_LERP);
      cur.coreG = lerpColor(cur.coreG, tTheme.core.g, COLOR_LERP);
      cur.coreB = lerpColor(cur.coreB, tTheme.core.b, COLOR_LERP);
      cur.coreA = lerpColor(cur.coreA, tTheme.core.a, COLOR_LERP);
      cur.midR = lerpColor(cur.midR, tTheme.mid.r, COLOR_LERP);
      cur.midG = lerpColor(cur.midG, tTheme.mid.g, COLOR_LERP);
      cur.midB = lerpColor(cur.midB, tTheme.mid.b, COLOR_LERP);
      cur.midA = lerpColor(cur.midA, tTheme.mid.a, COLOR_LERP);
      cur.haloR = lerpColor(cur.haloR, tTheme.halo.r, COLOR_LERP);
      cur.haloG = lerpColor(cur.haloG, tTheme.halo.g, COLOR_LERP);
      cur.haloB = lerpColor(cur.haloB, tTheme.halo.b, COLOR_LERP);
      cur.haloA = lerpColor(cur.haloA, tTheme.halo.a, COLOR_LERP);
      cur.specR = lerpColor(cur.specR, tTheme.specular.r, COLOR_LERP);
      cur.specG = lerpColor(cur.specG, tTheme.specular.g, COLOR_LERP);
      cur.specB = lerpColor(cur.specB, tTheme.specular.b, COLOR_LERP);
      cur.specA = lerpColor(cur.specA, tTheme.specular.a, COLOR_LERP);

      // BOLT: Performance Implementation - Lerp Early-Exit
      // Skip Stage-2 color lerping (mixing in Violet theme) and associated floating-point
      // operations if the orb is not within proximity of the CTF section.
      const p = colorProximityRef.current;
      let finalCoreR = cur.coreR, finalCoreG = cur.coreG, finalCoreB = cur.coreB, finalCoreA = cur.coreA;
      let finalMidR = cur.midR, finalMidG = cur.midG, finalMidB = cur.midB, finalMidA = cur.midA;
      let finalHaloR = cur.haloR, finalHaloG = cur.haloG, finalHaloB = cur.haloB, finalHaloA = cur.haloA;
      let finalSpecR = cur.specR, finalSpecG = cur.specG, finalSpecB = cur.specB, finalSpecA = cur.specA;

      if (p > 0.001) {
        const vCore = VIOLET_THEME.core;
        const vMid = VIOLET_THEME.mid;
        const vHalo = VIOLET_THEME.halo;
        const vSpec = VIOLET_THEME.specular;

        finalCoreR = lerpColor(cur.coreR, vCore.r, p);
        finalCoreG = lerpColor(cur.coreG, vCore.g, p);
        finalCoreB = lerpColor(cur.coreB, vCore.b, p);
        finalCoreA = lerpColor(cur.coreA, vCore.a, p);

        finalMidR = lerpColor(cur.midR, vMid.r, p);
        finalMidG = lerpColor(cur.midG, vMid.g, p);
        finalMidB = lerpColor(cur.midB, vMid.b, p);
        finalMidA = lerpColor(cur.midA, vMid.a, p);

        finalHaloR = lerpColor(cur.haloR, vHalo.r, p);
        finalHaloG = lerpColor(cur.haloG, vHalo.g, p);
        finalHaloB = lerpColor(cur.haloB, vHalo.b, p);
        finalHaloA = lerpColor(cur.haloA, vHalo.a, p);

        finalSpecR = lerpColor(cur.specR, vSpec.r, p);
        finalSpecG = lerpColor(cur.specG, vSpec.g, p);
        finalSpecB = lerpColor(cur.specB, vSpec.b, p);
        finalSpecA = lerpColor(cur.specA, vSpec.a, p);
      }

      // BOLT: Hardware-accelerated drawImage() with sprite caching replaces 4 expensive per-frame radial gradient draws.
      // Reusing static objects to avoid per-frame allocations if needed, but here simple literals are fine for RgbaColor
      updateSprite(
        finalCoreR, finalCoreG, finalCoreB, finalCoreA,
        finalMidR, finalMidG, finalMidB, finalMidA,
        finalHaloR, finalHaloG, finalHaloB, finalHaloA,
        finalSpecR, finalSpecG, finalSpecB, finalSpecA
      );

      const pulse = 1 + 0.08 * Math.sin(Date.now() * 0.002);
      const r_dynamic = (s.glow + pulse * 10) * 2;
      const spriteScale = r_dynamic / 60;

      const trailLen = 8;
      for (let i = 0; i < trailLen; i++) {
        const idx = (s.trailIndex - 1 - i + trailLen) % trailLen;
        const tx = s.trail[idx * 2];
        const ty = s.trail[idx * 2 + 1];
        if (tx === 0 && ty === 0) continue;
        const opacity = 0.3 * (1 - i / TRAIL_SIZE);
        if (opacity <= 0) continue;
        ctx.globalAlpha = opacity;
        const trailScale = spriteScale * 0.15 * (1 - i / trailLen);
        const trailSize = SPRITE_SIZE * trailScale;
        ctx.drawImage(spriteCanvas as CanvasImageSource, tx - trailSize / 2, ty - trailSize / 2, trailSize, trailSize);
      }
      ctx.globalAlpha = 1.0;

      const drawSize = SPRITE_SIZE * spriteScale;
      ctx.drawImage(spriteCanvas as CanvasImageSource, cx - drawSize / 2, cy - drawSize / 2, drawSize, drawSize);

      if (rippleRef.current.active) {
        const elapsed = Date.now() - rippleRef.current.startTime;
        const duration = 800;
        if (elapsed < duration) {
          const rippleProgress = elapsed / duration;
          const easeOut = 1 - Math.pow(1 - rippleProgress, 3);
          const rippleRadius = (BASE_GLOW * 2) + ((MAX_GLOW * 2) - (BASE_GLOW * 2)) * easeOut;
          const rippleOpacity = 1 - easeOut;
          ctx.strokeStyle = `rgba(${Math.round(finalCoreR)},${Math.round(finalCoreG)},${Math.round(finalCoreB)},${rippleOpacity * 0.8})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, rippleRadius, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          rippleRef.current.active = false;
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
      sectionObserver.disconnect();
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
