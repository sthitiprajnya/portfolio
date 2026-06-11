'use client';

import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface OrbState {
  // Lissajous base position
  t: number;
  // Physical position (spring target)
  x: number;
  y: number;
  // Velocity for spring dynamics
  vx: number;
  vy: number;
  // Mouse influence
  mouseX: number;
  mouseY: number;
  mouseActive: boolean;
  // BOLT: Cache viewport-dependent dimensions to avoid recalculating in the 60fps loop
  cx: number;
  cy: number;
  A: number;
  B: number;
}

// BOLT: Hoist static animation constants to module level to reduce per-frame object property lookups
// ── Lissajous parameters ─────────────────────────────────────────
const FREQ_X = 2;                      // horizontal frequency
const FREQ_Y = 3;                      // vertical frequency (3:2 = classic figure-8 variant)
const PHASE_DELTA = Math.PI / 4;       // phase offset — controls loop "tightness"
const ANIM_SPEED = 0.0008;             // radians per ms — full cycle ≈ 130s

// ── Spring constants ─────────────────────────────────────────────
const K_SPRING    = 0.045;   // restoring force toward Lissajous path
const DAMPING     = 0.88;    // velocity damping (0–1; lower = more damping)
const MOUSE_FORCE = 0.025;   // mouse attraction/repulsion multiplier
const MOUSE_RANGE = 300;     // px radius of mouse influence
const MOUSE_RANGE_SQ = MOUSE_RANGE * MOUSE_RANGE;

export default function HeroOrb() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const orbRef    = useRef<OrbState>({
    t:           0,
    x:           0,
    y:           0,
    vx:          0,
    vy:          0,
    mouseX:      0,
    mouseY:      0,
    mouseActive: false,
    cx:          0,
    cy:          0,
    A:           0,
    B:           0,
  });
  const rafRef = useRef<number>(0);
  const { ref: inViewRef, inView } = useInView({ threshold: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();

  // Combine refs for the canvas element
  const setRefs = (node: HTMLCanvasElement | null) => {
    canvasRef.current = node;
    inViewRef(node);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !inView || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // BOLT: Cache viewport-dependent values in resize handler to avoid redundant lookups and arithmetic in 60fps loop
    let A = 0;
    let B = 0;
    let cx = 0;
    let cy = 0;

    // BOLT: Performance Optimization - Sprite Caching
    // Pre-rendering the orb to a small offscreen canvas (sprite) avoids expensive
    // radial gradient and arc calculations on every 60fps frame.
    const SPRITE_SIZE = 256;
    const spriteCanvas = typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(SPRITE_SIZE, SPRITE_SIZE)
      : document.createElement('canvas');

    if (spriteCanvas instanceof HTMLCanvasElement) {
      spriteCanvas.width = SPRITE_SIZE;
      spriteCanvas.height = SPRITE_SIZE;
    }

    const spriteCtx = spriteCanvas.getContext('2d') as CanvasRenderingContext2D;
    let lastShiftFactor = -1;

    // ── Resize ──────────────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;

      cx = canvas.width / 2;
      cy = canvas.height / 2;
      A = canvas.width * 0.30;
      B = canvas.height * 0.22;

      // Reset to centre on resize
      const o = orbRef.current;
      o.x = cx;
      o.y = cy;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // ── Mouse tracking ───────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      orbRef.current.mouseX      = e.clientX;
      orbRef.current.mouseY      = e.clientY;
      orbRef.current.mouseActive = true;
    };
    const onMouseLeave = () => { orbRef.current.mouseActive = false; };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);

    // ── Touch tracking ───────────────────────────────────────────────
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        orbRef.current.mouseX      = e.touches[0].clientX;
        orbRef.current.mouseY      = e.touches[0].clientY;
        orbRef.current.mouseActive = true;
      }
    };
    const onTouchEnd = () => { orbRef.current.mouseActive = false; };
    window.addEventListener('touchstart', onTouchMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    // ── Drawing helpers ──────────────────────────────────────────────
    function updateSprite(t: number) {
      if (!spriteCtx) return;

      const shiftFactor = (Math.sin(t * 0.05) + 1) / 2;
      // BOLT: Only redraw the sprite when the color shift changes more than 0.5%.
      // This saves unnecessary CPU/GPU work on most frames.
      if (Math.abs(shiftFactor - lastShiftFactor) < 0.005 && lastShiftFactor !== -1) return;
      lastShiftFactor = shiftFactor;

      const center = SPRITE_SIZE / 2;
      const r = 60; // Base radius for the sprite

      spriteCtx.clearRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

      const r_core = 0 + (191 - 0) * shiftFactor;
      const g_core = 245 + (0 - 245) * shiftFactor;
      const b_core = 255 + (255 - 255) * shiftFactor;

      // ── Outer halo ───────────────────────────────────────────────
      const halo = spriteCtx.createRadialGradient(center, center, r * 0.6, center, center, r * 1.6);
      halo.addColorStop(0,   `rgba(${Math.round(r_core)}, ${Math.round(g_core)}, ${Math.round(b_core)}, 0.06)`);
      halo.addColorStop(0.5, `rgba(${Math.round(r_core)}, ${Math.round(g_core*0.75)}, ${Math.round(b_core)}, 0.03)`);
      halo.addColorStop(1,   `rgba(${Math.round(r_core)}, ${Math.round(g_core)}, ${Math.round(b_core)}, 0)`);
      spriteCtx.fillStyle = halo;
      spriteCtx.beginPath();
      spriteCtx.arc(center, center, r * 1.6, 0, Math.PI * 2);
      spriteCtx.fill();

      // ── Mid glow ─────────────────────────────────────────────────
      const mid = spriteCtx.createRadialGradient(center, center, 0, center, center, r);
      mid.addColorStop(0,   `rgba(${Math.round(r_core)}, ${Math.round(g_core)}, ${Math.round(b_core)}, 0.18)`);
      mid.addColorStop(0.35,`rgba(${Math.round(r_core)}, ${Math.round(g_core*0.8)}, ${Math.round(b_core)}, 0.12)`);
      mid.addColorStop(0.7, `rgba(${Math.round(r_core)}, ${Math.round(g_core*0.6)}, ${Math.round(b_core)}, 0.05)`);
      mid.addColorStop(1,   `rgba(${Math.round(r_core)}, ${Math.round(g_core)}, ${Math.round(b_core)}, 0)`);
      spriteCtx.fillStyle = mid;
      spriteCtx.beginPath();
      spriteCtx.arc(center, center, r, 0, Math.PI * 2);
      spriteCtx.fill();

      // ── Core sphere ──────────────────────────────────────────────
      const core = spriteCtx.createRadialGradient(
        center - r * 0.08, center - r * 0.08, 0,
        center, center, r * 0.28
      );
      core.addColorStop(0,   `rgba(180, 255, 255, 0.80)`);
      core.addColorStop(0.2, `rgba(180, 255, 255, 0.65)`);
      core.addColorStop(0.5, `rgba(${Math.round(r_core)}, ${Math.round(g_core)}, ${Math.round(b_core)}, 0.45)`);
      core.addColorStop(0.8, `rgba(${Math.round(r_core)}, ${Math.round(g_core*0.65)}, ${Math.round(b_core*0.8)}, 0.20)`);
      core.addColorStop(1,   `rgba(${Math.round(r_core)}, ${Math.round(g_core*0.3)}, ${Math.round(b_core*0.8)}, 0)`);
      spriteCtx.fillStyle = core;
      spriteCtx.beginPath();
      spriteCtx.arc(center, center, r * 0.28, 0, Math.PI * 2);
      spriteCtx.fill();

      // ── Specular highlight ───────────────────────────────────────
      const specX = center - r * 0.06;
      const specY = center - r * 0.09;
      const spec = spriteCtx.createRadialGradient(specX, specY, 0, specX, specY, r * 0.10);
      spec.addColorStop(0,   'rgba(255, 255, 255, 0.70)');
      spec.addColorStop(0.5, 'rgba(255, 255, 255, 0.20)');
      spec.addColorStop(1,   'rgba(255, 255, 255, 0)');
      spriteCtx.fillStyle = spec;
      spriteCtx.beginPath();
      spriteCtx.arc(specX, specY, r * 0.10, 0, Math.PI * 2);
      spriteCtx.fill();
    }

    // ── Animation loop ───────────────────────────────────────────────
    let lastTime = 0;

    function tick(now: number) {
      const dt = Math.min(now - lastTime, 32); // cap at ~30fps min
      lastTime  = now;

      const o  = orbRef.current;

      // Advance Lissajous parameter
      o.t += ANIM_SPEED * dt;

      // BOLT: Use cached viewport dimensions to avoid lookups in the hot loop
      // Target position on Lissajous curve
      const targetX = cx + A * Math.sin(FREQ_X * o.t + PHASE_DELTA);
      const targetY = cy + B * Math.sin(FREQ_Y * o.t);

      // Spring force toward Lissajous path
      let fx = (targetX - o.x) * K_SPRING;
      let fy = (targetY - o.y) * K_SPRING;

      // BOLT: Optimize mouse interaction with squared distance check before executing Math.sqrt, saving CPU cycles
      if (o.mouseActive) {
        const dx   = o.mouseX - o.x;
        const dy   = o.mouseY - o.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < MOUSE_RANGE_SQ && distSq > 1) {
          const dist = Math.sqrt(distSq);
          // Inside range: gentle repulsion
          const strength = MOUSE_FORCE * (1 - dist / MOUSE_RANGE);
          fx -= (dx / dist) * strength * 80;
          fy -= (dy / dist) * strength * 80;
        }
      }

      // Integrate velocity
      o.vx = (o.vx + fx) * DAMPING;
      o.vy = (o.vy + fy) * DAMPING;

      // Integrate position
      o.x += o.vx;
      o.y += o.vy;

      // BOLT: Use pre-rendered sprite for drawing.
      // drawImage() is hardware-accelerated and much faster than re-calculating gradients.
      updateSprite(o.t);
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const pulse = 1 + 0.06 * Math.sin(o.t * 4);
        const drawSize = SPRITE_SIZE * pulse;
        ctx.drawImage(spriteCanvas as CanvasImageSource, o.x - drawSize / 2, o.y - drawSize / 2, drawSize, drawSize);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchstart', onTouchMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [inView, prefersReducedMotion]);

  return (
    <canvas
      ref={setRefs}
      className="absolute inset-0 w-full h-full pointer-events-none will-change-transform z-0"
      style={{ willChange: 'transform' }}
      aria-hidden="true"
      role="presentation"
    />
  );
}
