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
  const [recentCmds, setRecentCmds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { speak } = useAudio();

  // Day 65: Recent commands from sessionStorage
  useEffect(() => {
    try {
      const recent = sessionStorage.getItem('cmd-recent');
      if (recent) {
        setRecentCmds(JSON.parse(recent));
      }
    } catch (e) {
      console.warn("Could not load recent commands from sessionStorage", e);
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      if (!isOpen) {
        setIsOpen(true);
        setQuery('');
        setSelectedIndex(0);
        speak("Command terminal ready.");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Open palette on '?' or '/'
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable;

      if ((e.key === '?' || e.key === '/') && !isOpen && !isInput) {
        e.preventDefault();
        handleOpen();
      }

      // Close palette
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        // Day 65: Clear recents on ESC
        try {
          sessionStorage.removeItem('cmd-recent');
          setRecentCmds([]);
        } catch {
          // ignore
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpen);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpen);
    };
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

  const filteredLinks = React.useMemo(() => NAV_LINKS.filter(link =>
    link.label.toLowerCase().includes(query.toLowerCase()) ||
    link.id.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  // Day 65: Build recent links list
  const recentLinks = React.useMemo(() => {
    if (query !== '') return [];
    return recentCmds.map(id => NAV_LINKS.find(l => l.id === id)).filter(Boolean) as typeof NAV_LINKS;
  }, [query, recentCmds]);

  const displayLinks = query === '' && recentLinks.length > 0 ? recentLinks : filteredLinks;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % displayLinks.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + displayLinks.length) % displayLinks.length);
    } else if (e.key === 'Enter' && displayLinks[selectedIndex]) {
      e.preventDefault();
      handleSelect(displayLinks[selectedIndex].id, displayLinks[selectedIndex].label);
    }
  };

  const handleSelect = (id: string, label?: string) => {
    setIsOpen(false);

    // Day 65: Add to recent
    try {
      const newRecents = [id, ...recentCmds.filter(r => r !== id)].slice(0, 5);
      sessionStorage.setItem('cmd-recent', JSON.stringify(newRecents));
      setRecentCmds(newRecents);
    } catch {
      // ignore
    }

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
                role="combobox"
                aria-expanded="true"
                aria-haspopup="listbox"
                aria-controls="command-palette-listbox"
                aria-autocomplete="list"
                aria-activedescendant={filteredLinks[selectedIndex] ? `option-${filteredLinks[selectedIndex].id}` : undefined}
                aria-label="Search site sections"
                className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder-text-secondary/50 focus:ring-0"
                placeholder="Jump to section... (Type to filter)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck="false"
                maxLength={100}
              />
              <span className="text-text-secondary text-xs font-mono bg-black/50 px-2 py-1 rounded-card border border-border/50" aria-hidden="true">ESC</span>
            </div>

            <div
              id="command-palette-listbox"
              role="listbox"
              aria-label="Search results"
              className="max-h-80 overflow-y-auto py-2 px-2 scrollbar-thin scrollbar-thumb-[var(--glass-border)] scrollbar-track-transparent relative z-10"
            >
              {query === '' && recentLinks.length > 0 && (
                <div className="px-3 py-2 text-[0.6rem] font-mono text-text-muted uppercase tracking-widest mb-1 flex items-center gap-2">
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   Recent
                </div>
              )}
              {displayLinks.length > 0 ? (
                displayLinks.map((link, i) => {
                  const isSelected = i === selectedIndex;
                  return (
                    <button
                      key={link.id}
                      id={`option-${link.id}`}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={-1}
                      className={clsx(
                        'w-full text-left px-4 py-3 rounded-card flex items-center justify-between font-mono text-sm transition-colors',
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

            <div className="px-4 py-3 border-t border-[var(--glass-border)] bg-[rgba(0,0,0,0.4)] flex items-center justify-between text-xs text-text-secondary font-mono relative z-10 flex-wrap gap-y-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded-card border border-white/20">↑</kbd>
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded-card border border-white/20">↓</kbd>
                  <span className="ml-1 hidden sm:inline">Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded-card border border-white/20">↵</kbd>
                  <span className="ml-1 hidden sm:inline">Select</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                {/* Day 66: Command hints */}
                <span className="flex items-center gap-1">
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded-card border border-white/20">Ctrl+/</kbd>
                  <span className="ml-1 hidden sm:inline">Livie</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded-card border border-white/20">?</kbd>
                  <span className="ml-1 hidden sm:inline">or</span>
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded-card border border-white/20">/</kbd>
                  <span className="ml-1 hidden sm:inline">Search</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
