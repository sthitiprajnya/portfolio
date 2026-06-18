"use client";
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

// The avatar renders as a terminal "biometric ID scan" using JetBrains Mono,
// which is already loaded by the project. Each character is chosen so the face
// reads clearly even at small sizes. The scanline sweeps over the top half;
// the metadata panel beneath uses real portfolio data.
const AVATAR_LINES = [
  '  ╭──────────────────────────╮  ',
  '  │  BIOMETRIC_ID :: SB-2025 │  ',
  '  ╰──────────────────────────╯  ',
  '                                 ',
  '         ╭───────────╮           ',
  '         │  ◈     ◈  │           ',
  '         │           │           ',
  '         │   ╌╌╌╌╌   │           ',
  '         │  ╰─────╯  │           ',
  '         ╰─────┬─────╯           ',
  '        ╭──────┴──────╮          ',
  '        │ ▓▓▓▓▓▓▓▓▓▓ │          ',
  '        │ ▓▓▓▓▓▓▓▓▓▓ │          ',
  '        ╰─────────────╯          ',
  '                                 ',
];

// Metadata rows shown beneath the face — each line types in sequentially.
const META_LINES = [
  '├─ NAME   :  STHITAPRAJNA BISWAL',
  '├─ ROLE   :  INFOSEC ENGINEER',
  '├─ ORG    :  iServeU TECHNOLOGY',
  '├─ BASE   :  BHUBANESWAR, IN',
  '╰─ STATUS :  ● ACTIVE',
];

interface AsciiAvatarProps {
  className?: string;
}

// BOLT: Extracting the face animation to a sub-component to prevent re-rendering the entire Avatar card every 120ms.
function AsciiFace({ inView }: { inView: boolean }) {
  const [scanPos, setScanPos] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !inView) return;
    const timer = setInterval(() => {
      setScanPos(prev => (prev >= AVATAR_LINES.length - 1 ? 0 : prev + 1));
    }, 120);
    return () => clearInterval(timer);
  }, [prefersReducedMotion, inView]);

  return (
    <>
      {AVATAR_LINES.map((line, idx) => (
        <div
          key={idx}
          className={clsx(
            'relative font-mono text-[0.68rem] leading-[1.45] whitespace-pre transition-colors duration-100',
            !prefersReducedMotion && idx === scanPos
              ? 'text-cyan bg-cyan/10'
              : 'text-cyan/70'
          )}
        >
          {line}
        </div>
      ))}
      {!prefersReducedMotion && (
        <div
          className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan/40 to-transparent pointer-events-none"
          style={{ animation: 'scan-sweep 3s linear infinite' }}
        />
      )}
    </>
  );
}

// BOLT: Extracting the metadata animation to a sub-component to prevent re-rendering the entire Avatar card every 300ms.
function MetadataPanel({ inView }: { inView: boolean }) {
  const [visibleMeta, setVisibleMeta] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !inView) {
      if (prefersReducedMotion) setVisibleMeta(META_LINES.length);
      return;
    }
    const timer = setInterval(() => {
      setVisibleMeta(prev => {
        if (prev >= META_LINES.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 300);
    return () => clearInterval(timer);
  }, [prefersReducedMotion, inView]);

  return (
    <div className="border-t border-[var(--glass-border)] bg-[rgba(0,0,0,0.6)] px-3 pt-2 pb-3 space-y-[2px] relative z-10">
      {META_LINES.map((line, idx) => (
        <div
          key={idx}
          className={clsx(
            'font-mono text-[0.65rem] leading-relaxed transition-all duration-300',
            idx < visibleMeta
              ? 'opacity-100 translate-x-0 text-green/90'
              : 'opacity-0 -translate-x-2'
          )}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

export function AsciiAvatar({ className }: AsciiAvatarProps) {
  const [isHuman, setIsHuman] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref, inView } = useInView({ threshold: 0 });

  return (
    <div
      ref={ref}
      className={clsx(
        'relative rounded-card border border-[var(--glass-border)] glass-heavy overflow-hidden',
        'shadow-[0_0_30px_rgba(0,245,255,0.12)]',
        'group transition-all duration-500 hover:border-[rgba(0,245,255,0.4)] hover:shadow-[var(--glow-cyan-md)]',
        className
      )}
    >
      {/* ── Terminal title bar ───────────────────────────── */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-[rgba(0,0,0,0.6)] border-b border-[var(--glass-border)] relative z-10">
        <span className="w-3 h-3 rounded-full bg-red-500/70" />
        <span className="w-3 h-3 rounded-full bg-amber-500/70" />
        <span className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-2 font-mono text-[0.65rem] text-text-muted tracking-widest">
          biometric_scan.sh
        </span>
        {/* Toggle Switch */}
        <button
          onClick={() => setIsHuman(!isHuman)}
          className="ml-auto flex items-center bg-black/50 rounded-pill border border-cyan/30 p-0.5 w-20 outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-1 focus-visible:ring-offset-black glass-pill"
          aria-label={isHuman ? "Switch to SCAN mode" : "Switch to HUMAN mode"}
          title={isHuman ? "Switch to SCAN mode" : "Switch to HUMAN mode"}
        >
          <span className={clsx(
            "w-1/2 text-center text-[0.55rem] font-mono tracking-wider py-0.5 rounded-pill transition-all",
            !isHuman ? "bg-cyan text-black font-bold" : "text-text-muted"
          )}>SCAN</span>
          <span className={clsx(
            "w-1/2 text-center text-[0.55rem] font-mono tracking-wider py-0.5 rounded-pill transition-all",
            isHuman ? "bg-green text-black font-bold" : "text-text-muted"
          )}>HUMAN</span>
        </button>
      </div>

      {/* ── Image Area ─────────────────────────────────── */}
      <div className="relative h-[240px] select-none flex items-center justify-center overflow-hidden bg-[rgba(0,0,0,0.4)] relative z-10" aria-hidden="true">

        {/* ASCII View */}
        <div className={clsx("absolute inset-0 pt-2 px-2 transition-opacity duration-500", !isHuman ? "opacity-100 z-10" : "opacity-0 z-0")}>
          <AsciiFace inView={inView} />
        </div>

        {/* Human View */}
        <div className={clsx("absolute inset-0 transition-opacity duration-500", isHuman ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
          <Image
            src="/portfolio/images/profile.jpg"
            alt="Sthitaprajna Biswal"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-top opacity-80"
          />
          {/* Scanline filter overlay for hacker aesthetic */}
          <div className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-cyan) 2px, var(--color-cyan) 4px)`
          }} />
          <div className="absolute inset-0 bg-cyan/10 mix-blend-color pointer-events-none" />

          {!prefersReducedMotion && (
            <div className="absolute inset-0 scan-line-effect pointer-events-none" />
          )}
        </div>

      </div>

      {/* ── Metadata panel ─────────────────────────────────── */}
      <MetadataPanel inView={inView} />

      {/* ── Corner targeting reticles (matching hero aesthetic) ── */}
      <div className="absolute top-10 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan/60 pointer-events-none z-20" />
      <div className="absolute top-10 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan/60 pointer-events-none z-20" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan/60 pointer-events-none z-20" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan/60 pointer-events-none z-20" />

      {/* Hover glitch flash */}
      <div
        className="absolute inset-0 bg-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />
    </div>
  );
}
