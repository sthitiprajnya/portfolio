import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as framerMotion from 'framer-motion';

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: vi.fn(() => false),
}));

vi.mock('framer-motion', () => {
  let mockScrollY = 0;
  let listeners: ((value: number) => void)[] = [];

  return {
    motion: {
      button: (props: Record<string, unknown>) => {
        const { initial, animate, exit, ...rest } = props;
        void initial;
        void animate;
        void exit;
        return <button {...rest} />;
      },
      div: (props: Record<string, unknown>) => {
        const { initial, animate, exit, ...rest } = props;
        void initial;
        void animate;
        void exit;
        return <div {...rest} />;
      },
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useScroll: () => ({ scrollY: mockScrollY }),
    useMotionValueEvent: (value: unknown, event: string, callback: (latest: number) => void) => {
      void value;
      void event;
      listeners.push(callback);
    },
    __setScrollY: (y: number) => {
      mockScrollY = y;
      listeners.forEach((callback) => callback(y));
    },
    __resetMock: () => {
      mockScrollY = 0;
      listeners = [];
    },
  };
});

import { BackToTop } from '../BackToTop';

const framerMotionTestHelpers = framerMotion as typeof framerMotion & {
  __setScrollY: (y: number) => void;
  __resetMock: () => void;
};

describe('BackToTop', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    vi.useFakeTimers();
    framerMotionTestHelpers.__resetMock();
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

    act(() => framerMotionTestHelpers.__setScrollY(401));

    expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument();
  });

  it('should scroll to top when clicked', () => {
    render(<BackToTop />);

    act(() => framerMotionTestHelpers.__setScrollY(401));

    fireEvent.click(screen.getByRole('button', { name: /back to top/i }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
