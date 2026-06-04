'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useFaviconBlink } from '@/hooks/useFaviconBlink';

interface FaviconBlinkContextType {
  setBlinkPattern: (pattern: 'fast' | 'slow' | 'default') => void;
}

const FaviconBlinkContext = createContext<FaviconBlinkContextType | undefined>(undefined);

export function FaviconBlinkProvider({ children }: { children: ReactNode }) {
  const [blinkPattern, setBlinkPattern] = useState<'fast' | 'slow' | 'default'>('default');

  useFaviconBlink(blinkPattern);

  return (
    <FaviconBlinkContext.Provider value={{ setBlinkPattern }}>
      {children}
    </FaviconBlinkContext.Provider>
  );
}

export function useFaviconPattern() {
  const context = useContext(FaviconBlinkContext);
  if (context === undefined) {
    throw new Error('useFaviconPattern must be used within a FaviconBlinkProvider');
  }
  return context;
}
