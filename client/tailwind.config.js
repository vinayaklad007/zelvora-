/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#e5d3cd',
          300: '#d0b3a9',
          400: '#b78b7e',
          500: '#9d6758', // Warm Terracotta / Rose Bronze
          600: '#865143',
          700: '#6f3f35',
          800: '#5c352d',
          900: '#4e2f29',
        },
        roseGold: {
          light: '#f7e7e6',
          DEFAULT: '#b76e79',
          dark: '#964b56'
        },
        gold: {
          light: '#fbf4dd',
          DEFAULT: '#d4af37',
          dark: '#aa881e'
        },
        luxuryDark: '#121212',
        champagne: '#f9f6f0'
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'luxury': '0 10px 30px -5px rgba(183, 110, 121, 0.15)',
      }
    },
  },
  plugins: [],
};
