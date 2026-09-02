'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// ⚡ Bolt: Dynamically import Preloader to defer loading of framer-motion and reduce initial bundle size
const Preloader = dynamic(() => import('@/components/sections/Preloader').then(mod => ({ default: mod.Preloader })), {
  ssr: false,
});
import { Navigation }           from '@/components/sections/Navigation';
import { CommandPalette }       from '@/components/global/CommandPalette';
import { ScrollProgress }       from '@/components/global/ScrollProgress';
import { Hero }                 from '@/components/sections/Hero';
import { CursorProvider }       from '@/components/providers/CursorProvider';
import { BackToTop }            from '@/components/ui/BackToTop';
// ⚡ Bolt: Dynamically import all below-the-fold components to reduce the
// initial Next.js JavaScript bundle size and improve Time to Interactive (TTI).
const About = dynamic(() => import('@/components/sections/About').then(mod => ({ default: mod.About })));
const Skills = dynamic(() => import('@/components/sections/Skills').then(mod => ({ default: mod.Skills })));
const Experience = dynamic(() => import('@/components/sections/Experience').then(mod => ({ default: mod.Experience })));
const Projects = dynamic(() => import('@/components/sections/Projects').then(mod => ({ default: mod.Projects })));
const WriteupsStub = dynamic(() => import('@/components/sections/WriteupsStub').then(mod => ({ default: mod.WriteupsStub })));
const Certifications = dynamic(() => import('@/components/sections/Certifications').then(mod => ({ default: mod.Certifications })));
const CTFStats = dynamic(() => import('@/components/sections/CTFStats').then(mod => ({ default: mod.CTFStats })));
const GitHubStats = dynamic(() => import('@/components/sections/GitHubStats').then(mod => ({ default: mod.GitHubStats })));
const ResumePanel = dynamic(() => import('@/components/sections/ResumePanel').then(mod => ({ default: mod.ResumePanel })));
const Contact = dynamic(() => import('@/components/sections/Contact').then(mod => ({ default: mod.Contact })));
const Footer = dynamic(() => import('@/components/sections/Footer').then(mod => ({ default: mod.Footer })));

export default function Home() {
  return (
    <>
      <Preloader />

      <CursorProvider>
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
      </CursorProvider>
    </>
  );
}
