/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",  // Adjust if you're using other folders or file types
      "./public/index.html"
    ],
    darkMode: 'class', // Use class-based dark mode toggle (recommended for theme switcher)
    theme: {
      extend: {
        fontFamily: {
          sans: ['Roboto', 'ui-sans-serif', 'system-ui'],
        },
        colors: {
          // Brand Colors
          primary: "#2563EB",
          "primary-hover": "#1D4ED8",
          accent: "#7C3AED",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
  
          // Light Theme
          "light-bg": "#FFFFFF",
          "light-bg-secondary": "#F9FAFB",
          "light-text-primary": "#111827",
          "light-text-secondary": "#6B7280",
          "light-border": "#E5E7EB",
          "light-card": "#FFFFFF",
  
          // Dark Theme
          "dark-bg": "#0F172A",
          "dark-bg-secondary": "#1E293B",
          "dark-text-primary": "#F1F5F9",
          "dark-text-secondary": "#94A3B8",
          "dark-border": "#334155",
          "dark-card": "#1E293B",
        },
        transitionDuration: {
          DEFAULT: '300ms',
          'fast': '200ms',
          'slow': '500ms',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'), // Recommended for form inputs
      require('@tailwindcss/typography'), // For better prose content if needed
      require('@tailwindcss/aspect-ratio') // Useful for responsive image or video containers
    ],
  };
  