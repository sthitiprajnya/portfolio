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

  // Day 60: Cursor Trail Array
  const trailRef = useRef<Array<{ x: number; y: number }>>(Array(8).fill({ x: 0, y: 0 }));
  const trailIndexRef = useRef(0);
  const trailContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (isInitial.current) {
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
        if (trailContainerRef.current) trailContainerRef.current.style.opacity = '1';
        isInitial.current = false;
      }

      // Day 60: Update circular buffer
      trailRef.current[trailIndexRef.current] = { x: e.clientX, y: e.clientY };
      trailIndexRef.current = (trailIndexRef.current + 1) % 8;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = !!(
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea')
      );

      isHovering.current = isInteractive;
      if (ringRef.current) {
        // Day 61: Scale up logic added to `.custom-cursor-ring.active` class behavior manually
        if (isInteractive) {
          ringRef.current.classList.add('bg-cyan/10', 'border-transparent', 'backdrop-blur-[2px]', 'active');
        } else {
          ringRef.current.classList.remove('bg-cyan/10', 'border-transparent', 'backdrop-blur-[2px]', 'active');
        }
      }
    };

    const handleMouseDown = () => {
      isClicking.current = true;
    };
    const handleMouseUp = () => {
      isClicking.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    let animationFrameId: number;

    const render = () => {
      // Lerp for smooth follow (lag)
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;

      if (dotRef.current) {
        const dotScale = isClicking.current ? 0.75 : 1;
        dotRef.current.style.transform = `translate(calc(${mousePos.current.x}px - 50%), calc(${mousePos.current.y}px - 50%)) scale(${dotScale})`;
        // Ensure opacity is 1 after initial movement
        if (!isInitial.current) dotRef.current.style.opacity = '1';
      }

      if (ringRef.current) {
        // Day 61: The 'active' class handles width/height now via CSS, so we only need to position
        const scale = isClicking.current ? 0.5 : 1;
        ringRef.current.style.transform = `translate(calc(${ringPos.current.x}px - 50%), calc(${ringPos.current.y}px - 50%)) scale(${scale})`;

        // Ensure opacity and classes are correct after potential React re-renders
        if (!isInitial.current) {
          ringRef.current.style.opacity = '1';
          if (isHovering.current) {
            ringRef.current.classList.add('bg-cyan/10', 'border-transparent', 'backdrop-blur-[2px]', 'active');
          } else {
            ringRef.current.classList.remove('bg-cyan/10', 'border-transparent', 'backdrop-blur-[2px]', 'active');
          }
        }
      }

      // Day 60: Render trail elements using raw DOM manipulation to avoid React reconciliation
      if (trailContainerRef.current && !isInitial.current) {
        const children = trailContainerRef.current.children;
        const trailLen = trailRef.current.length;

        for (let i = 0; i < trailLen; i++) {
          const child = children[i] as HTMLDivElement;
          if (!child) continue;

          // Oldest point to newest
          const dataIdx = (trailIndexRef.current - 1 - i + trailLen) % trailLen;
          const point = trailRef.current[dataIdx];

          if (point.x === 0 && point.y === 0) continue; // Uninitialized

          const targetOpacity = 1 / (i + 2);
          const targetScale = Math.pow(0.9, i);

          child.style.transform = `translate(calc(${point.x}px - 50%), calc(${point.y}px - 50%)) scale(${targetScale})`;
          child.style.opacity = targetOpacity.toString();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTouchDevice, prefersReducedMotion]);

  return (
    <>
      {!isTouchDevice && !prefersReducedMotion && (
        <>
          <div ref={trailContainerRef} className="fixed inset-0 pointer-events-none z-[10000]" style={{ opacity: 0 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-[4px] h-[4px] bg-cyan rounded-full pointer-events-none top-0 left-0"
                style={{ opacity: 0, transformOrigin: 'center center' }}
              />
            ))}
          </div>
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
