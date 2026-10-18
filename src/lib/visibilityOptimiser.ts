export function initVisibilityOptimiser(): () => void {
  const handleVisibilityChange = () => {
    document.documentElement.style.setProperty(
      '--animation-play-state',
      document.hidden ? 'paused' : 'running'
    );
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);
  // Reduced motion: pause everything on init if preferred
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty(
      '--animation-play-state', 'paused'
    );
  }

  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}
