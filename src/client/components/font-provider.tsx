// Font Provider - Uygulama genelinde font seçimi
// ThemeProvider pattern'i ile localStorage'a kaydeder
// body.style.fontFamily ile doğrudan override eder (Tailwind v4 @theme inline build-time'da inline eder)

import { createContext, useContext, useEffect, useState } from "react";

export type AppFont = "uber-move" | "geist" | "jetbrains-mono" | "geist-mono";

type FontProviderState = {
  font: AppFont;
  setFont: (font: AppFont) => void;
};

const FontProviderContext = createContext<FontProviderState>({
  font: "uber-move",
  setFont: () => null,
});

const STORAGE_KEY = "oplog-ui-font";

const fontFamilies: Record<AppFont, string> = {
  "uber-move": "'Uber Move', system-ui, sans-serif",
  "geist": "'Geist Variable', sans-serif",
  "jetbrains-mono": "'JetBrains Mono Variable', monospace",
  "geist-mono": "'Geist Mono Variable', monospace",
};

export const fontLabels: Record<AppFont, string> = {
  "uber-move": "Uber Move",
  "geist": "Geist",
  "jetbrains-mono": "JetBrains Mono",
  "geist-mono": "Geist Mono",
};

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFontState] = useState<AppFont>(
    () => (localStorage.getItem(STORAGE_KEY) as AppFont) || "uber-move"
  );

  useEffect(() => {
    // @theme inline değerleri build-time'da inline edilir, CSS variable runtime'da yok.
    // Bu yüzden doğrudan font-family set ediyoruz.
    document.body.style.fontFamily = fontFamilies[font];
  }, [font]);

  const setFont = (f: AppFont) => {
    localStorage.setItem(STORAGE_KEY, f);
    setFontState(f);
  };

  return (
    <FontProviderContext.Provider value={{ font, setFont }}>
      {children}
    </FontProviderContext.Provider>
  );
}

export const useFont = () => useContext(FontProviderContext);
