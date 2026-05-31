'use client';

import { useFaviconBlink } from '@/hooks/useFaviconBlink';

export function FaviconBlinkProvider({ children }: { children: React.ReactNode }) {
  useFaviconBlink();
  return <>{children}</>;
}
