import { Link } from "react-router-dom";
import { ConsultationForm } from "../components/ConsultationForm";
import { Icon } from "../components/Icon";
import { media } from "../data/media";
import { ProcedureExplorer } from "../components/ProcedureExplorer";
import { useLanguage } from "../lib/language";
import { patientQuestions } from "../data/patientContent";
import { Header } from "../components/Header";
import "./home.css";

export function Home() {
  const { t, language } = useLanguage();
  const faqs = patientQuestions
    .slice(1, 5)
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
              "BBL, liposucción, abdominoplastia y cirugía de pecho en Miami.",
              "BBL, liposuction, tummy tuck and breast surgery in Miami.",
            )}
          </p>
          <a className="ap-button ap-button--light" href="#ap-procedimientos">
            {t("Ver procedimientos", "View procedures")}
            <span>
              <Icon name="arrow" />
            </span>
          </a>
        </div>
        <a href="#ap-consulta" className="ap-cover-card">
          <div className="ap-cover-card__photo">
            <img src={media.hero} alt="" width="2048" height="1152" />
          </div>
          <div className="ap-cover-card__copy">
            <strong>{t("Consulta", "Consultation")}</strong>
            <span className="ap-cover-card__action">
              {t("Preparar consulta", "Prepare consultation")}
              <Icon name="arrow" />
            </span>
          </div>
        </a>
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

      <section
        className="ap-section ap-experience"
        id="ap-experiencia"
        aria-labelledby="ap-experience-title"
      >
        <div className="ap-experience__heading">
          <div className="ap-experience__aside">
            <img
              src={media.campaign[1]}
              alt=""
              width="180"
              height="225"
              loading="lazy"
            />
            <p>
              {t(
                "La evaluación médica determina si la cirugía es adecuada y qué preparación requiere.",
                "Medical assessment determines whether surgery is appropriate and what preparation it requires.",
              )}
            </p>
          </div>
          <h2 id="ap-experience-title">
            <span>{t("Evaluación", "Before")}</span>{" "}
            <span>{t("preoperatoria", "surgery")}</span>
          </h2>
        </div>
        <div className="ap-journey">
          <article>
            <Icon name="user" />
            <h3>{t("Historial médico", "Medical history")}</h3>
            <p>
              {t(
                "En la consulta se revisan tus antecedentes, medicación, alergias y cirugías previas.",
                "Your consultation covers medical history, medication, allergies and previous operations.",
              )}
            </p>
            <a className="ap-text-link" href="#ap-consulta">
              {t("Preparar mis datos", "Prepare my details")}
              <Icon name="arrow" />
            </a>
          </article>
          <article>
            <Icon name="plus" />
            <h3>{t("Técnica y riesgos", "Technique and risks")}</h3>
            <p>
              {t(
                "El plan debe explicar la técnica, la anestesia, las cicatrices, los riesgos y las alternativas.",
                "The plan should explain technique, anesthesia, scars, risks and alternatives.",
              )}
            </p>
            <Link className="ap-text-link" to="/recursos">
              {t("Ver preparación", "Read about preparation")}
              <Icon name="arrow" />
            </Link>
          </article>
          <article className="ap-journey__last">
            <span className="ap-journey__word">
              {t("Cuidados", "Recovery")}
            </span>
            <p>
              {t(
                "El plan postoperatorio debe indicar los cuidados, las revisiones y cuándo retomar las actividades.",
                "The recovery plan should cover aftercare, follow-up visits and the return to activity.",
              )}
            </p>
            <Link className="ap-text-link" to="/servicios">
              {t("Cuidados y recuperación", "Aftercare and recovery")}
              <Icon name="arrow" />
            </Link>
          </article>
        </div>
      </section>

      <section className="ap-editorial" aria-labelledby="ap-editorial-title">
        <figure>
          <img
            src={media.procedures["mommy-makeover"]}
            alt={t(
              "Modelo con bikini rosa sobre fondo malva.",
              "Model in a pink bikini against a mauve background.",
            )}
            width="1200"
            height="1600"
            loading="lazy"
          />
          <div className="ap-editorial__content">
            <h2 id="ap-editorial-title">
              MOMMY
              <br />
              <em>MAKEOVER</em>
            </h2>
            <p className="ap-editorial__summary">
              {t(
                "Combinación de cirugía de pecho y abdomen.",
                "A combination of breast and abdominal surgery.",
              )}
            </p>
            <a
              className="ap-button ap-button--light"
              href="/procedimientos/mommy-makeover"
            >
              {t("Ver Mommy Makeover", "Read about Mommy Makeover")}
              <span>
                <Icon name="arrow" />
              </span>
            </a>
          </div>
        </figure>
      </section>

      <section
        className="ap-section ap-perspective"
        aria-labelledby="ap-perspective-title"
      >
        <div>
          <h2 id="ap-perspective-title">
            {t("¿Liposucción", "Liposuction")}
            <br />
            <em>{t("o abdominoplastia?", "or tummy tuck?")}</em>
          </h2>
          <p>
            {t(
              "La liposucción retira grasa localizada. La abdominoplastia también trata la piel sobrante y puede reparar músculos separados. La cantidad de piel y el estado de la pared abdominal ayudan a distinguir qué procedimiento valorar.",
              "Liposuction removes localized fat. A tummy tuck also addresses excess skin and may repair separated muscles. Skin excess and the abdominal wall help determine which procedure to assess.",
            )}
          </p>
          <Link className="ap-text-link" to="/procedimientos/abdominoplastia">
            {t("Ver abdominoplastia", "Read about tummy tuck")}
            <Icon name="arrow" />
          </Link>
        </div>
        <figure>
          <div className="ap-perspective__portrait">
            <img
              src={media.campaign[4]}
              alt={t(
                "Retrato de una modelo junto a una piscina",
                "Portrait of a model beside a pool",
              )}
              width="340"
              height="460"
              loading="lazy"
            />
          </div>
        </figure>
      </section>

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

      <section
        className="ap-section ap-consult"
        id="ap-consulta"
        aria-labelledby="ap-consult-title"
      >
        <div className="ap-consult__intro">
          <h2 id="ap-consult-title">{t("Consulta", "Consultation")}</h2>
          <p>
            {t(
              "Selecciona un procedimiento y revisa tus datos de contacto.",
              "Choose a procedure and review your contact details.",
            )}
          </p>
          <Link className="ap-text-link" to="/recursos/seguridad">
            {t("Preparación para la consulta", "Consultation preparation")}
            <Icon name="arrow" />
          </Link>
        </div>
        <ConsultationForm />
      </section>
    </div>
  );
}
