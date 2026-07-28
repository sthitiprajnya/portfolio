export function initVisibilityOptimiser() {
  const handler = () => {
    document.documentElement.style.setProperty(
      '--animation-play-state',
      document.hidden ? 'paused' : 'running'
    );
  };

  document.addEventListener('visibilitychange', handler);

  // Reduced motion: pause everything on init if preferred
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty(
      '--animation-play-state', 'paused'
    );
  }
}
