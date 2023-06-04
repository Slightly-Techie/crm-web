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
      },
      colors: {
        primary: "#F5F5F5",
        secondary: "#3D4450",
        st: {
          gray200: "#DCDDE1",
        },
      },
    },
  },
  plugins: [],
};
