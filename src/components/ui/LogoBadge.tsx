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

  if (src && !error) {
    // Security: onError handler ensures that if a malicious or broken asset is loaded,
    // we fallback to a safe monogram, preventing broken images and improving resilience.
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