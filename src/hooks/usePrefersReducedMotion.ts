import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

// BOLT: Hoist subscription and snapshots to module level to ensure stability
// across all components consuming this hook, minimizing per-component overhead.
// This replaces two useEffects and one useState per component with a single
// optimized synchronization point, reducing memory footprint and effect churn.
// BOLT: Cache the MediaQueryList instance to prevent evaluating the query
// and instantiating a new object on every getSnapshot call during React renders.
let mqlCache: MediaQueryList | null = null;

const getMql = () => {
  if (typeof window === 'undefined') return null;
  if (!mqlCache) {
    mqlCache = window.matchMedia(QUERY);
  }
  return mqlCache;
};

export const _resetMqlCache = () => {
  mqlCache = null;
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

// Exported for testing purposes only
export const __resetMqlCacheForTesting = () => {
  mqlCache = null;
};

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Exported for Vitest tests to prevent state leakage between tests
export const resetMatchMediaCache = () => {
  mqlCache = null;
};
