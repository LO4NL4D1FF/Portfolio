/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink:    '#0a0a0c',
        fg:     '#1d1d1f',
        muted:  '#5e5e63',
        sub:    '#86868b',
        line:   'rgba(0, 0, 0, 0.08)',
        canvas: '#fafafa',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        lift: '0 2px 6px rgba(0,0,0,0.05), 0 18px 48px rgba(0,0,0,0.10)',
      },
      keyframes: {
        drift1: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%':      { transform: 'translate3d(8vw, -6vh, 0) scale(1.08)' },
        },
        drift2: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%':      { transform: 'translate3d(-6vw, 8vh, 0) scale(1.1)' },
        },
        drift3: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%':      { transform: 'translate3d(5vw, 10vh, 0) scale(0.95)' },
        },
      },
      animation: {
        drift1: 'drift1 22s ease-in-out infinite',
        drift2: 'drift2 26s ease-in-out infinite',
        drift3: 'drift3 30s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
