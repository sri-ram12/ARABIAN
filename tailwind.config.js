/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#09090b',
          card: '#121216',
          surface: '#18181f',
          elevated: '#202028',
          border: '#272730',
          borderGold: '#d4af37',
          subtext: '#9ca3af',
        },
        gold: {
          50: '#fdfbf5',
          100: '#fbf7e8',
          200: '#f7ecc6',
          300: '#f1db99',
          400: '#e8c466',
          500: '#d4af37',
          600: '#bf9525',
          700: '#9b711c',
          800: '#7e5a1b',
          900: '#684a1a',
        },
        amber: {
          500: '#f59e0b',
          600: '#d97706',
        },
        mandi: {
          bg: '#09090b',
          card: '#121216',
          surface: '#18181f',
          elevated: '#202028',
          border: '#272730',
          accent: '#d4af37',
          flame: '#ff7828',
          spice: '#ef4444',
          herb: '#10b981',
          cream: '#f4f4f5',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-cinzel)', 'Georgia', 'serif'],
        cinzel: ['var(--font-cinzel)', 'Georgia', 'serif'],
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      boxShadow: {
        'slate-card': '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(212, 175, 55, 0.15)',
        'gold-glow': '0 0 35px -5px rgba(212, 175, 55, 0.35)',
        'gold-sm': '0 0 15px -2px rgba(212, 175, 55, 0.25)',
        'flame-glow': '0 0 30px -5px rgba(255, 120, 40, 0.4)',
        'platter-shadow': '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 40px rgba(212, 175, 55, 0.15)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f6d365 0%, #d4af37 50%, #b8860b 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #b8860b 0%, #f6d365 50%, #b8860b 100%)',
        'flame-gradient': 'linear-gradient(135deg, #ff7828 0%, #ef4444 100%)',
        'dark-slate': 'linear-gradient(180deg, #16161b 0%, #0e0e12 100%)',
        'slate-plate': 'radial-gradient(circle, #1a1a22 0%, #0d0d11 100%)',
      }
    },
  },
  plugins: [],
};
