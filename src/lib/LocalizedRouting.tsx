import type { ReactNode } from "react";
import { Link, NavLink, parsePath, useLocation, useNavigate, type LinkProps, type NavLinkProps, type To } from "react-router-dom";
import { localizePath, resolveRoute } from "../data/routes";
import { LanguageProvider, useLanguage, type Language } from "./language";
import { usePageSearchParams } from "./searchParams";

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

const attributionKeys = new Set([
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id",
  "utm_keyword", "utm_matchtype", "campaign_id", "ad_group_id", "adset_id", "ad_id",
  "gclid", "gbraid", "wbraid", "msclkid", "fbclid",
]);

function translatedDestination(to: To, language: Language, currentSearch: string): To {
  // Never append site campaign information to third-party URLs.
  if (typeof to === "string" && /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(to)) return to;
  const destination = typeof to === "string" ? parsePath(localizePath(to, language)) : {
    ...to, pathname: to.pathname ? localizePath(to.pathname, language) : to.pathname,
  };
  const campaign = [...new URLSearchParams(currentSearch)].filter(([key]) => attributionKeys.has(key));
  if (!campaign.length) return typeof to === "string" ? localizePath(to, language) : destination;
  const params = new URLSearchParams(destination.search);
  for (const [key, value] of campaign) {
    if (!params.has(key)) params.set(key, value);
  }
  return { ...destination, search: `?${params}` };
}
export function LocalizedLink({ to, ...props }: LinkProps) {
  const { language } = useLanguage();
  const [params] = usePageSearchParams();
  return <Link to={translatedDestination(to, language, params.toString())} {...props} />;
}
export function LocalizedNavLink({ to, ...props }: NavLinkProps) {
  const { language } = useLanguage();
  const [params] = usePageSearchParams();
  return <NavLink to={translatedDestination(to, language, params.toString())} {...props} />;
}
