/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070707',
          900: '#0f0f0f',
          850: '#141414',
          800: '#1a1a1a',
          700: '#262626',
          600: '#333333',
        },
        gold: {
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          metallic: '#d4af37',
        },
        silver: {
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
          400: '#cbd5e1',
          500: '#94a3b8',
        },
        emerald: {
          custom: '#059669',
          glow: '#10b981',
        },
        navy: {
          custom: '#1e3a8a',
          dark: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['"Work Sans"', 'Lato', 'sans-serif'],
        display: ['"Montserrat"', '"Lato"', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
