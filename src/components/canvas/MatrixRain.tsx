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

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      // Day 2: Responsive font size
      fontSize = Math.max(12, Math.min(18, window.innerWidth / 80));
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      columns = Math.floor(width / fontSize);

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
    let glitchedColumns: number[] = [];
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

      for (let i = 0; i < dropsLen; i++) {
        // BOLT: Cache calculations and hoist length lookups to optimize 60fps loop
        const x = xCoords[i];
        const y = drops[i] * fontSize;

        // Day 6: Check for glitch column
        const isGlitchedCol = isGlitching && glitchedColumns.includes(i);

        // Day 10: Second pass over trailing characters
        const trailLength = 12;
        for (let j = 1; j <= trailLength; j++) {
          const trailY = y - j * fontSize;
          if (trailY < 0) continue;

          const ratio = j / trailLength;
          // Fade from cyan (0, 245, 255) to dark green (0, 85, 51)
          const g = Math.round(245 - ratio * (245 - 85));
          const b = Math.round(255 - ratio * (255 - 51));
          const opacity = 1 - ratio;

          ctx.fillStyle = isGlitchedCol
            ? `rgba(255, 0, 85, ${opacity})`
            : `rgba(0, ${g}, ${b}, ${opacity})`;

          const trailText = MATRIX_CHARS[Math.floor(fastRand() * charCount)];
          ctx.fillText(trailText, x, trailY);
        }

        // Draw lead character in bright white
        ctx.fillStyle = '#FFFFFF';
        const text = MATRIX_CHARS[Math.floor(fastRand() * charCount)];
        ctx.fillText(text, x, y);

        // Reset drop if at bottom or randomly
        if (y > height && fastRand() > 0.975) {
          drops[i] = 0;
          speeds[i] = 0.3 + fastRand() * 0.6; // Reset speed randomly
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
        glitchedColumns = [];
        for (let i = 0; i < 3; i++) {
          const colIndex = Math.floor(Math.random() * columns);
          glitchedColumns.push(colIndex);
          drops[colIndex] = 0; // Reset to top
        }

        setTimeout(() => {
          isGlitching = false;
          glitchedColumns = [];
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
