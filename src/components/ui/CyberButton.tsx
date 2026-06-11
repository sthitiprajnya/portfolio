"use client";
import React from 'react';
import { cn } from '@/lib/utils';

type CyberButtonBaseProps = {
  children: React.ReactNode;
  className?: string;
  color?: 'cyan' | 'green' | 'amber';
};

type CyberButtonAsButtonProps = CyberButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
  };

type CyberButtonAsAnchorProps = CyberButtonBaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a';
  };

export type CyberButtonProps = CyberButtonAsButtonProps | CyberButtonAsAnchorProps;

export const CyberButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, CyberButtonProps>(({
  children,
  className,
  color = 'cyan',
  as = 'button',
  ...props
}, ref) => {

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
    const { ...anchorProps } = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} className={baseClasses} {...anchorProps}>
        {innerContent}
      </a>
    );
  }

  const { type, ...buttonProps } = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} type={type || 'button'} className={baseClasses} {...buttonProps}>
      {innerContent}
    </button>
  );
});

CyberButton.displayName = 'CyberButton';