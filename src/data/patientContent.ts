import type { Localized } from "../lib/language";

export type Answer = Readonly<{ question: Localized; answer: Localized }>;
export const patientQuestions: readonly Answer[] = [
  {
    question: {
      es: "¿Cuál es la diferencia entre liposucción y abdominoplastia?",
      en: "How do liposuction and a tummy tuck differ?",
    },
    answer: {
      es: "La liposucción retira grasa localizada. La abdominoplastia también elimina piel sobrante y puede reparar músculos abdominales debilitados o separados.",
      en: "Liposuction removes localized fat. A tummy tuck also removes excess skin and may repair weakened or separated abdominal muscles.",
    },
  },
  {
    question: {
      es: "¿El BBL utiliza implantes?",
      en: "Does a BBL use implants?",
    },
    answer: {
      es: "El BBL utiliza grasa de la propia paciente, obtenida mediante liposucción. La cirugía con implantes glúteos es un procedimiento diferente.",
      en: "A BBL uses the patient's own fat, obtained through liposuction. Buttock implant surgery is a different procedure.",
    },
  },
  {
    question: {
      es: "¿Se pueden combinar varias cirugías?",
      en: "Can procedures be combined?",
    },
    answer: {
      es: "Algunas intervenciones pueden combinarse. La decisión depende de la evaluación médica, la duración de la cirugía y el plan de recuperación. En otros casos se realizan por etapas.",
      en: "Some procedures can be combined. The decision depends on medical assessment, surgical duration and the recovery plan. Other cases require separate stages.",
    },
  },
  {
    question: {
      es: "¿Cuándo se ven los resultados?",
      en: "When are results visible?",
    },
    answer: {
      es: "La inflamación inicial puede ocultar el resultado. La evolución depende de la intervención y de la cicatrización; el cirujano debe explicar el plazo previsto para cada caso.",
      en: "Initial swelling can obscure the result. Progress depends on the procedure and healing; your surgeon should explain the expected timeline for your case.",
    },
  },
  {
    question: {
      es: "¿Qué debe incluir el presupuesto?",
      en: "What should a quote include?",
    },
    answer: {
      es: "El procedimiento, los honorarios del cirujano, la anestesia, el centro quirúrgico y las revisiones incluidas. Confirma también los gastos adicionales y las condiciones de cancelación.",
      en: "The procedure, surgeon's fees, anesthesia, surgical facility and included follow-up visits. Also confirm additional costs and cancellation terms.",
    },
  },
];

export const consultationStages = [
  {
    title: { es: "Evaluación médica", en: "Medical assessment" },
    body: {
      es: "Antecedentes, medicación, cirugías previas y exploración de las zonas que se quieren tratar.",
      en: "Medical history, medication, previous operations and examination of the areas to be treated.",
    },
  },
  {
    title: { es: "Plan quirúrgico", en: "Surgical plan" },
    body: {
      es: "Técnica propuesta, alternativas, anestesia, cicatrices y riesgos específicos del procedimiento.",
      en: "Proposed technique, alternatives, anesthesia, scars and procedure-specific risks.",
    },
  },
  {
    title: { es: "Recuperación", en: "Recovery" },
    body: {
      es: "Cuidados, revisiones, ayuda en casa y autorización para retomar trabajo, ejercicio o viajes.",
      en: "Aftercare, follow-up visits, support at home and clearance to return to work, exercise or travel.",
    },
  },
] as const;
