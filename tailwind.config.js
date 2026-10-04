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
        gold: {
          50: '#fdfbf5',
          100: '#fbf7e8',
          200: '#f7ecc6',
          300: '#f1db99',
          400: '#e8c466',
          500: '#d4af37', // signature Arabian Gold
          600: '#bf9525',
          700: '#9b711c',
          800: '#7e5a1b',
          900: '#684a1a',
        },
        mandi: {
          bg: '#0B0C0E',
          card: '#14161A',
          surface: '#1A1D23',
          elevated: '#23272F',
          border: '#2E3440',
          accent: '#D4AF37',
          flame: '#E65100',
          spice: '#EF4444',
          herb: '#10B981',
          cream: '#FAF6ED',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-outfit)', 'serif'],
        arabic: ['var(--font-amiri)', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'gold-sm': '0 0 10px -2px rgba(212, 175, 55, 0.2)',
        'flame-glow': '0 0 25px -5px rgba(230, 81, 0, 0.3)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F5D061 0%, #D4AF37 50%, #9B711C 100%)',
        'dark-gradient': 'linear-gradient(180deg, #14161A 0%, #0B0C0E 100%)',
      }
    },
  },
  plugins: [],
};
