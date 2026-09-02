import '@testing-library/jest-dom';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    getVoices: () => [
      { name: 'Google UK English Male', lang: 'en-GB' },
      { name: 'Google US English', lang: 'en-US' },
      { name: 'Samantha', lang: 'en-US' },
      { name: 'Alex', lang: 'en-US' },
    ],
    speak: () => {},
    cancel: () => {},
    pause: () => {},
    resume: () => {},
    onvoiceschanged: null,
  },
});

// Mock SpeechSynthesisUtterance
if (typeof window.SpeechSynthesisUtterance === 'undefined') {
  window.SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
    text: string;
    lang: string;
    pitch: number;
    rate: number;
    voice: SpeechSynthesisVoice | null;
    volume: number;
    onstart: null | ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any);
    onend: null | ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any);
    onerror: null | ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisErrorEvent) => any);
    onpause: null | ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any);
    onresume: null | ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any);
    onmark: null | ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any);
    onboundary: null | ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any);

    constructor(text?: string) {
      this.text = text || '';
      this.lang = '';
      this.pitch = 1;
      this.rate = 1;
      this.voice = null;
      this.volume = 1;
      this.onstart = null;
      this.onend = null;
      this.onerror = null;
      this.onpause = null;
      this.onresume = null;
      this.onmark = null;
      this.onboundary = null;
    }
  } as any;
}
