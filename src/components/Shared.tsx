import { LocalizedLink as Link } from "../lib/LocalizedRouting";
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

export function ConsultationBand({ standalone = false, id = "consulta" }: { standalone?: boolean; id?: string }) {
  const { t } = useLanguage();
  const titleId = id + "-heading";
  const headline = <>{t("Hablemos de", "Let's talk about")}{" "}<br /><em>{t("tu cirugía.", "your surgery.")}</em></>;
  return (
    <section className="ap-contact" id={id} aria-labelledby={titleId}>
      <img className="ap-contact__background" src={media.contact} alt="" width="2048" height="1536" loading="lazy" />
      <div className="ap-contact__content">
        <div className="ap-contact__heading">
          {standalone ? <h1 id={titleId}>{headline}</h1> : <h2 id={titleId}>{headline}</h2>}
          <p>{t("Completa tus datos de contacto.", "Enter your contact details.")}</p>
        </div>
        <ConsultationForm />
      </div>
    </section>
  );
}

export function ConsultationLink() {
  const { t } = useLanguage();
  return <Link className="button" to="/consulta">{t("Preparar mi consulta", "Prepare my consultation")}<Icon name="arrow" /></Link>;
}
