import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAnimationActivity } from '@/hooks/useAnimationActivity';
import { useFaviconBlink } from '../useFaviconBlink';

vi.mock('@/hooks/useAnimationActivity', () => ({
  useAnimationActivity: vi.fn(),
}));

describe('useFaviconBlink', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.head.querySelectorAll("link[rel~='icon']").forEach((link) => link.remove());
    vi.mocked(useAnimationActivity).mockReturnValue(true);
  });

  afterEach(() => {
    document.head.querySelectorAll("link[rel~='icon']").forEach((link) => link.remove());
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('uses a static favicon and starts no interval while idle', () => {
    vi.mocked(useAnimationActivity).mockReturnValue(false);
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');

    renderHook(() => useFaviconBlink());

    expect(setIntervalSpy).not.toHaveBeenCalled();
    expect(document.querySelector("link[rel~='icon']")?.getAttribute('href')).toBe('/portfolio/favicon.svg');
  });

  it('pauses and resumes interval based on document visibility', () => {
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

    // Explicitly mock document.hidden as false initially
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });

    renderHook(() => useFaviconBlink());

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);

    // Simulate tab becoming hidden
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);

    // Simulate tab becoming visible again
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));

    expect(setIntervalSpy).toHaveBeenCalledTimes(2);
  });

  it('clears its interval and restores the static icon when activity pauses', () => {
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    const { rerender, unmount } = renderHook(() => useFaviconBlink());

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 800);
    vi.mocked(useAnimationActivity).mockReturnValue(false);
    rerender();

    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(document.querySelector("link[rel~='icon']")?.getAttribute('href')).toBe('/portfolio/favicon.svg');
    unmount();
  });
});
