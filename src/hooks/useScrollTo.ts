import { useCallback } from 'react';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export const useScrollTo = () => {
  const lenis = useSmoothScroll();
  const prefersReducedMotion = usePrefersReducedMotion();

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      if (lenis && !prefersReducedMotion) {
        lenis.scrollTo(el);
      } else {
        el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }

      // Accessibility: Transfer focus to the target section after a short delay
      // to ensure the scroll has started. preventScroll: true avoids sudden jumps.
      setTimeout(() => {
        el.focus({ preventScroll: true });
      }, 100);
    }
  }, [lenis, prefersReducedMotion]);

  return scrollTo;
};
