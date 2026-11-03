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

// Icons are Material Symbols ligatures: the text "dashboard" becomes an icon once
// the font loads. Until then globals.css hides them, and this script marks the
// page ready when the font has loaded (or failed, so the page never stays blank).
const iconFontReadyScript = `(function () {
  var root = document.documentElement;
  function ready() { root.setAttribute("data-icons", "ready"); }
  if (!document.fonts || !document.fonts.load) { ready(); return; }
  document.fonts.load('24px "Material Symbols Outlined"').then(ready, ready);
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* "block" is right for an icon font: hidden icons beat icon names shown as text. */}
        {/* eslint-disable-next-line @next/next/google-font-display */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
        {/* Must come after the icon stylesheet so the @font-face rule exists. */}
        <script dangerouslySetInnerHTML={{ __html: iconFontReadyScript }} />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} overflow-x-hidden bg-surface text-on-surface transition-colors duration-200`}
      >
        <Toaster />
        <Providers>
          <ProjectProvider>{children}</ProjectProvider>
        </Providers>
      </body>
    </html>
  );
}
