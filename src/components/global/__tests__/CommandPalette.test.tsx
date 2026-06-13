import { render, screen, fireEvent, act } from '@testing-library/react';
import { CommandPalette } from '../CommandPalette';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

// Mock dependencies
vi.mock('@/components/sections/Navigation', () => ({
  NAV_LINKS: [
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
  ],
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      ...(actual.motion as object),
      div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe('CommandPalette', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock scrollIntoView which is not implemented in JSDOM
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('renders and allows searching', async () => {
    render(<CommandPalette />);

    // Open the palette
    await act(async () => {
      window.dispatchEvent(new CustomEvent('open-command-palette'));
    });

    const input = screen.getByPlaceholderText(/Jump to section/i);
    expect(input).toBeInTheDocument();

    // Type something
    await act(async () => {
      fireEvent.change(input, { target: { value: 'About' } });
    });

    // Check results
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.queryByText('Skills')).not.toBeInTheDocument();

    // Check aria-live announcement
    const announcements = screen.getAllByText(/1 results found for About/i);
    expect(announcements.length).toBeGreaterThan(0);
    expect(announcements[0]).toBeInTheDocument();
  });

  it('clears search when clear button is clicked', async () => {
    render(<CommandPalette />);

    await act(async () => {
      window.dispatchEvent(new CustomEvent('open-command-palette'));
    });

    const input = screen.getByPlaceholderText(/Jump to section/i) as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, { target: { value: 'About' } });
    });

    const clearButton = screen.getByLabelText(/Clear search/i);
    expect(clearButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(clearButton);
    });

    expect(input.value).toBe('');
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });
});
