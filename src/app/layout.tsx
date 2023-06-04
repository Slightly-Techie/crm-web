import FONTS from "@/assets/fonts";
import "./globals.css";
import { Providers } from "./providers";

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
      <body className={`${FONTS.ttHoves.variable} ${FONTS.monalisa.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
