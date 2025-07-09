/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores customizadas para o tema da igreja
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        church: {
          gold: '#D4A574',
          darkblue: '#1a365d',
          lightblue: '#63b3ed',
          primary: '#2563eb',
          'primary-dark': '#1d4ed8',
          secondary: '#1a365d',
          bg: '#f8fafc',
        }
      },
      fontFamily: {
        'church': ['Merriweather', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.5'
          },
          '50%': { 
            transform: 'translateY(-20px) rotate(180deg)',
            opacity: '0.8'
          }
        },
        glow: {
          '0%': { 
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' 
          },
          '100%': { 
            boxShadow: '0 0 30px rgba(147, 51, 234, 0.8)' 
          }
        },
        shimmer: {
          '0%': { 
            backgroundPosition: '-200% 0' 
          },
          '100%': { 
            backgroundPosition: '200% 0' 
          }
        },
        gradient: {
          '0%, 100%': {
            backgroundSize: '200% 200%',
            backgroundPosition: 'left center'
          },
          '50%': {
            backgroundSize: '200% 200%',
            backgroundPosition: 'right center'
          }
        }
      }
    },
  },
  plugins: [],
  // Importante: configurar para não conflitar com Ionic
  corePlugins: {
    preflight: false, // Desabilita reset CSS do Tailwind para não conflitar com Ionic
  }
}
