"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../providers/AudioProvider';
import { CyberButton } from '../ui/CyberButton';

const Terminal = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" x2="20" y1="19" y2="19" />
  </svg>
);

interface AudioPromptProps {
  onComplete: () => void;
}

export default function AudioPrompt({ onComplete }: AudioPromptProps) {
  const { currentVoice, setCurrentVoice, availableVoices, setAudioEnabled } = useAudio();
  const [isClosing, setIsClosing] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkVoices = () => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            const available = window.speechSynthesis.getVoices();
            if (available.length > 0) {
                setVoicesLoaded(true);
            }
        }
    };

    checkVoices();

    if (!voicesLoaded) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.addEventListener('voiceschanged', checkVoices);
      }

      timeoutId = setTimeout(() => {
         if (!voicesLoaded) {
             console.warn("AudioPrompt: Web Speech API voices failed to load within 1.5s timeout. Auto-skipping.");
             handleSkip();
         }
      }, 1500);
    }

    return () => {
        if (timeoutId) clearTimeout(timeoutId);
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.removeEventListener('voiceschanged', checkVoices);
        }
    };
  }, [voicesLoaded]);

  const handleEnableAudio = () => {
    if (!voicesLoaded) return;
    setAudioEnabled(true);
    // Initialize speech synthesis silently to circumvent autoplay policies
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(u);
    }
    finish();
  };

  const handleSkip = () => {
    setAudioEnabled(false);
    finish();
  };

  const finish = () => {
    setIsClosing(true);
    setTimeout(() => {
      onComplete();
    }, 500); // Wait for closing animation
  };

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isClosing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Initial focus on the first interactive element or the modal itself
    const select = document.getElementById('voice-select');
    if(select) {
        select.focus();
    } else if (modalRef.current) {
        modalRef.current.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isClosing]);

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-void/90 backdrop-blur-sm p-4"
        >
          <div ref={modalRef} tabIndex={-1} className="max-w-md w-full bg-surface border border-cyan/30 p-8 rounded-lg shadow-[0_0_30px_rgba(0,245,255,0.1)] relative overflow-hidden focus:outline-none" role="dialog" aria-modal="true" aria-labelledby="audio-prompt-title">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan to-violet opacity-50"></div>

            <div className="flex items-center gap-3 mb-6">
              <Terminal className="text-cyan w-6 h-6" aria-hidden="true" />
              <h2 id="audio-prompt-title" className="text-2xl font-orbitron text-cyan tracking-wider">SENTINEL ONLINE</h2>
            </div>

            <p className="text-text-secondary font-mono text-sm mb-6 leading-relaxed">
              This portfolio features an interactive AI voice assistant. Would you like to enable auditory systems?
            </p>

            <div className="mb-8">
              <label htmlFor="voice-select" className="block text-xs font-mono text-cyan/70 mb-2 uppercase tracking-widest">
                Select Voice Profile
              </label>
              <div className="relative">
                <select
                  id="voice-select"
                  value={currentVoice}
                  onChange={(e) => setCurrentVoice(e.target.value)}
                  disabled={!voicesLoaded}
                  className="w-full bg-void border border-cyan/50 text-text-primary font-mono text-sm p-3 rounded appearance-none focus:outline-none focus:border-cyan focus:shadow-[0_0_10px_rgba(0,245,255,0.3)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {availableVoices.map((voice: string) => (
                    <option key={voice} value={voice}>{voice}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-cyan">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20" aria-hidden="true"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1" onClick={voicesLoaded ? handleEnableAudio : undefined}>
                 <CyberButton color="cyan" className="w-full justify-center" disabled={!voicesLoaded}>
                    {voicesLoaded ? '[ENABLE AUDIO]' : '[INITIALIZING]'}
                 </CyberButton>
              </div>
              <div className="flex-1" onClick={handleSkip}>
                  <CyberButton color="amber" className="w-full justify-center">
                    [SKIP]
                  </CyberButton>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
