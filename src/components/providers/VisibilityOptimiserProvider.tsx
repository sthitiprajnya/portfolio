'use client';

import { useEffect, useState } from 'react';
import { initVisibilityOptimiser } from '@/lib/visibilityOptimiser';

export function VisibilityOptimiserProvider({ children }: { children: React.ReactNode }) {
  const [debugActive, setDebugActive] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);

  useEffect(() => {
    initVisibilityOptimiser();

    // Day 64: Debug mode overlay
    if (process.env.NODE_ENV === 'development') {
      const checkDebug = () => {
        const isDebug = localStorage.getItem('vop-debug') === 'true';
        setDebugActive(isDebug);
      };

      checkDebug();
      window.addEventListener('storage', checkDebug);

      // Hook into the same intersection events if debugging is active
      // We do this by creating a parallel observer just for the debug UI
      let observer: IntersectionObserver;
      if (localStorage.getItem('vop-debug') === 'true') {
        observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setVisibleSections(prev => {
                if (!prev.includes(entry.target.id)) return [...prev, entry.target.id];
                return prev;
              });
            } else {
              setVisibleSections(prev => prev.filter(id => id !== entry.target.id));
            }
          });
        }, { threshold: 0.1 }); // Matching the library's threshold loosely

        document.querySelectorAll('section[id]').forEach(el => observer.observe(el));
      }

      return () => {
        window.removeEventListener('storage', checkDebug);
        if (observer) observer.disconnect();
      };
    }
  }, []);

  return (
    <>
      {children}
      {debugActive && process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 z-[9999] bg-black/80 border border-cyan text-cyan font-mono text-[0.6rem] p-3 rounded-card shadow-[var(--glow-cyan-sm)] backdrop-blur-md max-w-[200px]">
          <h4 className="font-bold border-b border-cyan/30 mb-2 pb-1">VOP DEBUG MODE</h4>
          <div>Visible Sections:</div>
          {visibleSections.length > 0 ? (
            <ul className="list-disc pl-4 mt-1">
              {visibleSections.map(s => <li key={s}>{s}</li>)}
            </ul>
          ) : (
            <div className="text-text-muted mt-1 italic">None detected...</div>
          )}
        </div>
      )}
    </>
  );
}
