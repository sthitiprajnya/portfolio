'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface VoiceOption {
  name: string;
  rate: number;
  pitch: number;
  voiceFilter: (voice: SpeechSynthesisVoice) => boolean;
}

interface AudioContextType {
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  speak: (text: string) => void;
  isSpeaking: boolean;
  cancelSpeech: () => void;
  currentVoice: string;
  setCurrentVoice: (voiceName: string) => void;
  availableVoices: string[];
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Voice presets with different characteristics
const VOICE_PRESETS: Record<string, VoiceOption> = {
  'Deep Robotic': {
    name: 'Deep Robotic',
    rate: 0.8,
    pitch: 0.6,
    voiceFilter: (v) =>
      v.name.includes('Google') || v.name.includes('Daniel') || v.lang === 'en-GB',
  },
  'Natural': {
    name: 'Natural',
    rate: 0.95,
    pitch: 1.0,
    voiceFilter: (v) => v.lang.startsWith('en'),
  },
  'High-Pitched': {
    name: 'High-Pitched',
    rate: 1.1,
    pitch: 1.4,
    voiceFilter: (v) => v.lang.startsWith('en') && v.name.includes('Female'),
  },
  'Slow & Deep': {
    name: 'Slow & Deep',
    rate: 0.7,
    pitch: 0.5,
    voiceFilter: (v) =>
      v.name.includes('Google') || v.name.includes('Male') || v.lang === 'en-GB',
  },
};

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [currentVoicePreset, setCurrentVoicePreset] = useState('Deep Robotic');
  const [availableVoices, setAvailableVoices] = useState<string[]>([]);

  // Initialize audio preference and voices
  useEffect(() => {
    // Check localStorage for audio preference
    const storedPreference = localStorage.getItem('audio_enabled');
    const storedVoice = localStorage.getItem('voice_preset');

    if (storedPreference === 'false') {
      setAudioEnabled(false);
    } else {
      setAudioEnabled(true); // Default to true if unset or true
    }

    if (storedVoice && VOICE_PRESETS[storedVoice]) {
      setCurrentVoicePreset(storedVoice);
    } else {
      setCurrentVoicePreset('Deep Robotic'); // Default voice
    }

    // Load voices
    const loadVoices = () => {
      if (!('speechSynthesis' in window)) return;

      const voices = window.speechSynthesis.getVoices();
      const presetNames = Object.keys(VOICE_PRESETS);
      setAvailableVoices(presetNames);

      // Find voice based on current preset
      const currentPreset = VOICE_PRESETS[currentVoicePreset];
      if (currentPreset) {
        const matchedVoice = voices.find(currentPreset.voiceFilter);
        if (matchedVoice) {
          setVoice(matchedVoice);
        } else if (voices.length > 0) {
          setVoice(voices[0]);
        }
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
  }, [currentVoicePreset]);

  // Update localStorage when preference changes
  const handleSetAudioEnabled = useCallback((enabled: boolean) => {
    setAudioEnabled(enabled);
    localStorage.setItem('audio_enabled', String(enabled));
  }, []);

  const handleSetCurrentVoice = useCallback((voiceName: string) => {
    if (VOICE_PRESETS[voiceName]) {
      setCurrentVoicePreset(voiceName);
      localStorage.setItem('voice_preset', voiceName);
    }
  }, []);

  const cancelSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!audioEnabled || !('speechSynthesis' in window)) return;

      cancelSpeech();

      const utterance = new SpeechSynthesisUtterance(text);
      const preset = VOICE_PRESETS[currentVoicePreset];

      // Apply preset settings
      if (preset) {
        utterance.rate = preset.rate;
        utterance.pitch = preset.pitch;
      }

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [audioEnabled, voice, currentVoicePreset, cancelSpeech]
  );

  // Keep isSpeaking state somewhat in sync with actual speech synthesis state
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const interval = setInterval(() => {
      if (window.speechSynthesis.speaking !== isSpeaking) {
        setIsSpeaking(window.speechSynthesis.speaking);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Global click-to-speech
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (!audioEnabled || !('speechSynthesis' in window)) return;

      const target = e.target as HTMLElement;

      // Don't interfere with inputs, buttons, or the Sentinel chat
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.sentinel-chat-bubble') ||
        target.closest('.audio-toggle') ||
        target.closest('.command-palette')
      ) {
        return;
      }

      // Find the closest textual block element
      const textBlock = target.closest('p, h1, h2, h3, h4, h5, h6, li, span, div');

      if (textBlock && textBlock.textContent) {
        // Simple heuristic to avoid speaking massive layout containers:
        // Only speak elements with a reasonable amount of text and no large nested structures
        const text = textBlock.textContent.trim();
        const childElements = textBlock.children.length;

        // If it's a leaf node or has very few children, speak its content
        if (text && text.length > 0 && text.length < 500 && childElements < 3) {
          speak(text);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [audioEnabled, speak]);

  return (
    <AudioContext.Provider
      value={{
        audioEnabled,
        setAudioEnabled: handleSetAudioEnabled,
        speak,
        isSpeaking,
        cancelSpeech,
        currentVoice: currentVoicePreset,
        setCurrentVoice: handleSetCurrentVoice,
        availableVoices,
      }}
    >
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
