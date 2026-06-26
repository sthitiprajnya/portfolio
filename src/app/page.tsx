'use client';

import React from 'react';
import { Preloader }            from '@/components/sections/Preloader';
import { Navigation }           from '@/components/sections/Navigation';
import { CommandPalette }       from '@/components/global/CommandPalette';
import { ScrollProgress }       from '@/components/global/ScrollProgress';
import { Hero }                 from '@/components/sections/Hero';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { CursorProvider }       from '@/components/providers/CursorProvider';
import { BackToTop }            from '@/components/ui/BackToTop';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { WriteupsStub } from '@/components/sections/WriteupsStub';
import { Certifications } from '@/components/sections/Certifications';
import { CTFStats } from '@/components/sections/CTFStats';
import { GitHubStats } from '@/components/sections/GitHubStats';
import { ResumePanel } from '@/components/sections/ResumePanel';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Preloader />

      <CursorProvider>
        <SmoothScrollProvider>
          <ScrollProgress />
          <BackToTop />
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
        </SmoothScrollProvider>
      </CursorProvider>
    </>
  );
}
