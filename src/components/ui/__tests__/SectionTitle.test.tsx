import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SectionTitle } from '../SectionTitle';

// Mock ScrollReveal
vi.mock('../ScrollReveal', () => ({
  ScrollReveal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  fadeSlideLeft: {},
}));

describe('SectionTitle', () => {
  it('renders correctly without id', () => {
    render(<SectionTitle number="01" title="Test Title" />);
    expect(screen.getByText('// 01')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders correctly with id and handles copy link', async () => {
    // Mock clipboard
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    // Mock window.location
    const originalLocation = window.location;
    // @ts-expect-error: Deleting window.location to mock it for testing
    delete window.location;
    window.location = {
      ...originalLocation,
      href: 'http://localhost/portfolio',
      origin: 'http://localhost',
      pathname: '/portfolio'
    };

    render(<SectionTitle number="01" title="Test Title" id="test-id" />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'section-title-test-id');

    const copyButton = screen.getByRole('button', { name: /Copy link to Test Title section/i });
    expect(copyButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(writeTextMock).toHaveBeenCalledWith('http://localhost/portfolio#section-title-test-id');
    expect(screen.getByText('COPIED!')).toBeInTheDocument();
    expect(screen.getByText('COPIED!')).toHaveAttribute('role', 'status');

    // Restore location
    window.location = originalLocation;
  });
});
