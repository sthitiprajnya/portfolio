'use client';

import { useEffect } from 'react';
import { initVisibilityOptimiser } from '@/lib/visibilityOptimiser';

export function VisibilityOptimiserProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initVisibilityOptimiser();
  }, []);

  return <>{children}</>;
}
