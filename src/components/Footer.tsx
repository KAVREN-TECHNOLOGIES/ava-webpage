import { LocalizedLink as Link } from "../lib/LocalizedRouting";
import { media } from "../data/media";
import { brandLockup } from "../data/brand";
import { company } from "../data/company";
import { useLanguage } from "../lib/language";
import { Icon } from "./Icon";
import { CompanyAddress } from "./CompanyAddress";
import { BrandLogo } from "./BrandLogo";
import "./footer.css";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="ap-footer-shell">
      <div className="ap-footer">
        <img className="ap-footer__photo" src={media.footer} alt="" width="2048" height="1536" loading="lazy" />
        <div className="ap-footer__top">
          <CompanyAddress className="ap-footer__location" />
          <Link className="ap-footer__logo" to="/" aria-label={t("AVA Cosmetic Surgery · Inicio", "AVA Cosmetic Surgery · Home")}>
            <BrandLogo />
          </Link>
          <nav aria-label={t("Enlaces del pie de página", "Footer links")}>
            <Link to="/procedimientos">{t("Procedimientos", "Procedures")}</Link>
            <Link to="/servicios">{t("Cuidados", "Aftercare")}</Link>
            <Link to="/recursos">{t("Pacientes", "Patients")}</Link>
            <Link to="/consulta">{t("Consulta", "Consultation")}</Link>
          </nav>
        </div>
        <svg className="ap-footer__art" viewBox="66.9336 62.4297 115.3438 32.9648" aria-hidden="true" focusable="false">
          <path d={brandLockup.letters} fill="currentColor" />
        </svg>
      </div>
      <div className="ap-footer__notes">
        <div className="ap-footer__bottom">
          <div className="ap-footer__identity">
            <p>© {new Date().getFullYear()} {company.legalName}</p>
          </div>
          <nav aria-label={t("Más información", "More information")}>
            <Link to="/bmi">{t("Calculadora de BMI", "BMI calculator")}</Link>
            <Link to="/resultados">{t("Fotografías", "Photography")}</Link>
            <Link to="/financiamiento">{t("Costos", "Costs")}</Link>
          </nav>
          <nav aria-label={t("Información legal", "Legal information")}>
            <Link to="/privacidad">{t("Privacidad", "Privacy")}</Link>
            <Link to="/terminos">{t("Términos", "Terms")}</Link>
            <Link to="/accesibilidad">{t("Accesibilidad", "Accessibility")}</Link>
          </nav>
          <a className="ap-back-top" href="#contenido" aria-label={t("Volver arriba", "Back to top")}><Icon name="arrow" /></a>
        </div>
      </div>
    </footer>
  );
}
