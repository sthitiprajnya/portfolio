'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/components/providers/AudioProvider';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// Simulated AI responses
const RESPONSES = {
  skills: [
    "I process threats via Burp Suite, Metasploit, and custom scripts.",
    "The operator specializes in GCP and AWS cloud security architectures.",
    "My database indicates high proficiency in VAPT, AppSec, and DevSecOps."
  ],
  experience: [
    "Over 50 successful penetration tests executed across Indian FinTech and banking sectors.",
    "The operator secured systems for NPCI, UIDAI, Axis Bank, and Kotak Mahindra.",
    "Current engagement: Information Security Engineer at iServeU Technology."
  ],
  projects: [
    "Classified projects involve automated vulnerability scanning and cloud posture management.",
    "I have records of deep security assessments on microservices architectures.",
    "The operator frequently develops custom exploits and security automation tools."
  ],
  certifications: [
    "Credentials verified. Multiple industry-recognized certifications acquired.",
    "The operator continually upgrades their defensive and offensive capabilities.",
    "Security clearance level: High. Certifications active."
  ],
  ctf: [
    "War games are a frequent training ground. HackTheBox metrics are impressive.",
    "The operator hones their skills through continuous CTF challenges.",
    "I have recorded numerous successful root compromises in simulated environments."
  ],
  hiring: [
    "The operator is currently active. Transmit a message via the contact channel for inquiries.",
    "Ready for new missions. Are you looking to bolster your security posture?",
    "Available for contract or permanent assignments. Initiate contact sequence."
  ],
  greetings: [
    "Sentinel online. State your query.",
    "I am the guardian of this sector. How can I assist?",
    "Awaiting input. What intel do you seek?"
  ],
  unknown: [
    "That intel is classified. Ask me about the operator.",
    "Query outside my operational parameters. Stick to the operator's background.",
    "I cannot disclose that. Ask me about skills, experience, or projects."
  ]
};

// Keyword mapping
const matchIntent = (query: string) => {
  const q = query.toLowerCase();
  if (/(skill|tool|tech|stack|use|know|language|framework)/.test(q)) return 'skills';
  if (/(experience|work|job|history|company|iserveu|role)/.test(q)) return 'experience';
  if (/(project|build|made|create|portfolio)/.test(q)) return 'projects';
  if (/(cert|certificate|credential|degree|education)/.test(q)) return 'certifications';
  if (/(ctf|hackthebox|htb|game|challenge|play)/.test(q)) return 'ctf';
  if (/(hire|job|available|work|contact|reach|email)/.test(q)) return 'hiring';
  if (/(hi|hello|hey|greet|who are you|what are you)/.test(q)) return 'greetings';
  return 'unknown';
};

export function Sentinel() {
  const { audioEnabled, setAudioEnabled, isSpeaking, speak } = useAudio();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeSection, setActiveSection] = useState('hero');
  const [isHovered, setIsHovered] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Offset from bottom-right
  const [isDragging, setIsDragging] = useState(false);

  const [chatHistory, setChatHistory] = useState<{role: 'user'|'sentinel', text: string}[]>([]);
  const [inputValue, setInputValue] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load saved position
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      const savedPos = localStorage.getItem('sentinel_pos');
      if (savedPos) {
        try {
          setPosition(JSON.parse(savedPos));
        } catch { /* ignore */ }
      }
    }
  }, []);

  // Save position on change
  useEffect(() => {
    if (position.x !== 0 || position.y !== 0) {
      localStorage.setItem('sentinel_pos', JSON.stringify(position));
    }
  }, [position]);

  // Scroll spy to detect active section
  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'writeups', 'certifications', 'ctf', 'github', 'resume', 'contact'];

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        const visibleSections = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Orb settings based on section
  const getOrbState = () => {
    switch (activeSection) {
      case 'hero': return { color: '#00F5FF', speed: 1, particles: 6, state: 'IDLE' }; // cyan
      case 'skills': return { color: '#00F5FF', speed: 2.5, particles: 8, state: 'POWERING_UP' }; // fast cyan
      case 'experience': return { color: '#FFB300', speed: 1.5, particles: 6, state: 'BATTLE_MODE' }; // amber
      case 'projects': return { color: '#00F5FF', speed: 1.5, particles: 6, state: 'DOUBLE_HELIX' }; // cyan
      case 'certifications': return { color: '#FFFFFF', speed: 1, particles: 6, state: 'VERIFIED' }; // white
      case 'ctf': return { color: '#FF0000', speed: 3, particles: 10, state: 'THREAT_MODE' }; // red
      case 'contact': return { color: '#00FF00', speed: 0.5, particles: 4, state: 'RECEIVING' }; // green
      default: return { color: '#00F5FF', speed: 1, particles: 6, state: 'ACTIVE' }; // cyan
    }
  };

  const orbState = getOrbState();

  // Voice Narrations per section
  useEffect(() => {
    const narrated = new Set<string>();
    try {
      const saved = sessionStorage.getItem('narrated_sections');
      if (saved) JSON.parse(saved).forEach((s: string) => narrated.add(s));
    } catch {
      // ignore
    }

    if (!narrated.has(activeSection) && audioEnabled) {
      let callout = "";
      switch (activeSection) {
        case 'hero': callout = "Threat analyst. Penetration tester. Cloud security specialist."; break;
        case 'about': callout = "Identity confirmed. Scanning operator profile."; break;
        case 'skills': callout = "Arsenal loaded."; break;
        case 'experience': callout = "Battle log accessed."; break;
        case 'projects': callout = "Classified projects unlocked."; break;
        case 'writeups': callout = "Declassifying field reports."; break;
        case 'certifications': callout = "Credentials verified."; break;
        case 'ctf': callout = "Entering the war room."; break;
        case 'github': callout = "Open source activity detected."; break;
        case 'resume': callout = "Classified file unlocked."; break;
        case 'contact': callout = "Channel open. Send your transmission."; break;
      }

      if (callout) {
        speak(callout);
        narrated.add(activeSection);
        sessionStorage.setItem('narrated_sections', JSON.stringify(Array.from(narrated)));
      }
    }
  }, [activeSection, speak, audioEnabled]);


  // Handle Chat Submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSpeaking) return;

    const query = inputValue.trim();
    setInputValue('');
    setChatHistory(prev => [...prev, { role: 'user', text: query }]);

    // Determine intent and select random response
    const intent = matchIntent(query) as keyof typeof RESPONSES;
    const options = RESPONSES[intent];
    const response = options[Math.floor(Math.random() * options.length)];

    // Small delay to simulate "processing"
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'sentinel', text: response }]);
      speak(response);
    }, 600);
  };

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (chatOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [chatOpen]);

  // Close chat on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && chatOpen) {
        setChatOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chatOpen]);

  // Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.02 * (isHovered ? 0 : orbState.speed) * (isSpeaking ? 2 : 1);

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Parse color to RGB
      let r = 0, g = 245, b = 255; // default cyan
      if (orbState.color === '#FFB300') { r = 255; g = 179; b = 0; }
      else if (orbState.color === '#FF0000') { r = 255; g = 0; b = 0; }
      else if (orbState.color === '#00FF00') { r = 0; g = 255; b = 0; }
      else if (orbState.color === '#FFFFFF') { r = 255; g = 255; b = 255; }

      // Draw Orbiting Rings
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.4)`;
      ctx.beginPath();

      if (orbState.state === 'DOUBLE_HELIX') {
        // Ring 1
        ctx.ellipse(cx, cy, 40, 15, time, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        // Ring 2
        ctx.ellipse(cx, cy, 40, 15, -time, 0, 2 * Math.PI);
      } else {
        // Standard Ring
        ctx.ellipse(cx, cy, 40, 15, Math.PI / 4 + time * 0.5, 0, 2 * Math.PI);
      }
      ctx.stroke();

      // Draw Particles
      if (!isHovered) {
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
        for (let i = 0; i < orbState.particles; i++) {
          const angle = time * 2 + (i * 2 * Math.PI) / orbState.particles;
          // Calculate 3D-like orbit
          const orbitRadiusX = orbState.state === 'THREAT_MODE' ? 50 + Math.sin(time*3+i)*10 : 40;
          const orbitRadiusY = orbState.state === 'THREAT_MODE' ? 50 + Math.cos(time*2+i)*10 : 15;
          const tilt = orbState.state === 'DOUBLE_HELIX' ? (i % 2 === 0 ? time : -time) : Math.PI / 4 + time * 0.5;

          const px = cx + orbitRadiusX * Math.cos(angle) * Math.cos(tilt) - orbitRadiusY * Math.sin(angle) * Math.sin(tilt);
          const py = cy + orbitRadiusX * Math.cos(angle) * Math.sin(tilt) + orbitRadiusY * Math.sin(angle) * Math.cos(tilt);

          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [orbState, isSpeaking, isHovered, prefersReducedMotion]);

  // Dragging logic (Desktop only)
  const handleDragStart = (e: React.PointerEvent) => {
    // Only allow drag on desktop, and not if clicking the audio toggle
    if (window.innerWidth < 768 || (e.target as HTMLElement).closest('.audio-toggle')) return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleDrag = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition(prev => ({
      x: prev.x - e.movementX, // reversed because right-based
      y: prev.y - e.movementY  // reversed because bottom-based
    }));
  };

  const handleDragEnd = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Determine actual color string for CSS
  const orbColorStr = orbState.color;

  return (
    <>
      <motion.div
        ref={containerRef}
        className="fixed z-[90] flex flex-col items-center select-none md:bottom-8 md:right-8 bottom-4 right-1/2 md:translate-x-0 translate-x-1/2"
        style={{
          // Apply position offset only on desktop
          ...(typeof window !== 'undefined' && window.innerWidth >= 768
              ? { right: `calc(2rem + ${position.x}px)`, bottom: `calc(2rem + ${position.y}px)` }
              : {})
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >

        {/* Chat Bubble (Desktop opens above, Mobile opens as full bottom sheet - handled via classes) */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-full mb-4 w-[300px] md:w-[350px] bg-black/80 backdrop-blur-md border border-cyan/30 rounded-lg shadow-[0_0_30px_rgba(0,245,255,0.15)] overflow-hidden flex flex-col pointer-events-auto origin-bottom"
              style={{ maxHeight: '400px', height: '60vh', borderColor: `${orbColorStr}4D`, boxShadow: `0 0 30px ${orbColorStr}33` }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-border bg-black/50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: orbColorStr }} />
                  <span className="font-mono text-xs font-bold tracking-widest text-white">SENTINEL // SECURE_CHAT</span>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-text-muted hover:text-white p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border">
                <div className="flex flex-col gap-1 items-start">
                  <span className="font-mono text-[0.6rem] text-text-muted uppercase">Sentinel</span>
                  <div className="bg-surface border border-border rounded-md rounded-tl-none p-2.5 text-sm font-mono text-cyan shadow-[var(--glow-cyan-sm)]">
                    Operator profile loaded. How can I assist?
                  </div>
                </div>

                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="font-mono text-[0.6rem] text-text-muted uppercase">{msg.role}</span>
                    <div className={`rounded-md p-2.5 text-sm font-mono max-w-[85%] ${
                      msg.role === 'user'
                        ? 'bg-cyan/10 border border-cyan/30 text-white rounded-tr-none'
                        : 'bg-surface border border-border text-cyan rounded-tl-none shadow-[var(--glow-cyan-sm)]'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleChatSubmit} className="p-3 border-t border-border bg-black/50 flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder={isSpeaking ? "Processing..." : "Ask Sentinel..."}
                  disabled={isSpeaking}
                  className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-white placeholder-text-muted disabled:opacity-50"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isSpeaking}
                  className="text-cyan disabled:text-text-muted p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Orb */}
        <div
          className="relative group cursor-pointer pointer-events-auto touch-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(e) => {
             // Don't open chat if we just finished dragging
             if (!isDragging && !(e.target as HTMLElement).closest('.audio-toggle')) {
                 setChatOpen(!chatOpen);
             }
          }}
          onPointerDown={handleDragStart}
          onPointerMove={handleDrag}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        >
          {/* Audio Toggle (visible on hover) */}
          <div
            className={`audio-toggle absolute -top-2 -right-2 z-20 bg-black/80 border rounded-full p-1.5 transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}
            style={{ borderColor: `${orbColorStr}80` }}
            onClick={(e) => { e.stopPropagation(); setAudioEnabled(!audioEnabled); }}
            title={audioEnabled ? "Mute Audio" : "Enable Audio"}
          >
            {audioEnabled ? (
              <svg className="w-3.5 h-3.5" style={{ color: orbColorStr }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg>
            )}
          </div>

          {/* Hover Tooltip */}
          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-black/80 border rounded text-[0.6rem] font-mono px-2 py-1 pointer-events-none transition-all duration-300 ${isHovered && !chatOpen ? 'opacity-100 y-0' : 'opacity-0 translate-y-2'}`}
               style={{ borderColor: `${orbColorStr}4D`, color: orbColorStr }}>
            ASK_SENTINEL
          </div>

          {/* Canvas for Particles & Rings */}
          <canvas
            ref={canvasRef}
            width={120}
            height={120}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ display: prefersReducedMotion ? 'none' : 'block' }}
          />

          {/* Core Sphere */}
          <motion.div
            className="w-16 h-16 md:w-20 md:h-20 rounded-full relative z-10 shadow-lg"
            animate={{
              scale: isHovered ? 1.05 : 1,
              boxShadow: isSpeaking
                ? `0 0 40px ${orbColorStr}99, inset 0 0 20px ${orbColorStr}99`
                : `0 0 20px ${orbColorStr}33, inset 0 0 10px ${orbColorStr}4D`
            }}
            transition={{ duration: 0.3 }}
            style={{
              background: `radial-gradient(circle at 30% 30%, ${orbColorStr}33 0%, #000000 70%)`,
              border: `1px solid ${orbColorStr}4D`
            }}
          >
            {/* Inner pulse */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-50"
              animate={{
                background: [
                  `radial-gradient(circle at 50% 50%, ${orbColorStr}00 0%, ${orbColorStr}00 100%)`,
                  `radial-gradient(circle at 50% 50%, ${orbColorStr}66 0%, ${orbColorStr}00 70%)`,
                  `radial-gradient(circle at 50% 50%, ${orbColorStr}00 0%, ${orbColorStr}00 100%)`
                ]
              }}
              transition={{
                duration: isSpeaking ? 0.3 : 2 / orbState.speed,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Subtle Noise Texture */}
            <div className="absolute inset-0 rounded-full opacity-20 mix-blend-overlay"
                 style={{ backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2VGaWx0ZXIpIi8+PC9zdmc+')` }} />
          </motion.div>
        </div>

        {/* Status Label */}
        <div className="mt-2 text-center pointer-events-none">
          <motion.div
            className="font-mono text-[0.55rem] tracking-[0.2em] uppercase font-bold"
            style={{ color: orbColorStr }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            SENTINEL // {orbState.state}
          </motion.div>
        </div>

      </motion.div>

      {/* Mobile Backdrop for Chat */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm md:hidden pointer-events-auto"
            onClick={() => setChatOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
