import type { Localized } from "../lib/language";
import { media } from "./media";

export type Procedure = Readonly<{
  slug: string;
  name: Localized;
  category: "body" | "breast" | "face";
  image: string;
  description: Localized;
  points: readonly Localized[];
  details: readonly Readonly<{ title: Localized; body: Localized }>[];
  source: string;
}>;

// Original AVA copy. Medical descriptions checked against the linked ASPS pages.
export const procedures: readonly Procedure[] = [
  {
    slug: "bbl",
    name: {
      es: "Brazilian Butt Lift",
      en: "Brazilian Butt Lift",
    },
    category: "body",
    image: media.procedures.bbl,
    description: {
      es: "Aumento del volumen de los glúteos con grasa extraída por liposucción.",
      en: "Buttock augmentation using fat removed by liposuction.",
    },
    points: [
      {
        es: "Grasa propia",
        en: "Your own fat",
      },
      {
        es: "Liposucción de zonas donantes",
        en: "Donor-area liposuction",
      },
      {
        es: "Volumen y contorno de glúteos",
        en: "Buttock volume and contour",
      },
    ],
    details: [
      {
        title: {
          es: "En qué consiste",
          en: "How it works",
        },
        body: {
          es: "El BBL combina liposucción y transferencia de grasa. La grasa se obtiene de otras zonas del cuerpo y se utiliza para modificar el volumen de los glúteos.",
          en: "A BBL combines liposuction and fat transfer. Fat is taken from other areas of the body and used to change buttock volume.",
        },
      },
      {
        title: {
          es: "Evaluación",
          en: "Assessment",
        },
        body: {
          es: "Se valoran la grasa disponible, las proporciones corporales, los antecedentes médicos y los riesgos específicos de la transferencia glútea.",
          en: "Assessment considers available donor fat, body proportions, medical history and the specific risks of gluteal fat transfer.",
        },
      },
      {
        title: {
          es: "Recuperación",
          en: "Recovery",
        },
        body: {
          es: "El cirujano indica cómo limitar la presión sobre los glúteos, usar las prendas prescritas y retomar las actividades.",
          en: "Your surgeon explains pressure restrictions, prescribed garments and the return to activity.",
        },
      },
    ],
    source:
      "https://www.plasticsurgery.org/cosmetic-procedures/buttock-enhancement",
  },
  {
    slug: "liposuccion",
    name: {
      es: "Liposucción",
      en: "Liposuction",
    },
    category: "body",
    image: media.procedures.liposuccion,
    description: {
      es: "Retirada de grasa localizada del abdomen, cintura, espalda u otras zonas.",
      en: "Removal of localized fat from the abdomen, waist, back or other areas.",
    },
    points: [
      {
        es: "Grasa localizada",
        en: "Localized fat",
      },
      {
        es: "Contorno corporal",
        en: "Body contour",
      },
      {
        es: "Elasticidad de la piel",
        en: "Skin elasticity",
      },
    ],
    details: [
      {
        title: {
          es: "En qué consiste",
          en: "How it works",
        },
        body: {
          es: "La liposucción extrae grasa de zonas concretas mediante cánulas. No es un tratamiento para la obesidad ni elimina el exceso de piel.",
          en: "Liposuction removes fat from specific areas through cannulas. It is not an obesity treatment and does not remove excess skin.",
        },
      },
      {
        title: {
          es: "Zonas de tratamiento",
          en: "Treatment areas",
        },
        body: {
          es: "Puede tratar abdomen, cintura, espalda, muslos y brazos. La selección depende de la distribución de grasa y la calidad de la piel.",
          en: "Areas may include the abdomen, waist, back, thighs and arms. Selection depends on fat distribution and skin quality.",
        },
      },
      {
        title: {
          es: "Recuperación",
          en: "Recovery",
        },
        body: {
          es: "La inflamación y los moretones forman parte de la recuperación. Las prendas de compresión y la actividad se ajustan al procedimiento.",
          en: "Swelling and bruising are part of recovery. Compression garments and activity guidance depend on the procedure.",
        },
      },
    ],
    source: "https://www.plasticsurgery.org/cosmetic-procedures/liposuction",
  },
  {
    slug: "abdominoplastia",
    name: {
      es: "Abdominoplastia",
      en: "Tummy Tuck",
    },
    category: "body",
    image: media.procedures.abdominoplastia,
    description: {
      es: "Retirada de piel sobrante del abdomen y reparación muscular cuando está indicada.",
      en: "Removal of excess abdominal skin, with muscle repair when indicated.",
    },
    points: [
      {
        es: "Piel abdominal sobrante",
        en: "Excess abdominal skin",
      },
      {
        es: "Pared muscular",
        en: "Abdominal muscles",
      },
      {
        es: "Cicatriz abdominal",
        en: "Abdominal scar",
      },
    ],
    details: [
      {
        title: {
          es: "En qué consiste",
          en: "How it works",
        },
        body: {
          es: "La abdominoplastia retira piel y grasa del abdomen. Puede incluir la reparación de músculos debilitados o separados.",
          en: "A tummy tuck removes abdominal skin and fat. It may include repair of weakened or separated muscles.",
        },
      },
      {
        title: {
          es: "Diferencia con la liposucción",
          en: "Difference from liposuction",
        },
        body: {
          es: "La liposucción trata grasa localizada. La abdominoplastia también aborda piel sobrante y la pared abdominal.",
          en: "Liposuction treats localized fat. A tummy tuck also addresses excess skin and the abdominal wall.",
        },
      },
      {
        title: {
          es: "Antes de operarte",
          en: "Before surgery",
        },
        body: {
          es: "Los cambios importantes de peso y futuros embarazos pueden modificar el resultado. Deben considerarse antes de planificar la cirugía.",
          en: "Major weight changes and future pregnancies can affect the result and should be considered before planning surgery.",
        },
      },
    ],
    source: "https://www.plasticsurgery.org/cosmetic-procedures/tummy-tuck",
  },
  {
    slug: "aumento-de-pecho",
    name: {
      es: "Aumento de pecho",
      en: "Breast Augmentation",
    },
    category: "breast",
    image: media.procedures["aumento-de-pecho"],
    description: {
      es: "Aumento del volumen del pecho mediante implantes o, en casos seleccionados, grasa propia.",
      en: "Increased breast volume using implants or, in selected cases, your own fat.",
    },
    points: [
      {
        es: "Tamaño y perfil",
        en: "Size and profile",
      },
      {
        es: "Implantes o grasa propia",
        en: "Implants or fat transfer",
      },
      {
        es: "Forma y simetría",
        en: "Shape and symmetry",
      },
    ],
    details: [
      {
        title: {
          es: "En qué consiste",
          en: "How it works",
        },
        body: {
          es: "El aumento mamario modifica el volumen del pecho. La técnica puede utilizar implantes o transferencia de grasa, según la anatomía y el objetivo.",
          en: "Breast augmentation changes breast volume using implants or fat transfer, depending on anatomy and the intended change.",
        },
      },
      {
        title: {
          es: "Elección del implante",
          en: "Implant selection",
        },
        body: {
          es: "Se valoran el ancho del pecho, el tejido disponible, el tamaño y la posición del implante.",
          en: "Assessment considers breast width, available tissue, implant size and implant position.",
        },
      },
      {
        title: {
          es: "Aumento y levantamiento",
          en: "Augmentation and lift",
        },
        body: {
          es: "El aumento no sustituye siempre a un levantamiento. Si existe caída del pecho, puede ser necesario valorar ambos procedimientos.",
          en: "Augmentation does not always replace a lift. Breast sagging may require assessment for both procedures.",
        },
      },
    ],
    source:
      "https://www.plasticsurgery.org/cosmetic-procedures/breast-augmentation",
  },
  {
    slug: "mommy-makeover",
    name: {
      es: "Mommy Makeover",
      en: "Mommy Makeover",
    },
    category: "body",
    image: media.procedures["mommy-makeover"],
    description: {
      es: "Combinación de cirugía de pecho y abdomen para tratar cambios después del embarazo.",
      en: "A combination of breast and abdominal surgery addressing changes after pregnancy.",
    },
    points: [
      {
        es: "Pecho y abdomen",
        en: "Breasts and abdomen",
      },
      {
        es: "Procedimientos combinados",
        en: "Combined procedures",
      },
      {
        es: "Una intervención o etapas",
        en: "One operation or stages",
      },
    ],
    details: [
      {
        title: {
          es: "En qué consiste",
          en: "How it works",
        },
        body: {
          es: "Mommy Makeover describe una combinación de procedimientos; no una técnica única. Puede incluir abdominoplastia, cirugía de pecho y liposucción.",
          en: "Mommy Makeover describes a combination of procedures rather than one technique. It may include a tummy tuck, breast surgery and liposuction.",
        },
      },
      {
        title: {
          es: "Qué se evalúa",
          en: "What is assessed",
        },
        body: {
          es: "La elección depende de los cambios en la piel, el abdomen y el pecho, además de los antecedentes y planes de embarazo.",
          en: "Selection depends on skin, abdominal and breast changes, as well as medical history and pregnancy plans.",
        },
      },
      {
        title: {
          es: "Cirugía combinada",
          en: "Combined surgery",
        },
        body: {
          es: "La valoración médica determina qué intervenciones pueden realizarse juntas y cuándo conviene separarlas. La recuperación depende de la combinación.",
          en: "Medical assessment determines which procedures can be combined and when staging is preferable. Recovery depends on the combination.",
        },
      },
    ],
    source: "https://www.plasticsurgery.org/cosmetic-procedures/mommy-makeover",
  },
  {
    slug: "levantamiento-de-pecho",
    name: {
      es: "Levantamiento de pecho",
      en: "Breast Lift",
    },
    category: "breast",
    image: media.procedures["levantamiento-de-pecho"],
    description: {
      es: "Elevación del pecho mediante la retirada de piel sobrante y la remodelación del tejido.",
      en: "Breast elevation through excess-skin removal and tissue reshaping.",
    },
    points: [
      {
        es: "Posición del pecho",
        en: "Breast position",
      },
      {
        es: "Piel sobrante",
        en: "Excess skin",
      },
      {
        es: "Forma de la areola",
        en: "Areola shape",
      },
    ],
    details: [
      {
        title: {
          es: "En qué consiste",
          en: "How it works",
        },
        body: {
          es: "La mastopexia eleva y remodela el pecho retirando piel y ajustando el tejido de soporte.",
          en: "Mastopexy lifts and reshapes the breast by removing skin and tightening supporting tissue.",
        },
      },
      {
        title: {
          es: "Forma y volumen",
          en: "Shape and volume",
        },
        body: {
          es: "El levantamiento cambia la posición del pecho. El aumento de volumen se valora por separado.",
          en: "A lift changes breast position. Increasing volume is assessed separately.",
        },
      },
      {
        title: {
          es: "Areola",
          en: "Areola",
        },
        body: {
          es: "La intervención también puede reducir una areola ensanchada. La técnica determina las incisiones necesarias.",
          en: "The procedure can also reduce an enlarged areola. The technique determines the required incisions.",
        },
      },
    ],
    source: "https://www.plasticsurgery.org/cosmetic-procedures/breast-lift",
  },
  {
    slug: "reduccion-de-pecho",
    name: {
      es: "Reducción de pecho",
      en: "Breast Reduction",
    },
    category: "breast",
    image: media.procedures["reduccion-de-pecho"],
    description: {
      es: "Reducción del tamaño del pecho mediante la retirada de piel y tejido mamario.",
      en: "Reduction of breast size through removal of skin and breast tissue.",
    },
    points: [
      {
        es: "Tamaño del pecho",
        en: "Breast size",
      },
      {
        es: "Peso y molestias",
        en: "Weight and discomfort",
      },
      {
        es: "Remodelación del tejido",
        en: "Tissue reshaping",
      },
    ],
    details: [
      {
        title: {
          es: "En qué consiste",
          en: "How it works",
        },
        body: {
          es: "La mamoplastia de reducción retira piel y tejido, remodela el pecho y modifica su posición.",
          en: "Reduction mammaplasty removes skin and tissue, reshapes the breast and changes its position.",
        },
      },
      {
        title: {
          es: "Motivos de consulta",
          en: "Reasons for consultation",
        },
        body: {
          es: "El tamaño puede asociarse a molestias en espalda, cuello y hombros o dificultar la actividad física.",
          en: "Breast size may be associated with back, neck and shoulder discomfort or difficulty exercising.",
        },
      },
      {
        title: {
          es: "Evaluación",
          en: "Assessment",
        },
        body: {
          es: "Se revisan las molestias, la proporción corporal y los antecedentes antes de determinar cuánto tejido retirar.",
          en: "Discomfort, body proportions and medical history are reviewed before deciding how much tissue to remove.",
        },
      },
    ],
    source:
      "https://www.plasticsurgery.org/reconstructive-procedures/breast-reduction",
  },
  {
    slug: "rinoplastia",
    name: {
      es: "Rinoplastia",
      en: "Rhinoplasty",
    },
    category: "face",
    image: media.procedures.rinoplastia,
    description: {
      es: "Cirugía para modificar la forma y las proporciones de la nariz.",
      en: "Surgery to change the shape and proportions of the nose.",
    },
    points: [
      {
        es: "Proporción nasal",
        en: "Nasal proportions",
      },
      {
        es: "Dorso y punta",
        en: "Bridge and tip",
      },
      {
        es: "Función respiratoria",
        en: "Breathing function",
      },
    ],
    details: [
      {
        title: {
          es: "En qué consiste",
          en: "How it works",
        },
        body: {
          es: "La rinoplastia modifica estructuras de la nariz para cambiar su forma o proporción.",
          en: "Rhinoplasty changes nasal structures to alter shape or proportions.",
        },
      },
      {
        title: {
          es: "Forma y respiración",
          en: "Shape and breathing",
        },
        body: {
          es: "También puede abordar dificultades respiratorias causadas por problemas estructurales. La función se evalúa junto con la forma.",
          en: "It can also address breathing difficulties caused by structural problems. Function is assessed alongside appearance.",
        },
      },
      {
        title: {
          es: "Qué se evalúa",
          en: "What is assessed",
        },
        body: {
          es: "Se revisan el dorso, la punta, el tamaño y la relación de la nariz con el resto del rostro.",
          en: "Assessment covers the bridge, tip, size and the relationship between the nose and other facial features.",
        },
      },
    ],
    source: "https://www.plasticsurgery.org/cosmetic-procedures/rhinoplasty",
  },
  {
    slug: "lifting-facial",
    name: {
      es: "Lifting facial",
      en: "Facelift",
    },
    category: "face",
    image: media.procedures["lifting-facial"],
    description: {
      es: "Cirugía para tratar la flacidez del rostro y el cuello.",
      en: "Surgery addressing sagging in the face and neck.",
    },
    points: [
      {
        es: "Flacidez facial",
        en: "Facial sagging",
      },
      {
        es: "Línea de la mandíbula",
        en: "Jawline",
      },
      {
        es: "Rostro y cuello",
        en: "Face and neck",
      },
    ],
    details: [
      {
        title: {
          es: "En qué consiste",
          en: "How it works",
        },
        body: {
          es: "La ritidectomía trata signos de envejecimiento del rostro y el cuello mediante cirugía.",
          en: "Rhytidectomy surgically addresses signs of aging in the face and neck.",
        },
      },
      {
        title: {
          es: "Zonas de tratamiento",
          en: "Treatment areas",
        },
        body: {
          es: "Puede abordar mejillas caídas, pérdida de definición mandibular y piel sobrante en el cuello.",
          en: "It may address sagging cheeks, reduced jawline definition and excess neck skin.",
        },
      },
      {
        title: {
          es: "Cambios del rostro",
          en: "Facial changes",
        },
        body: {
          es: "La valoración distingue entre flacidez, desplazamiento de grasa y cambios en los pliegues faciales.",
          en: "Assessment distinguishes sagging, changes in fat position and changes in facial folds.",
        },
      },
    ],
    source: "https://www.plasticsurgery.org/cosmetic-procedures/facelift",
  },
];

export const categoryLabels = {
  body: { es: "Cuerpo", en: "Body" },
  breast: { es: "Pecho", en: "Breast" },
  face: { es: "Rostro", en: "Face" },
} satisfies Record<Procedure["category"], Localized>;
