import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

// BOLT: Hoist subscription and snapshots to module level to ensure stability
// across all 27 components consuming this hook, minimizing per-component overhead.
// This replaces two useEffects and one useState per component with a single
// optimized synchronization point, reducing memory footprint and effect churn.

// BOLT: Cache the MediaQueryList instance to prevent excessive garbage collection
// and CPU overhead from getSnapshot being called on every React render.
let mqlCache: MediaQueryList | null = null;

const getMql = () => {
  if (!mqlCache && typeof window !== 'undefined') {
    mqlCache = window.matchMedia(QUERY);
  }
  return mqlCache;
};

const subscribe = (callback: () => void) => {
  const mql = getMql();
  if (!mql) return () => {};
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
};

const getSnapshot = () => {
  const mql = getMql();
  return mql ? mql.matches : false;
};

const getServerSnapshot = () => false;

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Exported for Vitest tests to prevent state leakage between tests
export const resetMatchMediaCache = () => {
  mqlCache = null;
};
