import { Link } from "react-router-dom";
import { media } from "../data/media";
import { useLanguage } from "../lib/language";
import { ConsultationForm } from "./ConsultationForm";
import { Icon } from "./Icon";

export function PageIntro({ title, subtitle }: { title: string; subtitle?: string }) {
  const { t } = useLanguage();
  const words = title.split(" ");
  const lastWord = words.pop();
  return (
    <div className="page-intro wrap">
      <nav className="breadcrumbs" aria-label={t("Ruta de navegación", "Breadcrumb")}>
        <Link to="/">{t("Inicio", "Home")}</Link><span aria-hidden="true">/</span><span>{title}</span>
      </nav>
      <h1>{words.length ? <>{words.join(" ")} <em>{lastWord}</em></> : title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export function ConsultationBand({ standalone = false }: { standalone?: boolean }) {
  const { t } = useLanguage();
  return (
    <section className={`consultation-band ap-consult ${standalone ? "ap-consult--standalone" : ""}`} id="consulta" aria-labelledby="consultation-heading">
      <div className="ap-consult__intro">
        {standalone ? <h1 id="consultation-heading">{t("Datos para la", "Consultation")} <em>{t("consulta", "details")}</em></h1> :
          <h2 id="consultation-heading">{t("Tu consulta", "Your consultation")}</h2>}
        <p>{t("Selecciona un procedimiento y revisa tus datos de contacto.", "Choose a procedure and review your contact details.")}</p>
        <Link className="ap-text-link" to="/recursos/seguridad">
          {t("Preparación para la consulta", "Consultation preparation")}<Icon name="arrow" />
        </Link>
        <img className="ap-consult__photo" src={media.hero} alt="" width="2048" height="1152" loading="lazy" />
      </div>
      <ConsultationForm />
    </section>
  );
}

export function ConsultationLink() {
  const { t } = useLanguage();
  return <Link className="button" to="/consulta">{t("Datos para la consulta", "Consultation details")}<Icon name="arrow" /></Link>;
}
