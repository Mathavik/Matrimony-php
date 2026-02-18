/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: (() => {
       
 const customSpacing = {};
        for (let i = 0; i <= 200; i++) {
          customSpacing[i] = `${i * 0.25}rem`;
        }

        return customSpacing;
      })(),

      fontSize: {
        'size-xs': '.75rem',
        'size-sm': '.875rem',
        'size-base': '1rem',
        'size-lg': '1.125rem',
        'size-xl': '1.25rem',
        'size-2xl': '1.5rem',
        'size-3xl': '1.875rem',
        'size-4xl': '2.25rem',
        'size-5xl': '3rem',
        'size-6xl': '4rem',
        'size-7xl': '5rem',
      },

      colors: {
        white: '#ffffff',
        charcoal: '#0f172a',
        'charcoal-light': '#111827',
        text: {
          primary: '#1a202c',
          subtle: '#4a5568',
          muted: '#718096',
          strong: '#0f172a',
        },
        coral: {
          DEFAULT: '#ff6b6b',
          dark: '#ff4d4d',
        },
        bg: {
          white: '#ffffff',
          gray: '#f7fafc',
        },
        purple: '#9B59B6',
        lavender: {
          DEFAULT: '#a78bfa',
          dark: '#7c5cf5',
        },
        brand: {
          50: '#f5f8ff',
          100: '#e9efff',
          200: '#cdd9ff',
          300: '#a9bbff',
          400: '#7f94ff',
          500: '#5c73ff',
          600: '#3f54f0',
          700: '#2f40ca',
          800: '#2836a1',
          900: '#212d80',
        },
        accent: {
          50: '#fff7f5',
          100: '#ffe9e2',
          200: '#ffcdbf',
          300: '#ffac93',
          400: '#ff8661',
          500: '#ff5c26',
          600: '#e44b19',
          700: '#b83a13',
          800: '#8f2e10',
          900: '#6f250c',
        },
        backgroundImage: {
          'gradient-primary': 'linear-gradient(135deg, #FF6B6B 0%, #9B59B6 100%)',
        },
      },

      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'],
      },

      zIndex: {
        nav: 999,
      },

      height: {
        '10vh': '10vh',
        '20vh': '20vh',
        '30vh': '30vh',
        '40vh': '40vh',
        '50vh': '50vh',
        '60vh': '60vh',
        '70vh': '70vh',
        '80vh': '80vh',
        '90vh': '90vh',
      },

      width: {
        '10vw': '10vw',
        '20vw': '20vw',
        '30vw': '30vw',
        '40vw': '40vw',
        '50vw': '50vw',
        '60vw': '60vw',
        '70vw': '70vw',
        '80vw': '80vw',
        '90vw': '90vw',
      },

      screens: {
        xs: '320px',
        xs2: '375px',
        xs3: '420px',
        xs4: '425px',
        xs5: '475px',
        mobile: '320px',
        'iphone-12': '390px',
        'iphone-13-pro': '428px',
        big: '2000px',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.65' }
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(10px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(-10px, 10px) scale(0.95)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' }
        }
      },

      animation: {
        'fade-in': 'fadeIn 1s ease-out both',
        'slide-in-left': 'slideInLeft 1s ease-out both',
        'slide-in-right': 'slideInRight 1s ease-out both',
        'fade-in-up': 'fadeInUp 0.8s ease-out both',
        'float': 'float 5s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'pulse-soft': 'pulseSoft 2.6s ease-in-out infinite',
        'blob': 'blob 12s ease-in-out infinite'
      },
    },
  },
  plugins: [],
};
