'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/components/providers/AudioProvider';

interface AudioPromptProps {
  onComplete: () => void;
}

export function AudioPrompt({ onComplete }: AudioPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Deep Robotic');
  const { setAudioEnabled, setCurrentVoice, availableVoices } = useAudio();

  useEffect(() => {
    // Only show if not booted
    if (sessionStorage.getItem('booted') !== 'true') {
      // Check if we already have an audio preference
      const storedPreference = localStorage.getItem('audio_enabled');
      if (storedPreference === null) {
         setIsVisible(true);
      } else {
         // Already chosen, skip directly to boot
         onComplete();
      }
    } else {
        onComplete();
    }
  }, [onComplete]);

  const handleChoice = (enableAudio: boolean) => {
    if (enableAudio) {
      setCurrentVoice(selectedVoice);
    }
    setAudioEnabled(enableAudio);
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
          className="max-w-lg w-full border border-cyan/30 bg-surface/50 backdrop-blur-md p-8 rounded-lg shadow-[0_0_30px_rgba(0,245,255,0.1)] text-center relative overflow-hidden"
        >
          {/* Decorative scanline */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20" />

          <div className="text-cyan font-bold text-xl mb-6 tracking-widest relative z-10 flex items-center justify-center gap-3">
             <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
             SENTINEL ONLINE
          </div>

          <p className="text-text-secondary text-sm mb-8 leading-relaxed relative z-10">
            For the optimal immersive experience, the AI Sentinel requests audio permissions.
          </p>

          {/* Voice selector */}
          <div className="mb-6 relative z-10">
            <label className="block text-left text-text-secondary text-xs mb-2 tracking-widest font-bold">
              [SELECT VOICE]
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full bg-surface/80 border border-cyan/50 text-cyan px-4 py-2 rounded text-sm focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/50 font-mono transition-all"
              disabled={availableVoices.length === 0}
            >
              {availableVoices.map((voice) => (
                <option key={voice} value={voice} className="bg-surface text-cyan">
                  {voice}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button
              onClick={() => handleChoice(true)}
              className="px-6 py-2 border border-cyan text-cyan hover:bg-cyan/10 transition-colors uppercase text-sm tracking-wider font-bold shadow-[var(--glow-cyan-sm)] outline-none focus-visible:ring-2 focus-visible:ring-cyan/50"
            >
              [ENABLE AUDIO]
            </button>
            <button
              onClick={() => handleChoice(false)}
              className="px-6 py-2 border border-border text-text-muted hover:text-white hover:border-white/50 transition-colors uppercase text-sm tracking-wider outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              [SKIP]
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
