'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/components/providers/AudioProvider';
import { NeonBorder } from '@/components/ui/NeonBorder';
import { CyberButton } from '@/components/ui/CyberButton';

interface AudioPromptProps {
  onComplete: () => void;
}

export function AudioPrompt({ onComplete }: AudioPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { setAudioEnabled } = useAudio();

  useEffect(() => {
    // Only show if not booted
    if (sessionStorage.getItem('booted') !== 'true') {
      setIsVisible(true);
    } else {
      onComplete();
    }
  }, [onComplete]);

  const handleChoice = () => {
    setAudioEnabled(true);
    setIsVisible(false);

    // Give a tiny delay for the exit animation before triggering completion
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[10001] bg-black text-white font-mono flex flex-col items-center justify-center p-8 overflow-hidden"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center relative overflow-hidden z-10"
        >
          <NeonBorder color="cyan" className="bg-surface/50 backdrop-blur-md p-8 rounded-card">
            {/* Decorative scanline */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20 rounded-card" />

            <div className="text-cyan font-bold text-xl mb-6 tracking-widest relative z-10 flex items-center justify-center gap-3">
               <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
               SENTINEL ONLINE
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <CyberButton
                onClick={handleChoice}
                color="cyan"
                className="w-full"
              >
                [ CLICK ANYWHERE TO BOOT SYSTEM ]
              </CyberButton>
            </div>
          </NeonBorder>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
