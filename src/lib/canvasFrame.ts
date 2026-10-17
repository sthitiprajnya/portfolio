const DEFAULT_MAX_FPS = 30;

/**
 * Create an independent frame gate for a canvas loop. Animation callbacks may
 * continue at the browser's refresh rate, but expensive drawing runs no faster
 * than the requested visual budget.
 */
export function createFrameGate(maxFps = DEFAULT_MAX_FPS) {
  if (!Number.isFinite(maxFps) || maxFps <= 0) {
    throw new RangeError('maxFps must be a positive finite number');
  }

  const minFrameInterval = 1000 / maxFps;
  let lastFrameTime = Number.NEGATIVE_INFINITY;

  return (timestamp: number) => {
    if (timestamp - lastFrameTime < minFrameInterval) return false;
    lastFrameTime = timestamp;
    return true;
  };
}
