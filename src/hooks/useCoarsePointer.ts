import { useSyncExternalStore } from 'react';

const QUERY = '(pointer: coarse)';

// Cache the MediaQueryList so every getSnapshot during render is a cheap
// cache hit instead of allocating a new object.
let mqlCache: MediaQueryList | null = null;

const getMql = () => {
  if (typeof window === 'undefined') return null;
  if (!mqlCache) {
    mqlCache = window.matchMedia(QUERY);
  }
  return mqlCache;
};

export const _resetPointerMqlCache = () => {
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

/** True when the primary input is coarse (touch), kept live via matchMedia. */
export function useCoarsePointer() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
