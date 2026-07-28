import { useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect } from 'react';

export function useCardTilt() {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(x, { stiffness: 250, damping: 28 });
  const rotateY = useSpring(y, { stiffness: 250, damping: 28 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Disable tilt on touch devices or low-memory devices to avoid unnecessary work
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const deviceMemory = typeof navigator !== 'undefined' && (navigator as any).deviceMemory ? (navigator as any).deviceMemory : 8;
    const isLowEnd = deviceMemory < 2;
    if (isTouch || isLowEnd) return;

    // Cache document-relative bounds to avoid recalculating on scroll
    let docRect: { top: number; left: number; width: number; height: number } | null = null;

    const updateRect = () => {
      const rect = el.getBoundingClientRect();
      docRect = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      };
    };

    const handleMouseEnter = () => {
      updateRect();
    };

    // rAF-batched mousemove handler to avoid thousands of synchronous updates
    let pending = false;
    let lastEvent: MouseEvent | null = null;
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      // store last event and schedule a rAF to process
      lastEvent = e;
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(() => {
        pending = false;
        if (!docRect || !lastEvent) return;
        const e2 = lastEvent;
        // Calculate the current viewport-relative position
        const currentTop = docRect.top - window.scrollY;
        const currentLeft = docRect.left - window.scrollX;

        const centerX = currentLeft + docRect.width / 2;
        const centerY = currentTop + docRect.height / 2;

        const px = e2.clientX - centerX;
        const py = e2.clientY - centerY;

        // Max rotation: ±10 degrees
        const rx = (py / (docRect.height / 2)) * -10;
        const ry = (px / (docRect.width / 2)) * 10;

        x.set(rx);
        y.set(ry);

        mouseX.set(e2.clientX - currentLeft);
        mouseY.set(e2.clientY - currentTop);

        el.style.setProperty('--mouse-x', `${e2.clientX - currentLeft}px`);
        el.style.setProperty('--mouse-y', `${e2.clientY - currentTop}px`);
      });
    };

    const handleMouseLeave = () => {
      docRect = null;
      x.set(0);
      y.set(0);
      el.style.setProperty('--mouse-x', `-1000px`);
      el.style.setProperty('--mouse-y', `-1000px`);
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
        pending = false;
      }
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    // rAF-batched listener — passive is safe as we don't call preventDefault
    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', updateRect, { passive: true });

    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', updateRect);
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
        pending = false;
      }
    };
  }, [x, y, mouseX, mouseY]);

  return { ref, rotateX, rotateY };
}
