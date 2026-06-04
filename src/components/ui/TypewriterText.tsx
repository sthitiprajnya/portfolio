"use client";
import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import clsx from 'clsx';

interface TypewriterTextProps {
  sequence: (string | number | (() => void | Promise<void>))[];
  className?: string;
  wrapper?: keyof JSX.IntrinsicElements;
  cursor?: boolean;
  repeat?: number;
  speed?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99;
  onComplete?: () => void;
  cursorBlinkSpeed?: number;
}

export function TypewriterText({
  sequence,
  className,
  wrapper = 'span',
  cursor = true,
  repeat = Infinity,
  speed = 40,
  onComplete,
  cursorBlinkSpeed = 530
}: TypewriterTextProps) {
  // Append onComplete callback to sequence if it exists and repeat is 0
  const finalSequence = React.useMemo(() => {
    if (onComplete && (repeat === 0 || repeat === undefined)) {
      return [...sequence, onComplete];
    }
    return sequence;
  }, [sequence, onComplete, repeat]);

  return (
    <div
      className={clsx("inline-block typewriter-container", className)}
      aria-live="polite"
      style={{ '--cursor-blink-speed': `${cursorBlinkSpeed}ms` } as React.CSSProperties}
    >
      <TypeAnimation
        sequence={finalSequence}
        wrapper={wrapper as "span" | "div" | "p"}
        cursor={cursor}
        repeat={repeat}
        speed={speed}
        className="inline-block"
      />
    </div>
  );
}