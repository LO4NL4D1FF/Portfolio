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
        // --- Minimalist cyberpunk palette ---
        // Three accents, plus a couple of neutrals for depth.
        'amber': '#d9a65f',       // warm primary (CRT phosphor amber)
        'slate': '#6b8e91',       // muted teal-gray secondary
        'bone': '#c8c3b4',        // off-white foreground

        'ink-0': '#0b0c0f',       // page background (near-black)
        'ink-1': '#101217',       // panel background
        'ink-2': '#171a21',       // elevated panel
        'ink-line': '#262832',    // divider / 1px line
        'dim': '#6b6c73',         // muted metadata text

        // --- Legacy aliases mapped into the new palette ---
        // Kept so any lingering class references don't break styling.
        'neon-yellow': '#d9a65f',
        'neon-cyan': '#6b8e91',
        'neon-magenta': '#a66a6a',
        'neon-pink': '#a66a6a',
        'neon-green': '#6b8e91',
        'neon-blue': '#6b8e91',
        'neon-purple': '#a66a6a',
        'neon-orange': '#d9a65f',
        'neon-red': '#a66a6a',

        'cyber-black': '#000000',
        'cyber-void': '#0b0c0f',
        'cyber-dark': '#101217',
        'cyber-panel': '#171a21',
        'cyber-steel': '#262832',
        'cyber-chrome': '#262832',
        'cyber-ash': '#6b6c73',
        'cyber-bone': '#c8c3b4',

        'pixel-dark': '#0b0c0f',
        'pixel-purple': '#a66a6a',
        'pixel-red': '#a66a6a',
        'pixel-orange': '#d9a65f',
        'pixel-yellow': '#d9a65f',
        'pixel-lime': '#6b8e91',
        'pixel-green': '#6b8e91',
        'pixel-cyan': '#6b8e91',
        'pixel-blue': '#6b8e91',
        'pixel-sky': '#6b8e91',
        'pixel-indigo': '#6b8e91',
        'pixel-pink': '#a66a6a',
        'pixel-peach': '#d9a65f',
        'pixel-brown': '#262832',
        'pixel-gray': '#262832',
        'pixel-light': '#6b6c73',
        'pixel-white': '#c8c3b4',
        'pixel-black': '#000000',
        'pixel-teal': '#6b8e91',

        'game-bg': '#0b0c0f',
        'game-panel': '#101217',
        'game-text': '#c8c3b4',
        'game-shadow': '#000000',
        'game-highlight': '#d9a65f',

        'android-bg': '#0b0c0f',
        'android-text': '#c8c3b4',
        'android-text-secondary': '#6b6c73',
        'android-accent': '#d9a65f',
      },
      fontFamily: {
        sans: ['Rajdhani', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Share Tech Mono"', 'monospace'],
        hud: ['Rajdhani', 'sans-serif'],
        cyber: ['Rajdhani', 'sans-serif'],
        pixel: ['Rajdhani', 'sans-serif'],
        game: ['Rajdhani', 'sans-serif'],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      borderRadius: {
        'pixel': '0px',
      },
      boxShadow: {
        'pixel': 'none',
        'pixel-sm': 'none',
        'pixel-lg': 'none',
        'pixel-inner': 'none',
        'neon-yellow': 'none',
        'neon-cyan': 'none',
        'neon-magenta': 'none',
        'neon-pink': 'none',
        'neon-green': 'none',
      },
      animation: {
        'blink': 'blink 1.2s steps(2) infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
