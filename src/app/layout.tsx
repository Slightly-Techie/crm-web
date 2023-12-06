// import FONTS from "@/assets/fonts";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Slightly Techie Network",
  description: "Welcome to Slightly Techie Network",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} overflow-x-hidden dark:bg-black`}
      >
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
