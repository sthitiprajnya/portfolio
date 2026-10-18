import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initVisibilityOptimiser } from '../visibilityOptimiser';

describe('initVisibilityOptimiser', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it('returns cleanup that removes its visibility listener', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const cleanup = initVisibilityOptimiser() as (() => void) | undefined;
    const listener = addSpy.mock.calls.find(([eventName]) => eventName === 'visibilitychange')?.[1];

    expect(cleanup).toBeTypeOf('function');
    cleanup?.();

    expect(listener).toBeDefined();
    expect(removeSpy).toHaveBeenCalledWith('visibilitychange', listener);
  });
});
