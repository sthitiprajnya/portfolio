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
        heading: ['system-ui', '-apple-system', 'sans-serif'],
        body:    ['system-ui', '-apple-system', 'sans-serif'],
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
      },
      borderRadius: {
        'xs':   '4px',
        'sm':   '8px',
        'md':   '12px',
        'lg':   '16px',
        'xl':   '20px',
        '2xl':  '24px',
        'card': '20px',
        'pill': '9999px',
      },
      backdropBlur: {
        'glass':       '12px',
        'glass-heavy': '20px',
        'glass-light': '6px',
      },
      boxShadow: {
        'glass':       '0 8px 32px rgba(0,0,0,0.40), 0 0 0 1px rgba(0,245,255,0.06), inset 0 1px 0 rgba(0,245,255,0.08)',
        'glass-hover': '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,245,255,0.20), inset 0 1px 0 rgba(0,245,255,0.14)',
        'glow-cyan':   '0 0 24px rgba(0,245,255,0.25), 0 0 48px rgba(0,245,255,0.10)',
        'glow-green':  '0 0 24px rgba(0,255,128,0.25)',
      },
    },
  },
  plugins: [],
};

export default config;