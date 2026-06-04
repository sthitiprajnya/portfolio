'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LiviePanel from './LiviePanel';

export default function LivieBot() {
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false); // Day 69: Unread badge state
  const [showTooltip, setShowTooltip] = useState(false); // Day 70: Tooltip state

  // Day 69: Auto-trigger unread badge after a few seconds if panel hasn't been opened
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!open && !sessionStorage.getItem('livie_greeted')) {
        setHasUnread(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [open]);

  const handleOpen = () => {
    setOpen(o => !o);
    setHasUnread(false); // Clear badge on open
    sessionStorage.setItem('livie_greeted', 'true');
  };

  useEffect(() => {
    // Keyboard shortcut (Ctrl+/)
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        handleOpen();
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {/* ── Floating Toggle Button ─────────────────────────────── */}
      <motion.button
        onClick={handleOpen}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        className="
          fixed bottom-6 right-6 z-[9999]
          w-14 h-14
          glass-heavy rounded-pill
          border border-[#00F5FF]/30
          flex items-center justify-center
          shadow-glow-cyan
          group
          focus:outline-none
          focus-visible:ring-2 focus-visible:ring-[#00F5FF]/60
        "
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label={open ? 'Close Livie (Ctrl+/)' : 'Open Livie assistant (Ctrl+/)'}
        title="Ask Livie (Ctrl+/)"
      >
        {/* Pulse ring */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-pill border border-[#00F5FF]/40 pointer-events-none"
            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Day 69: Unread badge dot */}
        {hasUnread && !open && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-black animate-pulse" />
        )}

        {/* Icon: terminal cursor when closed, X when open */}
        <span className="text-[#00F5FF] font-mono text-sm font-bold select-none">
          {open ? '✕' : 'AI'}
        </span>

        {/* Day 70: Shortcut Tooltip */}
        <AnimatePresence>
          {showTooltip && !open && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="absolute right-[calc(100%+16px)] whitespace-nowrap bg-black/80 border border-border text-cyan font-mono text-[0.6rem] px-3 py-1.5 rounded-card shadow-[var(--glow-cyan-sm)] backdrop-blur-md"
            >
              Ask Livie (Ctrl+/)
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat Panel ────────────────────────────────────────── */}
      <AnimatePresence>
        {open && <LiviePanel onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
