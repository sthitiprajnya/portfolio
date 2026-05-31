import { describe, it, expect, vi, beforeEach } from 'vitest';
import emailjs from '@emailjs/browser';

// Mock the @emailjs/browser module
vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn(),
  },
}));

describe('emailjs library', () => {
  beforeEach(() => {
    // Reset vi mocks
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe('sendContactEmail', () => {
    it('should call emailjs.send with the correct arguments based on environment variables', async () => {
      // Set test environment variables
      vi.stubEnv('NEXT_PUBLIC_EMAILJS_SERVICE_ID', 'test_service_id');
      vi.stubEnv('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID', 'test_template_id');
      vi.stubEnv('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY', 'test_public_key');

      // Mock successful response
      vi.mocked(emailjs.send).mockResolvedValue({ status: 200, text: 'OK' });

      // Dynamically import to ensure it reads the stubbed env variables
      const { sendContactEmail } = await import('./emailjs');

      const testData = {
        from_name: 'John Doe',
        from_email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test Message',
      };

      await sendContactEmail(testData);

      expect(emailjs.send).toHaveBeenCalledTimes(1);
      expect(emailjs.send).toHaveBeenCalledWith(
        'test_service_id',
        'test_template_id',
        testData as unknown as Record<string, unknown>,
        'test_public_key'
      );

      vi.unstubAllEnvs();
    });

    it('should propagate errors if emailjs.send fails', async () => {
      const mockError = new Error('Failed to send email');
      vi.mocked(emailjs.send).mockRejectedValue(mockError);

      const { sendContactEmail } = await import('./emailjs');

      const testData = {
        from_name: 'John Doe',
        from_email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test Message',
      };

      await expect(sendContactEmail(testData)).rejects.toThrow('Failed to send email');
    });
  });
});
