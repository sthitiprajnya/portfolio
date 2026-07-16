import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePrefersReducedMotion, __resetMqlCacheForTesting } from '../usePrefersReducedMotion';


describe('usePrefersReducedMotion', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    __resetMqlCacheForTesting();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    __resetMqlCacheForTesting();
  });

  it('should return false if reduced motion is not preferred', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it('should return true if reduced motion is preferred', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it('should update value when media query change event occurs', () => {
    let changeCallback: ((event: { matches: boolean }) => void) | null = null;
    const query = '(prefers-reduced-motion: reduce)';

    const mqlMock = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn().mockImplementation((event, callback) => {
        if (event === 'change') {
          changeCallback = callback;
        }
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    window.matchMedia = vi.fn().mockImplementation(() => mqlMock);

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    // Simulate change event
    act(() => {
      if (changeCallback) {
        // Change matches to true in the mock before triggering event
        // because getSnapshot will call matchMedia again
        const mqlMockUpdated = {
          matches: true,
          media: query,
          onchange: null,
          addEventListener: vi.fn(), // Already added
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        };
        window.matchMedia = vi.fn().mockImplementation(() => mqlMockUpdated);
        __resetMqlCacheForTesting(); // Reset cache to force reading from new mock

        changeCallback({ matches: true });
      }
    });

    expect(result.current).toBe(true);
  });

  it('should clean up event listener on unmount', () => {
    const removeEventListenerMock = vi.fn();

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: removeEventListenerMock,
      dispatchEvent: vi.fn(),
    }));

    const { unmount } = renderHook(() => usePrefersReducedMotion());
    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
