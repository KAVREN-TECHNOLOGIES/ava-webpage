import { useEffect, useRef } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { RoutedLanguageProvider } from "./lib/LocalizedRouting";
import { siteRoutes, normalizePath, resolveRoute, type SiteRoute } from "./data/routes";
import { SeoMetadata } from "./components/SeoMetadata";
import { createSmoothScroll } from "./lib/smoothScroll";
import { ExternalTracking } from "./components/ExternalTracking";
import { Home } from "./pages/Home";
import { BmiPage } from "./pages/BmiPage";
import { ThankYouPage } from "./pages/ThankYouPage";
import { ConsultationPage, ExperiencePage, FinancePage, GalleryPage, LegalPage, LocationPage, NotFoundPage, ProcedurePage, ProceduresPage, ResourcesPage, ServicesPage, TeamPage } from "./pages/Pages";

function RouteEffects() {
  const location = useLocation();
  const navigate = useNavigate();
  const type = useNavigationType();
  const routing = useRef({ location, navigate });
  const scroll = useRef<ReturnType<typeof createSmoothScroll> | null>(null);
  routing.current = { location, navigate };

  useEffect(() => {
    const controller = createSmoothScroll(hash => {
      const { location: current, navigate: routeTo } = routing.current;
      routeTo({ pathname: current.pathname, search: current.search, hash });
    });
    scroll.current = controller;
    return () => {
      controller.destroy();
      scroll.current = null;
    };
  }, []);

  useEffect(() => {
    scroll.current?.navigate({ key: location.key, pathname: location.pathname, hash: location.hash, type });
  }, [location.key, location.pathname, location.hash, type]);
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
    case "thank-you": return <ThankYouPage />;
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
  return <RoutedLanguageProvider><SeoMetadata /><RouteEffects /><SiteLayout /><ExternalTracking /></RoutedLanguageProvider>;
}

export function App() {
  return <BrowserRouter><Site /></BrowserRouter>;
}
