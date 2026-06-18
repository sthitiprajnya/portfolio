"use client";
import React from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ScrollReveal, fadeSlideUp, fadeSlideLeft, containerStagger } from '@/components/ui/ScrollReveal';
import { PERSONAL } from '@/data/portfolio';
import CountUp from 'react-countup';
import useSWR from 'swr';
import Image from 'next/image';
import { useState } from 'react';

const fetcher = async (url: string) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return await res.json();
  } finally {
    clearTimeout(id);
  }
};

const TOP_REPOS = [
  {
    name: 'VAPT-Automation',
    description: 'Automated vulnerability scanning pipeline leveraging Burp Suite Pro REST API and custom Python scripts.',
    language: 'Python',
    url: 'https://github.com/sthitiprajnya/VAPT-Automation',
    stars: 18,
    forks: 5
  },
  {
    name: 'GCP-Hardening-Scripts',
    description: 'Collection of Bash scripts to automatically audit and harden GCP environments according to CIS benchmarks.',
    language: 'Bash',
    url: 'https://github.com/sthitiprajnya/GCP-Hardening-Scripts',
    stars: 12,
    forks: 4
  },
  {
    name: 'Wazuh-SIEM-Rules',
    description: 'Custom decoders and rules for Wazuh to detect advanced persistent threats and anomalous activity.',
    language: 'XML',
    url: 'https://github.com/sthitiprajnya/Wazuh-SIEM-Rules',
    stars: 8,
    forks: 3
  },
  {
    name: 'DLP-Pipeline',
    description: 'Data Loss Prevention (DLP) mechanism integrated into CI/CD to prevent sensitive data leaks.',
    language: 'Python',
    url: 'https://github.com/sthitiprajnya/DLP-Pipeline',
    stars: 4,
    forks: 2
  }
];

const GITHUB_FALLBACK = { public_repos: 18, followers: 12, following: 0 };

export function GitHubStats() {
  const [heatmapError, setHeatmapError] = useState(false);
  const { data: githubData } = useSWR(
    'https://api.github.com/users/sthitiprajnya',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3_600_000, // 1 hour
      fallbackData: GITHUB_FALLBACK,
    }
  );

  const stats = React.useMemo(() => ({
    publicRepos: githubData?.public_repos || 18,
    totalStars: 42,
    totalForks: 14,
    followers: githubData?.followers || 12,
    commits: 852,
    prs: 43,
    issues: 12,
    topRepos: TOP_REPOS
  }), [githubData]);

  return (
    <section
      id="github"
      tabIndex={-1}
      aria-labelledby="section-title-open-source-activity"
      className="py-24 bg-black relative border-t border-border outline-none"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle number="07" title="Open Source Activity." id="github" />

          <div className="space-y-8">

            {/* Top Stats Row */}
            <ScrollReveal variants={containerStagger} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Public Repos" value={stats.publicRepos} />
              <StatCard label="Total Stars" value={stats.totalStars} />
              <StatCard label="Total Forks" value={stats.totalForks} />
              <StatCard label="Followers" value={stats.followers} />
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left Column - Terminal Style Heatmap & Logs */}
              <ScrollReveal variants={fadeSlideUp} className="lg:col-span-7">
                <div className="h-full p-0 flex flex-col overflow-hidden bg-[rgba(0,0,0,0.4)] glass rounded-card relative" data-orb-target="github-heatmap">
                  <div className="flex items-center px-4 py-2 bg-[rgba(0,0,0,0.6)] border-b border-[var(--glass-border)] relative z-10">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 mr-2"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 mr-2"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500/80 mr-4"></span>
                    <span className="font-mono text-[0.65rem] text-text-muted tracking-widest">git_log.sh --author="sthitiprajnya"</span>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-center items-center relative">
                     <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTEwIDBMICAwIDBMMCAxMEwxMCAxMEwxMCAwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-[0.03] pointer-events-none"></div>
                     {!heatmapError ? (
                       <Image
                         src={`https://ghchart.rshah.org/00F5FF/sthitiprajnya`}
                         alt={`${PERSONAL.name}'s GitHub Contribution Heatmap`}
                         className="w-full max-w-full drop-shadow-[0_0_8px_rgba(0,245,255,0.3)] filter brightness-110 contrast-125 invert-[1] hue-rotate-[180deg]"
                         style={{ opacity: 0.9 }}
                         width={495}
                         height={195}
                         unoptimized
                         onError={() => setHeatmapError(true)}
                       />
                     ) : (
                       <div className="w-full h-[195px] flex items-center justify-center border border-border/50 rounded bg-surface/50 text-text-muted font-mono text-[0.65rem] tracking-widest text-center px-4">
                         [HEATMAP_API_UNAVAILABLE] <br /> Showing static representation
                       </div>
                     )}
                     {/* Top languages bar */}
                     <div className="w-full mt-4 px-4">
                       <div className="flex justify-between font-mono text-[0.65rem] text-text-muted mb-1">
                         <span>TOP_LANGUAGES</span>
                       </div>
                       <div className="h-2 w-full flex rounded-card overflow-hidden">
                         <div className="bg-[#3572A5] h-full" style={{ width: '60%' }} title="Python 60%"></div>
                         <div className="bg-[#89e051] h-full" style={{ width: '25%' }} title="Bash 25%"></div>
                         <div className="bg-[#89e051] h-full opacity-70" style={{ width: '15%' }} title="Shell 15%"></div>
                       </div>
                       <div className="flex justify-between font-mono text-[0.55rem] text-text-muted mt-1 uppercase">
                         <span>Python 60%</span>
                         <span>Bash 25%</span>
                         <span>Shell 15%</span>
                       </div>
                     </div>

                     <div className="mt-4 grid grid-cols-3 gap-6 w-full text-center border-t border-[var(--glass-border)] pt-6 relative z-10">
                       <div>
                         <div className="font-mono text-xl text-cyan font-bold mb-1"><CountUp end={stats.commits} duration={2.5} enableScrollSpy scrollSpyOnce /></div>
                         <div className="font-mono text-[0.6rem] text-text-muted uppercase tracking-widest">Commits</div>
                       </div>
                       <div>
                         <div className="font-mono text-xl text-green font-bold mb-1"><CountUp end={stats.prs} duration={2.5} enableScrollSpy scrollSpyOnce /></div>
                         <div className="font-mono text-[0.6rem] text-text-muted uppercase tracking-widest">Pull Requests</div>
                       </div>
                       <div>
                         <div className="font-mono text-xl text-amber font-bold mb-1"><CountUp end={stats.issues} duration={2.5} enableScrollSpy scrollSpyOnce /></div>
                         <div className="font-mono text-[0.6rem] text-text-muted uppercase tracking-widest">Issues</div>
                       </div>
                     </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Right Column - Top Repos */}
              <ScrollReveal variants={fadeSlideLeft} className="lg:col-span-5">
                <div className="p-6 h-full flex flex-col glass rounded-card relative overflow-hidden">
                  <h3 className="font-mono text-sm text-white mb-6 border-b border-[var(--glass-border)] pb-2 relative z-10">
                    // TOP_REPOSITORIES
                  </h3>

                  <div className="flex flex-col space-y-4 flex-grow relative z-10">
                    {stats.topRepos.map((repo, idx) => (
                      <a
                        key={idx}
                        href={repo.url}
                        target="_blank" rel="noopener noreferrer"

                        className="group block p-4 rounded-card glass bg-[rgba(0,0,0,0.4)] hover:border-[rgba(0,245,255,0.4)] hover:bg-[rgba(0,0,0,0.6)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-heading font-bold text-cyan text-sm group-hover:underline">
                            {repo.name}
                          </h4>
                          <div className="flex items-center space-x-3 font-mono text-[0.65rem] text-text-muted">
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .288l2.833 8.718h9.167l-7.417 5.389 2.833 8.718-7.416-5.388-7.417 5.388 2.833-8.718-7.416-5.389h9.167z"/></svg>
                              {repo.stars}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.942-3.535 4.033-4.408v2.398l3.967-3.967-3.967-3.967v2.398c-2.091-.873-3.469-2.619-4.033-4.408-1.536 2.05-2.033 5.421-2.033 7.977 0 2.556.497 5.927 2.033 7.977z"/></svg>
                              {repo.forks}
                            </span>
                          </div>
                        </div>
                        <p className="font-body text-xs text-text-secondary line-clamp-2 mb-3">
                          {repo.description || 'No description provided.'}
                        </p>
                        {repo.language && (
                          <span className="inline-block px-2 py-0.5 rounded-pill glass-pill bg-[rgba(0,0,0,0.4)] border border-[var(--glass-border)] font-mono text-[0.6rem] text-text-muted">
                            {repo.language}
                          </span>
                        )}
                      </a>
                    ))}

                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
      </div>
    </section>
  );
}

const StatCard = React.memo(function StatCard({ label, value }: { label: string, value: number }) {
  return (
    <div className="p-6 flex flex-col items-center justify-center text-center glass rounded-card relative overflow-hidden">
      <div className="font-display text-3xl text-cyan mb-2 relative z-10">
        <CountUp end={value} duration={2} enableScrollSpy scrollSpyOnce />
      </div>
      <div className="font-mono text-[0.65rem] uppercase tracking-widest text-text-muted relative z-10">
        {label}
      </div>
    </div>
  );
});