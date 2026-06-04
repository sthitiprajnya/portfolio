'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '@/components/providers/AudioProvider';
import { generateDynamicSpeech } from '@/lib/sentinelSpeech';

interface Message {
  role:    'user' | 'assistant';
  content: string;
  timestamp: string; // Day 71
}

const GREETING: Message = {
  role:    'assistant',
  content: 'LIVIE_v1.0 ONLINE. I know everything about Sthita\'s background. Ask me about his experience, projects, certs, or anything you\'d ask a recruiter.',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export default function LiviePanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages]   = useState<Message[]>([GREETING]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const bottomRef                 = useRef<HTMLDivElement>(null);
  const inputRef                  = useRef<HTMLInputElement>(null);
  const { speak }                 = useAudio();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    // Auto-focus input when panel opens
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
      const reply = generateDynamicSpeech(text);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      speak(reply);
    } catch {
      const errorReply = 'NETWORK_ERROR. Try again.';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      speak(errorReply);
    } finally {
      setLoading(false);
    }
  }

  // Day 72: Clear Chat Functionality
  const [flashClear, setFlashClear] = useState(false);
  const handleClearChat = () => {
    // Re-generate greeting with fresh timestamp
    setMessages([{ ...GREETING, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setFlashClear(true);
    setTimeout(() => setFlashClear(false), 200);
  };

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: 16, scale: 0.97  }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className="
        fixed bottom-24 right-6 z-[9998]
        w-[340px] sm:w-[380px]
        h-[480px]
        glass-heavy rounded-card
        border border-[#00F5FF]/20
        shadow-glass
        flex flex-col
        overflow-hidden
      "
      style={{ backgroundColor: flashClear ? 'rgba(0,245,255,0.05)' : undefined }}
    >
      {/* Header */}
      <div className="
        flex items-center justify-between
        px-4 py-3
        border-b border-[#00F5FF]/10
        bg-[rgba(0,0,0,0.2)]
      ">
        <div className="flex items-center gap-2">
          {/* Status dot */}
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#00F5FF] opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F5FF]" />
          </span>
          <span className="font-mono text-[#00F5FF] text-sm font-semibold tracking-wider">
            LIVIE
          </span>
          <span className="font-mono text-[#00F5FF]/40 text-[10px]">
            AI ASSISTANT · ONLINE
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Day 72: Clear Chat Button */}
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1 text-text-secondary hover:text-red transition-colors text-[0.6rem] font-mono border border-transparent hover:border-red/30 px-1.5 py-0.5 rounded outline-none focus-visible:ring-1 focus-visible:ring-red"
            aria-label="Clear chat history"
            title="Clear Chat"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            CLEAR
          </button>
          <button
            onClick={onClose}
            className="text-[#00F5FF]/40 hover:text-[#00F5FF] transition-colors text-sm ml-1"
            aria-label="Close panel"
          >✕</button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-[#00F5FF]/20">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] px-3 py-2 rounded-card
              font-mono text-[12px] leading-relaxed
              ${msg.role === 'user'
                ? 'bg-[#00F5FF]/15 border border-[#00F5FF]/20 text-[#00F5FF] rounded-card'
                : 'bg-[rgba(0,0,0,0.4)] border border-[#00F5FF]/08 text-[#a0f0e8] rounded-card'}
            `}>
              {msg.role === 'assistant' && (
                <span className="text-[#00F5FF]/50 text-[10px] block mb-1">LIVIE ▸</span>
              )}
              {msg.content}
              {/* Day 71: Timestamps */}
              <time className={`block text-[9px] mt-1 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp}
              </time>
            </div>
          </div>
        ))}

        {/* Thinking dots */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[rgba(0,0,0,0.4)] border border-[#00F5FF]/08 rounded-card px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#00F5FF]/60"
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, delay: i * 0.18, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts (only at start) */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {["What's his strongest skill?", 'Any cloud security projects?', 'Is he open to remote?'].map(p => (
            <button
              key={p}
              onClick={() => { setInput(p); setTimeout(send, 50); }}
              className="glass-pill rounded-pill text-[10px] font-mono text-[#00F5FF]/70 px-2.5 py-1 hover:border-[#00F5FF]/40 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="
        flex items-center gap-2
        px-4 py-3
        border-t border-[#00F5FF]/10
        bg-[rgba(0,0,0,0.2)]
      ">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Ask about Sthita..."
          disabled={loading}
          maxLength={500}
          className="
            flex-1 bg-transparent
            font-mono text-[12px] text-[#a0f0e8]
            placeholder:text-[#00F5FF]/25
            focus:outline-none
            disabled:opacity-50
          "
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="
            glass-pill rounded-pill
            px-3 py-1.5
            font-mono text-[10px] text-[#00F5FF]
            border border-[#00F5FF]/30
            hover:border-[#00F5FF]/60 hover:bg-[#00F5FF]/10
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all
          "
        >
          SEND
        </button>
      </div>
    </motion.div>
  );
}