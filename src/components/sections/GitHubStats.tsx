"use client";
import React from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScrollReveal, fadeSlideUp, fadeSlideLeft, containerStagger } from '@/components/ui/ScrollReveal';
import { useGitHubStats } from '@/hooks/useGitHubStats';
import { PERSONAL } from '@/data/portfolio';
import CountUp from 'react-countup';


export function GitHubStats() {
  const { stats, loading } = useGitHubStats();

  return (
    <section id="github" className="py-24 bg-black relative border-t border-border">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle number="06" title="Open Source Activity." />

        {loading ? (
          <div
            className="h-64 flex items-center justify-center"
            role="status"
            aria-live="polite"
          >
            <div className="font-mono text-cyan animate-pulse">FETCHING_DATA...</div>
            <span className="sr-only">Loading GitHub statistics</span>
          </div>
        ) : (
          <div className="space-y-8">

            {/* Top Stats Row */}
            <ScrollReveal variants={containerStagger} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Public Repos" value={stats?.publicRepos || 0} />
              <StatCard label="Total Stars" value={stats?.totalStars || 0} />
              <StatCard label="Total Forks" value={stats?.totalForks || 0} />
              <StatCard label="Followers" value={stats?.followers || 0} />
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left Column - Third Party Embeds */}
              <ScrollReveal variants={fadeSlideUp} className="lg:col-span-7 space-y-8">

                <GlassCard className="p-1 border border-cyan/20">
                  <div className="w-full overflow-hidden rounded">
                    {/* Using github-readme-stats. Note: this requires user repo updates for live graphs */}
                    <img
                      src={`https://github-readme-stats.vercel.app/api/contribution?username=sthitiprajnya&theme=tokyonight`}
                      alt={`${PERSONAL.name}'s GitHub Stats`}
                      className="w-full h-auto object-cover"
                      width={495}
                      height={195}
                      loading="lazy"
                    />
                  </div>
                </GlassCard>

                <GlassCard className="p-1 border border-border">
                  <div className="w-full overflow-hidden rounded">
                    <img
                      src={`https://streak-stats.demolab.com/?user=sthitiprajnya&theme=highcontrast&hide_border=true`}
                      alt="Top Languages"
                      className="w-full h-auto object-cover"
                      width={495}
                      height={195}
                      loading="lazy"
                    />
                  </div>
                </GlassCard>

              </ScrollReveal>

              {/* Right Column - Top Repos */}
              <ScrollReveal variants={fadeSlideLeft} className="lg:col-span-5">
                <GlassCard className="p-6 h-full flex flex-col">
                  <h3 className="font-mono text-sm text-white mb-6 border-b border-border pb-2">
                    // TOP_REPOSITORIES
                  </h3>

                  <div className="flex flex-col space-y-4 flex-grow">
                    {stats?.topRepos.map((repo, idx) => (
                      <a
                        key={idx}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block p-4 rounded bg-black/40 border border-border hover:border-cyan/50 hover:bg-black/60 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-heading font-bold text-cyan text-sm group-hover:underline">
                            {repo.name}
                          </h4>
                          <div className="flex items-center space-x-3 font-mono text-[0.65rem] text-text-muted">
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .288l2.833 8.718h9.167l-7.417 5.389 2.833 8.718-7.416-5.388-7.417 5.388 2.833-8.718-7.416-5.389h9.167z"/></svg>
                              {repo.stars}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.942-3.535 4.033-4.408v2.398l3.967-3.967-3.967-3.967v2.398c-2.091-.873-3.469-2.619-4.033-4.408-1.536 2.05-2.033 5.421-2.033 7.977 0 2.556.497 5.927 2.033 7.977z"/></svg>
                              {repo.forks}
                            </span>
                          </div>
                        </div>
                        <p className="font-body text-xs text-text-secondary line-clamp-2 mb-3">
                          {repo.description || 'No description provided.'}
                        </p>
                        {repo.language && (
                          <span className="inline-block px-2 py-0.5 rounded-sm bg-surface border border-border font-mono text-[0.6rem] text-text-muted">
                            {repo.language}
                          </span>
                        )}
                      </a>
                    ))}

                    {(!stats?.topRepos || stats.topRepos.length === 0) && (
                      <div className="text-center py-8 font-mono text-sm text-text-muted">
                        No public repositories found.
                      </div>
                    )}
                  </div>
                </GlassCard>
              </ScrollReveal>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string, value: number }) {
  return (
    <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
      <div className="font-display text-3xl text-cyan mb-2">
        <CountUp end={value} duration={2} enableScrollSpy scrollSpyOnce />
      </div>
      <div className="font-mono text-[0.65rem] uppercase tracking-widest text-text-muted">
        {label}
      </div>
    </GlassCard>
  );
}