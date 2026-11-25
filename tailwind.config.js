const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      screens: {
        // Real hover-capable pointer (mouse / trackpad): keeps hover-only effects off touch screens.
        "can-hover": { raw: "(hover: hover) and (pointer: fine)" },
      },
      colors: {
        ink: "#07080c",
        lime: "#d4ff3a",
        neon: { cyan: "#22d3ee", violet: "#8b5cf6", blue: "#3b82f6" },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        display: ["Unbounded", "Arial Black", ...defaultTheme.fontFamily.sans],
        mono: ["'JetBrains Mono'", ...defaultTheme.fontFamily.mono],
      },
      keyframes: {
        marquee: { to: { transform: "translateX(-50%)" } },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(-5%, 3%)" },
          "50%": { transform: "translate(4%, -6%)" },
          "75%": { transform: "translate(-3%, 5%)" },
        },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "pop-in": {
          from: { opacity: "0", transform: "translateY(-6px) scale(0.98)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        grain: "grain 1.2s steps(4) infinite",
        "fade-in": "fade-in 0.3s ease-out both",
        "pop-in": "pop-in 0.2s ease-out both",
      },
    },
  },
  plugins: [],
};
