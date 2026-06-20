"use client";
import React, { useRef, useEffect, useCallback } from 'react';
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

// BOLT: Pre-calculate trail color strings at the module level to eliminate ~1,200 string allocations per frame.
const TRAIL_LENGTH = 12;
const TRAIL_COLORS = Array.from({ length: TRAIL_LENGTH + 1 }, (_, j) => {
  if (j === 0) return '#FFFFFF'; // Lead character
  const ratio = j / TRAIL_LENGTH;
  // Fade from cyan (0, 245, 255) to dark green (0, 85, 51)
  const g = Math.round(245 - ratio * (245 - 85));
  const b = Math.round(255 - ratio * (255 - 51));
  const opacity = 1 - ratio;
  return `rgba(0, ${g}, ${b}, ${opacity})`;
});

const GLITCH_TRAIL_COLORS = Array.from({ length: TRAIL_LENGTH + 1 }, (_, j) => {
  if (j === 0) return '#FFFFFF'; // Lead character remains white even in glitch
  const ratio = j / TRAIL_LENGTH;
  const opacity = 1 - ratio;
  return `rgba(255, 0, 85, ${opacity})`;
});

// BOLT: Hoist random pool to module level to avoid redundant allocations and re-initialization on every mount.
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

export default function MatrixRain({ className, opacity = 0.055 }: MatrixRainProps) {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();

  // BOLT: Use a callback ref to properly handle dual-ref requirement (canvas access + IntersectionObserver)
  const setRefs = useCallback((node: HTMLCanvasElement | null) => {
    canvasElementRef.current = node;
    inViewRef(node);
  }, [inViewRef]);

  useEffect(() => {
    const canvas = canvasElementRef.current;
    if (!canvas || prefersReducedMotion || !inView) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width: number;
    let height: number;

    let fontSize = 18;
    let columns: number;
    let drops: Float32Array;
    let speeds: Float32Array;
    let xCoords: Float32Array;
    let glitchMask: Uint8Array; // BOLT: Bitmask for O(1) glitch column lookup

    // BOLT: Glyph caching to avoid expensive ctx.fillText() in the 60fps loop.
    const glyphCacheCanvas = typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(0, 0)
      : document.createElement('canvas');
    const glyphCtx = glyphCacheCanvas.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

    const updateGlyphCache = () => {
      glyphCtx.clearRect(0, 0, glyphCacheCanvas.width, glyphCacheCanvas.height);
      glyphCtx.font = `${fontSize}px "JetBrains Mono", monospace`;
      glyphCtx.textAlign = 'left';
      glyphCtx.textBaseline = 'top';

      for (let j = 0; j <= TRAIL_LENGTH; j++) {
        // Normal Trail
        glyphCtx.fillStyle = TRAIL_COLORS[j];
        for (let i = 0; i < MATRIX_CHAR_LEN; i++) {
          glyphCtx.fillText(MATRIX_CHARS[i], i * fontSize, j * fontSize);
        }
        // Glitch Trail
        glyphCtx.fillStyle = GLITCH_TRAIL_COLORS[j];
        for (let i = 0; i < MATRIX_CHAR_LEN; i++) {
          glyphCtx.fillText(MATRIX_CHARS[i], i * fontSize, (TRAIL_LENGTH + 1 + j) * fontSize);
        }
      }
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      // Day 2: Responsive font size
      fontSize = Math.max(12, Math.min(18, window.innerWidth / 80));

      if (glyphCacheCanvas instanceof HTMLCanvasElement) {
        glyphCacheCanvas.width = fontSize * MATRIX_CHAR_LEN;
        glyphCacheCanvas.height = fontSize * (TRAIL_LENGTH + 1) * 2;
      } else {
        // OffscreenCanvas
        glyphCacheCanvas.width = fontSize * MATRIX_CHAR_LEN;
        glyphCacheCanvas.height = fontSize * (TRAIL_LENGTH + 1) * 2;
      }

      updateGlyphCache();

      columns = Math.floor(width / fontSize);

      // BOLT: Use TypedArrays for better performance and memory efficiency in the hot loop.
      drops = new Float32Array(columns);
      speeds = new Float32Array(columns);
      xCoords = new Float32Array(columns);
      glitchMask = new Uint8Array(columns);

      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100; // Start at random negative y positions
        speeds[i] = 0.3 + Math.random() * 0.6; // Speed between 0.3 and 0.9
        xCoords[i] = i * fontSize;
      }
    };

    // Glitch Burst state
    let isGlitching = false;
    let glitchTimeoutId: ReturnType<typeof setTimeout>;
    const glitchIndices: number[] = [];

    window.addEventListener('resize', () => {
      resize();
      updateGlyphCache();
    }, { passive: true });
    resize();

    const draw = () => {
      if (!inView) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      const dropsLen = drops.length;
      const charCount = MATRIX_CHAR_LEN;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const trailLen = TRAIL_LENGTH + 1;

      // BOLT: Performance Implementation - Glyph Caching
      for (let j = TRAIL_LENGTH; j >= 0; j--) {
        // Process glitching columns first for this trail level.
        if (isGlitching) {
          const glitchYOffset = (j + TRAIL_LENGTH + 1) * fontSize;
          for (let i = 0; i < glitchIndices.length; i++) {
            const idx = glitchIndices[i];
            const y = (drops[idx] - j) * fontSize;
            if (y < -fontSize || y > height) continue;

            const charIdx = Math.floor(fastRand() * charCount);
            ctx.drawImage(
              glyphCacheCanvas as CanvasImageSource,
              charIdx * fontSize, glitchYOffset, fontSize, fontSize,
              xCoords[idx], y, fontSize, fontSize
            );
          }
        }

        // Process normal columns for this trail level.
        const normalYOffset = j * fontSize;
        for (let i = 0; i < dropsLen; i++) {
          if (isGlitching && glitchMask[i] === 1) continue;
          const y = (drops[i] - j) * fontSize;
          if (y < -fontSize || y > height) continue;

          const charIdx = Math.floor(fastRand() * charCount);
          ctx.drawImage(
            glyphCacheCanvas as CanvasImageSource,
            charIdx * fontSize, normalYOffset, fontSize, fontSize,
            xCoords[i], y, fontSize, fontSize
          );
        }
      }

      // BOLT: Single pass for drop updates
      for (let i = 0; i < dropsLen; i++) {
        const y = drops[i] * fontSize;
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

    // Day 6: Glitch burst scheduler
    const scheduleGlitch = () => {
      const nextGlitchTime = 12000 + Math.random() * 6000; // 12-18 seconds
      glitchTimeoutId = setTimeout(() => {
        isGlitching = true;
        glitchMask.fill(0);
        glitchIndices.length = 0;
        for (let i = 0; i < 3; i++) {
          const colIndex = Math.floor(Math.random() * columns);
          glitchMask[colIndex] = 1;
          glitchIndices.push(colIndex);
          drops[colIndex] = 0; // Reset to top
        }

        setTimeout(() => {
          isGlitching = false;
          glitchMask.fill(0);
          glitchIndices.length = 0;
        }, 500); // 500ms duration

        scheduleGlitch();
      }, nextGlitchTime);
    };

    scheduleGlitch();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
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
