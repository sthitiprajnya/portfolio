import React from 'react';
import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useInView } from 'react-intersection-observer';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import MatrixRain from '../MatrixRain';

vi.mock('react-intersection-observer', () => ({ useInView: vi.fn() }));
vi.mock('@/hooks/usePrefersReducedMotion', () => ({ usePrefersReducedMotion: vi.fn() }));

describe('MatrixRain', () => {
  beforeEach(() => {
    vi.mocked(usePrefersReducedMotion).mockReturnValue(false);
    vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    const canvasContext = {
      clearRect: vi.fn(),
      fillText: vi.fn(),
      drawImage: vi.fn(),
      fillRect: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      canvasContext as unknown as CanvasRenderingContext2D
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('removes the exact resize callback when the canvas leaves the viewport', () => {
    let inView = true;
    const observerRef = vi.fn();
    vi.mocked(useInView).mockImplementation(() => ({
      ref: observerRef,
      inView,
    }) as unknown as ReturnType<typeof useInView>);

    const addListener = vi.spyOn(window, 'addEventListener');
    const removeListener = vi.spyOn(window, 'removeEventListener');
    const { rerender } = render(<MatrixRain />);
    inView = false;
    rerender(<MatrixRain />);

    const resizeRegistration = addListener.mock.calls.find(([type]) => type === 'resize');
    expect(resizeRegistration).toBeDefined();
    expect(removeListener.mock.calls.some(([type, callback]) => (
      type === 'resize' && callback === resizeRegistration?.[1]
    ))).toBe(true);
  });
});
