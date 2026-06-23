"use client";
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
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
  const [linkCopied, setLinkCopied] = useState(false);
  const [copiedDocId, setCopiedDocId] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // BOLT: Performance Optimization — Lazy-load the ~1.5MB PDF asset.
  // We use IntersectionObserver with a rootMargin of 200px to ensure the PDF starts
  // loading just before the user scrolls to it, improving TTI and reducing initial bandwidth.
  const { ref: iframeRef, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px',
  });

  const handleDownload = () => {
    setDownloadStarted(true);
    setTimeout(() => setDownloadStarted(false), 3000);
  };

  const handleCopyDocId = async () => {
    try {
      await navigator.clipboard.writeText('SB-RESUME-2025-v3');
      setCopiedDocId(true);
      setTimeout(() => setCopiedDocId(false), 2000);
    } catch (err) {
      console.error('Failed to copy Doc ID:', err);
    }
  };

  const handleCopyHash = async () => {
    try {
      await navigator.clipboard.writeText(RESUME_SHA256);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } catch (err) {
      console.error('Failed to copy SHA256:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      const fullUrl = `${window.location.origin}${PERSONAL.resumeUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy direct link:', err);
    }
  };

  return (
    <section
      id="resume"
      tabIndex={-1}
      aria-labelledby="section-title-resume"
      className="py-24 bg-deep relative border-t border-border overflow-hidden outline-none"
    >

      {/* Faint diagonal lines background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, var(--color-cyan) 0, var(--color-cyan) 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle number="08" title="Classified File." id="resume" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* ── Left: Document viewer ── */}
          <ScrollReveal variants={fadeSlideUp} className="lg:col-span-7">
            <div className="overflow-hidden border border-[var(--glass-border)] hover:shadow-[var(--glow-amber-sm)] glass-heavy rounded-card relative" data-orb-target="true">

              {/* Document title bar */}
              <div className="flex items-center justify-between px-5 py-3 bg-[rgba(0,0,0,0.6)] border-b border-[var(--glass-border)] relative z-10">
                <div className="flex items-center space-x-3">
                  {/* Fake "PDF" icon indicator */}
                  <div className="w-8 h-10 border border-amber/40 rounded-card relative flex items-center justify-center">
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
                  <span className="px-2 py-0.5 border border-green/50 text-green font-mono text-[0.55rem] uppercase tracking-widest rounded-card">
                    VERIFIED
                  </span>
                  <span className="px-2 py-0.5 border border-amber/50 text-amber font-mono text-[0.55rem] uppercase tracking-widest rounded-card">
                    2025
                  </span>
                </div>
              </div>

              {/* Document body / PDF viewer */}
              <div ref={iframeRef} className="w-full bg-[rgba(0,0,0,0.4)] relative z-10 min-h-[600px] flex items-center justify-center">
                {inView ? (
                  <iframe
                    src={PERSONAL.resumeUrl}
                    className="w-full h-[600px] border-none"
                    title="Resume PDF"
                    sandbox="allow-same-origin"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    allow="camera 'none'; microphone 'none'; geolocation 'none'; autoplay 'none'; payment 'none'; usb 'none'; magnetometer 'none'; accelerometer 'none'; gyroscope 'none'"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-text-muted animate-pulse font-mono text-xs uppercase tracking-widest">
                    <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Decrypting_Document_Buffer...
                  </div>
                )}
              </div>

              {/* Footer stamp */}
              <div className="px-6 py-4 border-t border-[var(--glass-border)] flex flex-col md:flex-row justify-between items-center bg-[rgba(0,0,0,0.6)] gap-4 relative z-10">
                <span className="text-[0.6rem] text-text-muted font-mono text-center md:text-left">
                  DOC_ID: <span className="relative inline-block">
                    <span
                      className="redacted group/doc"
                      tabIndex={0}
                      role="button"
                      aria-label="Reveal and copy document ID"
                      title="Reveal and copy document ID"
                      onClick={handleCopyDocId}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleCopyDocId();
                        }
                      }}
                    >
                      SB-RESUME-2025-v3
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black border border-amber text-amber px-2 py-0.5 rounded-card opacity-0 invisible group-focus/doc:opacity-100 group-focus/doc:visible group-hover/doc:opacity-100 group-hover/doc:visible transition-all text-[0.5rem] w-max z-50 pointer-events-none">
                        Click to copy
                      </span>
                    </span>
                    <AnimatePresence>
                      {copiedDocId && (
                        <motion.span
                          initial={{ opacity: 0, y: 10, x: '-50%' }}
                          animate={{ opacity: 1, y: 0, x: '-50%' }}
                          exit={{ opacity: 0, y: 10, x: '-50%' }}
                          className="absolute bottom-full left-1/2 mb-2 px-2 py-1 bg-amber text-black font-mono text-[0.6rem] rounded-card font-bold shadow-[var(--glow-amber-sm)] z-20 pointer-events-none whitespace-nowrap"
                          role="status"
                          aria-live="polite"
                        >
                          COPIED!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span><br className="md:hidden" />
                  <span className="hidden md:inline"> · </span>SHA256: <span className="relative inline-block">
                    <span
                      className="redacted group/hash"
                      tabIndex={0}
                      role="button"
                      aria-label="Reveal and copy SHA256 hash"
                      title="Reveal and copy SHA256 hash"
                      onClick={handleCopyHash}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleCopyHash();
                        }
                      }}
                    >
                      {RESUME_SHA256}
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black border border-amber text-amber px-2 py-0.5 rounded-card opacity-0 invisible group-focus/hash:opacity-100 group-focus/hash:visible group-hover/hash:opacity-100 group-hover/hash:visible transition-all text-[0.5rem] w-max z-50 pointer-events-none">
                        Click to copy
                      </span>
                    </span>
                    <AnimatePresence>
                      {copiedHash && (
                        <motion.span
                          initial={{ opacity: 0, y: 10, x: '-50%' }}
                          animate={{ opacity: 1, y: 0, x: '-50%' }}
                          exit={{ opacity: 0, y: 10, x: '-50%' }}
                          className="absolute bottom-full left-1/2 mb-2 px-2 py-1 bg-amber text-black font-mono text-[0.6rem] rounded-card font-bold shadow-[var(--glow-amber-sm)] z-20 pointer-events-none whitespace-nowrap"
                          role="status"
                          aria-live="polite"
                        >
                          COPIED!
                        </motion.span>
                      )}
                    </AnimatePresence>
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
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        <span>DOWNLOADING...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        <span>DOWNLOAD_RESUME.pdf</span>
                      </>
                    )}
                  </span>
                </CyberButton>

                <button
                  onClick={handleCopyLink}
                  className={clsx(
                    "w-full mt-3 flex items-center justify-center space-x-2 py-2 border font-mono text-xs uppercase tracking-widest rounded-pill glass transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan relative z-10",
                    linkCopied ? "border-green text-green bg-green/10" : "border-cyan/30 text-cyan hover:bg-cyan/10"
                  )}
                  aria-label={linkCopied ? "Link copied to clipboard" : "Copy direct link to resume"}
                >
                  {linkCopied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>LINK_COPIED</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span>COPY_DIRECT_LINK</span>
                    </>
                  )}
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
