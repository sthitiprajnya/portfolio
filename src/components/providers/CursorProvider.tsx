"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface CursorProviderProps {
  children: React.ReactNode;
}

/**
 * BOLT: CursorProvider Optimization
 *
 * 1. "Sleepy" Animation Loop: The requestAnimationFrame loop now stops entirely when the
 *    cursor is stationary and all visual states (scale/hover) are stable. It restarts
 *    automatically on mouse movement.
 * 2. GPU Acceleration: Switched from 'translate' to 'translate3d' to force GPU compositing.
 * 3. Efficient Interaction Detection: Replaced multiple DOM traversals in 'mouseover' with
 *    a single 'target.closest()' call.
 * 4. Reduced Per-Frame Work: Moved non-interpolated property updates (scale, opacity, classList)
 *    to event handlers, keeping the RAF loop focused strictly on interpolation.
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

  const wake = useCallback(() => {
    if (rafId.current !== null || isTouchDevice || prefersReducedMotion) return;

    const render = () => {
      // Lerp for smooth follow
      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;

      const LERP = 0.15;
      ringPos.current.x += dx * LERP;
      ringPos.current.y += dy * LERP;

      if (ringRef.current) {
        const scale = isClicking.current ? 0.5 : isHovering.current ? 1.5 : 1;
        ringRef.current.style.transform = `translate3d(calc(${ringPos.current.x}px - 50%), calc(${ringPos.current.y}px - 50%), 0) scale(${scale})`;
      }

      // BOLT: Sleep check - if the ring has caught up and state is stable, stop the loop.
      const distSq = dx * dx + dy * dy;
      if (distSq < 0.001) {
        ringPos.current.x = mousePos.current.x;
        ringPos.current.y = mousePos.current.y;
        rafId.current = null;
      } else {
        rafId.current = requestAnimationFrame(render);
      }
    };

    rafId.current = requestAnimationFrame(render);
  }, [isTouchDevice, prefersReducedMotion]);

  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (dotRef.current) {
        const dotScale = isClicking.current ? 0.75 : 1;
        dotRef.current.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0) scale(${dotScale})`;
        if (isInitial.current) {
          dotRef.current.style.opacity = '1';
        }
      }

      if (isInitial.current) {
        if (ringRef.current) ringRef.current.style.opacity = '1';
        isInitial.current = false;
      }

      wake();
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // BOLT: Single efficient traversal for interactive elements
      const interactive = target.closest('a, button, [role="button"], input, textarea');
      const isInteractive = !!interactive;

      if (isHovering.current !== isInteractive) {
        isHovering.current = isInteractive;
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
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(calc(${mousePos.current.x}px - 50%), calc(${mousePos.current.y}px - 50%), 0) scale(0.75)`;
      }
      wake();
    };

    const handleMouseUp = () => {
      isClicking.current = false;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(calc(${mousePos.current.x}px - 50%), calc(${mousePos.current.y}px - 50%), 0) scale(1)`;
      }
      wake();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isTouchDevice, prefersReducedMotion, wake]);

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
