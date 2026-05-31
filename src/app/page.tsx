'use client';

import React from 'react';
import { Preloader }            from '@/components/sections/Preloader';
import { Navigation }           from '@/components/sections/Navigation';
import { CommandPalette }       from '@/components/global/CommandPalette';
import { ScrollProgress }       from '@/components/global/ScrollProgress';
import { Hero }                 from '@/components/sections/Hero';
import { About }                from '@/components/sections/About';
import { Skills }               from '@/components/sections/Skills';
import { Experience }           from '@/components/sections/Experience';
import { Projects }             from '@/components/sections/Projects';
import { WriteupsStub }         from '@/components/sections/WriteupsStub';
import { Certifications }       from '@/components/sections/Certifications';
import { CTFStats }             from '@/components/sections/CTFStats';
import { GitHubStats }          from '@/components/sections/GitHubStats';
import { ResumePanel }          from '@/components/sections/ResumePanel';
import { Contact }              from '@/components/sections/Contact';
import { Footer }               from '@/components/sections/Footer';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { CursorProvider }       from '@/components/providers/CursorProvider';
import { Toaster }              from 'react-hot-toast';

import { useState } from 'react';
import { AudioPrompt } from '@/components/sections/AudioPrompt';
import { Sentinel } from '@/components/global/Sentinel';

export default function Home() {
  const [bootReady, setBootReady] = useState(false);

  return (
    <>
      {!bootReady && <AudioPrompt onComplete={() => setBootReady(true)} />}
      {bootReady && <Preloader />}

      <CursorProvider>
        <SmoothScrollProvider>
          <ScrollProgress />
          <CommandPalette />
          <Navigation />

          <main id="main-content" tabIndex={-1} className="outline-none">
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <WriteupsStub />
            <Certifications />
            {/* Section 06 — War Games: CTF / HackTheBox activity */}
            <CTFStats />
            <GitHubStats />
            {/* Section 08 — Classified File: resume panel + download CTA */}
            <ResumePanel />
            <Contact />
          </main>

          <Footer />
          <Sentinel />
        </SmoothScrollProvider>
      </CursorProvider>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background:  'var(--color-surface)',
            color:       'var(--text-primary)',
            border:      '1px solid var(--color-border)',
            fontFamily:  'var(--font-mono)',
            fontSize:    '0.8rem',
            borderRadius:'4px',
          },
          success: {
            iconTheme: { primary: 'var(--color-green)', secondary: 'black' },
            style: { borderColor: 'var(--color-green)', boxShadow: 'var(--glow-green-sm)' },
          },
          error: {
            iconTheme: { primary: 'var(--color-red)', secondary: 'white' },
            style: { borderColor: 'var(--color-red)' },
          },
        }}
      />
    </>
  );
}
