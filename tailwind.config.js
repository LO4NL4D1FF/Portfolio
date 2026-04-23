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
        // Cyberpunk 2077 Neon Palette
        'neon-yellow': '#fcee0a',
        'neon-cyan': '#00f0ff',
        'neon-magenta': '#ff003c',
        'neon-pink': '#ff00aa',
        'neon-green': '#39ff14',
        'neon-blue': '#0066ff',
        'neon-purple': '#8b00ff',
        'neon-orange': '#ff6b00',
        'neon-red': '#ff1744',

        'cyber-black': '#000000',
        'cyber-void': '#05050a',
        'cyber-dark': '#0a0a14',
        'cyber-panel': '#12121f',
        'cyber-steel': '#1f1f33',
        'cyber-chrome': '#2a2a3e',
        'cyber-ash': '#8892b0',
        'cyber-bone': '#e0e7ff',

        // Pixel palette remapped to cyberpunk hues (for legacy class compatibility)
        'pixel-dark': '#0a0a14',
        'pixel-purple': '#8b00ff',
        'pixel-red': '#ff003c',
        'pixel-orange': '#ff6b00',
        'pixel-yellow': '#fcee0a',
        'pixel-lime': '#39ff14',
        'pixel-green': '#00ff88',
        'pixel-cyan': '#00f0ff',
        'pixel-blue': '#0066ff',
        'pixel-sky': '#0099ff',
        'pixel-indigo': '#4d00ff',
        'pixel-pink': '#ff00aa',
        'pixel-peach': '#ff6b9d',
        'pixel-brown': '#2a1a33',
        'pixel-gray': '#2a2a3e',
        'pixel-light': '#8892b0',
        'pixel-white': '#e0e7ff',
        'pixel-black': '#000000',
        'pixel-teal': '#00d9c0',

        // UI specific colors
        'game-bg': '#05050a',
        'game-panel': '#12121f',
        'game-text': '#e0e7ff',
        'game-shadow': '#fcee0a',
        'game-highlight': '#fcee0a',

        // Legacy android-* aliases for any lingering references
        'android-bg': '#05050a',
        'android-text': '#e0e7ff',
        'android-text-secondary': '#8892b0',
        'android-accent': '#fcee0a',
      },
      fontFamily: {
        pixel: ['VT323', 'monospace'],
        game: ['"Press Start 2P"', 'monospace'],
        cyber: ['Orbitron', 'sans-serif'],
        hud: ['Rajdhani', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
        sans: ['Rajdhani', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      borderRadius: {
        'pixel': '0px',
      },
      boxShadow: {
        'pixel': '4px 4px 0px rgba(252, 238, 10, 0.8)',
        'pixel-sm': '2px 2px 0px rgba(252, 238, 10, 0.6)',
        'pixel-lg': '8px 8px 0px rgba(252, 238, 10, 0.9)',
        'pixel-inner': 'inset 2px 2px 0px rgba(0, 240, 255, 0.3)',
        'neon-yellow': '0 0 12px #fcee0a, 0 0 24px rgba(252, 238, 10, 0.6)',
        'neon-cyan': '0 0 12px #00f0ff, 0 0 24px rgba(0, 240, 255, 0.6)',
        'neon-magenta': '0 0 12px #ff003c, 0 0 24px rgba(255, 0, 60, 0.6)',
        'neon-pink': '0 0 12px #ff00aa, 0 0 24px rgba(255, 0, 170, 0.6)',
        'neon-green': '0 0 12px #39ff14, 0 0 24px rgba(57, 255, 20, 0.6)',
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0, 240, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.08) 1px, transparent 1px)',
        'cyber-gradient': 'linear-gradient(135deg, #05050a 0%, #12121f 50%, #1f0033 100%)',
        'night-city': 'linear-gradient(180deg, #000000 0%, #0a0a14 40%, #1f0033 80%, #ff003c 120%)',
      },
      animation: {
        'blink': 'blink 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'pixel-bounce': 'pixel-bounce 0.6s ease-in-out infinite',
        'glitch': 'glitch 0.5s ease-in-out infinite',
        'glitch-slow': 'glitch 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 3s linear infinite',
        'data-stream': 'data-stream 20s linear infinite',
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
          '0%, 100%': { transform: 'translate(0)', filter: 'hue-rotate(0deg)' },
          '20%': { transform: 'translate(-2px, 2px)', filter: 'hue-rotate(90deg)' },
          '40%': { transform: 'translate(-2px, -2px)', filter: 'hue-rotate(180deg)' },
          '60%': { transform: 'translate(2px, 2px)', filter: 'hue-rotate(270deg)' },
          '80%': { transform: 'translate(2px, -2px)', filter: 'hue-rotate(360deg)' },
        },
        'neon-pulse': {
          '0%, 100%': {
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 20px currentColor',
            opacity: '1',
          },
          '50%': {
            textShadow: '0 0 8px currentColor, 0 0 16px currentColor, 0 0 32px currentColor',
            opacity: '0.9',
          },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'flicker': {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '1' },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.4' },
        },
        'data-stream': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
