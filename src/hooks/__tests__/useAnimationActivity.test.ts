import { act, renderHook } from '@testing-library/react';
import { createElement, type PropsWithChildren } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AnimationActivityProvider, IDLE_ANIMATION_PAUSE_MS } from '@/components/providers/AnimationActivityProvider';
import { useAnimationActivity } from '../useAnimationActivity';

const wrapper = ({ children }: PropsWithChildren) => createElement(AnimationActivityProvider, null, children);

describe('useAnimationActivity', () => {
  afterEach(() => {
    vi.useRealTimers();
    document.documentElement.removeAttribute('data-animation-idle');
  });

  it('pauses global motion after inactivity and wakes on user input', () => {
    vi.useFakeTimers();
    const { result, unmount } = renderHook(() => useAnimationActivity(), { wrapper });

    expect(result.current).toBe(true);
    expect(document.documentElement.hasAttribute('data-animation-idle')).toBe(false);

    act(() => vi.advanceTimersByTime(IDLE_ANIMATION_PAUSE_MS));
    expect(result.current).toBe(false);
    expect(document.documentElement.getAttribute('data-animation-idle')).toBe('true');

    act(() => window.dispatchEvent(new Event('pointermove')));
    expect(result.current).toBe(true);
    expect(document.documentElement.hasAttribute('data-animation-idle')).toBe(false);

    unmount();
    expect(document.documentElement.hasAttribute('data-animation-idle')).toBe(false);
  });

  it('stays disabled when its caller is outside the visible area', () => {
    const { result, rerender } = renderHook(
      ({ enabled }) => useAnimationActivity(enabled),
      { initialProps: { enabled: false }, wrapper }
    );

    expect(result.current).toBe(false);
    rerender({ enabled: true });
    expect(result.current).toBe(true);
    rerender({ enabled: false });
    expect(result.current).toBe(false);
  });
});
