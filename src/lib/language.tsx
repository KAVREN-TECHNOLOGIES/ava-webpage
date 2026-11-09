import { createContext, useContext, useState, type ReactNode } from "react";

export type Language = "es" | "en";
export type Localized = Readonly<{ es: string; en: string }>;
const LanguageContext = createContext({
  language: "es" as Language,
  setLanguage: (_language: Language) => {},
  t: (es: string, _en: string) => es,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");
  const t = (es: string, en: string) => (language === "es" ? es : en);
  return (
    <LanguageContext value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext>
  );
}

export const useLanguage = () => useContext(LanguageContext);
