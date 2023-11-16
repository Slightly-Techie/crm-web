import localFont from "next/font/local";

const mona_sans = localFont({
  src: [
    {
      path: "./Mona-Sans/MonaSans-Light.otf",
      weight: "300",
      style: "light",
    },
    {
      path: "./Mona-Sans/MonaSans-Regular.otf",
      weight: "400",
      style: "regular",
    },
    {
      path: "./Mona-Sans/MonaSans-SemiBold.otf",
      weight: "500",
      style: "semibold",
    },
    {
      path: "./Mona-Sans/MonaSans-Bold.otf",
      weight: "500",
      style: "bold",
    },
  ],
  variable: "--font-mona-sans",
});

const FONTS = {
  mona_sans,
};

export default FONTS;
