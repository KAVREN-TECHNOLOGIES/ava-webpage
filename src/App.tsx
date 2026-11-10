import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { RoutedLanguageProvider } from "./lib/LocalizedRouting";
import { siteRoutes, normalizePath, resolveRoute, type SiteRoute } from "./data/routes";
import { SeoMetadata } from "./components/SeoMetadata";
import { Home } from "./pages/Home";
import { BmiPage } from "./pages/BmiPage";
import { ConsultationPage, ExperiencePage, FinancePage, GalleryPage, LegalPage, LocationPage, NotFoundPage, ProcedurePage, ProceduresPage, ResourcesPage, ServicesPage, TeamPage } from "./pages/Pages";

function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, hash]);
  return null;
}

function FormerVariantRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={{ pathname: "/", search, hash }} replace />;
}

function pageElement(route: SiteRoute) {
  switch (route.kind) {
    case "home": return <Home />;
    case "procedures": return <ProceduresPage />;
    case "procedure": return <ProcedurePage procedureSlug={route.procedureSlug} />;
    case "gallery": return <GalleryPage />;
    case "team": return <TeamPage />;
    case "experience": return <ExperiencePage />;
    case "services": return <ServicesPage />;
    case "finance": return <FinancePage />;
    case "location": return <LocationPage />;
    case "contact": return <ConsultationPage />;
    case "resources": return <ResourcesPage resourceTopic={route.topic} />;
    case "bmi": return <BmiPage />;
    case "privacy": return <LegalPage kind="privacidad" />;
    case "terms": return <LegalPage kind="terminos" />;
    case "accessibility": return <LegalPage kind="accesibilidad" />;
  }
}

function SiteLayout() {
  const location = useLocation();
  const { route, language } = resolveRoute(location.pathname);
  const home = route?.kind === "home";
  if (route && location.pathname !== normalizePath(location.pathname)) {
    return <Navigate to={{ pathname: route.paths[language], search: location.search, hash: location.hash }} replace />;
  }
  return (
    <div className={`ava-site ${home ? "ava-site--home" : "ava-site--interior"}`}>
      {!home && <Header />}
      <main id="contenido" tabIndex={-1}>
        <Routes>
          <Route path="/variante-apollo" element={<FormerVariantRedirect />} />
          {siteRoutes.flatMap(route => (["es", "en"] as const).map(language => (
            <Route key={`${route.id}:${language}`} path={route.paths[language]} element={pageElement(route)} />
          )))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export function Site() {
  return <RoutedLanguageProvider><SeoMetadata /><RouteEffects /><SiteLayout /></RoutedLanguageProvider>;
}

export function App() {
  return <BrowserRouter><Site /></BrowserRouter>;
}
