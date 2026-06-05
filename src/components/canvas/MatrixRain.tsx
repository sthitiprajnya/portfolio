"use client";
import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useInView } from 'react-intersection-observer';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface MatrixRainProps {
  className?: string;
  opacity?: number;
}

// BOLT: Hoist static data outside component to avoid redundant creation on every mount/effect run
const MATRIX_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0x&&||>><<'.split('');
const MATRIX_CHAR_LEN = MATRIX_CHARS.length;

// BOLT: Pre-calculate trail colors and length to eliminate string allocations and redundant math in 60fps loop
const TRAIL_LENGTH = 12;
const TRAIL_COLORS = Array.from({ length: TRAIL_LENGTH }, (_, k) => {
  const j = k + 1;
  const ratio = j / TRAIL_LENGTH;
  const g = Math.round(245 - ratio * (245 - 85));
  const b = Math.round(255 - ratio * (255 - 51));
  const opacity = 1 - ratio;
  return `rgba(0, ${g}, ${b}, ${opacity})`;
});

const GLITCH_TRAIL_COLORS = Array.from({ length: TRAIL_LENGTH }, (_, k) => {
  const j = k + 1;
  const opacity = 1 - (j / TRAIL_LENGTH);
  return `rgba(255, 0, 85, ${opacity})`;
});

export default function MatrixRain({ className, opacity = 0.055 }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();

  // Combine refs for the canvas element
  const setRefs = (node: HTMLCanvasElement | null) => {
    canvasRef.current = node;
    inViewRef(node);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion || !inView) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width: number;
    let height: number;

    let fontSize = 18;
    let columns: number;
    let drops: number[];
    let speeds: number[];
    let xCoords: number[];
    // BOLT: Use a Uint8Array bitmask for O(1) glitch column lookups, avoiding .includes() overhead
    let glitchedColumnsMask: Uint8Array;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      // Day 2: Responsive font size
      fontSize = Math.max(12, Math.min(18, window.innerWidth / 80));
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      columns = Math.floor(width / fontSize);
      glitchedColumnsMask = new Uint8Array(columns);

      drops = [];
      speeds = [];
      xCoords = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100; // Start at random negative y positions
        speeds[i] = 0.3 + Math.random() * 0.6; // Speed between 0.3 and 0.9
        xCoords[i] = i * fontSize;
      }
    };

    // Day 6: Glitch Burst state
    let isGlitching = false;
    let glitchTimeoutId: ReturnType<typeof setTimeout>;

    const RAND_POOL_SIZE = 2048;
    const randPool = new Float32Array(RAND_POOL_SIZE);
    let poolIdx = 0;
    for (let i = 0; i < RAND_POOL_SIZE; i++) {
      randPool[i] = Math.random();
    }
    const fastRand = () => {
      poolIdx = (poolIdx + 1) & (RAND_POOL_SIZE - 1);
      return randPool[poolIdx];
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      const dropsLen = drops.length;
      const charCount = MATRIX_CHAR_LEN;

      // BOLT: Restructure loop to iterate by trail index first then by column.
      // This allows batching fillText calls by color, reducing fillStyle changes from O(N*L) to O(L).
      for (let j = 1; j <= TRAIL_LENGTH; j++) {
        const trailColor = TRAIL_COLORS[j - 1];
        const glitchColor = GLITCH_TRAIL_COLORS[j - 1];

        // Normal Trail pass
        ctx.fillStyle = trailColor;
        for (let i = 0; i < dropsLen; i++) {
          if (glitchedColumnsMask[i]) continue;
          const trailY = drops[i] * fontSize - j * fontSize;
          if (trailY < 0 || trailY > height) continue;
          const text = MATRIX_CHARS[Math.floor(fastRand() * charCount)];
          ctx.fillText(text, xCoords[i], trailY);
        }

        // Glitch Trail pass (only if active)
        if (isGlitching) {
          ctx.fillStyle = glitchColor;
          for (let i = 0; i < dropsLen; i++) {
            if (!glitchedColumnsMask[i]) continue;
            const trailY = drops[i] * fontSize - j * fontSize;
            if (trailY < 0 || trailY > height) continue;
            const text = MATRIX_CHARS[Math.floor(fastRand() * charCount)];
            ctx.fillText(text, xCoords[i], trailY);
          }
        }
      }

      // Final pass for Lead characters (Bright White)
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < dropsLen; i++) {
        const x = xCoords[i];
        const y = drops[i] * fontSize;

        if (y >= 0 && y <= height + fontSize) {
          const text = MATRIX_CHARS[Math.floor(fastRand() * charCount)];
          ctx.fillText(text, x, y);
        }

        // Reset drop if at bottom or randomly
        if (y > height && fastRand() > 0.975) {
          drops[i] = 0;
          speeds[i] = 0.3 + fastRand() * 0.6;
        }

        // Move drop
        drops[i] += speeds[i];
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const intervalId = setInterval(() => {
      for (let i = 0; i < RAND_POOL_SIZE; i++) {
        randPool[i] = Math.random();
      }
    }, 5000);

    // Day 6: Glitch burst scheduler
    const scheduleGlitch = () => {
      const nextGlitchTime = 12000 + Math.random() * 6000; // 12-18 seconds
      glitchTimeoutId = setTimeout(() => {
        isGlitching = true;
        for (let i = 0; i < 3; i++) {
          const colIndex = Math.floor(Math.random() * columns);
          glitchedColumnsMask[colIndex] = 1;
          drops[colIndex] = 0; // Reset to top
        }

        setTimeout(() => {
          isGlitching = false;
          glitchedColumnsMask.fill(0);
        }, 500); // 500ms duration

        scheduleGlitch();
      }, nextGlitchTime);
    };

    scheduleGlitch();

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
      clearTimeout(glitchTimeoutId);
    };
  }, [prefersReducedMotion, inView]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={setRefs}
      className={clsx("absolute inset-0 pointer-events-none z-0", className)}
      style={{ opacity }}
    />
  );
}
