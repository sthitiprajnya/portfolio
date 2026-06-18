import { useCallback } from 'react';

export const useScrollTo = () => {
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Accessibility: Transfer focus to the target section after a short delay
      // to ensure the scroll has started. preventScroll: true avoids sudden jumps.
      setTimeout(() => {
        el.focus({ preventScroll: true });
      }, 100);
    }
  }, []);

  return scrollTo;
};
