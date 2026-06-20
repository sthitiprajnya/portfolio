import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: vi.fn(() => false),
}));

// Mock framer-motion properly using vi.mock with an inline factory
vi.mock('framer-motion', () => ({
  motion: {
    button: (props: Record<string, unknown>) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { initial, animate, exit, ...rest } = props;
      return <button {...rest} />;
    },
    div: (props: Record<string, unknown>) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { initial, animate, exit, ...rest } = props;
      return <div {...rest} />;
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { BackToTop } from '../BackToTop';

describe('BackToTop', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    // Start with scrollY at 0
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should not be visible initially', () => {
    render(<BackToTop />);
    expect(screen.queryByRole('button', { name: /back to top/i })).not.toBeInTheDocument();
  });

  it('should become visible after scrolling down 400px', () => {
    render(<BackToTop />);
    expect(screen.queryByRole('button', { name: /back to top/i })).not.toBeInTheDocument();

    window.scrollY = 401;
    fireEvent.scroll(window);

    expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument();
  });

  it('should scroll to top when clicked', () => {
    window.scrollY = 401;
    render(<BackToTop />);
    fireEvent.scroll(window);

    const button = screen.getByRole('button', { name: /back to top/i });
    fireEvent.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
