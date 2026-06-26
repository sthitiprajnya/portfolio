import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

// BOLT: Hoist subscription and snapshots to module level to ensure stability
// across all 27 components consuming this hook, minimizing per-component overhead.
// BOLT: Cache the MediaQueryList instance to prevent evaluating the query
// and instating a new object on every getSnapshot call during React renders.
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

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Exported for testing purposes only to prevent state leakage between tests
export const _resetMqlCache = () => {
  mqlCache = null;
};

// Alias for testing compatibility
export const __resetMqlCacheForTesting = _resetMqlCache;
