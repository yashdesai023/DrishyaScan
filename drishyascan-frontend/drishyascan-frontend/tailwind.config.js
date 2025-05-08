/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html",
    ],
    darkMode: 'class', // Enable class-based dark mode
    theme: {
      extend: {
        fontFamily: {
          sans: ['Roboto', 'sans-serif'],
        },
        colors: {
          // Brand colors
          primary: {
            DEFAULT: '#2563EB', // Primary Blue
            hover: '#1D4ED8',
          },
          accent: {
            DEFAULT: '#7C3AED', // Accent Purple
          },
          success: {
            DEFAULT: '#10B981', // Success Green
          },
          warning: {
            DEFAULT: '#F59E0B', // Warning Yellow
          },
          error: {
            DEFAULT: '#EF4444', // Error Red
          },
          
          // Light theme
          light: {
            bg: {
              primary: '#FFFFFF',
              secondary: '#F9FAFB',
              card: '#FFFFFF',
            },
            text: {
              primary: '#111827',
              secondary: '#6B7280',
            },
            border: '#E5E7EB',
          },
          
          // Dark theme
          dark: {
            bg: {
              primary: '#0F172A',
              secondary: '#1E293B',
              card: '#1E293B',
            },
            text: {
              primary: '#F1F5F9',
              secondary: '#94A3B8',
            },
            border: '#334155',
          },
        },
        transitionDuration: {
          'theme': '400ms', // Theme transition time (between 0.3s and 0.5s)
        },
      },
    },
    plugins: [],
  }