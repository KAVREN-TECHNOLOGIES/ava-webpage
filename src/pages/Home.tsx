import { ConsultationBand } from "../components/Shared";
import { Icon } from "../components/Icon";
import { media } from "../data/media";
import { ProcedureExplorer } from "../components/ProcedureExplorer";
import { ComboExplorer } from "../components/ComboExplorer";
import { useLanguage } from "../lib/language";
import { patientQuestions } from "../data/patientContent";
import { Header } from "../components/Header";
import "./home.css";

export function Home() {
  const { t, language } = useLanguage();
  const faqs = patientQuestions
    .map((item) => ({ q: item.question[language], a: item.answer[language] }));
  return (
    <div className="editorial-home" id="ap-inicio">
      <a className="ap-skip" href="#ap-procedimientos">
        {t("Saltar al contenido", "Skip to content")}
      </a>
      <section className="ap-cover" aria-labelledby="ap-title">
        <img
          className="ap-cover__photo"
          src={media.hero}
          alt={t(
            "Modelo con luz y sombras proyectadas.",
            "Model with projected light and shadows.",
          )}
          width="2048"
          height="1152"
          fetchPriority="high"
        />
        <Header cover />
        <div className="ap-cover__headline">
          <h1 id="ap-title">
            <span>{t("Cirugía", "Plastic")}</span>{" "}
            <span>{t("estética", "surgery")}</span>
          </h1>
        </div>
        <div className="ap-cover__story">
          <p>
            {t(
              "Procedimientos de cuerpo, pecho y rostro en Miami.",
              "Body, breast and facial procedures in Miami.",
            )}
          </p>
          <a className="ap-button ap-button--light" href="#ap-procedimientos">
            {t("Ver procedimientos", "View procedures")}
            <span aria-hidden="true">
              <Icon name="arrow" />
            </span>
          </a>
        </div>
        <div className="ap-cover__rail">
          <span>AVA COSMETIC SURGERY</span>
          <span>{t("CUERPO, PECHO Y ROSTRO", "BODY, BREAST & FACE")}</span>
          <span>MIAMI, FLORIDA</span>
          <a href="#ap-procedimientos">
            {t("VER PROCEDIMIENTOS", "VIEW PROCEDURES")}
            <Icon name="arrow" />
          </a>
        </div>
      </section>
      <ProcedureExplorer />
      <ComboExplorer />

      <ConsultationBand id="ap-consulta" />

      <section
        className="ap-section ap-faq"
        id="ap-preguntas"
        aria-labelledby="ap-faq-title"
      >
        <h2 id="ap-faq-title">
          {t("Preguntas frecuentes", "Frequently asked questions")}
        </h2>
        <div>
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <Icon name="plus" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}
