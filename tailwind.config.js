/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-schibsted)', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: token('paper'),
        surface: token('surface'),
        ink: token('ink'),
        slate: token('slate'),
        line: token('line'),
        sun: token('sun'),
        sky: token('sky'),
        navy: token('navy'),
        mist: token('mist'),
      },
      maxWidth: {
        page: '76rem',
        prose: '38rem',
      },
      borderRadius: {
        tray: '2rem',
        icon: '22%',
      },
    },
  },
  plugins: [],
};
