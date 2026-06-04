'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@/components/sections/Navigation';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Day 67 & 68: Section markers and percentage
  const [markers, setMarkers] = useState<{ id: string; label: string; pct: number }[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [currentPct, setCurrentPct] = useState(0);

  useEffect(() => {
    const calculateMarkers = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const newMarkers = NAV_LINKS.map(link => {
        const el = document.getElementById(link.id);
        if (!el) return null;

        // Calculate the percentage position of the element relative to the scrollable area
        // We use offsetTop because we want the marker to correspond to when the element reaches the top of the viewport
        const pct = el.offsetTop / scrollHeight;
        return { id: link.id, label: link.label, pct: Math.min(1, Math.max(0, pct)) };
      }).filter(Boolean) as { id: string; label: string; pct: number }[];

      setMarkers(newMarkers);
    };

    calculateMarkers();
    window.addEventListener('resize', calculateMarkers);
    return () => window.removeEventListener('resize', calculateMarkers);
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(v => {
      setCurrentPct(Math.round(v * 100));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div
      className="fixed right-0 top-0 bottom-0 w-2 md:w-3 z-50 flex flex-col justify-end bg-black/20 border-l border-white/5 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-hidden="true"
    >
      <motion.div
        className="w-full bg-cyan shadow-[0_0_10px_rgba(0,245,255,0.8)] origin-top absolute top-0 left-0"
        style={{ scaleY, height: '100%' }}
      />

      {/* Day 67: Section Markers */}
      {markers.map(marker => (
        <div
          key={marker.id}
          className="absolute w-full h-[2px] bg-white/30 z-10 hover:bg-white transition-colors"
          style={{ top: `${marker.pct * 100}%` }}
          title={marker.label}
        >
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[0.6rem] text-text-secondary bg-black/80 px-2 py-0.5 rounded border border-white/10 whitespace-nowrap pointer-events-none">
            {marker.label}
          </div>
        </div>
      ))}

      {/* Day 68: Hover Percentage Label */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-full mr-4 pointer-events-none"
            style={{ top: `calc(${currentPct}% - 12px)` }}
          >
            <div className="bg-cyan text-black font-mono text-[0.65rem] font-bold px-2 py-1 rounded-pill shadow-[var(--glow-cyan-sm)]">
              {currentPct}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
