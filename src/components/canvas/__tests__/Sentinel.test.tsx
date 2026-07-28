import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Sentinel from '../Sentinel';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: vi.fn(),
}));

describe('Sentinel Component', () => {
  let mockRequestAnimationFrame: ReturnType<typeof vi.spyOn>;
  let mockIntersectionObserver: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    (usePrefersReducedMotion as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);

    mockRequestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

    // Create a mock canvas context
    const mockContext = {
      clearRect: vi.fn(),
      createRadialGradient: vi.fn().mockReturnValue({
        addColorStop: vi.fn()
      }),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
    };

    // Mock HTMLCanvasElement.getContext
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockContext as unknown as CanvasRenderingContext2D);

    mockIntersectionObserver = vi.fn();
    window.IntersectionObserver = class {
      constructor() {}
      observe = mockIntersectionObserver;
      unobserve = vi.fn();
      disconnect = vi.fn();
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a canvas element when motion is allowed', () => {
    const { container } = render(<Sentinel />);
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
    expect(canvas?.className).toContain('fixed inset-0');
  });

  it('does not render when prefers reduced motion is true', () => {
    (usePrefersReducedMotion as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const { container } = render(<Sentinel />);
    expect(container.querySelector('canvas')).toBeNull();
  });

  it('sets up IntersectionObserver correctly', () => {
    const spy = vi.spyOn(window, 'IntersectionObserver');
    render(<Sentinel />);
    expect(spy).toHaveBeenCalled();
  });

  it('calls requestAnimationFrame to start the loop', () => {
    render(<Sentinel />);
    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });
});
