/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        feed: "60% 40%",
        announcement: "45% auto",
      },
      backgroundImage: {
        signup: "url('/src/assets/images/Left.png')",
      },
      colors: {
        // Stitch Design System Colors
        "primary": "#154212",
        "on-primary": "#ffffff",
        "primary-container": "#2d5a27",
        "on-primary-container": "#9dd090",
        "primary-fixed": "#bcf0ae",
        "primary-fixed-dim": "#a1d494",
        "on-primary-fixed": "#002201",
        "on-primary-fixed-variant": "#23501e",

        "secondary": "#4b6547",
        "on-secondary": "#ffffff",
        "secondary-container": "#cdebc5",
        "on-secondary-container": "#516b4d",
        "secondary-fixed": "#cdebc5",
        "secondary-fixed-dim": "#b2ceaa",
        "on-secondary-fixed": "#092009",
        "on-secondary-fixed-variant": "#344d31",

        "tertiary": "#303c34",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#47534a",
        "on-tertiary-container": "#b9c6bb",
        "tertiary-fixed": "#d9e6da",
        "tertiary-fixed-dim": "#bdcabe",
        "on-tertiary-fixed": "#131e17",
        "on-tertiary-fixed-variant": "#3e4a41",

        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        "background": "#fbf9f8",
        "on-background": "#1b1c1c",
        "surface": "#fbf9f8",
        "on-surface": "#1b1c1c",
        "surface-variant": "#e4e2e1",
        "on-surface-variant": "#42493e",

        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f3f2",
        "surface-container": "#f0eded",
        "surface-container-high": "#eae8e7",
        "surface-container-highest": "#e4e2e1",
        "surface-bright": "#fbf9f8",
        "surface-dim": "#dcd9d9",

        "outline": "#72796e",
        "outline-variant": "#c2c9bb",
        "inverse-surface": "#303030",
        "inverse-on-surface": "#f3f0f0",
        "inverse-primary": "#a1d494",
        "surface-tint": "#3b6934",

        // Legacy colors (keeping for compatibility)
        st: {
          gray: "#E8E8E8",
          grayDark: "#c7c7c73b",
          text: "#3D4450",
          textDark: "#5b677b",
          subTextDark: "#d0d5dc",
          surface: "#fff",
          surfaceDark: "#232323",
          edge: "#DCDDE1",
          edgeDark: "#353535",
          cardDark: "#141414",
        },
        "status-check": {
          yellow: "#BDAA00",
          danger: "#e3342f",
          success: "#38a169",
          complementary: "#9EA1AB",
        },
      },
      fontFamily: {
        "mona-sans": ["var(--font-mona-sans)", "Mona Sans", "sans-serif"],
        "headline": ["Public Sans", "system-ui", "sans-serif"],
        "body": ["Inter", "system-ui", "sans-serif"],
        "label": ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
