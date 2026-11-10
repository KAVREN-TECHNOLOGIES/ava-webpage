import type { ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate, type LinkProps, type NavLinkProps, type To } from "react-router-dom";
import { localizePath, resolveRoute } from "../data/routes";
import { LanguageProvider, useLanguage, type Language } from "./language";

export function RoutedLanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = resolveRoute(location.pathname);
  const setLanguage = (next: Language) => {
    if (next === language) return;
    const { route } = resolveRoute(location.pathname);
    const pathname = route?.paths[next] ?? (next === "en" ? "/en" : "/");
    navigate({ pathname, search: location.search, hash: location.hash });
  };
  return <LanguageProvider language={language} onLanguageChange={setLanguage}>{children}</LanguageProvider>;
}

function translatedDestination(to: To, language: Language): To {
  return typeof to === "string" ? localizePath(to, language) : { ...to, pathname: to.pathname ? localizePath(to.pathname, language) : to.pathname };
}
export function LocalizedLink({ to, ...props }: LinkProps) {
  const { language } = useLanguage();
  return <Link to={translatedDestination(to, language)} {...props} />;
}
export function LocalizedNavLink({ to, ...props }: NavLinkProps) {
  const { language } = useLanguage();
  return <NavLink to={translatedDestination(to, language)} {...props} />;
}
