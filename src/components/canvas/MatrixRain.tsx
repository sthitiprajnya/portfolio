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
    let drops: Float32Array;
    let speeds: Float32Array;
    let xCoords: Float32Array;
    let glitchMask: Uint8Array; // BOLT: Bitmask for O(1) glitch column lookup

    // BOLT: Glyph Cache Implementation
    // Pre-rendering characters to an offscreen canvas avoids expensive font rasterization and layout in the 60fps loop.
    const glyphCache = typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(0, 0)
      : document.createElement('canvas');
    const glyphCtx = glyphCache.getContext('2d', { alpha: true }) as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

    const updateGlyphCache = () => {
      const charCount = MATRIX_CHAR_LEN;
      const trailLen = TRAIL_LENGTH + 1;

      // Padding to prevent subpixel bleeding
      const cellW = Math.ceil(fontSize * 1.5);
      const cellH = Math.ceil(fontSize * 1.5);

      glyphCache.width = charCount * cellW;
      glyphCache.height = trailLen * 2 * cellH;

      glyphCtx.font = `${fontSize}px "JetBrains Mono", monospace`;
      glyphCtx.textAlign = 'center';
      glyphCtx.textBaseline = 'middle';

      // Render normal trail colors
      for (let j = 0; j < trailLen; j++) {
        glyphCtx.fillStyle = TRAIL_COLORS[j];
        for (let i = 0; i < charCount; i++) {
          glyphCtx.fillText(
            MATRIX_CHARS[i],
            i * cellW + cellW / 2,
            j * cellH + cellH / 2
          );
        }
      }

      // Render glitch trail colors
      for (let j = 0; j < trailLen; j++) {
        glyphCtx.fillStyle = GLITCH_TRAIL_COLORS[j];
        for (let i = 0; i < charCount; i++) {
          glyphCtx.fillText(
            MATRIX_CHARS[i],
            i * cellW + cellW / 2,
            (trailLen + j) * cellH + cellH / 2
          );
        }
      }

      return { cellW, cellH };
    };

    let cacheMeta = { cellW: 0, cellH: 0 };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      // Day 2: Responsive font size
      fontSize = Math.max(12, Math.min(18, window.innerWidth / 80));
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      cacheMeta = updateGlyphCache();

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

    // Day 6: Glitch Burst state
    let isGlitching = false;
    let glitchTimeoutId: ReturnType<typeof setTimeout>;

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      const dropsLen = drops.length;
      const charCount = MATRIX_CHAR_LEN;
      const { cellW, cellH } = cacheMeta;
      const trailLen = TRAIL_LENGTH + 1;

      // BOLT: Use hardware-accelerated drawImage() with pre-rendered glyph cache.
      // This eliminates the bottleneck of font rasterization and text layout in every frame.
      // Complexity: O(N * T) blits, which are significantly cheaper than O(N * T) fillText calls.
      for (let j = TRAIL_LENGTH; j >= 0; j--) {
        // BOLT: Process glitching columns first for this trail level.
        if (isGlitching) {
          const sourceY = (trailLen + j) * cellH;
          for (let i = 0; i < glitchIndices.length; i++) {
            const idx = glitchIndices[i];
            const y = (drops[idx] - j) * fontSize;
            if (y < -fontSize || y > height) continue;

            const charIdx = Math.floor(fastRand() * charCount);
            ctx.drawImage(
              glyphCache as CanvasImageSource,
              charIdx * cellW, sourceY, cellW, cellH,
              xCoords[idx] - (cellW - fontSize) / 2, y - cellH / 2, cellW, cellH
            );
          }
        }

        // Process normal columns for this trail level.
        const sourceY = j * cellH;
        for (let i = 0; i < dropsLen; i++) {
          if (isGlitching && glitchMask[i] === 1) continue;
          const y = (drops[i] - j) * fontSize;
          if (y < -fontSize || y > height) continue;

          const charIdx = Math.floor(fastRand() * charCount);
          ctx.drawImage(
            glyphCache as CanvasImageSource,
            charIdx * cellW, sourceY, cellW, cellH,
            xCoords[i] - (cellW - fontSize) / 2, y - cellH / 2, cellW, cellH
          );
        }
      }

      // BOLT: Single pass for drop updates to maintain logic integrity while separating from batched render calls
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

    // BOLT: Regenerating the random pool is unnecessary for visual effects and adds periodic CPU work.
    // We stick with the initial pool established at module level.

    const glitchIndices: number[] = [];

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
