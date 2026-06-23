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

    // BOLT: "Sleepy" animation pattern - only run the loop when the cursor is moving or interacting.
    // This significantly reduces idle CPU usage and saves battery on mobile/laptops.
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
      // BOLT: Optimized interactive element detection utilizing a single closest() call
      // which is more efficient than multiple iterative tagName and manual closest checks.
      const isInteractive = !!target.closest('a, button, [role="button"], input, textarea');

      if (isHovering.current !== isInteractive) {
        isHovering.current = isInteractive;
        if (ringRef.current) {
          if (isInteractive) {
            ringRef.current.classList.add('bg-cyan/10', 'border-transparent', 'backdrop-blur-[2px]');
          } else {
            ringRef.current.classList.remove('bg-cyan/10', 'border-transparent', 'backdrop-blur-[2px]');
          }
        }
      }
      wake();
    };

    const handleMouseDown = () => {
      isClicking.current = true;
      wake();
    };
    const handleMouseUp = () => {
      isClicking.current = false;
      wake();
    };

    const render = () => {
      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;

      // Lerp for smooth follow (lag)
      ringPos.current.x += dx * 0.15;
      ringPos.current.y += dy * 0.15;

      if (dotRef.current) {
        const dotScale = isClicking.current ? 0.75 : 1;
        // BOLT: Use translate3d for hardware acceleration and layer promotion
        dotRef.current.style.transform = `translate3d(calc(${mousePos.current.x}px - 50%), calc(${mousePos.current.y}px - 50%), 0) scale(${dotScale})`;
      }

      if (ringRef.current) {
        const scale = isClicking.current ? 0.5 : isHovering.current ? 1.5 : 1;
        // BOLT: Use translate3d for hardware acceleration and layer promotion
        ringRef.current.style.transform = `translate3d(calc(${ringPos.current.x}px - 50%), calc(${ringPos.current.y}px - 50%), 0) scale(${scale})`;
      }

      // Check if settled: positions are close enough AND no active clicking state
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1 && !isClicking.current) {
        animationFrameId = null;
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // BOLT: Adding { passive: true } to high-frequency event listeners to prevent main-thread blocking and layout jank
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup',   handleMouseUp,   { passive: true });

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
