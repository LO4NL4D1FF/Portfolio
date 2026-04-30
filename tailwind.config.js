/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#07080C',
          900: '#0B0D14',
          800: '#11141C',
          700: '#181C26',
          600: '#222735',
          500: '#2D3344',
        },
        cream: {
          50: '#F8F6F1',
          100: '#EDEAE2',
          200: '#D7D2C5',
          300: '#B7B0A0',
          400: '#8E8676',
        },
        accent: {
          50: '#EEF5FF',
          100: '#D9E7FF',
          200: '#B6CDFF',
          300: '#8AAEFC',
          400: '#6F92F1',
          500: '#5B7BE3',
          600: '#4A63C9',
          700: '#3D4FA3',
          800: '#33417F',
          900: '#2A3563',
        },
        ember: {
          400: '#E7B576',
          500: '#D9A05B',
          600: '#B98246',
        },
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at 50% 0%, rgba(91,123,227,0.18), transparent 60%)',
        'noise':
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.93 0 0 0 0 0.89 0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px -20px rgba(91,123,227,0.35)',
        soft: '0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.6)',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        floatSlow: 'floatSlow 8s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
};
