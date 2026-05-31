import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Contact } from '../Contact';
import emailjs from '@emailjs/browser';

// Mock emailjs
vi.mock('@emailjs/browser', () => ({
  default: {
    sendForm: vi.fn(),
  },
}));

// Mock framer-motion to bypass animations in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual as any,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
  };
});

// Mock react-intersection-observer
vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true }),
}));

describe('Contact Component - Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup environment variables for test
    vi.stubEnv('NEXT_PUBLIC_EMAILJS_SERVICE_ID', 'test_service_id');
    vi.stubEnv('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID', 'test_template_id');
    vi.stubEnv('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY', 'test_public_key');
  });

  it('should handle emailjs.sendForm errors and set status to error', async () => {
    // Silence console.error for this test as we expect an error to be logged
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock sendForm to reject
    const mockError = new Error('Test Error');
    (emailjs.sendForm as ReturnType<typeof vi.fn>).mockRejectedValueOnce(mockError);

    render(<Contact />);

    // Fill the form using more specific queries since there are multiple "Email" text matches
    const nameInput = screen.getByRole('textbox', { name: /^Name/i });
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    // For email, we use getByRole with type validation or a specific ID, as there might be a "Email" text somewhere else
    const emailInput = document.querySelector('input[name="from_email"]');
    if(emailInput) fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    const messageInput = screen.getByRole('textbox', { name: /^Message/i });
    fireEvent.change(messageInput, { target: { value: 'Hello world' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /TRANSMIT_MESSAGE/i }));

    // Wait for the error state
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /RETRY_TRANSMISSION/i })).toBeInTheDocument();
    });

    // Check that button color/class is updated for error state
    const button = screen.getByRole('button', { name: /RETRY_TRANSMISSION/i });
    expect(button).toHaveClass('border-red text-red hover:bg-red');

    consoleSpy.mockRestore();
  });
});
