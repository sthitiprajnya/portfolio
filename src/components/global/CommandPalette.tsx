'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { NAV_LINKS } from '@/components/sections/Navigation'; // Will export this from Navigation.tsx
import { useAudio } from '@/components/providers/AudioProvider';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { speak } = useAudio();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open palette on '?' or '/'
      if ((e.key === '?' || e.key === '/') && !isOpen && e.target === document.body) {
        e.preventDefault();
        setIsOpen(true);
        setQuery('');
        setSelectedIndex(0);
        speak("Command terminal ready.");
      }

      // Close palette
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, speak]);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure render before focus
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const filteredLinks = NAV_LINKS.filter(link =>
    link.label.toLowerCase().includes(query.toLowerCase()) ||
    link.id.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredLinks.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredLinks.length) % filteredLinks.length);
    } else if (e.key === 'Enter' && filteredLinks[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredLinks[selectedIndex].id, filteredLinks[selectedIndex].label);
    }
  };

  const handleSelect = (id: string, label?: string) => {
    setIsOpen(false);
    if (label) {
      speak(label);
    }
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 pt-[10vh] pb-20 sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative glass-heavy rounded-card shadow-[0_0_40px_rgba(0,245,255,0.1)] w-full max-w-lg overflow-hidden flex flex-col"
          >
            <div className="flex items-center px-4 py-4 border-b border-[var(--glass-border)] bg-[rgba(0,0,0,0.4)] relative z-10">
              <span className="text-cyan font-mono mr-3">{'>'}</span>
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder-text-secondary/50 focus:ring-0"
                placeholder="Jump to section... (Type to filter)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck="false"
              />
              <span className="text-text-secondary text-xs font-mono bg-black/50 px-2 py-1 rounded border border-border/50">ESC</span>
            </div>

            <div className="max-h-80 overflow-y-auto py-2 px-2 scrollbar-thin scrollbar-thumb-[var(--glass-border)] scrollbar-track-transparent relative z-10">
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link, i) => {
                  const isSelected = i === selectedIndex;
                  return (
                    <button
                      key={link.id}
                      className={clsx(
                        'w-full text-left px-4 py-3 rounded-md flex items-center justify-between font-mono text-sm transition-colors',
                        isSelected ? 'bg-cyan/10 text-cyan border border-cyan/20 glass-pill rounded-pill' : 'text-text-secondary hover:bg-white/5 hover:text-white border border-transparent rounded-pill'
                      )}
                      onClick={() => handleSelect(link.id, link.label)}
                      onMouseEnter={() => setSelectedIndex(i)}
                    >
                      <span className="flex items-center gap-3">
                        <span className={clsx("w-1.5 h-1.5 rounded-full", isSelected ? "bg-cyan" : "bg-transparent")} />
                        {link.label}
                      </span>
                      <span className="text-xs opacity-40">#{link.id}</span>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-text-secondary font-mono text-sm">
                  NO_MATCHES_FOUND
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-[var(--glass-border)] bg-[rgba(0,0,0,0.4)] flex items-center justify-between text-xs text-text-secondary font-mono relative z-10">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded border border-white/20">↑</kbd>
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded border border-white/20">↓</kbd>
                  <span className="ml-1">Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded border border-white/20">↵</kbd>
                  <span className="ml-1">Select</span>
                </span>
              </div>
              <span className="opacity-50">v2.0_SYSTEM_NAV</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
