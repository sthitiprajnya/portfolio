import { render, screen, fireEvent, act } from '@testing-library/react';
import { BackToTop } from '../BackToTop';
import { expect, test, vi, beforeEach, describe } from 'vitest';
import React, { ReactNode } from 'react';

interface MockProps {
  children?: ReactNode;
  onClick?: () => void;
  [key: string]: unknown;
}

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MockProps) => <div {...props}>{children}</div>,
    button: ({ children, onClick, ...props }: MockProps) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>
}));

// Mock the hook
vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false
}));

describe('BackToTop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.scrollY
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    vi.useFakeTimers();
  });

  test('should not be visible initially', () => {
    render(<BackToTop />);
    expect(screen.queryByLabelText('Back to top')).not.toBeInTheDocument();
  });

  test('should become visible after scrolling down 400px', () => {
    render(<BackToTop />);

    // Simulate scroll
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 401, writable: true, configurable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByLabelText('Back to top')).toBeInTheDocument();
  });

  test('should scroll to top when clicked', () => {
    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;

    render(<BackToTop />);

    // Make it visible
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 401, writable: true, configurable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    const button = screen.getByLabelText('Back to top');
    fireEvent.click(button);

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
