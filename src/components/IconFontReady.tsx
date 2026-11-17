"use client";

import { useEffect } from "react";

// Icons are Material Symbols ligatures: the text "dashboard" becomes an icon once
// the font loads. Until then globals.css hides them, and this marks the page ready
// when the font has loaded (or failed, so icons never stay hidden for good).
// It runs as an effect, not an inline <script>, because pages rendered only in the
// browser (like /login) never run inline scripts from the layout.
export default function IconFontReady() {
  useEffect(() => {
    const root = document.documentElement;
    const ready = () => root.setAttribute("data-icons", "ready");
    if (!document.fonts || !document.fonts.load) return ready();

    const loadFont = () =>
      document.fonts
        .load('24px "Material Symbols Outlined"')
        .then(ready, ready);

    // The font can only load once its stylesheet has added the @font-face rule.
    const sheet = document.querySelector<HTMLLinkElement>(
      'link[href*="Material+Symbols+Outlined"]'
    );
    if (!sheet || sheet.sheet) {
      loadFont();
      return;
    }
    sheet.addEventListener("load", loadFont, { once: true });
    sheet.addEventListener("error", ready, { once: true });
    return () => {
      sheet.removeEventListener("load", loadFont);
      sheet.removeEventListener("error", ready);
    };
  }, []);

  return null;
}
