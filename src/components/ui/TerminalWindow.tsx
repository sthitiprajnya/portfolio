"use client";
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import clsx from 'clsx';

interface TerminalLine {
  prompt: string;
  command?: string;
  output?: string;
  cursor?: boolean;
}

interface TerminalWindowProps {
  lines: TerminalLine[];
  className?: string;
}

export function TerminalWindow({ lines, className }: TerminalWindowProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (inView && !started) {
      setStarted(true);
    }
  }, [inView, started]);

  useEffect(() => {
    if (!started || prefersReducedMotion) return;

    if (currentLineIndex < lines.length) {
      const currentLine = lines[currentLineIndex];

      if (currentLine.command) {
        if (currentCharIndex < currentLine.command.length) {
          const timeout = setTimeout(() => {
            setCurrentCharIndex(prev => prev + 1);
          }, 40 + Math.random() * 40); // Random typing speed
          return () => clearTimeout(timeout);
        } else {
          const timeout = setTimeout(() => {
            setCurrentLineIndex(prev => prev + 1);
            setCurrentCharIndex(0);
          }, 300); // Pause after command typed
          return () => clearTimeout(timeout);
        }
      } else {
        // Output line appears instantly
        const timeout = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
        }, 150);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentLineIndex, currentCharIndex, started, lines, prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className={clsx(
        "rounded-card overflow-hidden bg-black border border-border font-mono text-mono-sm text-green relative shadow-[var(--glow-green-sm)]",
        className
      )}
    >
      <div className="flex bg-[#1a1a1a] px-3 py-1 items-center border-b border-border">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="mx-auto text-[0.65rem] text-text-muted">sthitaprajna@kali ~</div>
      </div>
      <div className="p-4 leading-relaxed">
        {lines.map((line, lineIdx) => {
          if (!prefersReducedMotion && lineIdx > currentLineIndex) return null;

          const isCurrentTypingLine = !prefersReducedMotion && lineIdx === currentLineIndex && line.command;
          const showCursor = line.cursor || isCurrentTypingLine;

          let displayText = '';
          if (line.command) {
            displayText = isCurrentTypingLine
              ? line.command.substring(0, currentCharIndex)
              : line.command;
          } else if (line.output) {
            displayText = line.output;
          }

          return (
            <div key={lineIdx} className="flex whitespace-pre-wrap word-break break-words">
              <span className="text-text-muted mr-2 select-none">{line.prompt}</span>
              <span className={clsx(line.output && "text-text-secondary")}>
                {displayText}
                {showCursor && (
                  <span className="inline-block w-2 h-[1em] bg-green ml-1 animate-pulse align-middle" />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}