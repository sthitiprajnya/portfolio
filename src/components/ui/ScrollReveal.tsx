"use client";
import React, { useMemo } from 'react';
import { motion, type Variants, type HTMLMotionProps } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export const fadeSlideUp: Variants = {
  hidden:  { opacity: 0, y: 80, filter: 'blur(10px)', rotateX: 10 },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    rotateX: 0,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  },
};

export const fadeSlideLeft: Variants = {
  hidden:  { opacity: 0, x: -100, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] }
  },
};

export const scaleReveal: Variants = {
  hidden:  { opacity: 0, scale: 0.9, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] }
  },
};

export const containerStagger: Variants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  },
};

export const cinematicReveal: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(100% 0 0 0)' },
  visible: {
    opacity: 1,
    clipPath: 'inset(0% 0 0 0)',
    transition: { duration: 1.5, ease: [0.77, 0, 0.175, 1] }
  }
};

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  stagger?: number; // Day 48
}

export function ScrollReveal({
  children,
  variants = fadeSlideUp,
  className,
  delay,
  stagger,
  ...props
}: ScrollRevealProps) {
  const { ref, inView } = useInView({
    threshold: 0.12,
    triggerOnce: true,
  });
  const prefersReducedMotion = usePrefersReducedMotion();

  const activeVariants = useMemo(() => {
    if (delay && variants.visible && typeof variants.visible === 'object' && 'transition' in variants.visible) {
      return {
        ...variants,
        visible: {
          ...variants.visible,
          transition: {
            ...variants.visible.transition,
            delay
          }
        }
      };
    }
    return variants;
  }, [variants, delay]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Day 48: Stagger children implementation
  if (stagger !== undefined) {
    // Strip motion props if returning a standard div wrapper to avoid TS errors
    const standardProps = { ...props } as Omit<HTMLMotionProps<"div">, "style" | "transition" | "variants" | "initial" | "animate">;

    return (
      <div ref={ref} className={className} style={props.style as React.CSSProperties} {...standardProps}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;

          return (
            <motion.div
              variants={variants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ delay: delay ? delay + index * stagger : index * stagger }}
            >
              {child}
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      variants={activeVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}