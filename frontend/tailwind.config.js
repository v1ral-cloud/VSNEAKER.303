/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // VSneakers Color Palette - White Base with Orange Accent
        sneaker: {
          orange: '#FF6B00',     // Primary accent - vibrant orange
          gold: '#E8B84B',       // Secondary accent - gold
          light: '#FFF4EC',      // Soft orange tint background
          dark: '#C44E00',       // Dark orange for hover
        },
        // Keep street-red alias mapped to sneaker orange for compatibility
        street: {
          red: '#FF6B00',        // Remapped: orange replaces red
          neon: '#00FF00',
          orange: '#FF6B00',
          purple: '#9D00FF',
        },
        primary: {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#d4d4d4',
          300: '#a3a3a3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#262626',
          800: '#171717',
          900: '#0a0a0a',
        },
        dark: {
          950: '#0A0A0A',        // Near-black
          900: '#141414',
          800: '#1a1a1a',
          700: '#262626',
          600: '#333333',
        },
        light: {
          50: '#ffffff',         // Pure white
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#efefef',
        }
      },
      fontFamily: {
        // Premium sneaker brand fonts
        display: ['"Plus Jakarta Sans"', '"DM Sans"', 'Inter', 'sans-serif'],
        street: ['"Plus Jakarta Sans"', '"DM Sans"', 'Inter', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        graffiti: ['"Bebas Neue"', 'Impact', 'sans-serif'],
      },
      boxShadow: {
        'street': '0 4px 20px rgba(0, 0, 0, 0.12)',
        'street-hover': '0 8px 30px rgba(0, 0, 0, 0.2)',
        'orange-glow': '0 0 24px rgba(255, 107, 0, 0.4)',
        'orange-soft': '0 4px 20px rgba(255, 107, 0, 0.25)',
        'harsh': '6px 6px 0px rgba(0, 0, 0, 0.9)',
        'harsh-orange': '6px 6px 0px rgba(255, 107, 0, 0.8)',
        'card': '0 2px 16px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.16)',
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out',
        'glitch': 'glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        'dots': "radial-gradient(circle, #e5e5e5 1px, transparent 1px)",
        'orange-gradient': "linear-gradient(135deg, #FF6B00 0%, #E8B84B 100%)",
      },
    },
  },
  plugins: [],
}
