import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAnimationActivity } from '@/hooks/useAnimationActivity';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { TypewriterText } from '../TypewriterText';

vi.mock('@/hooks/useAnimationActivity', () => ({
  useAnimationActivity: vi.fn(),
}));

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: vi.fn(),
}));

describe('TypewriterText', () => {
  const sequence = ['Cloud Security Engineer', 0, 'Penetration Tester'];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(useAnimationActivity).mockReturnValue(true);
    vi.mocked(usePrefersReducedMotion).mockReturnValue(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the first phrase immediately with a non-live accessible label', () => {
    render(<TypewriterText sequence={sequence} />);

    expect(screen.getByLabelText('Cloud Security Engineer')).toHaveAttribute('aria-live', 'off');
    expect(screen.getByLabelText('Cloud Security Engineer')).toHaveTextContent('Cloud Security Engineer');
  });

  it('completes one finite sequence and leaves no scheduled timers', () => {
    const { container } = render(<TypewriterText sequence={sequence} cursor={false} />);

    act(() => vi.runAllTimers());

    expect(container.textContent).toBe('Penetration Tester');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cancels the pending character timer immediately when page motion pauses', () => {
    const longSequence = ['Start', 0, 'A long role that should stop typing when the page becomes idle'];
    const { container, rerender } = render(<TypewriterText sequence={longSequence} cursor={false} />);

    act(() => vi.advanceTimersByTime(300));
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    vi.mocked(useAnimationActivity).mockReturnValue(false);
    rerender(<TypewriterText sequence={longSequence} cursor={false} />);
    expect(container.textContent).toBe('Start');
    expect(vi.getTimerCount()).toBe(0);

    const pausedMarkup = container.innerHTML;
    act(() => vi.advanceTimersByTime(10_000));
    expect(container.innerHTML).toBe(pausedMarkup);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('uses static text when reduced motion is requested', () => {
    vi.mocked(usePrefersReducedMotion).mockReturnValue(true);
    vi.mocked(useAnimationActivity).mockImplementation((enabled = true) => enabled);

    render(<TypewriterText sequence={sequence} />);

    expect(useAnimationActivity).toHaveBeenCalledWith(false);
    expect(screen.getByText('Cloud Security Engineer')).toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(0);
  });
});
