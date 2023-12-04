import FONTS from "@/assets/fonts";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Slightly Techie Network",
  description: "Welcome to Slightly Techie Network",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${FONTS.mona_sans.variable} font-mona-sans overflow-x-hidden dark:bg-black`}
      >
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
