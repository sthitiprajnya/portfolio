"use client";
import React, { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface CursorProviderProps {
  children: React.ReactNode;
}

export function CursorProvider({ children }: CursorProviderProps) {
  // Custom logic to handle touch detection beyond media queries
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Use refs for positions and states to avoid any re-renders from cursor interactions
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const isClicking = useRef(false);
  const isInitial = useRef(true);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    let animationFrameId: number | null = null;

    // BOLT: Sleepy RAF Pattern - The loop only runs when there is meaningful movement or state change.
    // This saves CPU and battery on idle tabs.
    // We use a function declaration for render to ensure it's hoisted and available to wake().
    function render() {
      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;

      // Lerp for smooth follow (lag)
      ringPos.current.x += dx * 0.15;
      ringPos.current.y += dy * 0.15;

      // BOLT: Performance Implementation - Use translate3d for GPU-accelerated positioning.
      if (dotRef.current) {
        const dotScale = isClicking.current ? 0.75 : 1;
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate3d(-50%, -50%, 0) scale(${dotScale})`;
      }

      if (ringRef.current) {
        const scale = isClicking.current ? 0.5 : isHovering.current ? 1.5 : 1;
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate3d(-50%, -50%, 0) scale(${scale})`;
      }

      // BOLT: Sleepy Early-Exit - Stop the RAF loop if the ring has settled at the mouse position
      // and interactive states are stable.
      const distSq = dx * dx + dy * dy;
      if (distSq > 0.01 || isClicking.current) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        animationFrameId = null;
      }
    }

    const wake = () => {
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(render);
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
      // BOLT: Optimize interactive detection with a single closest() call to minimize DOM traversal.
      const isInteractive = !!target.closest('a, button, [role="button"], input, textarea');

      if (isInteractive !== isHovering.current) {
        isHovering.current = isInteractive;
        if (ringRef.current) {
          // BOLT: Move DOM mutations (classList) to the event handler to avoid redundant per-frame writes in the hot loop.
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

    // BOLT: Adding { passive: true } to high-frequency event listeners to prevent main-thread blocking and layout jank
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    wake();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
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
              left: 0
            }}
          />
          <div
            ref={ringRef}
            className="custom-cursor-ring custom-cursor"
            style={{
              opacity: 0,
              top: 0,
              left: 0
            }}
          />
        </>
      )}
      {children}
    </>
  );
}
