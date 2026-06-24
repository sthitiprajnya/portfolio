import { useEffect } from 'react';

// Use a global counter to track how many active lock requests exist.
let lockCount = 0;

export const useScrollLock = (lock: boolean) => {
  useEffect(() => {
    if (!lock) return;

    lockCount += 1;
    if (lockCount === 1) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = '';
      }
    };
  }, [lock]);
};
