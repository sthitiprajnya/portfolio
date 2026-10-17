import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: vi.fn(() => false),
}));

// Mock framer-motion properly using vi.mock with an inline factory
vi.mock('framer-motion', () => {
  let mockScrollY = 0;
  let listeners: ((v: number) => void)[] = [];

  return {
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
    useScroll: () => ({ scrollY: mockScrollY }),
    useMotionValueEvent: (value: any, event: string, callback: (latest: number) => void) => {
      listeners.push(callback);
    },
    // Test helper to simulate scroll in framer-motion mock
    __setScrollY: (y: number) => {
      mockScrollY = y;
      listeners.forEach(cb => cb(y));
    },
    __resetMock: () => {
      mockScrollY = 0;
      listeners = [];
    }
  };
});

import { BackToTop } from '../BackToTop';
import * as framerMotion from 'framer-motion';
import { act } from '@testing-library/react';

describe('BackToTop', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
    vi.useFakeTimers();
    // @ts-ignore
    framerMotion.__resetMock();
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

    act(() => {
      // @ts-ignore
      framerMotion.__setScrollY(401);
    });

    expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument();
  });

  it('should scroll to top when clicked', () => {
    render(<BackToTop />);

    act(() => {
      // @ts-ignore
      framerMotion.__setScrollY(401);
    });

    const button = screen.getByRole('button', { name: /back to top/i });
    fireEvent.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
