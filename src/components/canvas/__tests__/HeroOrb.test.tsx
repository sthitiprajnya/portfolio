import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import HeroOrb from '../HeroOrb';
import { useInView } from 'react-intersection-observer';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

vi.mock('react-intersection-observer', () => ({
  useInView: vi.fn(),
}));

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: vi.fn(),
}));

describe('HeroOrb Component', () => {
  let mockRequestAnimationFrame: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    (useInView as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ ref: vi.fn(), inView: true });
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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a canvas element', () => {
    const { container } = render(<HeroOrb />);
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('does not animate when prefers reduced motion is true', () => {
    (usePrefersReducedMotion as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);
    render(<HeroOrb />);
    expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
  });

  it('starts animation loop when in view', () => {
    render(<HeroOrb />);
    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });

  it('does not animate when not in view', () => {
    (useInView as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ ref: vi.fn(), inView: false });
    render(<HeroOrb />);
    expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
  });
});
