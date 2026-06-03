import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

// BOLT: Hoist subscription and snapshots to module level to ensure stability
// across all 27 components consuming this hook, minimizing per-component overhead.
// This replaces two useEffects and one useState per component with a single
// optimized synchronization point, reducing memory footprint and effect churn.
const subscribe = (callback: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

const getServerSnapshot = () => false;

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
