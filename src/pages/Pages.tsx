import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { usePageSearchParams as useSearchParams } from "../lib/searchParams";
import { LocalizedLink as Link } from "../lib/LocalizedRouting";
import { media } from "../data/media";
import { categoryLabels, procedures } from "../data/procedures";
import { consultationStages, patientQuestions } from "../data/patientContent";
import { privacySections, termsSections } from "../data/legalContent";
import { company } from "../data/company";
import { CompanyAddress } from "../components/CompanyAddress";
import { useLanguage, type Localized } from "../lib/language";
import { Icon } from "../components/Icon";
import {
  ConsultationBand,
  ConsultationLink,
  PageIntro,
} from "../components/Shared";

const galleryPhotos = Object.values(media.procedures);

type ReadingItem = Readonly<{ title: Localized; body: Localized }>;
function ReadingGrid({ items }: { items: readonly ReadingItem[] }) {
  const { language } = useLanguage();
  return (
    <div className="reading-grid">
      {items.map((item) => (
        <article key={item.title.es}>
          <h3>{item.title[language]}</h3>
          <p>{item.body[language]}</p>
        </article>
      ))}
    </div>
  );
}

export function ProceduresPage() {
  const { t, language } = useLanguage();
  return (
    <>
      <PageIntro title={t("Procedimientos", "Procedures")} />
      <div className="wrap directory">
        <nav className="directory-nav" aria-label={t("Categorías de procedimientos", "Procedure categories")}>
          {(["body", "breast", "face"] as const).map(category => <a key={category} href={`#${category}`}>{categoryLabels[category][language]}</a>)}
        </nav>
        {(["body", "breast", "face"] as const).map((category) => (
          <section id={category} key={category}>
            <h2>{categoryLabels[category][language]}</h2>
            <div className={`procedure-directory procedure-directory--${category}`}>
              {procedures
                .filter((item) => item.category === category)
                .map((item) => (
                  <Link to={`/procedimientos/${item.slug}`} key={item.slug}>
                    <div className="directory-image">
                      <img
                        src={item.image}
                        width="1200" height="1600"
                        alt={t(
                          "Fotografía ilustrativa de una modelo",
                          "Illustrative model photograph",
                        )}
                        loading="lazy"
                      />
                    </div>
                    <h3>
                      {item.name[language]}
                      <Icon name="arrow" />
                    </h3>
                    <p>{item.description[language]}</p>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
      <ConsultationBand />
    </>
  );
}

export function ProcedurePage({ procedureSlug }: { procedureSlug?: string } = {}) {
  const { slug: routeSlug } = useParams();
  const slug = procedureSlug ?? routeSlug;
  const { t, language } = useLanguage();
  const procedure = procedures.find((item) => item.slug === slug);
  if (!procedure) return <NotFoundPage />;
  const [introduction, ...details] = procedure.details;
  return (
    <>
      <PageIntro title={procedure.name[language]} />
      <section className="detail-intro wrap">
        <div className="detail-image">
          <img
            src={procedure.image}
            width="1200" height="1600"
            alt={t(
              "Fotografía ilustrativa de una modelo",
              "Illustrative model photograph",
            )}
          />
        </div>
        <div>
          <h2>{introduction.title[language]}</h2>
          <p>{introduction.body[language]}</p>
          <ConsultationLink />
        </div>
      </section>
      <section className="reading-section wrap">
        <h2>{t("Beneficios y tratamiento", "Benefits and treatment")}</h2>
        <ReadingGrid items={details} />
        <p className="source-link">
          <a href={procedure.source} target="_blank" rel="noopener noreferrer">
            American Society of Plastic Surgeons
            <Icon name="arrow" />
          </a>
        </p>
      </section>
      <ConsultationBand />
    </>
  );
}

export function GalleryPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const clinical = searchParams.get("tipo") === "clinica";
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected === null) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);
  return (
    <>
      <PageIntro
        title={
          clinical
            ? t("Cómo evaluar resultados", "Evaluating results")
            : t("Fotografía editorial", "Editorial photography")
        }
      />
      <section className="gallery-page wrap">
        <div
          className="filter-buttons"
          role="group"
          aria-label={t("Contenido de la galería", "Gallery content")}
        >
          <button aria-pressed={!clinical} onClick={() => setSearchParams({})}>
            {t("Fotografías editoriales", "Editorial photographs")}
          </button>
          <button
            aria-pressed={clinical}
            onClick={() => setSearchParams({ tipo: "clinica" })}
          >
            {t("Cómo evaluar resultados", "Evaluating results")}
          </button>
        </div>
        {clinical ? (
          <div className="reading-section">
            <h2>
              {t(
                "Cómo evaluar un antes y después",
                "How to assess before-and-after photos",
              )}
            </h2>
            <p>
              {t(
                "Compara casos del mismo procedimiento, con iluminación, postura y ángulos equivalentes. Revisa el tiempo transcurrido desde la cirugía. Una fotografía no permite predecir tu resultado.",
                "Compare the same procedure using equivalent lighting, posture and angles. Check how long it has been since surgery. A photograph cannot predict your outcome.",
              )}
            </p>
            <ReadingGrid
              items={[
                {
                  title: { es: "Casos comparables", en: "Comparable cases" },
                  body: {
                    es: "La anatomía inicial y el alcance de la intervención importan tanto como la imagen final.",
                    en: "Starting anatomy and the extent of surgery matter as much as the final image.",
                  },
                },
                {
                  title: { es: "Evolución", en: "Healing stage" },
                  body: {
                    es: "Distingue la inflamación inicial del resultado una vez avanzado el proceso de cicatrización.",
                    en: "Distinguish initial swelling from the result later in the healing process.",
                  },
                },
              ]}
            />
          </div>
        ) : (
          <>
            <div className="gallery-grid">
              {galleryPhotos.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelected(index)}
                  aria-label={t(
                    `Ampliar fotografía ${index + 1}`,
                    `Enlarge photograph ${index + 1}`,
                  )}
                >
                  <img
                    src={image}
                    loading="lazy"
                    alt={t(
                      "Fotografía editorial de una modelo",
                      "Editorial model photograph",
                    )}
                  />
                  <span>
                    <Icon name="plus" />
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </section>
      {selected !== null ? (
        <dialog
          className="image-dialog"
          ref={dialog}
          onClose={() => setSelected(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) dialog.current?.close();
          }}
          aria-label={t("Fotografía ampliada", "Enlarged photograph")}
        >
          <button
            className="dialog-close"
            aria-label={t("Cerrar fotografía", "Close photograph")}
            onClick={() => dialog.current?.close()}
          >
            <Icon name="close" />
          </button>
          <img
            src={galleryPhotos[selected]}
            alt={t(
              "Fotografía editorial ilustrativa",
              "Illustrative editorial photograph",
            )}
          />
        </dialog>
      ) : null}
    </>
  );
}

export function TeamPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageIntro
        title={t("Credenciales médicas", "Medical credentials")}
        subtitle={t(
          "Qué comprobar antes de elegir un cirujano.",
          "What to check before choosing a surgeon.",
        )}
      />
      <section className="reading-section wrap">
        <ReadingGrid
          items={[
            {
              title: { es: "Licencia profesional", en: "Medical license" },
              body: {
                es: "Comprueba la licencia vigente del médico en el estado donde se realizará la cirugía.",
                en: "Check the physician's current license in the state where surgery will take place.",
              },
            },
            {
              title: { es: "Certificación", en: "Certification" },
              body: {
                es: "Solicita el nombre de la entidad certificadora y confirma a qué especialidad corresponde.",
                en: "Ask for the certifying body's name and confirm the specialty it covers.",
              },
            },
            {
              title: {
                es: "Experiencia en el procedimiento",
                en: "Procedure experience",
              },
              body: {
                es: "Pregunta qué técnica propone, cuáles son sus límites y cómo se gestionan las complicaciones.",
                en: "Ask which technique is proposed, its limitations and how complications are managed.",
              },
            },
            {
              title: {
                es: "Centro quirúrgico y anestesia",
                en: "Surgical facility and anesthesia",
              },
              body: {
                es: "Identifica dónde se operará, quién administrará la anestesia y cuál es el protocolo de atención posterior.",
                en: "Identify where surgery will take place, who will provide anesthesia and the follow-up protocol.",
              },
            },
          ]}
        />
        <a
          className="text-link"
          href="https://find.plasticsurgery.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          American Society of Plastic Surgeons
          <Icon name="arrow" />
        </a>
      </section>
    </>
  );
}

export function ServicesContent() {
  const { language } = useLanguage();
  return (
    <section className="services-list wrap">
      {consultationStages.map((item) => (
        <article key={item.title.es}>
          <h2>{item.title[language]}</h2>
          <p>{item.body[language]}</p>
          <Icon name="check" />
        </article>
      ))}
    </section>
  );
}

export function ExperiencePage() {
  const { t } = useLanguage();
  return (
    <>
      <PageIntro
        title={t("Consulta quirúrgica", "Surgical consultation")}
        subtitle={t(
          "Evaluación, alternativas, riesgos y recuperación.",
          "Assessment, alternatives, risks and recovery.",
        )}
      />
      <section className="reading-section wrap">
        <p>
          {t(
            "La consulta permite revisar los antecedentes médicos, explorar las zonas que se quieren tratar y determinar si una intervención está indicada. El plan debe explicar qué puede cambiar la cirugía y qué no puede conseguir.",
            "A consultation reviews medical history, examines the areas to be treated and determines whether surgery is indicated. The plan should explain what surgery can change and what it cannot achieve.",
          )}
        </p>
      </section>
      <ServicesContent />
      <ConsultationBand />
    </>
  );
}
export function ServicesPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageIntro
        title={t("Preparación y cuidados", "Preparation and aftercare")}
        subtitle={t(
          "Qué incluye la planificación de una cirugía.",
          "What surgical planning involves.",
        )}
      />
      <ServicesContent />
      <section className="reading-section wrap">
        <h2>{t("Indicaciones por escrito", "Written instructions")}</h2>
        <p>
          {t(
            "Antes de operarte, confirma las instrucciones de preparación, los cuidados posteriores, las fechas de revisión y los canales de atención del equipo médico.",
            "Before surgery, confirm preparation instructions, aftercare, follow-up dates and your medical team's contact channels.",
          )}
        </p>
        <ConsultationLink />
      </section>
    </>
  );
}

export function FinancePage() {
  const { t } = useLanguage();
  return (
    <>
      <PageIntro
        title={t("Costos de cirugía", "Surgery costs")}
        subtitle={t(
          "Procedimiento, anestesia, centro quirúrgico y revisiones.",
          "Procedure, anesthesia, surgical facility and follow-up.",
        )}
      />
      <section className="reading-section wrap">
        <h2>{t("Presupuesto desglosado", "Itemized quote")}</h2>
        <p>
          {t(
            "El costo depende de la intervención y de los servicios incluidos. Solicita un presupuesto escrito que identifique los siguientes conceptos.",
            "Cost depends on the operation and the services included. Request a written quote identifying the following items.",
          )}
        </p>
        <ReadingGrid
          items={[
            {
              title: {
                es: "Cirugía y anestesia",
                en: "Surgery and anesthesia",
              },
              body: {
                es: "Honorarios del cirujano y del profesional de anestesia, además del procedimiento acordado.",
                en: "Surgeon's and anesthesia provider's fees, together with the agreed procedure.",
              },
            },
            {
              title: { es: "Centro quirúrgico", en: "Surgical facility" },
              body: {
                es: "Uso de las instalaciones, materiales y servicios vinculados a la intervención.",
                en: "Facility use, materials and services associated with the operation.",
              },
            },
            {
              title: {
                es: "Revisiones y cuidados",
                en: "Follow-up and aftercare",
              },
              body: {
                es: "Consultas posteriores incluidas y costos de prendas, medicación u otros cuidados cuando correspondan.",
                en: "Included follow-up visits and costs for garments, medication or other care when applicable.",
              },
            },
            {
              title: { es: "Condiciones", en: "Terms" },
              body: {
                es: "Importe total, calendario de pagos y condiciones de cancelación o cambios de fecha.",
                en: "Total amount, payment schedule and cancellation or rescheduling terms.",
              },
            },
          ]}
        />
        <ConsultationLink />
      </section>
    </>
  );
}

function TravelContent() {
  const { t } = useLanguage();
  return (
    <section className="reading-section wrap">
      <ReadingGrid
        items={[
          {
            title: { es: "Antes de reservar", en: "Before booking" },
            body: {
              es: "Confirma la evaluación necesaria, la fecha quirúrgica y el tiempo de estancia antes de comprar vuelos o alojamiento.",
              en: "Confirm the required assessment, surgical date and length of stay before booking flights or accommodation.",
            },
          },
          {
            title: { es: "Acompañante", en: "Companion" },
            body: {
              es: "Consulta qué ayuda necesitarás tras el alta y qué condiciones debe tener el alojamiento para recuperarte.",
              en: "Ask what help you will need after discharge and what your recovery accommodation should provide.",
            },
          },
          {
            title: { es: "Revisiones", en: "Follow-up visits" },
            body: {
              es: "Organiza las revisiones presenciales y conserva las indicaciones y los contactos del equipo médico.",
              en: "Arrange in-person follow-up visits and keep your medical team's instructions and contact details.",
            },
          },
          {
            title: { es: "Viaje de regreso", en: "Return travel" },
            body: {
              es: "El equipo médico debe autorizar cuándo puedes viajar según el procedimiento y tu evolución.",
              en: "Your medical team should clear travel based on the procedure and your recovery.",
            },
          },
        ]}
      />
      <Link className="text-link" to="/recursos/seguridad">
        {t("Preparación para la cirugía", "Preparing for surgery")}
        <Icon name="arrow" />
      </Link>
    </section>
  );
}
export function LocationPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageIntro
        title={t("Cirugía en Miami", "Surgery in Miami")}
        subtitle={t(
          "Información para pacientes de otras ciudades.",
          "Information for patients traveling from another city.",
        )}
      />
      <section className="reading-section wrap">
        <h2>{t("Dónde estamos", "Our location")}</h2>
        <CompanyAddress />
      </section>
      <TravelContent />
    </>
  );
}
export function ConsultationPage() {
  return <ConsultationBand standalone />;
}
export function ResourcesPage({ resourceTopic }: { resourceTopic?: string } = {}) {
  const { topic: routeTopic } = useParams();
  const topic = resourceTopic ?? routeTopic;
  const { t, language } = useLanguage();
  if (topic === "pacientes-de-fuera")
    return (
      <>
        <PageIntro
          title={t("Pacientes de otras ciudades", "Traveling patients")}
          subtitle={t(
            "Preparación del viaje y recuperación en Miami.",
            "Travel preparation and recovery in Miami.",
          )}
        />
        <TravelContent />
      </>
    );
  if (topic === "seguridad")
    return (
      <>
        <PageIntro
          title={t("Antes de la cirugía", "Before surgery")}
          subtitle={t(
            "Evaluación médica y preparación preoperatoria.",
            "Medical assessment and preoperative preparation.",
          )}
        />
        <ServicesContent />
        <section className="reading-section wrap">
          <h2>{t("Riesgos y alternativas", "Risks and alternatives")}</h2>
          <p>
            {t(
              "Toda cirugía implica riesgos. La consulta debe incluir complicaciones posibles, anestesia, cicatrices, alternativas y las consecuencias de no realizar la intervención.",
              "Every operation carries risks. Your consultation should cover potential complications, anesthesia, scars, alternatives and the option of not proceeding.",
            )}
          </p>
          <Link className="text-link" to="/equipo">
            {t(
              "Cómo comprobar las credenciales del cirujano",
              "How to check a surgeon's credentials",
            )}
            <Icon name="arrow" />
          </Link>
        </section>
      </>
    );
  return (
    <>
      <PageIntro
        title={t("Preguntas frecuentes", "Frequently asked questions")}
        subtitle={t(
          "Consulta, seguridad y recuperación.",
          "Consultation, safety and recovery.",
        )}
      />
      <section className="faq-section wrap">
        {patientQuestions.map((item) => (
          <details key={item.question.es}>
            <summary>
              {item.question[language]}
              <Icon name="plus" />
            </summary>
            <p>{item.answer[language]}</p>
          </details>
        ))}
        <div className="resource-links">
          <Link to="/bmi">
            {t("Calculadora de BMI", "BMI calculator")}
            <Icon name="arrow" />
          </Link>
          <Link to="/recursos/pacientes-de-fuera">
            {t("Pacientes de otras ciudades", "Traveling patients")}
            <Icon name="arrow" />
          </Link>
          <Link to="/financiamiento">
            {t("Costos de cirugía", "Surgery costs")}
            <Icon name="arrow" />
          </Link>
        </div>
        <ConsultationLink />
      </section>
    </>
  );
}

export function LegalPage({
  kind,
}: {
  kind: "privacidad" | "terminos" | "accesibilidad";
}) {
  const { t, language } = useLanguage();
  const titles = {
    privacidad: t("Política de privacidad", "Privacy policy"),
    terminos: t("Términos de servicio", "Terms of service"),
    accesibilidad: t("Accesibilidad", "Accessibility"),
  };
  const sections: Record<typeof kind, readonly ReadingItem[]> = {
    privacidad: privacySections,
    terminos: termsSections,
    accesibilidad: [
      {
        title: { es: "Navegación con teclado", en: "Keyboard navigation" },
        body: {
          es: "Usa Tab para recorrer enlaces y controles. Las flechas desplazan el carrusel de procedimientos. Escape cierra el menú móvil y las fotografías ampliadas.",
          en: "Use Tab to move through links and controls. Arrow keys move the procedure carousel. Escape closes the mobile menu and enlarged photographs.",
        },
      },
      {
        title: { es: "Lectura y formularios", en: "Reading and forms" },
        body: {
          es: "El contenido admite ampliación con el navegador. Los controles tienen etiquetas y foco visible; los errores del formulario se identifican junto al campo correspondiente.",
          en: "Content supports browser zoom. Controls have labels and visible focus; form errors are identified beside the relevant field.",
        },
      },
      {
        title: { es: "Movimiento", en: "Motion" },
        body: {
          es: "Las animaciones respetan la preferencia de movimiento reducido configurada en el dispositivo.",
          en: "Animations respect the reduced-motion preference configured on your device.",
        },
      },
    ],
  };
  return (
    <>
      <PageIntro title={titles[kind]} subtitle={kind === "accesibilidad" ? undefined : t("Última actualización: 10 de noviembre de 2026.", "Last updated: November 10, 2026.")} />
      <article className="legal-page wrap">
        <section>
          <h2>{t("Datos de la empresa", "Company information")}</h2>
          <div>
            <p>{company.legalName}</p>
            <CompanyAddress />
          </div>
        </section>
        {sections[kind].map((item) => (
          <section key={item.title.es}>
            <h2>{item.title[language]}</h2>
            <p>{item.body[language]}</p>
          </section>
        ))}
      </article>
    </>
  );
}
export function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <div className="not-found wrap">
      <span>404</span>
      <h1>{t("Página no encontrada", "Page not found")}</h1>
      <Link className="button" to="/">
        {t("Volver al inicio", "Back to home")}
        <Icon name="arrow" />
      </Link>
    </div>
  );
}
