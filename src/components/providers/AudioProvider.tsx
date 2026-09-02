"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type VoicePreset = {
  name: string;
  rate: number;
  pitch: number;
  voiceFilter: (voice: SpeechSynthesisVoice) => boolean;
};

const VOICE_PRESETS: Record<string, VoicePreset> = {
  'System Default': {
    name: 'System Default',
    rate: 1.0,
    pitch: 1.0,
    voiceFilter: (v) => true,
  },
};

interface AudioContextType {
  currentVoice: string;
  setCurrentVoice: (voice: string) => void;
  availableVoices: string[];
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  speak: (text: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentVoice, setCurrentVoice] = useState('System Default');
  const [availableVoices, setAvailableVoices] = useState<string[]>(['System Default']);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        const voiceNames = voices.map((v) => v.name);
        if (voiceNames.length > 0) {
          setAvailableVoices([...new Set(['System Default', ...voiceNames])]);
        }
      }
    };

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      updateVoices();
      window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!audioEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    if (currentVoice !== 'System Default') {
      const selectedVoice = voices.find((v) => v.name === currentVoice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <AudioContext.Provider value={{ currentVoice, setCurrentVoice, availableVoices, audioEnabled, setAudioEnabled, speak }}>
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
