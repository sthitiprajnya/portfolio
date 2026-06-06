import { useEffect } from 'react';

export function useFaviconBlink() {
  useEffect(() => {
    let isBlank = false;

    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    document.head.appendChild(link);

    const updateFavicon = () => {
      // Basic SVG data URI for terminal cursor
      const cursorColor = encodeURIComponent('#00F5FF');

      const svgCursor = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect x='0' y='12' width='16' height='4' fill='${cursorColor}'/%3E%3C/svg%3E`;
      const svgBlank = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3C/svg%3E`;

      link.href = isBlank ? svgBlank : svgCursor;
      isBlank = !isBlank;
    };

    updateFavicon(); // Initial set

    let intervalId: NodeJS.Timeout | null = setInterval(updateFavicon, 800);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } else {
        if (!intervalId) {
          updateFavicon();
          intervalId = setInterval(updateFavicon, 800);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
