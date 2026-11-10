import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { LocalizedLink as Link } from "../lib/LocalizedRouting";
import { Icon } from "../components/Icon";
import { PageIntro } from "../components/Shared";
import { useLanguage, type Localized } from "../lib/language";
import { bmiCategory, calculateBmi, CENTIMETERS_PER_INCH, parseMeasurement, POUNDS_PER_KILOGRAM, type BmiCategory } from "../lib/bmi";
import "./bmi.css";

type Units = "metric" | "us";
type Field = "weight" | "height" | "feet" | "inches";
type Measurements = Record<Field, string>;
type FieldErrors = Partial<Record<Field, "positive" | "feet" | "inches" | "result">>;

const emptyMeasurements: Measurements = { weight: "", height: "", feet: "", inches: "" };
const categories: { id: BmiCategory; label: Localized; range: Localized }[] = [
  { id: "underweight", label: { es: "Bajo peso", en: "Underweight" }, range: { es: "Menos de 18,5", en: "Below 18.5" } },
  { id: "healthy", label: { es: "Peso saludable", en: "Healthy weight" }, range: { es: "18,5 a menos de 25", en: "18.5 to below 25" } },
  { id: "overweight", label: { es: "Sobrepeso", en: "Overweight" }, range: { es: "25 a menos de 30", en: "25 to below 30" } },
  { id: "obesity", label: { es: "Obesidad", en: "Obesity" }, range: { es: "30 o más", en: "30 or above" } },
];

const measurementText = (value: number) => String(Number(value.toFixed(3)));

export function BmiPage() {
  const { t, language } = useLanguage();
  const [units, setUnits] = useState<Units>("metric");
  const [measurements, setMeasurements] = useState<Measurements>({ ...emptyMeasurements });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<number | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const weightInput = useRef<HTMLInputElement>(null);
  const category = result === null ? null : bmiCategory(result);
  const locale = language === "es" ? "es-ES" : "en-US";
  // Keep the displayed value on the same side of a category boundary as the calculation.
  const resultDigits = result === null ? 1 : Array.from({ length: 15 }, (_, index) => index + 1)
    .find(digits => bmiCategory(Number(result.toFixed(digits))) === category) ?? 15;
  const formattedResult = result === null ? "—" : new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: resultDigits }).format(result);

  useEffect(() => {
    if (Object.keys(errors).length) form.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus();
  }, [errors]);

  function update(field: Field, value: string) {
    setMeasurements(current => ({ ...current, [field]: value }));
    setErrors({});
    setResult(null);
  }

  function changeUnits(next: Units) {
    if (next === units) return;
    const weight = parseMeasurement(measurements.weight);
    const height = parseMeasurement(measurements.height);
    const feet = parseMeasurement(measurements.feet);
    const inches = parseMeasurement(measurements.inches);
    const converted: Measurements = { ...emptyMeasurements };
    if (weight !== null && weight > 0) converted.weight = measurementText(next === "us" ? weight * POUNDS_PER_KILOGRAM : weight / POUNDS_PER_KILOGRAM);
    if (next === "us" && height !== null && height > 0) {
      const totalInches = Number((height / CENTIMETERS_PER_INCH).toFixed(3));
      converted.feet = String(Math.floor(totalInches / 12));
      converted.inches = measurementText(totalInches % 12);
    } else if (next === "metric" && feet !== null && Number.isInteger(feet) && feet >= 0 && inches !== null && inches >= 0 && inches < 12) {
      const centimeters = (feet * 12 + inches) * CENTIMETERS_PER_INCH;
      if (centimeters > 0) converted.height = measurementText(centimeters);
    }
    setMeasurements(converted);
    setUnits(next);
    setErrors({});
  }

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    const weight = parseMeasurement(measurements.weight);
    let centimeters = parseMeasurement(measurements.height);
    if (weight === null || weight <= 0) nextErrors.weight = "positive";
    if (units === "metric") {
      if (centimeters === null || centimeters <= 0) nextErrors.height = "positive";
    } else {
      const feet = parseMeasurement(measurements.feet);
      const inches = parseMeasurement(measurements.inches);
      if (feet === null || !Number.isInteger(feet) || feet < 0) nextErrors.feet = "feet";
      if (inches === null || inches < 0 || inches >= 12) nextErrors.inches = "inches";
      centimeters = feet !== null && inches !== null ? (feet * 12 + inches) * CENTIMETERS_PER_INCH : null;
      if (centimeters === 0) nextErrors.feet = "positive";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setResult(null);
      return;
    }
    const bmi = calculateBmi(units === "metric" ? weight! : weight! / POUNDS_PER_KILOGRAM, centimeters!);
    if (bmi === null) nextErrors.weight = "result";
    setErrors(nextErrors);
    setResult(bmi);
  }

  function reset() {
    setMeasurements({ ...emptyMeasurements });
    setErrors({});
    setResult(null);
    weightInput.current?.focus();
  }

  function field(id: Field, label: string, unit: string, placeholder: string) {
    const error = errors[id];
    const errorText = error === "feet" ? t("Introduce un número entero de pies, desde 0.", "Enter a whole number of feet, starting at 0.")
      : error === "inches" ? t("Introduce pulgadas desde 0 y menores de 12.", "Enter inches from 0 to less than 12.")
      : error === "result" ? t("Revisa las medidas e inténtalo de nuevo.", "Check your measurements and try again.")
      : t("Introduce un valor numérico mayor que 0.", "Enter a number greater than 0.");
    return <div className="bmi-field">
      <label htmlFor={`bmi-${id}`}>{label} <span>({unit})</span></label>
      <input ref={id === "weight" ? weightInput : undefined} id={`bmi-${id}`} type="text" inputMode={id === "feet" ? "numeric" : "decimal"}
        autoComplete="off" spellCheck={false} maxLength={12} value={measurements[id]} placeholder={placeholder}
        aria-invalid={error ? true : undefined} aria-describedby={error ? `bmi-${id}-error` : undefined}
        onChange={event => update(id, event.target.value)} />
      {error && <span className="bmi-field-error" id={`bmi-${id}-error`}>{errorText}</span>}
    </div>;
  }

  return <>
    <PageIntro title={t("Calculadora de BMI", "BMI calculator")} subtitle={t("Conoce tu índice de masa corporal antes de tu consulta.", "Understand your body mass index before your consultation.")} />
    <section className="bmi-calculator wrap" aria-label={t("Calculadora de índice de masa corporal", "Body mass index calculator")}>
      <div className="bmi-measurements">
        <h2>{t("Tus medidas", "Your measurements")}</h2>
        <p className="bmi-instructions">{t("Introduce tu peso y estatura para calcular tu BMI (IMC).", "Enter your weight and height to calculate your BMI.")}</p>
        <div className="bmi-units" role="group" aria-label={t("Sistema de unidades", "Measurement system")}>
          <button type="button" aria-pressed={units === "metric"} onClick={() => changeUnits("metric")}>{t("Métrico", "Metric")} <span>kg / cm</span></button>
          <button type="button" aria-pressed={units === "us"} onClick={() => changeUnits("us")}>{t("Estadounidense", "US")} <span>lb / ft</span></button>
        </div>
        <form ref={form} onSubmit={calculate} noValidate>
          <div className="bmi-fields">
            {field("weight", t("Peso", "Weight"), units === "metric" ? "kg" : "lb", units === "metric" ? t("Ej. 65", "e.g. 65") : t("Ej. 145", "e.g. 145"))}
            {units === "metric" ? field("height", t("Estatura", "Height"), "cm", t("Ej. 165", "e.g. 165")) :
              <fieldset className="bmi-height"><legend>{t("Estatura", "Height")}</legend><div>
                {field("feet", t("Pies", "Feet"), "ft", "5")}
                {field("inches", t("Pulgadas", "Inches"), "in", "6")}
              </div></fieldset>}
          </div>
          <div className="bmi-actions">
            <button className="button" type="submit">{t("Calcular mi BMI", "Calculate my BMI")}<Icon name="arrow" /></button>
            <button className="bmi-reset" type="button" onClick={reset}>{t("Reiniciar", "Reset")}</button>
          </div>
        </form>
      </div>
      <div className="bmi-result">
        <div role="status" aria-live="polite" aria-atomic="true" className="bmi-result-summary">
          <h2>{t("Tu resultado", "Your result")}</h2>
          <div className="bmi-number">{formattedResult}<span>kg/m²</span></div>
          <p className="bmi-category">{category ? categories.find(item => item.id === category)!.label[language] : t("Introduce tus medidas para comenzar.", "Enter your measurements to get started.")}</p>
        </div>
        <div className="bmi-scale" aria-hidden="true">
          <div className="bmi-scale-track">
            {result !== null && <span className="bmi-scale-marker" style={{ "--bmi-position": `${Math.min(100, Math.max(0, (result - 15) / 25 * 100))}%` } as CSSProperties} />}
          </div>
          <div className="bmi-scale-ticks">{[15, 18.5, 25, 30, 40].map(value => <span key={value} style={{ left: `${(value - 15) / 25 * 100}%` }}>{new Intl.NumberFormat(locale).format(value)}</span>)}</div>
        </div>
        <div className="bmi-surgical-note">
          <h3>{t("BMI y cirugía", "BMI and surgery")}</h3>
          <p>{t("El BMI es una herramienta orientativa. Tu cirujano evaluará tu salud y el procedimiento para determinar si la cirugía es adecuada para ti.", "BMI is a screening tool. Your surgeon will assess your health and the procedure to determine whether surgery is appropriate for you.")}</p>
          <Link to="/consulta">{t("Preparar mi consulta", "Prepare my consultation")}<Icon name="arrow" /></Link>
        </div>
      </div>
    </section>
    <section className="bmi-guide wrap" aria-labelledby="bmi-guide-title">
      <div className="bmi-guide-intro">
        <h2 id="bmi-guide-title">{t("Cómo interpretar", "Understanding")} <em>{t("tu BMI", "your BMI")}</em></h2>
        <p>{t("El índice de masa corporal relaciona el peso con la estatura. Estos rangos se utilizan como referencia para adultos de 20 años o más.", "Body mass index relates weight to height. These ranges are a reference for adults aged 20 and older.")}</p>
        <a className="bmi-source" href="https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html" target="_blank" rel="noopener noreferrer"
          aria-label={t("Fuente: categorías de los CDC (abre en otra pestaña)", "Source: CDC BMI categories (opens in a new tab)")}>
          {t("Fuente: categorías de los CDC", "Source: CDC BMI categories")}<Icon name="arrow" />
        </a>
      </div>
      <div>
        <dl className="bmi-ranges">{categories.map(item => <div key={item.id} data-active={category === item.id ? "true" : undefined}>
          <dt>{item.label[language]}{category === item.id && <span className="bmi-current">{t("Tu rango", "Your range")}</span>}</dt><dd>{item.range[language]}</dd>
        </div>)}</dl>
        <p className="bmi-guide-note">{t("El BMI no distingue entre músculo y grasa ni sustituye una evaluación médica. No se utiliza para valorar el peso durante el embarazo.", "BMI does not distinguish muscle from fat or replace a medical assessment. It is not used to assess weight during pregnancy.")}</p>
      </div>
    </section>
  </>;
}
