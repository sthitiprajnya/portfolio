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
  disabled,
  ...props
}: CyberButtonProps) {

  // Day 43: Ripple effect via DOM manipulation
  const handleRipple = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (disabled) return;

    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.style.position = "absolute";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = "20px";
    ripple.style.height = "20px";
    ripple.style.background = "rgba(0, 245, 255, 0.3)";
    ripple.style.borderRadius = "50%";
    ripple.style.transform = "translate(-50%, -50%) scale(0)";
    ripple.style.pointerEvents = "none";
    ripple.style.transition = "transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms ease-out";
    ripple.style.zIndex = "0"; // Behind text, but above background

    element.appendChild(ripple);

    // Trigger animation
    requestAnimationFrame(() => {
      ripple.style.transform = "translate(-50%, -50%) scale(15)";
      ripple.style.opacity = "0";
    });

    // Cleanup
    setTimeout(() => {
      if (element.contains(ripple)) {
        element.removeChild(ripple);
      }
    }, 600);
  };

  const baseClasses = cn(
    "cyber-button relative inline-flex items-center justify-center font-mono text-xs uppercase tracking-widest px-6 py-3 transition-all duration-300 overflow-hidden group border-2 rounded-pill bg-transparent active:scale-[0.97] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black glass-pill",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:bg-transparent disabled:hover:shadow-none disabled:hover:text-inherit disabled:pointer-events-none",
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
      <a
        className={baseClasses}
        onMouseDown={handleRipple}
        onTouchStart={handleRipple as unknown as React.TouchEventHandler<HTMLAnchorElement>}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button
      className={baseClasses}
      onMouseDown={handleRipple}
      onTouchStart={handleRipple as unknown as React.TouchEventHandler<HTMLButtonElement>}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {innerContent}
    </button>
  );
}