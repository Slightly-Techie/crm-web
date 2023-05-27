/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        feed: "auto 1fr auto",
      },
    },
    colors: {
      primary: "#F5F5F5",
      white: "#ffffff",
      secondary: "#3D4450",
      st: {
        gray200: "#DCDDE1",
      },
    },
  },
  plugins: [],
};
