'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LiviePanel from './LiviePanel';

export default function LivieBot() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(1); // initial greeting

  useEffect(() => {
    // Keyboard shortcut (Ctrl+/)
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setOpen(o => {
          if (!o) setUnread(0);
          return !o;
        });
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
        onClick={() => { setOpen(o => !o); setUnread(0); }}
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

        {/* Icon: terminal cursor when closed, X when open */}
        <span className="text-[#00F5FF] font-mono text-sm font-bold select-none">
          {open ? '✕' : 'AI'}
        </span>

        {/* Unread badge */}
        {!open && unread > 0 && (
          <span className="
            absolute -top-1 -right-1
            w-4 h-4 rounded-pill bg-[#00F5FF]
            text-black text-[9px] font-bold
            flex items-center justify-center
          ">
            {unread}
          </span>
        )}
      </motion.button>

      {/* ── Chat Panel ────────────────────────────────────────── */}
      <AnimatePresence>
        {open && <LiviePanel onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
