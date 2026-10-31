/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Indian Wedding Palette
        ivory: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F5EFEB',
          300: '#EFE5DC',
          400: '#E4D5C7',
          DEFAULT: '#FAF7F2',
        },
        cream: {
          50: '#FCF9F2',
          100: '#FAF5EE',
          200: '#F3ECE2',
          300: '#EAE2D5',
          DEFAULT: '#FAF5EE',
        },
        gold: {
          50: '#FBF8EE',
          100: '#F7F0D9',
          200: '#EFE1B3',
          300: '#E5C378',
          400: '#D4AF37',
          500: '#C5A059',
          600: '#B38F30',
          700: '#8C6F23',
          800: '#665017',
          DEFAULT: '#C5A059',
          metallic: '#D4AF37',
        },
        burgundy: {
          50: '#FDF2F4',
          100: '#FCE7EB',
          200: '#F7C5CE',
          300: '#EE96A8',
          400: '#DF5C78',
          500: '#C41E3A',
          600: '#9B111E',
          700: '#800020',
          800: '#67001A',
          900: '#4A0012',
          DEFAULT: '#800020',
        },
        weddingred: {
          light: '#E63946',
          DEFAULT: '#9B111E',
          dark: '#67001A',
        },
        charcoal: {
          50: '#F7F7F7',
          100: '#E3E2E2',
          200: '#C7C5C4',
          300: '#9B9896',
          400: '#6B6765',
          500: '#4A4644',
          600: '#3D3A38',
          700: '#2C2A29',
          800: '#1F1D1D',
          DEFAULT: '#2C2A29',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Outfit"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        cursive: ['"Great Vibes"', '"Alex Brush"', '"Pinyon Script"', 'cursive'],
        hermiona: ['"Great Vibes"', '"Alex Brush"', '"Pinyon Script"', 'cursive'],
        royal: ['"Cinzel Decorative"', '"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        'royal': '0 4px 20px -2px rgba(197, 160, 89, 0.15), 0 2px 6px -1px rgba(128, 0, 32, 0.06)',
        'royal-lg': '0 10px 30px -5px rgba(197, 160, 89, 0.25), 0 4px 10px -2px rgba(128, 0, 32, 0.1)',
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.35)',
      }
    },
  },
  plugins: [],
}
