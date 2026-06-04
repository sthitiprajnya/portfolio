'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

interface AudioContextType {
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  speak: (text: string) => void;
  isSpeaking: boolean;
  cancelSpeech: () => void;
  voices: SpeechSynthesisVoice[];
  voiceURI: string | null;
  setVoiceURI: (uri: string) => void;
  isMuted: boolean; // Day 58
  toggleMute: () => void; // Day 58
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [allVoices, setAllVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURIState] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const speakDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio preference and voices
  useEffect(() => {
    // Check localStorage for audio preference
    const storedPreference = localStorage.getItem('audio_enabled');
    if (storedPreference !== null) {
      setAudioEnabled(storedPreference === 'true');
    }

    // Load voices
    const loadVoices = () => {
      if (!('speechSynthesis' in window)) return;

      const voicesList = window.speechSynthesis.getVoices();
      setAllVoices(voicesList);

      // Try to find a robotic/british voice
      // 1. Any voice with "Male" in name
      // 2. Any voice with "Daniel" in name
      // 3. Any voice with "Google UK English Male"
      // 4. Any en-GB voice
      // 5. Fallback to first available English voice
      const preferredVoice =
        voicesList.find(v => v.name.includes('Male')) ||
        voicesList.find(v => v.name.includes('Daniel')) ||
        voicesList.find(v => v.name.includes('Google UK English Male')) ||
        voicesList.find(v => v.name.includes('en-GB') || v.lang === 'en-GB') ||
        voicesList.find(v => v.lang.startsWith('en'));

      if (preferredVoice) {
        setVoice(preferredVoice);
        setVoiceURIState(preferredVoice.voiceURI);
      } else if (voicesList.length > 0) {
        setVoice(voicesList[0]);
        setVoiceURIState(voicesList[0].voiceURI);
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

  const cancelSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Day 58: Global mute shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key.toLowerCase() === 'm') {
        setIsMuted(prev => {
          const next = !prev;
          if (next && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
          }
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      if (next && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      return next;
    });
  }, []);

  // Update localStorage when preference changes
  const handleSetAudioEnabled = useCallback((enabled: boolean) => {
    setAudioEnabled(enabled);
    localStorage.setItem('audio_enabled', String(enabled));
    if (!enabled) {
      cancelSpeech();
    }
  }, [cancelSpeech]);

  const setVoiceURI = useCallback((uri: string) => {
    setVoiceURIState(uri);
    const selectedVoice = allVoices.find(v => v.voiceURI === uri);
    if (selectedVoice) {
      setVoice(selectedVoice);
    }
  }, [allVoices]);

  const speak = useCallback((text: string) => {
    if (!audioEnabled || isMuted || !('speechSynthesis' in window)) return;

    // Day 59: Debounce speak calls to avoid overlapping speech on rapid mounts
    cancelSpeech();

    if (speakDebounceTimerRef.current) {
      clearTimeout(speakDebounceTimerRef.current);
    }

    speakDebounceTimerRef.current = setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);

      // Set pitch and rate to sound more robotic
      utterance.rate = 0.78;
      utterance.pitch = 0.3;

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [audioEnabled, isMuted, voice, cancelSpeech]);

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
    <AudioContext.Provider value={{ audioEnabled, setAudioEnabled: handleSetAudioEnabled, speak, isSpeaking, cancelSpeech, voices: allVoices, voiceURI, setVoiceURI, isMuted, toggleMute }}>
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
