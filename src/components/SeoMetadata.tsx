import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { headElements } from "../lib/seo";
import { useLanguage } from "../lib/language";

export function SeoMetadata() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = language;
    document.querySelectorAll("[data-ava-seo]").forEach(element => element.remove());
    const fragment = document.createDocumentFragment();
    for (const spec of headElements(pathname)) {
      const element = document.createElement(spec.tag);
      element.setAttribute("data-ava-seo", "");
      for (const [key, value] of Object.entries(spec.attributes)) element.setAttribute(key, value);
      if (spec.content) element.textContent = spec.content;
      fragment.append(element);
    }
    document.head.append(fragment);
  }, [pathname, language]);
  return null;
}
