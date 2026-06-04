import Image from 'next/image';

interface LogoBadgeProps {
  src?: string;
  alt: string;
  monogram?: string;
  width?: number; // legacy prop
  height?: number; // legacy prop
  className?: string;
  size?: 'sm' | 'md' | 'lg'; // Day 56
  tooltip?: string; // Day 56
}

export function LogoBadge({
  src, alt, monogram = '??', width, height, className = '', size = 'md', tooltip
}: LogoBadgeProps) {

  // Day 56: Map sizes
  let finalWidth = width || 32;
  let finalHeight = height || 32;

  if (!width && !height) {
    if (size === 'sm') { finalWidth = 24; finalHeight = 24; }
    else if (size === 'md') { finalWidth = 32; finalHeight = 32; }
    else if (size === 'lg') { finalWidth = 48; finalHeight = 48; }
  }

  const tooltipProps = tooltip ? {
    title: tooltip,
    "aria-label": tooltip
  } : { "aria-label": alt };

  if (src) {
    return (
      <div className="relative group/badge inline-flex" {...tooltipProps}>
        <Image
          src={src}
          alt={alt}
          width={finalWidth}
          height={finalHeight}
          className={`object-contain ${className}`}
        />
        {tooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max opacity-0 invisible group-hover/badge:opacity-100 group-hover/badge:visible transition-all bg-black border border-cyan/30 text-cyan font-mono text-[0.6rem] px-2 py-1 rounded-card z-50 pointer-events-none">
            {tooltip}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group/badge inline-flex" {...tooltipProps}>
      <span
        className={`inline-flex items-center justify-center rounded-card font-mono text-xs font-bold
          bg-cyan/10 border border-cyan/30 text-cyan ${className}`}
        style={{ width: finalWidth, height: finalHeight }}
      >
        {monogram}
      </span>
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max opacity-0 invisible group-hover/badge:opacity-100 group-hover/badge:visible transition-all bg-black border border-cyan/30 text-cyan font-mono text-[0.6rem] px-2 py-1 rounded-card z-50 pointer-events-none">
          {tooltip}
        </div>
      )}
    </div>
  );
}