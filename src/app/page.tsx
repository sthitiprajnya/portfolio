'use client';

import React from 'react';
import { Preloader }            from '@/components/sections/Preloader';
import { Navigation }           from '@/components/sections/Navigation';
import { BackToTop }            from '@/components/ui/BackToTop';
import { CommandPalette }       from '@/components/global/CommandPalette';
import { ScrollProgress }       from '@/components/global/ScrollProgress';
import { Hero }                 from '@/components/sections/Hero';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { CursorProvider }       from '@/components/providers/CursorProvider';
import { Toaster }              from 'react-hot-toast';

import dynamic from 'next/dynamic';

const About = dynamic(() => import('@/components/sections/About').then(mod => mod.About), { ssr: false, loading: () => null });
const Skills = dynamic(() => import('@/components/sections/Skills').then(mod => mod.Skills), { ssr: false, loading: () => null });
const Experience = dynamic(() => import('@/components/sections/Experience').then(mod => mod.Experience), { ssr: false, loading: () => null });
const Projects = dynamic(() => import('@/components/sections/Projects').then(mod => mod.Projects), { ssr: false, loading: () => null });
const WriteupsStub = dynamic(() => import('@/components/sections/WriteupsStub').then(mod => mod.WriteupsStub), { ssr: false, loading: () => null });
const Certifications = dynamic(() => import('@/components/sections/Certifications').then(mod => mod.Certifications), { ssr: false, loading: () => null });
const CTFStats = dynamic(() => import('@/components/sections/CTFStats').then(mod => mod.CTFStats), { ssr: false, loading: () => null });
const GitHubStats = dynamic(() => import('@/components/sections/GitHubStats').then(mod => mod.GitHubStats), { ssr: false, loading: () => null });
const ResumePanel = dynamic(() => import('@/components/sections/ResumePanel').then(mod => mod.ResumePanel), { ssr: false, loading: () => null });
const Contact = dynamic(() => import('@/components/sections/Contact').then(mod => mod.Contact), { ssr: false, loading: () => null });
const Footer = dynamic(() => import('@/components/sections/Footer').then(mod => mod.Footer), { ssr: false, loading: () => null });

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
