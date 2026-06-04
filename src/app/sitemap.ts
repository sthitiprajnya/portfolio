export const dynamic = "force-static";

export default function sitemap() {
  // Day 85: Expanded sitemap with static dates
  const staticDate = '2025-06-01'; // Static date to avoid cache invalidation on every build

  return [
    {
      url: 'https://sthitiprajnya.github.io/portfolio/',
      lastModified: staticDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    { url: 'https://sthitiprajnya.github.io/portfolio/#about', lastModified: staticDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://sthitiprajnya.github.io/portfolio/#skills', lastModified: staticDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://sthitiprajnya.github.io/portfolio/#experience', lastModified: staticDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://sthitiprajnya.github.io/portfolio/#projects', lastModified: staticDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://sthitiprajnya.github.io/portfolio/#certifications', lastModified: staticDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://sthitiprajnya.github.io/portfolio/#contact', lastModified: staticDate, changeFrequency: 'monthly', priority: 0.8 },
  ];
}
