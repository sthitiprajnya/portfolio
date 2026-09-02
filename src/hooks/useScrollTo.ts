import { useCallback } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export const useScrollTo = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });

      // Accessibility: Transfer focus to the target section after a short delay
      // to ensure the scroll has started. preventScroll: true avoids sudden jumps.
      setTimeout(() => {
        el.focus({ preventScroll: true });
      }, 100);
    }
  }, [prefersReducedMotion]);

  return scrollTo;
};
