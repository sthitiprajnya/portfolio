'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed right-0 top-0 bottom-0 w-1 md:w-1.5 z-50 pointer-events-none flex flex-col justify-end bg-black/20 border-l border-white/5">
      <motion.div
        className="w-full bg-cyan shadow-[0_0_10px_rgba(0,245,255,0.8)] origin-top"
        style={{ scaleY }}
      />
    </div>
  );
}
