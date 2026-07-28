'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initVisibilityOptimiser } from '@/lib/visibilityOptimiser';

interface VisibilityContextProps {
  isDocumentVisible: boolean;
}

const VisibilityContext = createContext<VisibilityContextProps>({
  isDocumentVisible: true,
});

export function VisibilityOptimiserProvider({ children }: { children: React.ReactNode }) {
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);

  useEffect(() => {
    initVisibilityOptimiser();

    const handleVisibilityChange = () => {
      setIsDocumentVisible(!document.hidden);
    };

    // Initialize
    handleVisibilityChange();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <VisibilityContext.Provider value={{ isDocumentVisible }}>
      {children}
    </VisibilityContext.Provider>
  );
}

export function useVisibility() {
  return useContext(VisibilityContext);
}
