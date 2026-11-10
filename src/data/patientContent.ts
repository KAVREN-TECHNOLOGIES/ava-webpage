import type { Localized } from "../lib/language";

export type Answer = Readonly<{ question: Localized; answer: Localized }>;
export const patientQuestions: readonly Answer[] = [
  {
    question: {
      es: "¿Qué distingue a AVA Cosmetic Surgery?",
      en: "What sets AVA Cosmetic Surgery apart?",
    },
    answer: {
      es: "En AVA, la consulta parte de tus objetivos, tu historial médico y las zonas que deseas tratar. El plan debe explicar las opciones, los riesgos y la recuperación para que puedas tomar una decisión informada.",
      en: "At AVA, your consultation starts with your goals, medical history and areas of concern. The plan should explain your options, risks and recovery so you can make an informed decision.",
    },
  },
  {
    question: {
      es: "¿Cómo sé qué procedimiento es adecuado para mí?",
      en: "How can I choose the right procedure?",
    },
    answer: {
      es: "La elección depende de tus objetivos, tu anatomía y tu salud. Durante la consulta, el cirujano valorará las opciones y te explicará qué puede aportar cada procedimiento y cuáles son sus límites.",
      en: "The choice depends on your goals, anatomy and health. During your consultation, the surgeon will assess your options and explain what each procedure can achieve and its limitations.",
    },
  },
  {
    question: {
      es: "¿Qué tan segura es la cirugía estética?",
      en: "What should I know about surgical safety?",
    },
    answer: {
      es: "Toda cirugía implica riesgos. La valoración debe revisar tu salud, la técnica, la anestesia y el centro donde se realizará. El cirujano te explicará los riesgos de tu caso y cómo se abordan.",
      en: "Every surgery carries risks. Assessment should cover your health, the technique, anesthesia and surgical facility. Your surgeon will explain the risks relevant to your case and how they are managed.",
    },
  },
  {
    question: {
      es: "¿Cuánto tardaré en ver los resultados?",
      en: "When should I expect to see my results?",
    },
    answer: {
      es: "Los cambios pueden empezar a apreciarse pronto, pero la inflamación puede ocultar el resultado inicial. El aspecto final se define de forma gradual durante los meses siguientes, según el procedimiento y la cicatrización.",
      en: "Changes may become noticeable early, but swelling can obscure the initial result. The final appearance develops gradually over the following months, depending on the procedure and your healing.",
    },
  },
  {
    question: {
      es: "¿Necesito una consulta antes de operarme?",
      en: "Is a consultation needed before surgery?",
    },
    answer: {
      es: "Sí. La consulta permite valorar tu salud, revisar tus antecedentes y medicación, definir tus objetivos y resolver dudas sobre las opciones, los riesgos y la recuperación.",
      en: "Yes. The consultation allows your health, medical history and medications to be reviewed, your goals to be discussed and your questions about options, risks and recovery to be answered.",
    },
  },
  {
    question: {
      es: "¿Tendré que guardar reposo después del procedimiento?",
      en: "What recovery time should I plan for?",
    },
    answer: {
      es: "Sí, debes planificar un período de recuperación. El tiempo para volver al trabajo, hacer ejercicio o viajar depende de la intervención y de tu evolución. El cirujano te indicará cuándo retomar cada actividad.",
      en: "Plan for a recovery period. Returning to work, exercise or travel depends on the procedure and your progress. Your surgeon will advise when you can resume each activity.",
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
