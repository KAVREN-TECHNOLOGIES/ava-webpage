import { useEffect, useRef } from "react";
import { Icon } from "../components/Icon";
import { media } from "../data/media";
import { LocalizedLink } from "../lib/LocalizedRouting";
import { useLanguage } from "../lib/language";
import "./thank-you.css";

export function ThankYouPage() {
  const { t } = useLanguage();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);

  return <section className="ap-contact thank-you" aria-labelledby="thank-you-heading">
    <img className="ap-contact__background" src={media.contact} alt="" width="2048" height="1536" fetchPriority="high" />
    <div className="ap-contact__content">
      <h1 id="thank-you-heading" ref={heading} tabIndex={-1}>
        {t("Gracias por", "Thank you for")}{" "}<br />
        <em>{t("contactarnos.", "reaching out.")}</em>
      </h1>
      <p>{t("Conoce qué información preparar y qué preguntas hacer en tu primera consulta.", "Find out what to prepare and what to ask at your first consultation.")}</p>
      <div className="thank-you__actions">
        <LocalizedLink className="button button--light" to="/experiencia">
          {t("Prepara tu consulta", "Prepare for your consultation")}<Icon name="arrow" />
        </LocalizedLink>
        <LocalizedLink className="thank-you__home" to="/">{t("Volver al inicio", "Back to home")}</LocalizedLink>
      </div>
    </div>
  </section>;
}
