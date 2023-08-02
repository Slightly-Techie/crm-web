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
        feed: "auto 1fr auto",
        announcement: "40% 1fr",
      },
      colors: {
        primary: "#F5F5F5",
        secondary: "#3D4450",
        st: {
          bg: "#F5F5F5",
          bgDark: "#000",
          gray: "#E8E8E8",
          grayDark: "#c7c7c73b",
          text: "#3D4450",
          textDark: "#5b677b",
          subTextDark: "#d0d5dc",
          surface: "#fff",
          surfaceDark: "#232323",
          edge: "#DCDDE1",
          edgeDark: "#353535",
        },
      },
      fontFamily: {
        "tt-hoves": ["var(--font-tthoves)", "TT Hoves", "sans-serif"],
        monalisa: ["var(--font-monalisa)", "Monalisa", "sans-serif"],
      },
    },
  },
  plugins: [],
};
