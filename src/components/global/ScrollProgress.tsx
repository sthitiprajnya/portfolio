'use client';

import React, { useEffect, useRef } from 'react';

// BOLT: Replaced heavy framer-motion useScroll and useSpring with native vanilla JS.
// This eliminates React render cycle overhead on every scroll event.
// Direct DOM mutation via ref + requestAnimationFrame provides significantly
// smoother 60fps performance without triggering React reconciliation.
export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;

    let rafId: number | null = null;
    let cachedScrollHeight = 0;
    let cachedClientHeight = 0;

    // Smoothness interpolation (spring-like damping)
    let currentScaleY = 0;
    let targetScaleY = 0;
    const LERP_FACTOR = 0.15; // Lower is smoother/slower, higher is snappier

    // Cache scroll height to avoid expensive layout thrashing in the scroll/RAF loop
    const updateDimensions = () => {
      cachedScrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      cachedClientHeight = document.documentElement.clientHeight || window.innerHeight;
      calculateTarget();
    };

    const calculateTarget = () => {
      const maxScroll = cachedScrollHeight - cachedClientHeight;
      if (maxScroll <= 0) {
        targetScaleY = 0;
      } else {
        targetScaleY = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      }

      // Wake up the animation loop if it's sleeping
      if (rafId === null) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const onScroll = () => {
      calculateTarget();
    };

    const draw = () => {
      // Interpolate for smooth spring-like feel
      const diff = targetScaleY - currentScaleY;

      // Only update DOM if the difference is meaningful, to save CPU
      if (Math.abs(diff) > 0.0001) {
        currentScaleY += diff * LERP_FACTOR;
        // Optimization: direct DOM manipulation bypasses React state
        bar.style.transform = `scaleY(${currentScaleY})`;
        rafId = requestAnimationFrame(draw);
      } else {
        // Optimization: Stop the animation loop when fully settled to save CPU and battery
        currentScaleY = targetScaleY;
        bar.style.transform = `scaleY(${currentScaleY})`;
        rafId = null;
      }
    };

    // Use ResizeObserver to reliably track document height changes without polling
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    resizeObserver.observe(document.body);

    // Initial setup
    updateDimensions();

    // Use passive listener to avoid blocking the main thread scroll
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateDimensions, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateDimensions);
      resizeObserver.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed right-0 top-0 bottom-0 w-1 md:w-1.5 z-50 pointer-events-none flex flex-col justify-start bg-black/20 border-l border-white/5">
      <div
        ref={progressRef}
        className="w-full h-full bg-cyan shadow-[0_0_10px_rgba(0,245,255,0.8)] origin-top"
        style={{ transform: 'scaleY(0)', willChange: 'transform' }}
      />
    </div>
  );
}
