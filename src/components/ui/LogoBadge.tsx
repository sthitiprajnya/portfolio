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
  const [hasError, setHasError] = useState(false);

  // Security & Resilience: If src is provided and no error occurred, attempt to render the image.
  // We use an onError handler to detect broken or invalid (e.g. 404 HTML) images and fallback to monogram.
  if (src && !hasError) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`object-contain ${className}`}
        onError={() => setHasError(true)}
      />
    );
  }

  // Fallback to monogram for missing, broken, or insecurely loaded images.
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
