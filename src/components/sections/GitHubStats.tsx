"use client";
import React, { useMemo } from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScrollReveal, fadeSlideUp, fadeSlideLeft, containerStagger } from '@/components/ui/ScrollReveal';
import CountUp from 'react-countup';

// Static mock data to replace unreliable live fetches on static GitHub Pages
const STATIC_GITHUB_STATS = {
  commits: 852,
  prs: 43,
  issues: 12,
  repos: 18,
  stars: 42,
  forks: 15,
  topLanguages: [
    { name: 'Python', percent: 65, color: '#3572A5' },
    { name: 'Bash', percent: 20, color: '#89e051' },
    { name: 'JavaScript', percent: 15, color: '#f1e05a' },
  ],
  pinnedRepos: [
    { name: 'gcp-bucket-auditor', desc: 'Automated enumeration and exploitation of GCP Storage misconfigurations.', lang: 'Python', stars: 15, forks: 4, url: 'https://github.com/sthitiprajnya/gcp-bucket-auditor' },
    { name: 'dlp-pipeline-poc', desc: 'Proof of concept for PCI/PII data masking via Google DLP API.', lang: 'Python', stars: 12, forks: 3, url: 'https://github.com/sthitiprajnya/dlp-pipeline-poc' },
    { name: 'vapt-jira-sync', desc: 'Automates Burp Suite XML finding ingestion into JIRA via REST API.', lang: 'Bash', stars: 8, forks: 5, url: 'https://github.com/sthitiprajnya/vapt-jira-sync' },
    { name: 'wazuh-rules-pack', desc: 'Custom detection engineering rules for cryptojacking and lateral movement.', lang: 'XML', stars: 7, forks: 3, url: 'https://github.com/sthitiprajnya/wazuh-rules-pack' }
  ]
};

export function GitHubStats() {
  // Generate random static heatmap data for the last 52 weeks
  const heatmapData = useMemo(() => {
    const weeks = [];
    for (let w = 0; w < 52; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        // Randomly generate activity level 0-4
        let level = 0;
        const rand = Math.random();
        if (rand > 0.95) level = 4;
        else if (rand > 0.8) level = 3;
        else if (rand > 0.6) level = 2;
        else if (rand > 0.4) level = 1;
        days.push(level);
      }
      weeks.push(days);
    }
    return weeks;
  }, []);

  return (
    <section id="github" className="py-24 bg-black relative border-t border-border">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle number="07" title="Open Source Activity." />

        <div className="space-y-8">

          {/* Top Stats Row */}
          <ScrollReveal variants={containerStagger} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Public Repos" value={STATIC_GITHUB_STATS.repos} />
            <StatCard label="Total Stars" value={STATIC_GITHUB_STATS.stars} />
            <StatCard label="Total Forks" value={STATIC_GITHUB_STATS.forks} />
            <StatCard label="Total Commits" value={STATIC_GITHUB_STATS.commits} />
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column - Terminal Style Heatmap & Logs */}
            <ScrollReveal variants={fadeSlideUp} className="lg:col-span-7">
              <GlassCard className="h-full border border-cyan/20 p-0 flex flex-col overflow-hidden bg-[#0A0A0A]">
                <div className="flex items-center px-4 py-2 bg-black border-b border-border">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 mr-2"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 mr-2"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/80 mr-4"></span>
                  <span className="font-mono text-[0.65rem] text-text-muted tracking-widest">git log --oneline --author="sthitiprajnya"</span>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-center items-center relative">
                   <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTEwIDBMICAwIDBMMCAxMEwxMCAxMEwxMCAwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-[0.03] pointer-events-none"></div>

                   {/* Custom CSS Grid Heatmap */}
                   <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border">
                     <div className="flex gap-1 min-w-max">
                       {heatmapData.map((week, wIdx) => (
                         <div key={wIdx} className="flex flex-col gap-1">
                           {week.map((level, dIdx) => {
                             let bgClass = "bg-border/30";
                             if (level === 1) bgClass = "bg-cyan/30";
                             if (level === 2) bgClass = "bg-cyan/50";
                             if (level === 3) bgClass = "bg-cyan/80";
                             if (level === 4) bgClass = "bg-cyan shadow-[0_0_5px_var(--color-cyan)]";

                             return <div key={`${wIdx}-${dIdx}`} className={`w-3 h-3 rounded-[2px] ${bgClass}`} />
                           })}
                         </div>
                       ))}
                     </div>
                     <div className="flex justify-between items-center mt-3 font-mono text-[0.55rem] text-text-muted uppercase">
                       <span>Less</span>
                       <div className="flex gap-1 items-center">
                         <div className="w-3 h-3 rounded-[2px] bg-border/30" />
                         <div className="w-3 h-3 rounded-[2px] bg-cyan/30" />
                         <div className="w-3 h-3 rounded-[2px] bg-cyan/50" />
                         <div className="w-3 h-3 rounded-[2px] bg-cyan/80" />
                         <div className="w-3 h-3 rounded-[2px] bg-cyan" />
                       </div>
                       <span>More</span>
                     </div>
                   </div>

                   <div className="w-full mt-6 space-y-3">
                     <div className="flex items-center gap-3">
                       <span className="font-mono text-cyan text-sm">{'>'}</span>
                       <div className="flex-1 h-2 bg-border rounded-full overflow-hidden flex">
                         {STATIC_GITHUB_STATS.topLanguages.map(lang => (
                           <div key={lang.name} style={{ width: `${lang.percent}%`, backgroundColor: lang.color }} className="h-full" />
                         ))}
                       </div>
                     </div>
                     <div className="flex justify-center gap-4">
                        {STATIC_GITHUB_STATS.topLanguages.map(lang => (
                           <div key={lang.name} className="flex items-center gap-1.5 font-mono text-[0.6rem] text-text-secondary uppercase">
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                             {lang.name} <span className="opacity-50">{lang.percent}%</span>
                           </div>
                        ))}
                     </div>
                   </div>

                   <div className="mt-8 grid grid-cols-3 gap-6 w-full text-center border-t border-border/50 pt-6">
                     <div>
                       <div className="font-mono text-xl text-cyan font-bold mb-1"><CountUp end={STATIC_GITHUB_STATS.commits} duration={2.5} /></div>
                       <div className="font-mono text-[0.6rem] text-text-muted uppercase tracking-widest">Commits</div>
                     </div>
                     <div>
                       <div className="font-mono text-xl text-green font-bold mb-1"><CountUp end={STATIC_GITHUB_STATS.prs} duration={2.5} /></div>
                       <div className="font-mono text-[0.6rem] text-text-muted uppercase tracking-widest">Pull Requests</div>
                     </div>
                     <div>
                       <div className="font-mono text-xl text-amber font-bold mb-1"><CountUp end={STATIC_GITHUB_STATS.issues} duration={2.5} /></div>
                       <div className="font-mono text-[0.6rem] text-text-muted uppercase tracking-widest">Issues</div>
                     </div>
                   </div>
                </div>
              </GlassCard>
            </ScrollReveal>

            {/* Right Column - Top Repos */}
            <ScrollReveal variants={fadeSlideLeft} className="lg:col-span-5">
              <GlassCard className="p-6 h-full flex flex-col">
                <h3 className="font-mono text-sm text-white mb-6 border-b border-border pb-2">
                  // PINNED_REPOSITORIES
                </h3>

                <div className="flex flex-col space-y-4 flex-grow">
                  {STATIC_GITHUB_STATS.pinnedRepos.map((repo, idx) => (
                    <a
                      key={idx}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-4 rounded bg-black/40 border border-border hover:border-cyan/50 hover:bg-black/60 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-heading font-bold text-cyan text-sm group-hover:underline flex items-center gap-2">
                          <svg className="w-4 h-4 opacity-70" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path></svg>
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
                        {repo.desc}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATIC_GITHUB_STATS.topLanguages.find(l => l.name === repo.lang)?.color || '#3572A5' }} />
                        <span className="font-mono text-[0.6rem] text-text-muted">{repo.lang}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
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