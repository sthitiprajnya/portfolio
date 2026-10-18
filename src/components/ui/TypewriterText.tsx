"use client";

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useAnimationActivity } from '@/hooks/useAnimationActivity';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type TypewriterSequenceItem = string | number;
type TypewriterWrapper = 'span' | 'div' | 'p';

interface TypewriterTextProps {
  sequence: TypewriterSequenceItem[];
  className?: string;
  wrapper?: TypewriterWrapper;
  cursor?: boolean;
  speed?: number;
}

export function TypewriterText({
  sequence,
  className,
  wrapper = 'span',
  cursor = true,
  speed = 40,
}: TypewriterTextProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isAnimationActive = useAnimationActivity(!prefersReducedMotion);
  const accessibleText = sequence.find((item): item is string => typeof item === 'string') ?? '';
  const classes = clsx('inline-block', className);

  if (!isAnimationActive) {
    const StaticWrapper = wrapper;
    return <StaticWrapper className={classes}>{accessibleText}</StaticWrapper>;
  }

  return (
    <AnimatedTypewriter
      sequence={sequence}
      accessibleText={accessibleText}
      className={classes}
      wrapper={wrapper}
      cursor={cursor}
      speed={speed}
    />
  );
}

interface AnimatedTypewriterProps {
  sequence: TypewriterSequenceItem[];
  accessibleText: string;
  className: string;
  wrapper: TypewriterWrapper;
  cursor: boolean;
  speed: number;
}

function AnimatedTypewriter({
  sequence,
  accessibleText,
  className,
  wrapper,
  cursor,
  speed,
}: AnimatedTypewriterProps) {
  const [displayedText, setDisplayedText] = useState(accessibleText);
  const sequenceRef = useRef(sequence);
  sequenceRef.current = sequence;

  useEffect(() => {
    const activeSequence = sequenceRef.current;
    const firstStringIndex = activeSequence.findIndex((item) => typeof item === 'string');
    let sequenceIndex = firstStringIndex === 0 ? 1 : 0;
    let currentText = accessibleText;
    let timeoutId: number | undefined;
    let cancelled = false;
    const characterDelay = Math.max(1, Math.abs(100 - speed));

    const scheduleStep = (delay: number) => {
      timeoutId = window.setTimeout(step, delay);
    };

    const step = () => {
      if (cancelled || sequenceIndex >= activeSequence.length) return;

      const item = activeSequence[sequenceIndex];
      if (typeof item === 'number') {
        sequenceIndex += 1;
        scheduleStep(Math.max(0, item));
        return;
      }

      const currentCharacters = Array.from(currentText);
      const targetCharacters = Array.from(item);

      if (!item.startsWith(currentText) && currentCharacters.length > 0) {
        currentCharacters.pop();
        currentText = currentCharacters.join('');
        setDisplayedText(currentText);
        scheduleStep(characterDelay);
        return;
      }

      if (currentCharacters.length < targetCharacters.length) {
        currentText = targetCharacters.slice(0, currentCharacters.length + 1).join('');
        setDisplayedText(currentText);
        scheduleStep(characterDelay);
        return;
      }

      sequenceIndex += 1;
      scheduleStep(0);
    };

    scheduleStep(0);

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [accessibleText, sequence, speed]);

  const AnimatedWrapper = wrapper;
  return (
    <AnimatedWrapper className={className} aria-label={accessibleText} aria-live="off">
      {displayedText}
      {cursor && <span className="ml-0.5 inline-block animate-pulse text-cyan" aria-hidden="true">|</span>}
    </AnimatedWrapper>
  );
}
