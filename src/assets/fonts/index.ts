import localFont from "next/font/local";

// const oatmeal = localFont({
//   src: "../assets/fonts/Oatmeal Sans.ttf",
//   weight: "100 900",
//   variable: "--font-oatmeal-sans",
// });

const monalisa = localFont({
  src: [
    {
      path: "./Monolisa/MonoLisa-Thin.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./Monolisa/MonoLisa-ThinItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "./Monolisa/MonoLisa-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Monolisa/MonoLisa-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Monolisa/MonoLisa-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./Monolisa/MonoLisa-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Monolisa/MonoLisa-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "./Monolisa/MonoLisa-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "./Monolisa/MonoLisa-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-monalisa",
});
const ttHoves = localFont({
  src: [
    {
      path: "./TTHoves/TTHoves-Thin.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./TTHoves/TTHoves-ThinItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "./TTHoves/TTHoves-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./TTHoves/TTHoves-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./TTHoves/TTHoves-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./TTHoves/TTHoves-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./TTHoves/TTHoves-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "./TTHoves/TTHoves-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "./TTHoves/TTHoves-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-tthoves",
});

const FONTS = {
  ttHoves,
  monalisa,
};

export default FONTS;
