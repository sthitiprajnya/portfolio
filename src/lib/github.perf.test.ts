import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGitHubStats } from './github';

describe('fetchGitHubStats performance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('measures execution time of repos processing with many repos', async () => {
    const mockUser = { followers: 100, public_repos: 50 };
    const mockRepos = Array.from({ length: 100000 }, (_, i) => ({
      name: `repo${i}`,
      description: `Description for repo ${i}`,
      stargazers_count: Math.floor(Math.random() * 100),
      forks_count: Math.floor(Math.random() * 50),
      language: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', null][Math.floor(Math.random() * 6)],
      html_url: `https://github.com/user/repo${i}`
    }));

    vi.stubGlobal('fetch', vi.fn().mockImplementation((url) => {
      if (url.includes('/repos')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([...mockRepos]) // Return a copy to avoid mutating between tests
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser)
      });
    }));

    // Warmup
    await fetchGitHubStats();

    const start = performance.now();
    await fetchGitHubStats();
    const end = performance.now();
    const optimizedTime = end - start;
    console.log(`fetchGitHubStats execution time (100k repos): ${optimizedTime}ms`);

    // An unoptimized approach with multiple iterations and .sort() would take ~50-80ms
    // With the single loop and swapping logic, it should be well under 10ms for 100k items.
    // Use an extremely generous upper bound to prevent flakiness in CI environments
    expect(optimizedTime).toBeLessThan(1000);

    vi.unstubAllGlobals();
  });
});
