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
      colors: {
        primary: {
          light: "#f5f5f5",
          dark: "#020202",
        },
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
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
