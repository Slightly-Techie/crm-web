// import FONTS from "@/assets/fonts";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import { ProjectProvider } from "@/context/ProjectContext";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} overflow-x-hidden bg-surface`}
      >
        <Toaster />
        <Providers>
          <ProjectProvider>{children}</ProjectProvider>
        </Providers>
      </body>
    </html>
  );
}
