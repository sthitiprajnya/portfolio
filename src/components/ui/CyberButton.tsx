"use client";
import React from 'react';
import { cn } from '@/lib/utils';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'cyan' | 'green' | 'amber';
  as?: 'button' | 'a';
  href?: string;
  download?: string | boolean;
}

export function CyberButton({
  children,
  className,
  color = 'cyan',
  as = 'button',
  ...props
}: CyberButtonProps) {

  const baseClasses = cn(
    "cyber-button relative inline-flex items-center justify-center font-mono text-xs uppercase tracking-widest px-6 py-3 transition-all duration-300 overflow-hidden group border-2 rounded-pill bg-transparent active:scale-[0.97] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black glass-pill",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:bg-transparent disabled:hover:shadow-none disabled:hover:text-inherit",
    color === 'cyan' ? [
      "border-cyan text-cyan",
      "hover:bg-cyan hover:text-black",
      "hover:shadow-[var(--glow-cyan-md)]",
      "disabled:hover:text-cyan",
      "focus-visible:ring-cyan"
    ] : color === 'green' ? [
      "border-green text-green",
      "hover:bg-green hover:text-black",
      "hover:shadow-[var(--glow-green-md)]",
      "disabled:hover:text-green",
      "focus-visible:ring-green"
    ] : [
      "border-amber text-amber",
      "hover:bg-amber hover:text-black",
      "hover:shadow-[var(--glow-amber-md)]",
      "disabled:hover:text-amber",
      "focus-visible:ring-amber"
    ],
    className
  );

  const innerContent = (
    <>
      <span className="relative z-10 font-bold">{children}</span>
    </>
  );

  if (as === 'a') {
    return (
      <a className={baseClasses} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {innerContent}
      </a>
    );
  }

  return (
    <button className={baseClasses} {...props}>
      {innerContent}
    </button>
  );
}