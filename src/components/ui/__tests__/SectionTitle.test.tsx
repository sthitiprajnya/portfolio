import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent} from '@testing-library/react';
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

    render(<SectionTitle number="01" title="Test Title" id="test-id" />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'section-title-test-id');

    const copyButton = screen.getByRole('button', { name: /Copy link to Test Title section/i });
    expect(copyButton).toBeInTheDocument();

    fireEvent.click(copyButton);

    expect(writeTextMock).toHaveBeenCalled();
    // Verify that "COPIED!" text appears (localized feedback)
    expect(await screen.findByText('COPIED!')).toBeInTheDocument();
  });
});
