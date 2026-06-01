'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '@/components/providers/AudioProvider';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

// Define Speech Banks
const SPEECH_BANKS: Record<string, string[]> = {
  hero: [
    "Sentinel online. System initialized.",
    "Guardian process active.",
    "Scanning portfolio parameters."
  ],
  about: [
    "Analyzing operator background.",
    "Identity verified. Access granted.",
    "Reviewing historical data."
  ],
  skills: [
    "Arsenal loaded. Tools ready.",
    "Skill matrices optimal.",
    "Weaponry systems online."
  ],
  experience: [
    "Accessing combat logs.",
    "Reviewing previous engagements.",
    "Battle history verified."
  ],
  projects: [
    "Classified projects accessed.",
    "Decrypting mission files.",
    "Scanning developed assets."
  ],
  certifications: [
    "Credentials verified.",
    "Clearance codes accepted.",
    "Validating security certs."
  ],
  ctf: [
    "War games simulation active.",
    "Threat level elevated.",
    "Analyzing attack vectors."
  ],
  github: [
    "Code repository sync active.",
    "Scanning push metrics.",
    "Development cycle nominal."
  ],
  contact: [
    "Comms channel open.",
    "Awaiting transmission.",
    "Secure line established."
  ]
};

const AMBIENT_SPEECH_BANKS: Record<string, string[]> = {
  hero: ["Awaiting directives."],
  about: ["The operator is highly skilled."],
  skills: ["No vulnerabilities detected in this stack."],
  experience: ["Field experience is extensive."],
  projects: ["These architectures are solid."],
  certifications: ["Knowledge base is current."],
  ctf: ["Always ready for a challenge."],
  github: ["Commit history is clean."],
  contact: ["Standing by for incoming messages."]
};

const ELEMENT_SPEECH_MAP: Record<string, string[]> = {
  project: ["Target acquired. Classified project in range."],
  cert: ["Credential verified. Clearance confirmed."],
  skill: ["Tool proficiency: confirmed."],
  experience: ["Battle log entry detected."],
  contact: ["Transmission channel open. Make contact."],
  ctf: ["War game record. The operator does not lose often."]
};

// Section Definitions for Color and Speech
const SECTIONS = [
  { id: 'hero', color: '#00F5FF' },
  { id: 'about', color: '#00F5FF' },
  { id: 'skills', color: '#39FF14' },
  { id: 'experience', color: '#FFB300' },
  { id: 'projects', color: '#00F5FF' },
  { id: 'certifications', color: '#FFFFFF' },
  { id: 'ctf', color: '#FF0055' },
  { id: 'github', color: '#39FF14' },
  { id: 'contact', color: '#39FF14' }
];

export function Sentinel() {
  const { isSpeaking, speak } = useAudio();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [orbColor, setOrbColor] = useState('#00F5FF');
  const [isDisturbed, setIsDisturbed] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateDisturbed = (val: boolean) => { setIsDisturbed(val); };


  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  // Core dimensions
  const ORB_SIZE_DESKTOP = 60;
  const ORB_SIZE_MOBILE = 44;

  const stateRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    initialized: false,
    ringAngle: 0,
    lastScrollY: 0,
    scrollSpeed: 0,
    trail: [] as {x: number, y: number, timestamp: number}[],
    activeGlowElements: new Map<Element, number>(),

    currentSection: 'hero',
    lastSpeechTime: 0,
    spokenPhrases: new Set<string>(),
    speechQueue: [] as string[],

    // Scroll Stop tracking
    lastScrollTime: Date.now(),
    isIdle: false,
    ambientSpokenForSection: false
  });

  const getOrbSize = () => {
    if (typeof window === 'undefined') return ORB_SIZE_DESKTOP;
    return window.innerWidth >= 768 ? ORB_SIZE_DESKTOP : ORB_SIZE_MOBILE;
  };

  const getAmplitude = () => {
     if (typeof window === 'undefined') return 0;
     const isMobile = window.innerWidth < 768;
     return window.innerWidth * (isMobile ? 0.3 : 0.4);
  };

  const getRgbaFromHex = (hex: string, alpha: number) => {
      let r = 0, g = 0, b = 0;
      if (hex.length === 4) {
          r = parseInt(hex[1] + hex[1], 16);
          g = parseInt(hex[2] + hex[2], 16);
          b = parseInt(hex[3] + hex[3], 16);
      } else if (hex.length === 7) {
          r = parseInt(hex.substring(1, 3), 16);
          g = parseInt(hex.substring(3, 5), 16);
          b = parseInt(hex.substring(5, 7), 16);
      }
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const queueSpeech = React.useCallback((text: string, type: string) => {
    const now = Date.now();
    const state = stateRef.current;

    const memoryKey = `${type}:${text}`;
    if (state.spokenPhrases.has(memoryKey)) return;

    if (now - state.lastSpeechTime < 4000) {
       if (state.speechQueue.length === 0) {
           state.speechQueue.push(text);
           state.spokenPhrases.add(memoryKey);
       }
       return;
    }

    if (state.scrollSpeed > 20) {
        if (state.speechQueue.length === 0) {
           state.speechQueue.push(text);
           state.spokenPhrases.add(memoryKey);
       }
       return;
    }

    speak(text);
    state.lastSpeechTime = now;
    state.spokenPhrases.add(memoryKey);
  }, [speak]);

  useEffect(() => {
     if (!canvasRef.current || typeof window === 'undefined') return;
     const resizeCanvas = () => {
         const canvas = canvasRef.current;
         if (canvas) {
             canvas.width = window.innerWidth;
             canvas.height = window.innerHeight;
         }
     };
     resizeCanvas();
     window.addEventListener('resize', resizeCanvas);
     return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Animation Loop
  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion || !canvasRef.current) return;

    let animationFrameId: number;
    let lastProximityCheck = 0;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const lerpColor = (a: string, b: string, amount: number) => {
        const ah = parseInt(a.replace(/#/g, ''), 16),
              ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
              bh = parseInt(b.replace(/#/g, ''), 16),
              br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
              rr = ar + amount * (br - ar),
              rg = ag + amount * (bg - ag),
              rb = ab + amount * (bb - ab);
        return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1).toUpperCase();
    };

    let currentRenderColor = orbColor;
    let targetColor = orbColor;

    const animate = (timestamp: number) => {
      const scrollY = window.scrollY;
      const innerHeight = window.innerHeight;
      const innerWidth = window.innerWidth;
      const now = Date.now();

      const centerX = innerWidth / 2;
      const amplitude = getAmplitude();
      const orbRadius = getOrbSize() / 2;

      stateRef.current.scrollSpeed = Math.abs(scrollY - stateRef.current.lastScrollY);

      if (stateRef.current.scrollSpeed > 0) {
          stateRef.current.lastScrollTime = now;
          if (stateRef.current.isIdle) {
              stateRef.current.isIdle = false;
              // Reset ambient spoken flag when they start moving again
              stateRef.current.ambientSpokenForSection = false;
          }
      }
      stateRef.current.lastScrollY = scrollY;

      // Idle check (> 1.5 seconds)
      const timeSinceLastScroll = now - stateRef.current.lastScrollTime;
      if (timeSinceLastScroll > 1500 && !stateRef.current.isIdle) {
          stateRef.current.isIdle = true;
          // Speak ambient phrase once per idle stop per section
          if (!stateRef.current.ambientSpokenForSection) {
              const phrases = AMBIENT_SPEECH_BANKS[stateRef.current.currentSection];
              if (phrases) {
                  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
                  queueSpeech(phrase, `ambient-${stateRef.current.currentSection}`);
                  stateRef.current.ambientSpokenForSection = true;
              }
          }
      }

      // Determine Section
      let newSection = stateRef.current.currentSection;
      for (const section of SECTIONS) {
          const el = document.getElementById(section.id);
          if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top < innerHeight * 0.4 && rect.bottom > 0) {
                  newSection = section.id;
                  targetColor = section.color;
              }
          }
      }

      if (newSection !== stateRef.current.currentSection) {
          stateRef.current.currentSection = newSection;
          stateRef.current.ambientSpokenForSection = false; // reset for new section

          const phrases = SPEECH_BANKS[newSection];
          if (phrases && phrases.length > 0) {
              const phrase = phrases[Math.floor(Math.random() * phrases.length)];
              queueSpeech(phrase, `section-${newSection}`);
          }
      }

      currentRenderColor = lerpColor(currentRenderColor, targetColor, 0.05);
      if (Math.random() < 0.1 && currentRenderColor !== orbColor) {
         setOrbColor(currentRenderColor);
      }

      const frequency = (Math.PI * 2) / 900;

      // Horizontal movement stops when idle
      if (!stateRef.current.isIdle) {
          stateRef.current.targetX = centerX + amplitude * Math.sin(scrollY * frequency);
      }
      stateRef.current.targetY = innerHeight * 0.6;

      if (!stateRef.current.initialized) {
        stateRef.current.x = stateRef.current.targetX;
        stateRef.current.y = stateRef.current.targetY;
        stateRef.current.initialized = true;

        if (orbRef.current) {
          orbRef.current.style.opacity = '1';
        }
      } else {
        stateRef.current.x = lerp(stateRef.current.x, stateRef.current.targetX, 0.08);
        stateRef.current.y = lerp(stateRef.current.y, stateRef.current.targetY, 0.08);
      }

      if (orbRef.current) {
         const transformX = stateRef.current.x - orbRadius;
         const transformY = stateRef.current.y - orbRadius;
         orbRef.current.style.transform = `translate(${transformX}px, ${transformY}px)`;
      }

      // Speech Queue Processor
      if (stateRef.current.speechQueue.length > 0 && now - stateRef.current.lastSpeechTime >= 4000 && stateRef.current.scrollSpeed < 10) {
          const nextPhrase = stateRef.current.speechQueue.shift();
          if (nextPhrase) {
              speak(nextPhrase);
              stateRef.current.lastSpeechTime = now;
          }
      }

      // Proximity Scanner
      if (timestamp - lastProximityCheck > 100) {
          lastProximityCheck = timestamp;

          const targets = document.querySelectorAll('[data-orb-target]');
          targets.forEach(el => {
              const rect = el.getBoundingClientRect();
              const elCenterX = rect.left + rect.width / 2;
              const elCenterY = rect.top + rect.height / 2;

              const dx = stateRef.current.x - elCenterX;
              const dy = stateRef.current.y - elCenterY;
              const distance = Math.sqrt(dx * dx + dy * dy);

              const isClose = distance < 150;
              const isCurrentlyActive = stateRef.current.activeGlowElements.has(el);

              if (isClose && !isCurrentlyActive) {
                  el.classList.add('orb-glow-active');
                  el.classList.remove('orb-glow-active-leaving');
                  stateRef.current.activeGlowElements.set(el, timestamp);

                  stateRef.current.trail.forEach(pt => {
                      pt.x += (Math.random() - 0.5) * 40;
                      pt.y += (Math.random() - 0.5) * 40;
                  });

                  const targetType = el.getAttribute('data-orb-target');
                  if (targetType && ELEMENT_SPEECH_MAP[targetType]) {
                      const phrases = ELEMENT_SPEECH_MAP[targetType];
                      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
                      queueSpeech(phrase, `element-${targetType}`);
                  }

              } else if (!isClose && isCurrentlyActive) {
                  el.classList.remove('orb-glow-active');
                  el.classList.add('orb-glow-active-leaving');
                  stateRef.current.activeGlowElements.delete(el);

                  setTimeout(() => {
                      el.classList.remove('orb-glow-active-leaving');
                  }, 400);
              }
          });
      }

      stateRef.current.trail.push({ x: stateRef.current.x, y: stateRef.current.y, timestamp });
      while (stateRef.current.trail.length > 0 && timestamp - stateRef.current.trail[0].timestamp > 400) {
          stateRef.current.trail.shift();
      }

      // Ring Rotation (Slows down significantly when idle)
      const baseSpeed = stateRef.current.isIdle ? 0.005 : 0.02;
      const moveSpeed = stateRef.current.scrollSpeed * 0.005;
      stateRef.current.ringAngle += baseSpeed + moveSpeed;

      ctx.clearRect(0, 0, innerWidth, innerHeight);

      const px = stateRef.current.x;
      const py = stateRef.current.y;

      const isDisturbed = stateRef.current.activeGlowElements.size > 0;
      const glowOpacity = isDisturbed ? 0.3 : 0.15;
      const haloRadius = isDisturbed ? 50 : 40;

      const gradient = ctx.createRadialGradient(px, py, orbRadius, px, py, orbRadius + haloRadius);
      gradient.addColorStop(0, getRgbaFromHex(currentRenderColor, glowOpacity));
      gradient.addColorStop(1, getRgbaFromHex(currentRenderColor, 0));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(px, py, orbRadius + haloRadius, 0, Math.PI * 2);
      ctx.fill();

      // Only draw 2 dots if idle, else draw all 4 delays
      const delays = stateRef.current.isIdle ? [80, 160] : [80, 160, 240, 320];
      const trailPointsToDraw = [];

      for (const delay of delays) {
          const targetTime = timestamp - delay;
          let closestPoint = null;
          let minDiff = Infinity;
          for (let i = stateRef.current.trail.length - 1; i >= 0; i--) {
              const pt = stateRef.current.trail[i];
              const diff = Math.abs(pt.timestamp - targetTime);
              if (diff < minDiff) {
                  minDiff = diff;
                  closestPoint = pt;
              }
          }
          if (closestPoint && minDiff < 40) {
              trailPointsToDraw.push({ ...closestPoint, delay });
          }
      }

      trailPointsToDraw.forEach((pt, idx) => {
          const progress = 1 - (pt.delay / 400);
          const dotRadius = orbRadius * 0.15 * progress;

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, Math.max(1, dotRadius), 0, Math.PI * 2);
          // If idle, trail orbits slowly around the orb's current center
          if (stateRef.current.isIdle) {
             const angleOffset = (timestamp * 0.001) + (idx * Math.PI);
             const orbitDistance = orbRadius * 1.2;
             ctx.arc(px + Math.cos(angleOffset) * orbitDistance, py + Math.sin(angleOffset) * orbitDistance, Math.max(1, dotRadius), 0, Math.PI * 2);
          } else {
             ctx.arc(pt.x, pt.y, Math.max(1, dotRadius), 0, Math.PI * 2);
          }
          ctx.fillStyle = getRgbaFromHex(currentRenderColor, progress * 0.6);
          ctx.fill();
      });

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(30 * Math.PI / 180);
      ctx.rotate(stateRef.current.ringAngle);

      ctx.beginPath();
      ctx.ellipse(0, 0, orbRadius * 1.5, orbRadius * 0.5, 0, 0, Math.PI * 2);
      ctx.strokeStyle = getRgbaFromHex(currentRenderColor, 0.4);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(orbRadius * 1.5, 0, 2, 0, Math.PI * 2);
      ctx.fillStyle = getRgbaFromHex(currentRenderColor, 0.8);
      ctx.fill();

      ctx.restore();

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion, speak, orbColor, queueSpeech]);

  useEffect(() => {
    if (prefersReducedMotion && orbRef.current && typeof window !== 'undefined') {
       const size = getOrbSize();
       const centerX = window.innerWidth / 2 - size / 2;
       const centerY = window.innerHeight * 0.6 - size / 2;
       orbRef.current.style.transform = `translate(${centerX}px, ${centerY}px)`;
       orbRef.current.style.opacity = '1';
    }
  }, [prefersReducedMotion]);



  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[10000]"
        style={{ display: prefersReducedMotion ? 'none' : 'block' }}
      />

      <div
        ref={orbRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] flex items-center justify-center will-change-transform"
        style={{
          width: getOrbSize(),
          height: getOrbSize(),
          opacity: 0,
          transition: 'opacity 0.5s ease'
        }}
      >
        <motion.div
          className="w-full h-full rounded-full relative shadow-lg"
          animate={{
            boxShadow: isDisturbed || isSpeaking
              ? `0 0 40px ${orbColor}99, inset 0 0 20px ${orbColor}99`
              : `0 0 20px ${orbColor}33, inset 0 0 10px ${orbColor}4D`
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(circle at 30% 30%, ${orbColor}33 0%, #000000 70%)`,
            border: `1px solid ${orbColor}4D`
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-full opacity-50"
            animate={{
              background: [
                `radial-gradient(circle at 50% 50%, ${orbColor}00 0%, ${orbColor}00 100%)`,
                `radial-gradient(circle at 50% 50%, ${orbColor}66 0%, ${orbColor}00 70%)`,
                `radial-gradient(circle at 50% 50%, ${orbColor}00 0%, ${orbColor}00 100%)`
              ]
            }}
            transition={{
              duration: isDisturbed ? 0.8 : (isSpeaking ? 0.3 : 2.5),
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="absolute inset-0 rounded-full opacity-20 mix-blend-overlay"
               style={{ backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2VGaWx0ZXIpIi8+PC9zdmc+')` }} />

          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="scan-line-effect w-full h-full" />
          </div>
        </motion.div>
      </div>
    </>
  );
}
