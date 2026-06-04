import { useEffect } from 'react';

// Day 63: Add multiple blink patterns via prop
export function useFaviconBlink(pattern: 'fast' | 'slow' | 'default' = 'default') {
  useEffect(() => {
    let isBlank = false;

    let intervalTime = 800; // default
    if (pattern === 'fast') intervalTime = 200;
    else if (pattern === 'slow') intervalTime = 1000;

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
    const intervalId = setInterval(updateFavicon, intervalTime);

    return () => clearInterval(intervalId);
  }, [pattern]);
}
