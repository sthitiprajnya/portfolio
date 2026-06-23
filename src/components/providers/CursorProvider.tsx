"use client";
import React, { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface CursorProviderProps {
  children: React.ReactNode;
}

/**
 * BOLT: Performance-optimized Cursor Provider
 * ⚡ Implements a 'Sleepy' requestAnimationFrame loop that stops when the cursor is stationary
 * ⚡ Uses translate3d for GPU acceleration and to prevent sub-pixel layout shifts
 * ⚡ Consolidates DOM mutations (opacity/classList) to event handlers rather than the 60fps loop
 * ⚡ Reduces per-event CPU overhead by optimizing interactive element detection
 */
export function CursorProvider({ children }: CursorProviderProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const isClicking = useRef(false);
  const isInitial = useRef(true);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    // BOLT: The 'wake' function ensures the animation loop only runs when there is active movement or state changes
    const wake = () => {
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (isInitial.current) {
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
        isInitial.current = false;
      }
      wake();
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // BOLT: Optimize interactive detection with a single 'closest' call to reduce per-event CPU overhead
      const isInteractive = !!target.closest('a, button, [role="button"], input, textarea');

      if (isHovering.current !== isInteractive) {
        isHovering.current = isInteractive;
        // BOLT: Move DOM class mutations to the event handler instead of every 16ms in the loop
        if (ringRef.current) {
          if (isInteractive) {
            ringRef.current.classList.add('bg-cyan/10', 'border-transparent', 'backdrop-blur-[2px]');
          } else {
            ringRef.current.classList.remove('bg-cyan/10', 'border-transparent', 'backdrop-blur-[2px]');
          }
        }
        wake();
      }
    };

    const handleMouseDown = () => {
      isClicking.current = true;
      wake();
    };
    const handleMouseUp = () => {
      isClicking.current = false;
      wake();
    };

    // BOLT: Use passive event listeners for high-frequency tracking to improve scroll performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    const render = () => {
      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;

      // Lerp for smooth follow (lag)
      ringPos.current.x += dx * 0.15;
      ringPos.current.y += dy * 0.15;

      const dotScale = isClicking.current ? 0.75 : 1;
      const ringScale = isClicking.current ? 0.5 : isHovering.current ? 1.5 : 1;

      // BOLT: Use translate3d to ensure GPU acceleration and prevent sub-pixel layout shifts
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(calc(${mousePos.current.x}px - 50%), calc(${mousePos.current.y}px - 50%), 0) scale(${dotScale})`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(calc(${ringPos.current.x}px - 50%), calc(${ringPos.current.y}px - 50%), 0) scale(${ringScale})`;
      }

      // BOLT: Sleepy Loop - Stop the RAF loop when the cursor is stationary and state is stable
      const isStationary = Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1;
      if (!isStationary || isClicking.current) {
        rafId.current = requestAnimationFrame(render);
      } else {
        rafId.current = null;
      }
    };

    // Initial wake
    wake();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [isTouchDevice, prefersReducedMotion]);

  return (
    <>
      {!isTouchDevice && !prefersReducedMotion && (
        <>
          <div
            ref={dotRef}
            className="custom-cursor-dot"
            style={{
              opacity: 0,
              top: 0,
              left: 0,
              willChange: 'transform'
            }}
          />
          <div
            ref={ringRef}
            className="custom-cursor-ring custom-cursor"
            style={{
              opacity: 0,
              top: 0,
              left: 0,
              willChange: 'transform'
            }}
          />
        </>
      )}
      {children}
    </>
  );
}
