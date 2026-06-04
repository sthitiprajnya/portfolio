const CACHE_KEY   = 'github_stats_cache';
const CACHE_TTL   = 60 * 60 * 1000;
const GITHUB_USER = 'sthitiprajnya';

export interface GitHubStats {
  followers:   number;
  publicRepos: number;
  totalStars:  number;
  totalForks:  number;
  languages:   Record<string, number>;
  topRepos:    TopRepo[];
  fetchedAt:   number;
}

export interface TopRepo {
  name:        string;
  description: string | null;
  stars:       number;
  forks:       number;
  language:    string | null;
  url:         string;
}

export interface GitHubApiRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
}

const GITHUB_FALLBACK_DATA: GitHubStats = {
  followers: 0,
  publicRepos: 10,
  totalStars: 0,
  totalForks: 0,
  languages: { Python: 4, Shell: 3, JavaScript: 2 },
  topRepos: [],
  fetchedAt: Date.now(),
};

export async function fetchGitHubStats(): Promise<GitHubStats> {
  if (typeof window === 'undefined') return GITHUB_FALLBACK_DATA;

  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const parsed: GitHubStats = JSON.parse(cached);
      if (Date.now() - parsed.fetchedAt < CACHE_TTL) return parsed;
    } catch (e) {
      console.warn('Failed to parse cached GitHub stats, clearing cache.', e);
      localStorage.removeItem(CACHE_KEY);
    }
  }

  const headers = { 'Accept': 'application/vnd.github.v3+json' };

  try {
    // Day 73: Fetch retry wrapper with exponential backoff
    const [userRes, reposRes] = await Promise.all([
      fetchWithRetry(`https://api.github.com/users/${GITHUB_USER}`, { headers }),
      fetchWithRetry(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, { headers }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return GITHUB_FALLBACK_DATA;
    }

    const user  = await userRes.json();
    const repos: GitHubApiRepo[] = await reposRes.json();

    let totalStars = 0;
    let totalForks = 0;
    const languages: Record<string, number> = {};

    let top1: GitHubApiRepo | null = null;
    let top2: GitHubApiRepo | null = null;
    let top3: GitHubApiRepo | null = null;

    let minTopStars = -1;

    for (let i = 0; i < repos.length; i++) {
      const r = repos[i];
      const stars = r.stargazers_count;
      const forks = r.forks_count;
      const lang = r.language;

      totalStars += stars;
      totalForks += forks;

      if (lang) {
        languages[lang] = (languages[lang] || 0) + 1;
      }

      if (stars > minTopStars) {
          if (!top1 || stars > top1.stargazers_count) {
              top3 = top2;
              top2 = top1;
              top1 = r;
          } else if (!top2 || stars > top2.stargazers_count) {
              top3 = top2;
              top2 = r;
          } else if (!top3 || stars > top3.stargazers_count) {
              top3 = r;
          }
          if (top3) minTopStars = top3.stargazers_count;
      }
    }

    const topReposArr = [];
    if (top1) topReposArr.push(top1);
    if (top2) topReposArr.push(top2);
    if (top3) topReposArr.push(top3);

    const topRepos = topReposArr.map(r => ({
        name:        r.name,
        description: r.description,
        stars:       r.stargazers_count,
        forks:       r.forks_count,
        language:    r.language,
        url:         r.html_url,
    }));

    const stats: GitHubStats = {
      followers: user.followers,
      publicRepos: user.public_repos,
      totalStars,
      totalForks,
      languages,
      topRepos,
      fetchedAt: Date.now(),
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(stats));
    return stats;
  } catch (error) {
    console.error('Failed to fetch github stats', error);
    return GITHUB_FALLBACK_DATA;
  }
}

// Day 74: In-memory module-level map cache keyed by API URL to prevent duplicates within the same page session
const fetchCache = new Map<string, { data: Response; timestamp: number }>();

// Day 73: Retry logic with exponential backoff
export async function fetchWithRetry(url: string, options?: RequestInit): Promise<Response> {
  // Check memory cache first (Day 74)
  const cached = fetchCache.get(url);
  if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes
    return cached.data.clone(); // Clone response so it can be read multiple times
  }

  const delays = [500, 1000, 2000];
  let attempt = 0;

  while (attempt <= 3) {
    try {
      const response = await fetch(url, options);

      // Cache successful response (Day 74)
      if (response.ok) {
        // Only clone if the environment supports it (not in vitest basic mocks)
        try {
          fetchCache.set(url, { data: response.clone(), timestamp: Date.now() });
        } catch {
          fetchCache.set(url, { data: response, timestamp: Date.now() });
        }
        return response;
      }

      // Retry on 429 (rate limit) or 5xx (server errors)
      if (response.status === 429 || response.status >= 500) {
        if (attempt === 3) return response; // Final attempt, return the error response
        await new Promise(resolve => setTimeout(resolve, delays[attempt]));
        attempt++;
      } else {
        // Do not retry on 4xx (except 429)
        return response;
      }
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise(resolve => setTimeout(resolve, delays[attempt]));
      attempt++;
    }
  }

  throw new Error('Maximum retry attempts exceeded');
}