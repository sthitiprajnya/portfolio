"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { CyberButton }  from '@/components/ui/CyberButton';
import { ScrollReveal, fadeSlideUp, fadeSlideLeft, containerStagger } from '@/components/ui/ScrollReveal';
import { PERSONAL, RESUME_HIGHLIGHTS } from '@/data/portfolio';

const RESUME_SHA256 = 'f4a9f24d314dd2a6869c505d896746a84561e97392e77d1a53c6b8adcbc06c91';

// The resume section is styled like a "classified document viewer" inside a terminal.
// Redacted sections reveal on hover — a small UX easter egg that reinforces the
// security-engineer aesthetic and gets recruiters to interact with the page.
export function ResumePanel() {
  const [downloadStarted, setDownloadStarted] = useState(false);

  const handleDownload = () => {
    setDownloadStarted(true);
    setTimeout(() => setDownloadStarted(false), 3000);
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard! 📋`);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy. Please try again.');
    }
  };

  return (
    <section id="resume" className="py-24 bg-deep relative border-t border-border overflow-hidden">

      {/* Faint diagonal lines background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, var(--color-cyan) 0, var(--color-cyan) 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle number="08" title="Classified File." />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* ── Left: Document viewer ── */}
          <ScrollReveal variants={fadeSlideUp} className="lg:col-span-7">
            <div className="overflow-hidden border border-[var(--glass-border)] hover:shadow-[var(--glow-amber-sm)] glass-heavy rounded-2xl relative">

              {/* Document title bar */}
              <div className="flex items-center justify-between px-5 py-3 bg-[rgba(0,0,0,0.6)] border-b border-[var(--glass-border)] relative z-10">
                <div className="flex items-center space-x-3">
                  {/* Fake "PDF" icon indicator */}
                  <div className="w-8 h-10 border border-amber/40 rounded-sm relative flex items-center justify-center">
                    <span className="font-mono text-[0.5rem] text-amber font-bold">PDF</span>
                    <div className="absolute top-0 right-0 w-2 h-2 border-l border-b border-amber/40 bg-black" />
                  </div>
                  <div>
                    <div className="font-mono text-xs text-white font-bold tracking-widest">
                      Sthitaprajna_Biswal_Resume.pdf
                    </div>
                    <div className="font-mono text-[0.6rem] text-text-muted">
                      CLEARANCE: PUBLIC — DISTRIBUTION AUTHORISED
                    </div>
                  </div>
                </div>
                {/* Stamps */}
                <div className="hidden md:flex items-center space-x-2">
                  <span className="px-2 py-0.5 border border-green/50 text-green font-mono text-[0.55rem] uppercase tracking-widest rounded-sm">
                    VERIFIED
                  </span>
                  <span className="px-2 py-0.5 border border-amber/50 text-amber font-mono text-[0.55rem] uppercase tracking-widest rounded-sm">
                    2025
                  </span>
                </div>
              </div>

              {/* Document body / PDF viewer */}
              <div className="w-full bg-[rgba(0,0,0,0.4)] relative z-10">
                <iframe
                  src={PERSONAL.resumeUrl}
                  className="w-full h-[600px] border-none"
                  title="Resume PDF"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>

              {/* Footer stamp */}
              <div className="px-6 py-4 border-t border-[var(--glass-border)] flex flex-col md:flex-row justify-between items-center bg-[rgba(0,0,0,0.6)] gap-4 relative z-10">
                <span className="text-[0.6rem] text-text-muted font-mono text-center md:text-left">
                  DOC_ID: <span
                    className="redacted"
                    tabIndex={0}
                    role="button"
                    aria-label="Reveal and copy document ID"
                    title="Reveal and copy document ID"
                    onClick={() => handleCopy('SB-RESUME-2025-v3', 'Document ID')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCopy('SB-RESUME-2025-v3', 'Document ID');
                      }
                    }}
                  >SB-RESUME-2025-v3</span><br className="md:hidden" />
                  <span className="hidden md:inline"> · </span>SHA256: <span
                    className="redacted group/hash"
                    tabIndex={0}
                    role="button"
                    aria-label="Reveal and copy SHA256 hash"
                    title="Reveal and copy SHA256 hash"
                    onClick={() => handleCopy(RESUME_SHA256, 'SHA256 hash')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCopy(RESUME_SHA256, 'SHA256 hash');
                      }
                    }}
                  >
                    {RESUME_SHA256}
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black border border-amber text-amber px-2 py-0.5 rounded opacity-0 invisible group-focus/hash:opacity-100 group-focus/hash:visible group-hover/hash:opacity-100 group-hover/hash:visible transition-all text-[0.5rem] w-max z-50 pointer-events-none">
                      Click to copy
                    </span>
                  </span>
                </span>
                <span className="text-[0.6rem] text-green font-bold font-mono uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                  INTEGRITY OK
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Right: Stats + download CTA ── */}
          <ScrollReveal variants={fadeSlideLeft} className="lg:col-span-5 space-y-6">

            {/* Metric cards */}
            <ScrollReveal variants={containerStagger} className="grid grid-cols-2 gap-4">
              {RESUME_HIGHLIGHTS.map((item) => (
                <ScrollReveal key={item.label} variants={fadeSlideUp}>
                  <div className="p-4 text-center hover:shadow-[var(--glow-cyan-sm)] glass rounded-card relative overflow-hidden">
                    <div className="font-display text-2xl text-cyan font-bold mb-1 relative z-10">
                      {item.value}
                    </div>
                    <div className="font-mono text-[0.6rem] text-text-muted uppercase tracking-widest mb-1 relative z-10">
                      {item.label}
                    </div>
                    <div className="font-body text-[0.7rem] text-text-secondary leading-snug relative z-10">
                      {item.detail}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </ScrollReveal>

            {/* Download CTA */}
            <ScrollReveal variants={fadeSlideUp} delay={0.2}>
              <div className="p-6 border-green/20 hover:shadow-[var(--glow-green-sm)] glass rounded-card relative overflow-hidden">
                <div className="font-mono text-[0.65rem] text-text-muted uppercase tracking-widest mb-3 relative z-10">
                  // AUTHORISED DOWNLOAD
                </div>
                <p className="font-body text-sm text-text-secondary leading-relaxed mb-6 relative z-10">
                  Full resume with engagement details, methodology notes, and verified credentials.
                  PDF format — ready to forward to your hiring manager.
                </p>

                <CyberButton
                  as="a"
                  href={PERSONAL.resumeUrl}
                  download
                  color="green"
                  className="w-full justify-center rounded-pill glass"
                  onClick={handleDownload}
                >
                  <span className="flex items-center space-x-2">
                    {downloadStarted ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        <span>DOWNLOADING...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        <span>DOWNLOAD_RESUME.pdf</span>
                      </>
                    )}
                  </span>
                </CyberButton>

                <button
                  onClick={() => handleCopy(window.location.origin + window.location.pathname + '#resume', 'Resume Link')}
                  className="w-full mt-3 flex items-center justify-center space-x-2 py-2 border border-cyan/30 text-cyan font-mono text-xs uppercase tracking-widest rounded-pill glass hover:bg-cyan/10 transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan relative z-10"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>COPY_DIRECT_LINK</span>
                </button>

                {/* Audit trail label */}
                <div className="mt-4 text-center font-mono text-[0.6rem] text-text-muted flex items-center justify-center gap-2 relative z-10">
                  <span className="opacity-60">Last updated:</span>
                  <span className="text-white">June 2025</span>
                  <span className="opacity-40">|</span>
                  <span className="opacity-60">PDF (&lt;2MB)</span>
                </div>
              </div>
            </ScrollReveal>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
