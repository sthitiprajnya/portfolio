import { describe, it, expect, vi } from 'vitest';
import { debounce, throttle, clamp } from './utils';

describe('utils', () => {
  describe('debounce', () => {
    it('should debounce calls', () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toBeCalled();

      vi.advanceTimersByTime(50);
      expect(fn).not.toBeCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toBeCalledTimes(1);

      vi.useRealTimers();
    });
  });

  describe('throttle', () => {
    it('should throttle calls', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      const now = Date.now();
      vi.spyOn(Date, 'now').mockReturnValue(now);

      throttled();
      expect(fn).toBeCalledTimes(1);

      throttled();
      throttled();
      expect(fn).toBeCalledTimes(1);

      vi.spyOn(Date, 'now').mockReturnValue(now + 150);
      throttled();
      expect(fn).toBeCalledTimes(2);

      vi.restoreAllMocks();
    });
  });

  describe('clamp', () => {
    it('should clamp values', () => {
      expect(clamp(5, 1, 10)).toBe(5);
      expect(clamp(-5, 1, 10)).toBe(1);
      expect(clamp(15, 1, 10)).toBe(10);
    });
  });
});
