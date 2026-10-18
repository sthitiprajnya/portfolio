import { useEffect } from 'react';
import { useAnimationActivity } from '@/hooks/useAnimationActivity';
import { sitePath } from '@/lib/sitePath';

const CURSOR_COLOR = encodeURIComponent('#00F5FF');
const SVG_CURSOR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect x='0' y='12' width='16' height='4' fill='${CURSOR_COLOR}'/%3E%3C/svg%3E`;
const SVG_BLANK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3C/svg%3E`;

export function useFaviconBlink() {
  const isAnimationActive = useAnimationActivity();

  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    document.head.appendChild(link);

    if (!isAnimationActive) {
      link.href = sitePath('/favicon.svg');
      return;
    }

    let isBlank = false;
    const updateFavicon = () => {
      link.href = isBlank ? SVG_BLANK : SVG_CURSOR;
      isBlank = !isBlank;
    };

    updateFavicon();
    const intervalId = setInterval(updateFavicon, 800);

    return () => clearInterval(intervalId);
  }, [isAnimationActive]);
}
