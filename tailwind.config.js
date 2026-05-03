/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        surface: {
          DEFAULT: '#111111',
          dark: '#0A0A0A',
          light: '#1A1A1A',
        },
        gold: {
          DEFAULT: '#C6A85C',
          light: '#D4BC7A',
          dark: '#B8994E',
        },
        'race-red': {
          DEFAULT: '#E63946',
          light: '#FF4757',
          dark: '#D62936',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Racing Sans One', 'Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'carbon-texture': "url('/carbon-texture.png')",
        'surface-gradient': 'linear-gradient(135deg, #111111 0%, #1A1A1A 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
