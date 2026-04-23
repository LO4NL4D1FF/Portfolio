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
        // --- Pure monochrome scale ---
        'g-0':   '#000000',  // background
        'g-50':  '#0a0a0a',
        'g-100': '#111113',
        'g-200': '#17171a',
        'g-300': '#1f1f23',
        'g-400': '#27272b',
        'g-500': '#3f3f46',
        'g-600': '#52525b',
        'g-700': '#71717a',
        'g-800': '#a1a1aa',
        'g-900': '#d4d4d8',
        'g-950': '#ffffff',

        // Semantic
        'ink':   '#000000',
        'fg':    '#ffffff',
        'muted': '#a1a1aa',
        'sub':   '#71717a',

        // --- Legacy aliases (kept so old class refs don't crash styling) ---
        'amber': '#ffffff',
        'slate': '#a1a1aa',
        'bone':  '#ffffff',

        'ink-0':    '#000000',
        'ink-1':    '#0a0a0a',
        'ink-2':    '#111113',
        'ink-line': '#27272b',
        'dim':      '#71717a',

        'neon-yellow':  '#ffffff',
        'neon-cyan':    '#a1a1aa',
        'neon-magenta': '#a1a1aa',
        'neon-pink':    '#a1a1aa',
        'neon-green':   '#a1a1aa',
        'neon-blue':    '#a1a1aa',
        'neon-purple':  '#a1a1aa',
        'neon-orange':  '#ffffff',
        'neon-red':     '#a1a1aa',

        'cyber-black':  '#000000',
        'cyber-void':   '#000000',
        'cyber-dark':   '#0a0a0a',
        'cyber-panel':  '#111113',
        'cyber-steel':  '#27272b',
        'cyber-chrome': '#27272b',
        'cyber-ash':    '#71717a',
        'cyber-bone':   '#ffffff',

        'pixel-dark':   '#0a0a0a',
        'pixel-purple': '#71717a',
        'pixel-red':    '#71717a',
        'pixel-orange': '#ffffff',
        'pixel-yellow': '#ffffff',
        'pixel-lime':   '#a1a1aa',
        'pixel-green':  '#a1a1aa',
        'pixel-cyan':   '#a1a1aa',
        'pixel-blue':   '#a1a1aa',
        'pixel-sky':    '#a1a1aa',
        'pixel-indigo': '#a1a1aa',
        'pixel-pink':   '#a1a1aa',
        'pixel-peach':  '#ffffff',
        'pixel-brown':  '#27272b',
        'pixel-gray':   '#27272b',
        'pixel-light':  '#71717a',
        'pixel-white':  '#ffffff',
        'pixel-black':  '#000000',
        'pixel-teal':   '#a1a1aa',

        'game-bg':        '#000000',
        'game-panel':     '#111113',
        'game-text':      '#ffffff',
        'game-shadow':    '#000000',
        'game-highlight': '#ffffff',

        'android-bg':             '#000000',
        'android-text':           '#ffffff',
        'android-text-secondary': '#a1a1aa',
        'android-accent':         '#ffffff',
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
        // Legacy-compat: all alias to Inter
        hud:   ['Inter', 'sans-serif'],
        cyber: ['Inter', 'sans-serif'],
        pixel: ['Inter', 'sans-serif'],
        game:  ['Inter', 'sans-serif'],
      },
      spacing: {
        'safe-top':    'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      borderRadius: {
        'pixel': '0px',
      },
      boxShadow: {
        'pixel':       'none',
        'pixel-sm':    'none',
        'pixel-lg':    'none',
        'pixel-inner': 'none',
      },
      animation: {
        'blink': 'blink 1.4s steps(2) infinite',
      },
      keyframes: {
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
