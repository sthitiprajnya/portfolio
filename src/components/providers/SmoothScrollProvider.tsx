
"use client";
import React, { useEffect, createContext, useContext, useState } from 'react';
import type LenisType from 'lenis';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

const SmoothScrollContext = createContext<LenisType | null>(null);

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [lenisInstance, setLenisInstance] = useState<LenisType | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    let lenis: LenisType | null = null;
    let rafId: number | null = null;
    let isMounted = true;

    // BOLT: Dynamically import Lenis to reduce initial bundle size.
    // Lenis is only needed on the client and isn't critical for initial paint.
    import('lenis').then(({ default: Lenis }) => {
      if (!isMounted) return;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.5,
        infinite: false,
      });

      setLenisInstance(lenis);

      function raf(time: number) {
        if (lenis) {
          lenis.raf(time);
        }
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    }).catch(console.error);

    return () => {
      isMounted = false;
      if (lenis) {
        lenis.destroy();
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      setLenisInstance(null);
    };
  }, [prefersReducedMotion]);

  return (
    <SmoothScrollContext.Provider value={lenisInstance}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
