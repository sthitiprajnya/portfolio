'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface AudioContextType {
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  speak: (text: string) => void;
  isSpeaking: boolean;
  cancelSpeech: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Initialize audio preference and voices
  useEffect(() => {
    // Check localStorage for audio preference
    const storedPreference = localStorage.getItem('audio_enabled');
    if (storedPreference === 'true') {
      setAudioEnabled(true);
    }

    // Load voices
    const loadVoices = () => {
      if (!('speechSynthesis' in window)) return;

      const voices = window.speechSynthesis.getVoices();
      // Try to find a robotic/british voice
      const preferredVoice = voices.find(v =>
        v.name.includes('Google') ||
        v.name.includes('Daniel') ||
        v.name.includes('en-GB') ||
        v.lang === 'en-GB'
      );

      if (preferredVoice) {
        setVoice(preferredVoice);
      } else if (voices.length > 0) {
        setVoice(voices[0]);
      }
    };

    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Update localStorage when preference changes
  const handleSetAudioEnabled = useCallback((enabled: boolean) => {
    setAudioEnabled(enabled);
    localStorage.setItem('audio_enabled', String(enabled));
  }, []);

  const cancelSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;

    cancelSpeech();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set pitch and rate to sound more robotic
    utterance.rate = 0.85;
    utterance.pitch = 0.7;

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [audioEnabled, voice, cancelSpeech]);

  // Keep isSpeaking state somewhat in sync with actual speech synthesis state
  // This is needed because sometimes onend doesn't fire correctly in all browsers
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const interval = setInterval(() => {
      if (window.speechSynthesis.speaking !== isSpeaking) {
        setIsSpeaking(window.speechSynthesis.speaking);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  return (
    <AudioContext.Provider value={{ audioEnabled, setAudioEnabled: handleSetAudioEnabled, speak, isSpeaking, cancelSpeech }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
