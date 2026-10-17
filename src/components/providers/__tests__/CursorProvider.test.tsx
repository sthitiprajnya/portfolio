import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { CursorProvider } from '../CursorProvider';

vi.mock('@/hooks/usePrefersReducedMotion', () => ({ usePrefersReducedMotion: vi.fn() }));

describe('CursorProvider', () => {
  let requestFrame: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.mocked(usePrefersReducedMotion).mockReturnValue(false);
    requestFrame = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts its animation loop only after pointer movement', () => {
    render(<CursorProvider><main>Portfolio</main></CursorProvider>);

    expect(requestFrame).not.toHaveBeenCalled();
    fireEvent.mouseMove(window, { clientX: 120, clientY: 80 });
    expect(requestFrame).toHaveBeenCalledTimes(1);
  });
});
