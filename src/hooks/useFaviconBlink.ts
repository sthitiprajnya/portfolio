import { useEffect } from 'react';

// BOLT: Hoist static strings and URI encoding to module level
// to avoid unnecessary allocations and CPU work every 800ms
const CURSOR_COLOR = encodeURIComponent('#00F5FF');
const SVG_CURSOR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect x='0' y='12' width='16' height='4' fill='${CURSOR_COLOR}'/%3E%3C/svg%3E`;
const SVG_BLANK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3C/svg%3E`;

export function useFaviconBlink() {
  useEffect(() => {
    let isBlank = false;

    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    document.head.appendChild(link);

    const updateFavicon = () => {
      link.href = isBlank ? SVG_BLANK : SVG_CURSOR;
      isBlank = !isBlank;
    };

    updateFavicon(); // Initial set

    let intervalId: NodeJS.Timeout | null = null;

    const startInterval = () => {
      if (!intervalId) {
        intervalId = setInterval(updateFavicon, 800);
      }
    };

    const stopInterval = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    if (!document.hidden) {
      startInterval();
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopInterval();
      } else {
        updateFavicon();
        startInterval();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopInterval();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
