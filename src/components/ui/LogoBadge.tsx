import Image from 'next/image';
import { useState } from 'react';

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
    // If it's a PNG that is black (like nmap.png or zabbix.png), we'll let the user add `invert dark:invert-0` in className
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