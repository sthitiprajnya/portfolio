'use client';

import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

export const IDLE_ANIMATION_PAUSE_MS = 10_000;
const AnimationActivityContext = createContext(true);

const ACTIVITY_EVENTS = [
  'pointermove',
  'pointerdown',
  'wheel',
  'keydown',
  'touchstart',
  'scroll',
] as const;

export function AnimationActivityProvider({ children }: PropsWithChildren) {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const pause = () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      timeoutId = undefined;
      setIsActive(false);
      document.documentElement.setAttribute('data-animation-idle', 'true');
    };

    const markActive = () => {
      if (document.hidden) return;
      setIsActive(true);
      document.documentElement.removeAttribute('data-animation-idle');
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      timeoutId = setTimeout(pause, IDLE_ANIMATION_PAUSE_MS);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) pause();
      else markActive();
    };

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, markActive, { passive: true });
    });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (document.hidden) pause();
    else markActive();

    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, markActive);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.documentElement.removeAttribute('data-animation-idle');
    };
  }, []);

  return (
    <AnimationActivityContext.Provider value={isActive}>
      {children}
    </AnimationActivityContext.Provider>
  );
}

/** Returns false when the page is idle or when the caller is not visible/eligible. */
export function useAnimationActivity(enabled = true) {
  return useContext(AnimationActivityContext) && enabled;
}
