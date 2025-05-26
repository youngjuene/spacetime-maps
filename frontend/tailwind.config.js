import { modernTheme } from "./src/theme/colors.js";

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*{.js,.jsx,.ts,.tsx,.html}", "./index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: modernTheme.primary,
        accent: modernTheme.accent,
        neutral: modernTheme.neutral,
        success: modernTheme.success,
        warning: modernTheme.warning,
        error: modernTheme.error,
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
    fontFamily: {
      sans: [
        "Gabarito, sans-serif",
        {
          fontVariationSettings: "'wght' 400",
        },
      ],
    },
  },
  plugins: [],
};

export default config;
