/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Habilitamos el modo oscuro por clase
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: {
          50: '#FBF9F1',
          100: '#F6F0DB',
          200: '#EBDCB4',
          300: '#DDC482',
          400: '#D4AF37',
          500: '#C49F2D', 
          600: '#9B7E20',
          700: '#755F1A',
          800: '#584816',
          900: '#463A14',
        }
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #EBDCB4 0%, #D4AF37 50%, #B4912A 100%)',
        'light-mesh': 'radial-gradient(at 40% 20%, #F6F0DB 0px, transparent 50%), radial-gradient(at 80% 0%, #EBDCB4 0px, transparent 50%), radial-gradient(at 0% 50%, #FBF9F1 0px, transparent 50%)',
        'dark-mesh': 'radial-gradient(at 40% 20%, rgba(212,175,55,0.05) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(212,175,55,0.02) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(255,255,255,0.02) 0px, transparent 50%)',
      },
      boxShadow: {
        'gold': '0 20px 40px -10px rgba(212, 175, 55, 0.3)',
        'gold-sm': '0 10px 20px -5px rgba(212, 175, 55, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
