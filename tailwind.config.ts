import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void:          '#000000',
        deep:          '#020408',
        surface:       '#071018',
        overlay:       '#0A1628',
        border:        '#0D2137',
        'border-glow': '#1B4F72',

        cyan:          '#00F5FF',
        'cyan-dim':    '#00B4CC',
        'cyan-ghost':  '#00F5FF15',
        green:         '#39FF14',
        'green-dim':   '#2ACC0F',
        'green-ghost': '#39FF1410',
        violet:        '#BF00FF',
        'violet-dim':  '#8B00BB',
        amber:         '#FFB300',
        red:           '#FF0055',

        'text-primary':   '#E8F4F8',
        'text-secondary': '#7FA8C4',
        'text-muted':     '#3D6680',
        'text-accent':    '#00F5FF',
      },
      fontFamily: {
        display: ['Orbitron', 'monospace'],
        heading: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'hero':    ['clamp(2.1rem, 8vw, 6.5rem)', { lineHeight: '1.0', letterSpacing: '-0.03em', fontWeight: '900' }],
        'display': ['clamp(2rem, 4.5vw, 4rem)',   { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'section': ['clamp(1.6rem, 3vw, 2.6rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'card':    ['clamp(1.1rem, 2vw, 1.4rem)', { lineHeight: '1.3', fontWeight: '600' }],
        'body':    ['1rem',                       { lineHeight: '1.7', fontWeight: '400' }],
        'small':   ['0.875rem',                   { lineHeight: '1.6', fontWeight: '400' }],
        'label':   ['0.7rem',                     { lineHeight: '1.4', letterSpacing: '0.15em', fontWeight: '600' }],
        'mono-sm': ['0.8rem',                     { lineHeight: '1.5' }],
      },
      screens: {
        'xs':  '375px',
        'sm':  '640px',
        'md':  '768px',
        'lg':  '1024px',
        'xl':  '1280px',
        '2xl': '1536px',
      }
    },
  },
  plugins: [],
  // Performance optimization: purge unused CSS
  safelist: [
    // Keep animations
    'animate-pulse',
    // Keep text colors used dynamically
    'text-cyan',
    'text-green',
    'text-yellow-500',
    'text-text-primary',
    'text-text-secondary',
    'text-text-muted',
  ],
};

export default config;