import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { useLanguage, LanguageProvider } from "./lib/language";
import { Home } from "./pages/Home";
import { procedures } from "./data/procedures";
import {
  ConsultationPage,
  ExperiencePage,
  FinancePage,
  GalleryPage,
  LegalPage,
  LocationPage,
  NotFoundPage,
  ProcedurePage,
  ProceduresPage,
  ResourcesPage,
  ServicesPage,
  TeamPage,
} from "./pages/Pages";

function RouteEffects() {
  const { pathname, hash } = useLocation();
  const { language } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  useEffect(() => {
    const pageTitles: Record<string, [string, string]> = {
      "/": ["Cirugía estética en Miami", "Cosmetic surgery in Miami"],
      "/procedimientos": ["Procedimientos", "Procedures"],
      "/resultados": ["Fotografía editorial", "Editorial photography"],
      "/equipo": ["Credenciales médicas", "Medical credentials"],
      "/experiencia": ["Consulta quirúrgica", "Surgical consultation"],
      "/servicios": ["Preparación y cuidados", "Preparation and aftercare"],
      "/financiamiento": ["Costos de cirugía", "Surgery costs"],
      "/ubicacion": ["Cirugía en Miami", "Surgery in Miami"],
      "/consulta": ["Datos para la consulta", "Consultation details"],
      "/recursos": ["Preguntas frecuentes", "Frequently asked questions"],
      "/recursos/seguridad": ["Antes de la cirugía", "Before surgery"],
      "/recursos/pacientes-de-fuera": ["Pacientes de otras ciudades", "Traveling patients"],
      "/privacidad": ["Política de privacidad", "Privacy policy"],
      "/terminos": ["Términos de uso", "Terms of use"],
      "/accesibilidad": ["Accesibilidad", "Accessibility"],
    };
    const procedure = procedures.find(item => pathname === `/procedimientos/${item.slug}`);
    const pageTitle = procedure?.name[language] ?? pageTitles[pathname]?.[language === "es" ? 0 : 1] ?? (language === "es" ? "Página no encontrada" : "Page not found");
    document.title = `${pageTitle} · AVA Cosmetic Surgery`;
  }, [pathname, language]);
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView(),
      );
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
}

function FormerVariantRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={{ pathname: "/", search, hash }} replace />;
}

function SiteLayout() {
  const { pathname } = useLocation();
  const home = pathname === "/";
  return (
    <div className={`ava-site ${home ? "ava-site--home" : "ava-site--interior"}`}>
      {!home && <Header />}
      <main id="contenido" tabIndex={-1}>
        <Routes>
          <Route path="/variante-apollo" element={<FormerVariantRedirect />} />
          <Route path="/" element={<Home />} />
          <Route path="/procedimientos" element={<ProceduresPage />} />
          <Route path="/procedimientos/:slug" element={<ProcedurePage />} />
          <Route path="/resultados" element={<GalleryPage />} />
          <Route path="/equipo" element={<TeamPage />} />
          <Route path="/experiencia" element={<ExperiencePage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/financiamiento" element={<FinancePage />} />
          <Route path="/ubicacion" element={<LocationPage />} />
          <Route path="/consulta" element={<ConsultationPage />} />
          <Route path="/recursos" element={<ResourcesPage />} />
          <Route path="/recursos/:topic" element={<ResourcesPage />} />
          <Route path="/privacidad" element={<LegalPage kind="privacidad" />} />
          <Route path="/terminos" element={<LegalPage kind="terminos" />} />
          <Route
            path="/accesibilidad"
            element={<LegalPage kind="accesibilidad" />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <RouteEffects />
        <SiteLayout />
      </BrowserRouter>
    </LanguageProvider>
  );
}
