'use client';

import { useEffect, useRef } from 'react';

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

// BOLT: Hoist static animation constants to module level to avoid redundant allocations on every render
const FREQ_X = 2;
const FREQ_Y = 3;
const DELTA = Math.PI / 4;
const SPEED = 0.0008;
const K_SPRING = 0.045;
const DAMPING = 0.88;
const MOUSE_FORCE = 0.025;
const MOUSE_RANGE = 300;
const MOUSE_RANGE_SQ = MOUSE_RANGE * MOUSE_RANGE;

export default function HeroOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Resize ──────────────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;

      const o = orbRef.current;
      // BOLT: Cache center and Lissajous amplitudes during resize to eliminate per-frame work
      o.cx = canvas.width / 2;
      o.cy = canvas.height / 2;
      o.A = canvas.width * 0.30;
      o.B = canvas.height * 0.22;

      // Reset to centre on resize
      o.x = o.cx;
      o.y = o.cy;
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

    // ── Drawing helpers ──────────────────────────────────────────────
    function drawOrb(x: number, y: number, t: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pulse = 1 + 0.06 * Math.sin(t * 4);    // slow breathing scale
      const r     = 200 * pulse;                      // outer glow radius

      // ── Outer halo (wide, very faint) ────────────────────────────
      const halo = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 1.6);
      halo.addColorStop(0,   'rgba(0, 245, 255, 0.06)');
      halo.addColorStop(0.5, 'rgba(0, 180, 255, 0.03)');
      halo.addColorStop(1,   'rgba(0, 245, 255, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // ── Mid glow ─────────────────────────────────────────────────
      const mid = ctx.createRadialGradient(x, y, 0, x, y, r);
      mid.addColorStop(0,   'rgba(0, 245, 255, 0.18)');
      mid.addColorStop(0.35,'rgba(0, 200, 255, 0.12)');
      mid.addColorStop(0.7, 'rgba(0, 150, 255, 0.05)');
      mid.addColorStop(1,   'rgba(0, 245, 255, 0)');
      ctx.fillStyle = mid;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // ── Core sphere ──────────────────────────────────────────────
      const core = ctx.createRadialGradient(
        x - r * 0.08, y - r * 0.08, 0,
        x, y, r * 0.28
      );
      core.addColorStop(0,   'rgba(255, 255, 255, 0.80)');
      core.addColorStop(0.2, 'rgba(180, 255, 255, 0.65)');
      core.addColorStop(0.5, 'rgba(0,  245, 255, 0.45)');
      core.addColorStop(0.8, 'rgba(0,  160, 255, 0.20)');
      core.addColorStop(1,   'rgba(0,  80,  200, 0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.28, 0, Math.PI * 2);
      ctx.fill();

      // ── Specular highlight ────────────────────────────────────────
      const specX = x - r * 0.06;
      const specY = y - r * 0.09;
      const spec = ctx.createRadialGradient(specX, specY, 0, specX, specY, r * 0.10);
      spec.addColorStop(0,   'rgba(255, 255, 255, 0.70)');
      spec.addColorStop(0.5, 'rgba(255, 255, 255, 0.20)');
      spec.addColorStop(1,   'rgba(255, 255, 255, 0)');
      ctx.fillStyle = spec;
      ctx.beginPath();
      ctx.arc(specX, specY, r * 0.10, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Animation loop ───────────────────────────────────────────────
    let lastTime = 0;

    function tick(now: number) {
      const dt = Math.min(now - lastTime, 32); // cap at ~30fps min
      lastTime  = now;

      const o  = orbRef.current;

      // Advance Lissajous parameter
      o.t += SPEED * dt;

      // BOLT: Use cached viewport dimensions to avoid lookups in the hot loop
      // Target position on Lissajous curve
      const targetX = o.cx + o.A * Math.sin(FREQ_X * o.t + DELTA);
      const targetY = o.cy + o.B * Math.sin(FREQ_Y * o.t);

      // Spring force toward Lissajous path
      let fx = (targetX - o.x) * K_SPRING;
      let fy = (targetY - o.y) * K_SPRING;

      // BOLT: Use squared distance for mouse interaction checks to eliminate expensive Math.sqrt() calls
      // Mouse magnetic influence (repulsion when close, attraction when far)
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

      drawOrb(o.x, o.y, o.t);
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none will-change-transform z-0"
      style={{ willChange: 'transform' }}
      aria-hidden="true"
      role="presentation"
    />
  );
}
