"use client";
import React, { useEffect, useState, useRef } from 'react';
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
  const prefersReducedMotion = usePrefersReducedMotion();
  // BOLT: Optimize AsciiFace animation by using refs and direct DOM manipulation
  // instead of React state. This prevents React from continuously reconciling
  // and re-rendering the component every 120ms.
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);

  const currentPosRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (prefersReducedMotion || !inView) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const startTimer = () => {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          let currentPos = currentPosRef.current;
          const prevLine = linesRef.current[currentPos];
          if (prevLine) {
            prevLine.classList.remove('text-cyan', 'bg-cyan/10');
            prevLine.classList.add('text-cyan/70');
          }
          currentPos = currentPos >= AVATAR_LINES.length - 1 ? 0 : currentPos + 1;
          currentPosRef.current = currentPos;
          const nextLine = linesRef.current[currentPos];
          if (nextLine) {
            nextLine.classList.remove('text-cyan/70');
            nextLine.classList.add('text-cyan', 'bg-cyan/10');
          }
        }, 120);
      }
    };

    const stopTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      // BOLT: Pause animation when tab is inactive to save CPU and battery
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    };

    if (!document.hidden) {
      startTimer();
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopTimer();
    if (prefersReducedMotion || !inView) return;

    let timer: NodeJS.Timeout | null = null;

    const startAnimation = () => {
      if (timer) return;
      timer = setInterval(() => {
        let currentPos = currentPosRef.current;
        const prevLine = linesRef.current[currentPos];
        if (prevLine) {
          prevLine.classList.remove('text-cyan', 'bg-cyan/10');
          prevLine.classList.add('text-cyan/70');
        }
        currentPos = currentPos >= AVATAR_LINES.length - 1 ? 0 : currentPos + 1;
        currentPosRef.current = currentPos;
        const nextLine = linesRef.current[currentPos];
        if (nextLine) {
          nextLine.classList.remove('text-cyan/70');
          nextLine.classList.add('text-cyan', 'bg-cyan/10');
        }
      }, 120);
    };

    const stopAnimation = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    // BOLT: Only run animation when tab is visible to save CPU/battery
    if (!document.hidden) {
      startAnimation();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopAnimation();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [prefersReducedMotion, inView]);

  return (
    <>
      {AVATAR_LINES.map((line, idx) => (
        <div
          key={idx}
          ref={(el) => {
            linesRef.current[idx] = el;
          }}
          className={clsx(
            'relative font-mono text-[0.68rem] leading-[1.45] whitespace-pre transition-colors duration-100',
            !prefersReducedMotion && idx === 0 ? 'text-cyan bg-cyan/10' : 'text-cyan/70'
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const metaLinesRef = useRef<(HTMLDivElement | null)[]>([]);
  const currentVisibleRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (prefersReducedMotion || !inView) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (prefersReducedMotion) {
         metaLinesRef.current.forEach(el => {
           if(el) {
              el.classList.remove('opacity-0', '-translate-x-2');
              el.classList.add('opacity-100', 'translate-x-0', 'text-green/90');
           }
         });
      }
      return;
    }

    const startTimer = () => {
      if (!timerRef.current && currentVisibleRef.current < META_LINES.length) {
        timerRef.current = setInterval(() => {
          let currentVisible = currentVisibleRef.current;
          if (currentVisible >= META_LINES.length) {
            stopTimer();
            return;
          }
          const line = metaLinesRef.current[currentVisible];
          if (line) {
            line.classList.remove('opacity-0', '-translate-x-2');
            line.classList.add('opacity-100', 'translate-x-0', 'text-green/90');
          }
          currentVisible++;
          currentVisibleRef.current = currentVisible;
        }, 300);
      }
    };

    const stopTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
    let timer: NodeJS.Timeout | null = null;

    const startAnimation = () => {
      if (timer) return;
      if (currentVisibleRef.current >= META_LINES.length) return;

      timer = setInterval(() => {
        let currentVisible = currentVisibleRef.current;
        if (currentVisible >= META_LINES.length) {
          stopAnimation();
          return;
        }
        const line = metaLinesRef.current[currentVisible];
        if (line) {
          line.classList.remove('opacity-0', '-translate-x-2');
          line.classList.add('opacity-100', 'translate-x-0', 'text-green/90');
        }
        currentVisible++;
        currentVisibleRef.current = currentVisible;
      }, 300);
    };

    const stopAnimation = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const handleVisibilityChange = () => {
      // BOLT: Pause animation when tab is inactive to save CPU and battery
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    if (!document.hidden) {
      startTimer();
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopTimer();
      startAnimation();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopAnimation();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [prefersReducedMotion, inView]);

  return (
    <div className="border-t border-[var(--glass-border)] bg-[rgba(0,0,0,0.6)] px-3 pt-2 pb-3 space-y-[2px] relative z-10">
      {META_LINES.map((line, idx) => (
        <div
          key={idx}
          ref={(el) => {
            metaLinesRef.current[idx] = el;
          }}
          className={clsx(
            'font-mono text-[0.65rem] leading-relaxed transition-all duration-300 opacity-0 -translate-x-2'
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
          aria-pressed={isHuman}
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
