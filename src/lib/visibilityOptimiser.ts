export function initVisibilityOptimiser() {
  document.addEventListener('visibilitychange', () => {
    document.documentElement.style.setProperty(
      '--animation-play-state',
      document.hidden ? 'paused' : 'running'
    );
  });
  // Reduced motion: pause everything on init if preferred
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty(
      '--animation-play-state', 'paused'
    );
  }
}
