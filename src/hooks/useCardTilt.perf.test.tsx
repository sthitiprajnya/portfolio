import { renderHook } from '@testing-library/react';
import { useCardTilt } from './useCardTilt';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('useCardTilt performance', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('measures getBoundingClientRect calls inside scroll handler', () => {
    const el = document.createElement('div');
    const getBoundingClientRectMock = vi.fn(() => ({
      top: 100, left: 100, width: 200, height: 200, bottom: 300, right: 300, x: 100, y: 100, toJSON: () => {}
    }));
    el.getBoundingClientRect = getBoundingClientRectMock;

    // Set up window listener spy before rendering
    const windowAddEventListenerSpy = vi.spyOn(window, 'addEventListener');

    // Render and manually attach ref
    const { unmount } = renderHook(() => {
      const hook = useCardTilt();
      // Only set the ref once during initialization to properly simulate React lifecycle
      if (!hook.ref.current) {
        // @ts-expect-error test explicit mock ref assignment
        hook.ref.current = el;
      }
      return hook;
    });

    const scrollCalls = windowAddEventListenerSpy.mock.calls.filter(c => c[0] === 'scroll');
    const isScrollAttached = scrollCalls.length > 0;

    expect(isScrollAttached).toBe(false);

    console.log(`BASELINE: Scroll event attached: ${isScrollAttached}`);

    if (isScrollAttached) {
      const scrollHandler = scrollCalls[0][1] as EventListener;

      const beforeCount = getBoundingClientRectMock.mock.calls.length;

      // Simulate 100 scroll events
      for (let i = 0; i < 100; i++) {
        scrollHandler(new Event('scroll'));
      }

      const afterCount = getBoundingClientRectMock.mock.calls.length;
      console.log(`BASELINE: getBoundingClientRect calls per 100 scroll events: ${afterCount - beforeCount}`);
    } else {
      console.log(`BASELINE: getBoundingClientRect calls on scroll: 0 (No scroll event listener)`);
    }

    // Unmount
    unmount();
  });
});
