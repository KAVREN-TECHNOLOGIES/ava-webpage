import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { procedures } from "../data/procedures";
import { useLanguage } from "../lib/language";
import { Icon } from "./Icon";

type Fields = {
  name: string;
  email: string;
  phone: string;
  procedure: string;
  language: string;
  message: string;
  consent: boolean;
};
type Errors = Partial<Record<keyof Fields, string>>;
const emptyFields: Fields = {
  name: "",
  email: "",
  phone: "",
  procedure: "",
  language: "es",
  message: "",
  consent: false,
};

export function ConsultationForm() {
  const { t, language } = useLanguage();
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<Errors>({});
  const [review, setReview] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const reviewTitle = useRef<HTMLHeadingElement>(null);
  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };
  useEffect(() => {
    if (review) reviewTitle.current?.focus();
  }, [review]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = {};
    if (fields.name.trim().length < 2)
      next.name = t("Escribe tu nombre.", "Enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()))
      next.email = t("Escribe un correo válido.", "Enter a valid email.");
    if (
      fields.phone.replace(/\D/g, "").length < 7 ||
      fields.phone.replace(/\D/g, "").length > 15
    )
      next.phone = t(
        "Revisa tu número de teléfono.",
        "Check your phone number.",
      );
    if (!procedures.some((item) => item.slug === fields.procedure))
      next.procedure = t("Selecciona un procedimiento.", "Choose a procedure.");
    if (!fields.consent)
      next.consent = t(
        "Lee y acepta la política de privacidad para continuar.",
        "Read and accept the privacy policy to continue.",
      );
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() =>
        form.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    setReview(true);
  };
  const error = (key: keyof Fields) =>
    errors[key] ? (
      <span className="field-error" id={`error-${key}`}>
        {errors[key]}
      </span>
    ) : null;
  const accessibility = (key: keyof Fields) => ({
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `error-${key}` : undefined,
  });

  if (review)
    return (
      <div className="form-review" role="status">
        <Icon name="check" />
        <h3 ref={reviewTitle} tabIndex={-1}>
          {t("Revisión de datos", "Review your details")}
        </h3>
        <p>
          {t(
            "No se han enviado ni guardado.",
            "They have not been sent or saved.",
          )}
        </p>
        <dl>
          <div>
            <dt>{t("Nombre", "Name")}</dt>
            <dd>{fields.name}</dd>
          </div>
          <div>
            <dt>{t("Correo", "Email")}</dt>
            <dd>{fields.email}</dd>
          </div>
          <div>
            <dt>{t("Teléfono", "Phone")}</dt>
            <dd>{fields.phone}</dd>
          </div>
          <div>
            <dt>{t("Interés", "Interest")}</dt>
            <dd>
              {
                procedures.find((item) => item.slug === fields.procedure)?.name[
                  language
                ]
              }
            </dd>
          </div>
          {fields.message ? (
            <div>
              <dt>{t("Mensaje", "Message")}</dt>
              <dd>{fields.message}</dd>
            </div>
          ) : null}
        </dl>
        <button
          className="button button--light"
          onClick={() => setReview(false)}
        >
          {t("Corregir mis datos", "Edit my details")}
        </button>
      </div>
    );

  return (
    <form ref={form} className="consultation-form" onSubmit={submit} noValidate>
      <p className="form-notice">
        {t(
          "Este formulario permite revisar tus datos; no envía solicitudes.",
          "This form lets you review your details; it does not send requests.",
        )}
      </p>
      <div className="form-grid">
        <div className="field field--half">
          <label htmlFor="consult-name">
            {t("Nombre completo *", "Full name *")}
          </label>
          <input
            id="consult-name"
            name="name"
            autoComplete="name"
            maxLength={100}
            value={fields.name}
            onChange={(event) => set("name", event.target.value)}
            {...accessibility("name")}
            required
          />
          {error("name")}
        </div>
        <div className="field field--half">
          <label htmlFor="consult-email">
            {t("Correo electrónico *", "Email address *")}
          </label>
          <input
            id="consult-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={200}
            value={fields.email}
            onChange={(event) => set("email", event.target.value)}
            {...accessibility("email")}
            required
          />
          {error("email")}
        </div>
        <div className="field field--third">
          <label htmlFor="consult-phone">{t("Teléfono *", "Phone *")}</label>
          <input
            id="consult-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            value={fields.phone}
            onChange={(event) => set("phone", event.target.value)}
            {...accessibility("phone")}
            required
          />
          {error("phone")}
        </div>
        <div className="field field--third">
          <label htmlFor="consult-language">{t("Idioma", "Language")}</label>
          <select
            id="consult-language"
            value={fields.language}
            onChange={(event) => set("language", event.target.value)}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="field field--third">
          <label htmlFor="consult-procedure">
            {t("Procedimiento de interés *", "Procedure of interest *")}
          </label>
          <select
            id="consult-procedure"
            value={fields.procedure}
            onChange={(event) => set("procedure", event.target.value)}
            {...accessibility("procedure")}
            required
          >
            <option value="">{t("Selecciona", "Select")}</option>
            {procedures.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name[language]}
              </option>
            ))}
          </select>
          {error("procedure")}
        </div>
        <div className="field field--full">
          <label htmlFor="consult-message">
            {t("Comentarios para la consulta", "Consultation notes")}
          </label>
          <textarea
            id="consult-message"
            name="message"
            rows={3}
            maxLength={2000}
            value={fields.message}
            onChange={(event) => set("message", event.target.value)}
          />
          <small>
            {t(
              "No incluyas información médica sensible ni fotografías.",
              "Do not include sensitive medical information or photographs.",
            )}
          </small>
        </div>
      </div>
      <div className="consent-field">
        <label>
          <input
            type="checkbox"
            checked={fields.consent}
            onChange={(event) => set("consent", event.target.checked)}
            {...accessibility("consent")}
          />
          <span>
            {t(
              "He leído la política de privacidad. Entiendo que no se envían datos.",
              "I have read the privacy policy. I understand that details are not sent.",
            )}
          </span>
        </label>{" "}
        <Link to="/privacidad" target="_blank" rel="noopener noreferrer">
          {t(
            "Política de privacidad (otra pestaña)",
            "Privacy policy (new tab)",
          )}
        </Link>
        {error("consent")}
      </div>
      <button className="button button--light form-submit" type="submit">
        {t("Revisar mis datos", "Review my details")}
        <Icon name="arrow" />
      </button>
    </form>
  );
}
