import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchGitHubStats } from '../github';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('fetchGitHubStats', () => {
  beforeEach(() => {
    // Clear mocks and localStorage before each test
    vi.clearAllMocks();
    localStorage.clear();

    // Default fetch mock response
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([])
    });
  });

  it('should handle unparseable JSON in localStorage gracefully', async () => {
    // Arrange: Set corrupted data in localStorage
    localStorage.setItem('github_stats_cache', '{ invalid json ]');

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Act: Call the function
    await fetchGitHubStats();

    // Assert: Check that a warning was logged and the cache was cleared
    expect(warnSpy).toHaveBeenCalledWith('Failed to parse cached GitHub stats, clearing cache.', expect.any(Error));

    // Should have proceeded to fetch fresh data
    expect(mockFetch).toHaveBeenCalled();

    // Check that localStorage was overwritten with valid JSON
    const newCache = localStorage.getItem('github_stats_cache');
    expect(newCache).not.toBeNull();
    // It should now be parseable JSON
    expect(() => JSON.parse(newCache!)).not.toThrow();

    warnSpy.mockRestore();
  });
});
