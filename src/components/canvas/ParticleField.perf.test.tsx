import { render } from '@testing-library/react';
import ParticleField from './ParticleField';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

// Mock intersection observer
const mockInView = vi.fn(() => ({ ref: vi.fn(), inView: true }));
vi.mock('react-intersection-observer', () => ({
  useInView: () => mockInView(),
}));

// Mock prefers reduced motion
vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false,
}));

describe('ParticleField performance', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 1000,
      height: 1000,
      top: 0,
      left: 0,
      bottom: 1000,
      right: 1000,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect));
  });

  it('verifies getBoundingClientRect is NOT called during mousemove after initial mount', () => {
    // Mock getContext to avoid JSDOM error
    // @ts-expect-error test explicit mock
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      clearRect: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
    }));

    const getBoundingClientRectSpy = vi.spyOn(Element.prototype, 'getBoundingClientRect');

    // We need to trigger the useEffect. In JSDOM, we might need to mock requestAnimationFrame
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(cb, 0));

    render(<ParticleField />);

    // Initial mount calls:
    // 1. react-intersection-observer might call it
    // 2. Our code calls it once to cache it
    const initialCallCount = getBoundingClientRectSpy.mock.calls.length;
    expect(initialCallCount).toBeGreaterThan(0);

    // Simulate mousemove multiple times
    for (let i = 0; i < 100; i++) {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: i, clientY: i }));
    }

    // Call count should NOT increase
    expect(getBoundingClientRectSpy.mock.calls.length).toBe(initialCallCount);

    console.log(`OPTIMIZATION VERIFIED: getBoundingClientRect calls after 100 mousemoves: ${getBoundingClientRectSpy.mock.calls.length - initialCallCount}`);

    // Clear the stubbed requestAnimationFrame and any resulting timeouts
    vi.unstubAllGlobals();
  });
});
