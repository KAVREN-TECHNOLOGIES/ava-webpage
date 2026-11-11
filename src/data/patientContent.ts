import type { Localized } from "../lib/language";

export type Answer = Readonly<{ question: Localized; answer: Localized }>;
export const patientQuestions: readonly Answer[] = [
  {
    question: {
      es: "¿Cómo preparo mi consulta?",
      en: "How should I prepare for my consultation?",
    },
    answer: {
      es: "Ten a mano tu historial médico, las cirugías previas y la lista de medicamentos y suplementos que tomas. Anota qué zonas quieres tratar y las preguntas que quieras resolver.",
      en: "Have your medical history, previous surgeries and a list of medications and supplements ready. Note the areas you want to address and the questions you want to ask.",
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
      es: "¿Puedo combinar varios procedimientos?",
      en: "Can I combine procedures?",
    },
    answer: {
      es: "Algunas intervenciones pueden combinarse. El cirujano debe valorar tu salud, la duración de la operación y los cuidados posteriores para decidir si conviene realizarlas juntas o en etapas.",
      en: "Some procedures can be combined. Your surgeon must assess your health, the length of the operation and aftercare needs to decide whether to combine them or plan separate stages.",
    },
  },
  {
    question: {
      es: "¿Cuándo puedo volver al trabajo o hacer ejercicio?",
      en: "When can I return to work or exercise?",
    },
    answer: {
      es: "Depende de la intervención, del esfuerzo que requiere tu trabajo y de cómo evolucione la recuperación. Organiza la ayuda que necesitarás en casa y sigue los plazos que indique el cirujano para cada actividad.",
      en: "It depends on the procedure, the physical demands of your job and how your recovery progresses. Arrange help at home and follow your surgeon's guidance for each activity.",
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
