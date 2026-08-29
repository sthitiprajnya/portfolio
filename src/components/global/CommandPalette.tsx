'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { NAV_LINKS } from '@/components/sections/Navigation'; // Will export this from Navigation.tsx
import { useScrollLock } from '@/hooks/useScrollLock';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useScrollLock(isOpen);

  useEffect(() => {
    const handleOpen = () => {
      if (!isOpen) {
        triggerRef.current = document.activeElement as HTMLElement;
        setIsOpen(true);
        setQuery('');
        setSelectedIndex(0);
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
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpen);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpen);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure render before focus
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      // Return focus to the trigger element when closed
      if (triggerRef.current) {
        triggerRef.current.focus();
        triggerRef.current = null;
      }
    }
  }, [isOpen]);

  // ⚡ Bolt: Memoize filteredLinks to prevent redundant O(N) string processing on every render,
  // particularly useful as user types query where multiple renders occur.
  const filteredLinks = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return NAV_LINKS.filter(link =>
      link.label.toLowerCase().includes(lowerQuery) ||
      link.id.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  // Keep the highlighted option valid for the current result set without an effect:
  // adjust state during render (React's recommended pattern for derived state resets).
  if (selectedIndex >= filteredLinks.length) {
    setSelectedIndex(0);
  }

  // UX: Auto-scroll selected item into view during keyboard navigation
  useEffect(() => {
    if (isOpen && filteredLinks[selectedIndex]) {
      const el = document.getElementById(`option-${filteredLinks[selectedIndex].id}`);
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, isOpen, filteredLinks]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredLinks.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredLinks.length) % filteredLinks.length);
    } else if (e.key === 'Enter' && filteredLinks[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredLinks[selectedIndex].id);
    } else if (e.key === 'Tab') {
      // Focus trapping logic
      const focusableElements = Array.from(
        document.querySelectorAll(
          '#command-palette-listbox button, #command-palette-input, #clear-search-button'
        )
      ) as HTMLElement[];

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  const handleSelect = (id: string) => {
    triggerRef.current = null; // Don't return focus if we are navigating
    setIsOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        // Accessibility: Transfer focus to target section. Using a nested timeout
        // ensures the element is ready and scroll has initiated.
        setTimeout(() => {
          el.focus({ preventScroll: true });
        }, 100);
      }
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
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative glass-heavy rounded-card shadow-[0_0_40px_rgba(0,245,255,0.1)] w-full max-w-lg overflow-hidden flex flex-col"
          >
            {/* Accessibility: Announce result count to screen readers */}
            <div className="sr-only" aria-live="polite">
              {query ? `${filteredLinks.length} results found for ${query}` : ''}
            </div>

            <div className="flex items-center px-4 py-4 border-b border-[var(--glass-border)] bg-[rgba(0,0,0,0.4)] relative z-10">
              <span className="text-cyan font-mono mr-3">{'>'}</span>
              <input
                ref={inputRef}
                id="command-palette-input"
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
              {query && (
                <button
                  id="clear-search-button"
                  onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                  className="p-1 mr-2 text-text-muted hover:text-cyan transition-colors outline-none focus-visible:ring-1 focus-visible:ring-cyan rounded-sm"
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <span className="text-text-secondary text-xs font-mono bg-black/50 px-2 py-1 rounded-card border border-border/50" aria-hidden="true">ESC</span>
            </div>

            {/* Accessibility: result count announced once, above, via the aria-live region */}

            <div
              id="command-palette-listbox"
              role="listbox"
              aria-label="Search results"
              className="max-h-80 overflow-y-auto py-2 px-2 scrollbar-thin scrollbar-thumb-[var(--glass-border)] scrollbar-track-transparent relative z-10"
            >
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link, i) => {
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
                      onClick={() => handleSelect(link.id)}
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
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded-card border border-white/20">↑</kbd>
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded-card border border-white/20">↓</kbd>
                  <span className="ml-1">Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded-card border border-white/20">↵</kbd>
                  <span className="ml-1">Select</span>
                </span>
              </div>
              <span className="opacity-50" aria-hidden="true">v2.0_SYSTEM_NAV</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
