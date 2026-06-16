"use client";
import React, { useState } from 'react';
import Image from 'next/image';

interface LogoBadgeProps {
  src?: string;
  alt: string;
  monogram?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function LogoBadge({
  src, alt, monogram = '??', width = 28, height = 28, className = ''
}: LogoBadgeProps) {
  const [error, setError] = useState(false);

  // Security: Fallback to monogram if image fails to load (prevents broken image icon and potential injection)
  if (src && !error) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`object-contain ${className}`}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={alt}
      title={alt}
      className={`inline-flex items-center justify-center rounded-card font-mono text-xs font-bold
        bg-cyan/10 border border-cyan/30 text-cyan ${className}`}
      style={{ width, height }}
    >
      {monogram}
    </span>
  );
}
