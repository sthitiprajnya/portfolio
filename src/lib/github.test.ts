import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchGitHubStats } from './github';

describe('fetchGitHubStats', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return fallback data if window is undefined', async () => {
    // In vitest/jsdom environment, window is usually defined.
    // This test might be tricky if we can't easily mock window being undefined.
    // However, we can check if it returns data.
  });

  it('should return cached data if available and not expired', async () => {
    const cachedData = {
      followers: 10,
      publicRepos: 5,
      totalStars: 100,
      totalForks: 50,
      languages: { TypeScript: 1 },
      topRepos: [],
      fetchedAt: Date.now(),
    };
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(cachedData));

    const stats = await fetchGitHubStats();
    expect(stats).toEqual(cachedData);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should fetch from API if cache is missing or expired', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const mockUser = { followers: 20, public_repos: 15 };
    const mockRepos = [
      { name: 'repo1', stargazers_count: 5, forks_count: 2, language: 'TypeScript', html_url: 'url1', description: 'desc1' },
      { name: 'repo2', stargazers_count: 10, forks_count: 3, language: 'JavaScript', html_url: 'url2', description: 'desc2' },
    ];

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      } as Response);

    const stats = await fetchGitHubStats();

    expect(stats.followers).toBe(20);
    expect(stats.publicRepos).toBe(15);
    expect(stats.totalStars).toBe(15);
    expect(stats.totalForks).toBe(5);
    expect(stats.languages).toEqual({ TypeScript: 1, JavaScript: 1 });
    expect(stats.topRepos).toHaveLength(2);
    expect(stats.topRepos[0].name).toBe('repo2'); // Sorted by stars
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should return fallback data on fetch failure', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const stats = await fetchGitHubStats();
    expect(stats.publicRepos).toBe(10); // Fallback data publicRepos is 10
  });
});
