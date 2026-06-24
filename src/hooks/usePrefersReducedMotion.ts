import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

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

// BOLT: Hoist subscription and snapshots to module level to ensure stability
// across all 27 components consuming this hook, minimizing per-component overhead.
// This replaces two useEffects and one useState per component with a single
// optimized synchronization point, reducing memory footprint and effect churn.
// BOLT: Caching the MediaQueryList instance prevents excessive garbage collection and CPU overhead from getSnapshot on every render.
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
