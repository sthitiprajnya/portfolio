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

  const { voices, voiceURI, setVoiceURI, speak } = useAudio();

  // Day 40: Persist Voice Preference
  useEffect(() => {
    const savedVoice = localStorage.getItem("sentinel-voice-preference");
    if (savedVoice) {
      setVoiceURI(savedVoice);
    }
  }, [setVoiceURI]);

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVoice = e.target.value;
    setVoiceURI(newVoice);
    localStorage.setItem("sentinel-voice-preference", newVoice);
  };

  const handleChoice = () => {
    setAudioEnabled(true);
    setIsVisible(false);

    // Give a tiny delay for the exit animation before triggering completion
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  // Day 26: Preview Voice
  const handlePreviewVoice = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent clicking from triggering boot
    speak("SENTINEL ONLINE. Voice test successful.");
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

            <div className="mb-6 relative z-10 text-left">
              <label htmlFor="voice-select" className="block text-xs text-text-muted mb-2 font-mono uppercase tracking-widest">
                Select Audio Profile (Optional)
              </label>
              <div className="flex gap-2">
                <select
                  id="voice-select"
                  value={voiceURI || ''}
                  onChange={handleVoiceChange}
                  className="flex-1 bg-black/50 border border-[var(--glass-border)] text-text-secondary text-xs rounded p-2 outline-none focus:border-cyan appearance-none cursor-pointer"
                >
                  <option value="">Default System Voice</option>
                  {voices.map(voice => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handlePreviewVoice}
                  className="px-3 bg-[rgba(0,245,255,0.1)] hover:bg-[rgba(0,245,255,0.2)] border border-[var(--glass-border)] hover:border-cyan text-cyan text-[0.65rem] rounded transition-colors whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-cyan uppercase tracking-widest font-bold"
                  title="Test selected voice"
                >
                  Test
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <CyberButton
                onClick={handleChoice}
                color="cyan"
                className="w-full"
              >
                [ CLICK HERE TO BOOT SYSTEM ]
              </CyberButton>
            </div>
          </NeonBorder>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
