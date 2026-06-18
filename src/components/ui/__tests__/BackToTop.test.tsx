import { render, screen, fireEvent } from '@testing-library/react';
import { BackToTop } from '../BackToTop';
import { expect, test, vi, beforeEach } from 'vitest';

// Mock CyberButton since it might have complex logic/styles
vi.mock('../CyberButton', () => ({
  CyberButton: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  )
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

describe('BackToTop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.scrollY
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  test('should not be visible initially', () => {
    render(<BackToTop />);
    expect(screen.queryByLabelText('Scroll back to top')).not.toBeInTheDocument();
  });

  test('should become visible after scrolling down 400px', () => {
    render(<BackToTop />);

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 401, writable: true });
    fireEvent.scroll(window);

    expect(screen.getByLabelText('Scroll back to top')).toBeInTheDocument();
  });

  test('should scroll to top when clicked', () => {
    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;

    render(<BackToTop />);

    // Make it visible
    Object.defineProperty(window, 'scrollY', { value: 401, writable: true });
    fireEvent.scroll(window);

    const button = screen.getByLabelText('Scroll back to top');
    fireEvent.click(button);

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
