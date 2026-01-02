/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Retro Game Pixel Art Palette (16-bit inspired)
        'pixel-dark': '#1a1c2c',      // Deep space blue (backgrounds)
        'pixel-purple': '#5d275d',     // Dark purple
        'pixel-red': '#b13e53',        // Muted red
        'pixel-orange': '#ef7d57',     // Warm orange
        'pixel-yellow': '#ffcd75',     // Golden yellow
        'pixel-lime': '#a7f070',       // Bright lime green
        'pixel-green': '#38b764',      // Grass green
        'pixel-cyan': '#257179',       // Deep cyan
        'pixel-blue': '#29366f',       // Navy blue
        'pixel-sky': '#3b5dc9',        // Sky blue
        'pixel-indigo': '#41a6f6',     // Bright indigo
        'pixel-pink': '#ff77a8',       // Hot pink
        'pixel-peach': '#ffccaa',      // Peach
        'pixel-brown': '#5a3921',      // Brown
        'pixel-gray': '#6f6776',       // Mid gray
        'pixel-light': '#9badb7',      // Light gray
        'pixel-white': '#f4f4f4',      // Off-white
        'pixel-black': '#0d0d0d',      // True black

        // UI specific colors
        'game-bg': '#1a1c2c',
        'game-panel': '#29366f',
        'game-text': '#f4f4f4',
        'game-shadow': '#0d0d0d',
        'game-highlight': '#ffcd75',
      },
      fontFamily: {
        pixel: ['VT323', 'monospace'],
        game: ['Press Start 2P', 'monospace'],
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      borderRadius: {
        'pixel': '0px',
      },
      boxShadow: {
        'pixel': '4px 4px 0px rgba(13, 13, 13, 0.8)',
        'pixel-sm': '2px 2px 0px rgba(13, 13, 13, 0.8)',
        'pixel-lg': '8px 8px 0px rgba(13, 13, 13, 0.8)',
        'pixel-inner': 'inset 2px 2px 0px rgba(244, 244, 244, 0.3)',
      },
      animation: {
        'blink': 'blink 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'pixel-bounce': 'pixel-bounce 0.6s ease-in-out infinite',
        'glitch': 'glitch 0.5s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'blink': {
          '0%, 49%, 100%': { opacity: '1' },
          '50%, 99%': { opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pixel-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
      },
    },
  },
  plugins: [],
}
