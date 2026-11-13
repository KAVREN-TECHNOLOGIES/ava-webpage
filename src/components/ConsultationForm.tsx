import { useId, useRef, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { localizePath } from "../data/routes";
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

export function ConsultationForm() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const combo = readCombo(searchParams.get("combo"));
  const names = comboNames(combo, language);
  const prefix = useId();
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<Errors>({});
  const form = useRef<HTMLFormElement>(null);
  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: false }));
  };

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
  const validate = () => {
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
      return false;
    }
    return true;
  };
  const guardSubmission = (event: { preventDefault: () => void; stopPropagation: () => void }) => {
    if (validate()) return;
    // GHL listens on the form and submit button in the capture phase. React's
    // root capture handler must reject invalid or unconsented clicks before they arrive.
    event.preventDefault();
    event.stopPropagation();
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // The SDK's native capture listener has already read this form and its URL.
    // Keep campaign context in the URL; never add entered contact details.
    navigate({ pathname: localizePath("/gracias", language), search: location.search }, { replace: true });
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

  return <form ref={form} id="ava-consultation" name="ava_consultation" className="consultation-form"
    onClickCapture={event => {
      if (event.target instanceof Element && event.target.closest('button[type="submit"], input[type="submit"]')) guardSubmission(event);
    }}
    onSubmitCapture={guardSubmission} onSubmit={submit} noValidate>
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
