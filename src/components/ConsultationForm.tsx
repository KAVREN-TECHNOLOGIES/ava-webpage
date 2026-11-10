import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { usePageSearchParams as useSearchParams } from "../lib/searchParams";
import { LocalizedLink as Link } from "../lib/LocalizedRouting";
import { comboNames, readCombo } from "../data/combo";
import { useLanguage } from "../lib/language";
import { Icon } from "./Icon";
import "./contact.css";

type Fields = { firstName: string; lastName: string; phone: string; email: string; consent: boolean };
type TextField = Exclude<keyof Fields, "consent">;
type Errors = Partial<Record<keyof Fields, boolean>>;
const emptyFields: Fields = { firstName: "", lastName: "", phone: "", email: "", consent: false };

type FormProps = {
  onReviewChange?: (review: boolean) => void;
  reviewHeading?: "h1" | "h2" | "h3";
  reviewHeadingId?: string;
};

export function ConsultationForm({ onReviewChange, reviewHeading: ReviewHeading = "h3", reviewHeadingId }: FormProps = {}) {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const combo = readCombo(searchParams.get("combo"));
  const names = comboNames(combo, language);
  const prefix = useId();
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<Errors>({});
  const [review, setReview] = useState(false);
  const changeReview = (value: boolean) => { setReview(value); onReviewChange?.(value); };
  const form = useRef<HTMLFormElement>(null);
  const reviewTitle = useRef<HTMLHeadingElement>(null);
  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: false }));
  };
  useEffect(() => { if (review) reviewTitle.current?.focus(); }, [review]);

  const messages: Record<keyof Fields, string> = {
    firstName: t("Escribe tu nombre.", "Enter your first name."),
    lastName: t("Escribe tus apellidos.", "Enter your last name."),
    phone: t("Revisa tu número de teléfono.", "Check your phone number."),
    email: t("Escribe un correo válido.", "Enter a valid email."),
    consent: t("Lee y acepta la política de privacidad para continuar.", "Read and accept the privacy policy to continue."),
  };
  const inputs: { key: TextField; name: string; label: string; type: string; autocomplete: string; placeholder: string; max: number }[] = [
    { key: "firstName", name: "first_name", label: t("Nombre", "First name"), type: "text", autocomplete: "given-name", placeholder: t("Tu nombre", "Your first name"), max: 100 },
    { key: "lastName", name: "last_name", label: t("Apellidos", "Last name"), type: "text", autocomplete: "family-name", placeholder: t("Tus apellidos", "Your last name"), max: 100 },
    { key: "phone", name: "phone", label: t("Teléfono", "Phone number"), type: "tel", autocomplete: "tel", placeholder: "(305) 555-0123", max: 30 },
    { key: "email", name: "email", label: t("Correo electrónico", "Email"), type: "email", autocomplete: "email", placeholder: t("tu@correo.com", "you@example.com"), max: 200 },
  ];
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const digits = fields.phone.replace(/\D/g, "");
    const next: Errors = {
      firstName: !fields.firstName.trim(),
      lastName: !fields.lastName.trim(),
      phone: digits.length < 7 || digits.length > 15,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()),
      consent: !fields.consent,
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    changeReview(true);
  };
  const error = (key: keyof Fields) => errors[key] ?
    <span className="field-error" id={prefix + "-error-" + key}>{messages[key]}</span> : null;
  const accessibility = (key: keyof Fields) => ({
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? prefix + "-error-" + key : undefined,
  });
  const context = names && <div className="contact-context" aria-label={t("Combo seleccionado", "Selected combo")}>
    <span>{t("Tu combo", "Your combo")}</span>
    <p>{names}</p>
  </div>;

  if (review) return <div className="consultation-form form-review">
    <ReviewHeading id={reviewHeadingId} ref={reviewTitle} tabIndex={-1}>{t("Revisión de datos", "Review your details")}</ReviewHeading>
    <dl>
      {inputs.map(item => <div key={item.key}><dt>{item.label}</dt><dd>{fields[item.key]}</dd></div>)}
    </dl>
    {context}
    <button className="contact-submit" type="button" onClick={() => changeReview(false)}>
      {t("Corregir mis datos", "Edit my details")}<span><Icon name="arrow" /></span>
    </button>
  </div>;

  return <form ref={form} className="consultation-form" onSubmit={submit} noValidate>
    {context}
    {combo.length > 0 && <input type="hidden" name="combo" value={combo.join(",")} />}
    <div className="form-grid">
      {inputs.map(item => <div className={"field field--half" + (item.type === "tel" || item.type === "email" ? " field--contact" : "")} key={item.key}>
        <label htmlFor={prefix + "-" + item.key}>{item.label}</label>
        <input id={prefix + "-" + item.key} name={item.name} type={item.type}
          autoComplete={item.autocomplete} placeholder={item.placeholder} maxLength={item.max}
          value={fields[item.key]} onChange={event => set(item.key, event.target.value)}
          {...accessibility(item.key)} required />
        {error(item.key)}
      </div>)}
    </div>
    <div className="consent-field">
      <label htmlFor={prefix + "-consent"}>
        <input id={prefix + "-consent"} name="privacy_consent" type="checkbox"
          checked={fields.consent} onChange={event => set("consent", event.target.checked)}
          {...accessibility("consent")} required />
        <span>{t("He leído la ", "I have read the ")}
          <Link to="/privacidad" target="_blank" rel="noopener noreferrer">{t("política de privacidad", "privacy policy")}</Link>.
        </span>
      </label>
      {error("consent")}
    </div>
    <button className="contact-submit" type="submit">
      {t("Continuar", "Continue")}<span><Icon name="arrow" /></span>
    </button>
  </form>;
}
