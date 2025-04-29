/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {colors: {
        primary: "#2563EB",
        "primary-hover": "#1D4ED8",
        accent: "#7C3AED",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        // Light theme
        "light-bg": "#FFFFFF",
        "light-bg-secondary": "#F9FAFB",
        "light-text-primary": "#111827",
        "light-text-secondary": "#6B7280",
        "light-border": "#E5E7EB",
        // Dark theme
        "dark-bg": "#0F172A",
        "dark-bg-secondary": "#1E293B",
        "dark-text-primary": "#F1F5F9",
        "dark-text-secondary": "#94A3B8",
        "dark-border": "#334155",
      },},
    },
    plugins: [],
    darkMode: "selector",
  }
  