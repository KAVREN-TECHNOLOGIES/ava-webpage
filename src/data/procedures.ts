import type { Localized } from "../lib/language";
import { media } from "./media";

export type Procedure = Readonly<{
  slug: string;
  name: Localized;
  category: "body" | "breast" | "face";
  image: string;
  description: Localized;
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
      es: "Transferencia de grasa propia para aumentar el volumen de los glúteos.",
      en: "Fat transfer to increase buttock volume.",
    },
    details: [
      {
        title: { es: "En qué consiste", en: "How it works" },
        body: {
          es: "El Brazilian Butt Lift utiliza tu propia grasa para dar más volumen y forma a los glúteos. Combina la liposucción de zonas como el abdomen, la cintura o la espalda con la transferencia de esa grasa a los glúteos. Si buscas curvas más marcadas, permite trabajar tanto la zona que aporta grasa como la que recibe volumen.",
          en: "A Brazilian Butt Lift uses your own fat to add buttock volume and shape. It combines liposuction of areas such as the abdomen, waist or back with transfer of that fat to the buttocks. If you want more defined curves, it allows both the donor area and the area receiving volume to be reshaped.",
        },
      },
      {
        title: { es: "Beneficios que puedes valorar", en: "Benefits to consider" },
        body: {
          es: "Puede aportar mayor proyección, mejorar el contorno de los glúteos y crear una transición más definida entre cintura y caderas. La liposucción también reduce depósitos de grasa en las zonas donantes. El volumen se adapta a tu anatomía y a la grasa disponible, para buscar una proporción que encaje con el cambio que deseas.",
          en: "A BBL can increase projection, improve buttock contours and create a more defined transition between the waist and hips. Liposuction also reduces fat deposits in donor areas. The amount transferred is planned around your anatomy and available fat, with proportions that suit the change you want.",
        },
      },
      {
        title: { es: "Cómo se realiza", en: "How the procedure is performed" },
        body: {
          es: "Primero se marcan las zonas de liposucción y de transferencia. Con la anestesia acordada, se extrae grasa mediante cánulas, se procesa y se coloca en el tejido subcutáneo de los glúteos, por encima del músculo. La guía ecográfica permite comprobar la posición de la cánula durante la inyección. El plan determina qué zonas tratar y cuánto volumen es adecuado transferir.",
          en: "The liposuction and transfer areas are marked first. Under the agreed anesthesia, fat is removed through cannulas, processed and placed in the subcutaneous tissue of the buttocks, above the muscle. Ultrasound guidance allows the cannula position to be checked during injection. The plan determines which areas to treat and how much fat can appropriately be transferred.",
        },
      },
      {
        title: { es: "¿Puede encajar contigo?", en: "Could it be right for you?" },
        body: {
          es: "Se valora cuando deseas aumentar o definir los glúteos y tienes suficiente grasa donante. La consulta revisa tu salud, la calidad de la piel, el peso y las proporciones corporales. Si predomina la piel sobrante o hay poca grasa disponible, conviene estudiar otras opciones antes de decidir.",
          en: "It may be considered if you want fuller or more defined buttocks and have enough donor fat. Consultation reviews your health, skin quality, weight and body proportions. If excess skin is the main concern or little donor fat is available, other options should be assessed before deciding.",
        },
      },
      {
        title: { es: "Recuperación", en: "Recovery" },
        body: {
          es: "Organiza ayuda en casa y adapta cómo vas a sentarte y dormir. Durante la fase inicial tendrás que limitar la presión directa sobre los glúteos y seguir las indicaciones sobre la prenda de compresión. Es habitual que haya inflamación y moretones en las zonas tratadas. El cirujano pautará las revisiones y el regreso al trabajo, los viajes y el ejercicio.",
          en: "Arrange help at home and plan how you will sit and sleep. Early recovery involves limiting direct pressure on the buttocks and following compression-garment instructions. Swelling and bruising in treated areas are common. Your surgeon will set follow-up visits and guide your return to work, travel and exercise.",
        },
      },
      {
        title: { es: "Cómo evoluciona el resultado", en: "How results develop" },
        body: {
          es: "El volumen de los primeros días incluye inflamación. Parte de la grasa transferida se reabsorbe y el contorno se define durante los meses siguientes. Mantener un peso estable ayuda a conservar las proporciones, aunque los cambios de peso y el envejecimiento pueden modificarlas. La cantidad de grasa que permanece varía de una persona a otra.",
          en: "The initial volume includes swelling. Some transferred fat is reabsorbed, and contours develop over the following months. A stable weight helps maintain proportions, although weight changes and aging can affect them. The amount of fat that remains varies from person to person.",
        },
      },
      {
        title: { es: "Seguridad y límites", en: "Safety and limitations" },
        body: {
          es: "El BBL añade volumen, pero no elimina piel sobrante. Tiene riesgos importantes, incluida la embolia grasa, que puede ser mortal, además de infección, asimetría o pérdida de grasa transferida. Antes de decidir, pregunta por la técnica, la guía ecográfica, las credenciales del cirujano y el seguimiento. La consulta debe explicar qué cambio es viable en tu caso.",
          en: "A BBL adds volume but does not remove excess skin. It carries important risks, including potentially fatal fat embolism, infection, asymmetry and loss of transferred fat. Before deciding, discuss technique, ultrasound guidance, your surgeon's credentials and follow-up care. The consultation should explain what change is achievable in your case.",
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
      es: "Extracción de grasa localizada para modificar el contorno corporal.",
      en: "Removal of localized fat to reshape body contours.",
    },
    details: [
      {
        title: { es: "En qué consiste", en: "How it works" },
        body: {
          es: "La liposucción permite reducir depósitos de grasa localizada que siguen marcando el abdomen, la cintura, la espalda, los muslos o los brazos. Mediante cánulas se extrae grasa de las zonas elegidas para modificar el contorno. Si tu objetivo es definir una zona concreta, la consulta ayuda a distinguir cuánto depende de la grasa y cuánto de la piel.",
          en: "Liposuction reduces localized fat deposits that affect the contours of the abdomen, waist, back, thighs or arms. Fat is removed through cannulas to reshape selected areas. If you want a more defined contour, consultation helps distinguish how much of the concern comes from fat and how much comes from the skin.",
        },
      },
      {
        title: { es: "Beneficios para el contorno", en: "Benefits for your contours" },
        body: {
          es: "Puede definir la cintura, reducir volumen en zonas específicas y mejorar la proporción entre áreas del cuerpo. Tratar varias zonas permite planificar las transiciones entre abdomen, costados y espalda. El objetivo es ajustar la silueta a tu anatomía; una buena elasticidad de la piel favorece que se adapte al nuevo contorno.",
          en: "It can define the waist, reduce volume in specific areas and improve proportions between parts of the body. Treating several areas allows transitions between the abdomen, flanks and back to be planned together. The aim is to reshape your silhouette around your anatomy; good skin elasticity helps it adapt to the new contour.",
        },
      },
      {
        title: { es: "Cómo se realiza", en: "How the procedure is performed" },
        body: {
          es: "El cirujano marca las zonas que se van a tratar y acuerda contigo el alcance de la intervención. Con la anestesia indicada, introduce cánulas a través de pequeñas incisiones para movilizar y aspirar la grasa. La técnica y el volumen de extracción dependen de tu salud y de las áreas seleccionadas. Después se indican los cuidados de las incisiones y la compresión.",
          en: "Your surgeon marks the treatment areas and discusses the extent of surgery with you. Under the appropriate anesthesia, cannulas are introduced through small incisions to loosen and suction fat. The technique and amount removed depend on your health and the selected areas. Incision care and compression instructions follow.",
        },
      },
      {
        title: { es: "Qué se valora en la consulta", en: "What your consultation assesses" },
        body: {
          es: "Suele valorarse en personas con peso estable y grasa localizada que desean mejorar una zona concreta. Se revisan la elasticidad de la piel, las cirugías previas y los antecedentes médicos. Si existe piel sobrante importante en el abdomen, puede tener más sentido considerar una abdominoplastia o combinar procedimientos.",
          en: "It is often considered by people at a stable weight who want to reshape a specific area with localized fat. Skin elasticity, previous surgery and medical history are reviewed. Significant excess abdominal skin may make a tummy tuck or a combination of procedures more appropriate.",
        },
      },
      {
        title: { es: "Recuperación", en: "Recovery" },
        body: {
          es: "Durante las primeras semanas puede haber inflamación, moretones y sensibilidad. La prenda de compresión ayuda a dar soporte a las zonas tratadas mientras cicatrizan. La vuelta al trabajo depende de la extensión de la cirugía y del esfuerzo que requiera tu actividad. El ejercicio se retoma de forma gradual, según las indicaciones del cirujano.",
          en: "Swelling, bruising and tenderness can occur during the first weeks. A compression garment supports the treated areas as they heal. Returning to work depends on the extent of surgery and the physical demands of your job. Exercise is resumed gradually according to your surgeon's instructions.",
        },
      },
      {
        title: { es: "Cuándo apreciarás el cambio", en: "When you will see the change" },
        body: {
          es: "El contorno se aprecia mejor a medida que baja la inflamación, que puede tardar meses en resolverse. Mantener un peso estable ayuda a conservar el resultado, porque las células grasas que permanecen pueden aumentar de tamaño. Las revisiones permiten valorar la evolución antes de juzgar la forma definitiva.",
          en: "Contours become clearer as swelling settles, which can take months. Maintaining a stable weight helps preserve the result because remaining fat cells can enlarge. Follow-up visits allow healing to be assessed before judging the final shape.",
        },
      },
      {
        title: { es: "Lo que conviene tener claro", en: "What to keep in mind" },
        body: {
          es: "La liposucción no es un tratamiento para la obesidad ni sustituye la pérdida de peso. Tampoco corrige por sí sola la celulitis o el exceso de piel. Entre los riesgos están las irregularidades del contorno, la acumulación de líquido, la infección y los cambios de sensibilidad. En consulta puedes valorar si sus beneficios responden a lo que buscas.",
          en: "Liposuction is not an obesity treatment or a substitute for weight loss. It does not, by itself, correct cellulite or excess skin. Risks include contour irregularities, fluid accumulation, infection and changes in sensation. Consultation lets you assess whether its potential benefits match what you want to change.",
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
      es: "Cirugía para retirar el exceso de piel y grasa del abdomen.",
      en: "Surgery to remove excess abdominal skin and fat.",
    },
    details: [
      {
        title: { es: "En qué consiste", en: "How it works" },
        body: {
          es: "La abdominoplastia trata la piel sobrante y la flacidez del abdomen que pueden aparecer después del embarazo o de cambios importantes de peso. Retira piel y grasa y, cuando está indicado, repara la separación de los músculos abdominales. Puede ser una opción si buscas un abdomen más firme y el problema principal no es solo la grasa localizada.",
          en: "A tummy tuck addresses excess abdominal skin and laxity that can follow pregnancy or major weight changes. It removes skin and fat and, when appropriate, repairs separation of the abdominal muscles. It may be an option if you want a firmer abdomen and localized fat is not the only concern.",
        },
      },
      {
        title: { es: "Beneficios para el abdomen", en: "Benefits for your abdomen" },
        body: {
          es: "Puede reducir los pliegues de piel, mejorar el perfil abdominal y dar mayor definición al contorno de la cintura. Cuando existe separación muscular, su reparación permite abordar también la pared abdominal. Algunas estrías pueden desaparecer si están en la piel que se retira; las situadas fuera de esa zona permanecen.",
          en: "It can reduce folds of skin, improve the abdominal profile and give the waist a more defined contour. Where muscle separation is present, repair also addresses the abdominal wall. Some stretch marks may be removed with the excised skin; those outside that area remain.",
        },
      },
      {
        title: { es: "Cómo se realiza", en: "How the procedure is performed" },
        body: {
          es: "En una abdominoplastia completa se realiza una incisión en la parte baja del abdomen y puede ser necesaria otra alrededor del ombligo. Se retira el exceso de piel, se trata la pared muscular si corresponde y se ajusta la piel restante. La longitud de la cicatriz depende del exceso de piel. La liposucción puede valorarse para zonas de grasa adyacentes.",
          en: "A full tummy tuck uses an incision across the lower abdomen and may require another around the navel. Excess skin is removed, the abdominal muscles are addressed where appropriate and the remaining skin is repositioned. Scar length depends on the amount of excess skin. Liposuction may be considered for adjacent fat deposits.",
        },
      },
      {
        title: { es: "Cuándo puede encajar contigo", en: "When it may suit you" },
        body: {
          es: "Se valora cuando tienes piel abdominal sobrante, un peso estable y un estado de salud compatible con la cirugía. Si planeas perder bastante peso o tener futuros embarazos, coméntalo antes de elegir la fecha: ambos pueden modificar el resultado. La exploración permite distinguir qué parte del cambio requiere retirar piel, tratar grasa o reparar músculos.",
          en: "It may be considered if you have excess abdominal skin, a stable weight and health that allows surgery. Discuss plans for substantial weight loss or future pregnancy before choosing a date, as both can affect the result. Examination distinguishes whether the concern calls for skin removal, fat treatment or muscle repair.",
        },
      },
      {
        title: { es: "Recuperación", en: "Recovery" },
        body: {
          es: "Necesitarás organizar ayuda en casa y limitar esfuerzos mientras cicatriza el abdomen. Puede indicarse una prenda de compresión y, en algunos casos, drenajes temporales para evacuar líquido. Recibirás instrucciones para cuidar las incisiones y retomar la actividad. La vuelta a cargar peso, hacer ejercicio y trabajar se decide según la extensión de la cirugía y tu evolución.",
          en: "Arrange help at home and limit strain while your abdomen heals. A compression garment and, in some cases, temporary drains may be used. You will receive incision-care and activity instructions. Returning to lifting, exercise and work depends on the extent of surgery and your recovery.",
        },
      },
      {
        title: { es: "Resultado y mantenimiento", en: "Results and maintenance" },
        body: {
          es: "El abdomen se define conforme disminuye la inflamación. La cicatriz también cambia de aspecto con el tiempo, aunque no desaparece. Mantener un peso estable ayuda a conservar el contorno. La valoración previa permite acordar dónde quedará la incisión y qué cambios pueden esperarse tanto con ropa como sin ella.",
          en: "The abdominal shape becomes clearer as swelling subsides. The scar changes over time but does not disappear. Maintaining a stable weight helps preserve the contour. Before surgery, discuss incision placement and the changes you can reasonably expect both in and out of clothing.",
        },
      },
      {
        title: { es: "Cicatrices, límites y riesgos", en: "Scars, limitations and risks" },
        body: {
          es: "Esta cirugía no sustituye la pérdida de peso ni elimina todas las estrías. Deja una cicatriz permanente y puede producir acumulación de líquido, infección, alteraciones de sensibilidad o problemas de cicatrización, además de riesgos relacionados con la anestesia y los coágulos. La consulta debe ayudarte a sopesar ese compromiso frente al cambio abdominal que deseas.",
          en: "This operation does not replace weight loss or remove all stretch marks. It leaves a permanent scar. Risks include fluid accumulation, infection, altered sensation and healing problems, as well as anesthesia-related risks and blood clots. Consultation should help you weigh that trade-off against the abdominal change you want.",
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
      es: "Aumento del volumen del pecho con implantes o grasa propia.",
      en: "Increased breast volume using implants or fat transfer.",
    },
    details: [
      {
        title: { es: "En qué consiste", en: "How it works" },
        body: {
          es: "El aumento de pecho permite añadir volumen, recuperar la plenitud perdida tras un embarazo o cambios de peso y tratar ciertas diferencias de tamaño. Puede realizarse con implantes o, en casos seleccionados, con grasa propia. La consulta empieza por el cambio que buscas: más volumen, mayor proyección o una proporción distinta con el resto de tu cuerpo.",
          en: "Breast augmentation adds volume, restores fullness lost after pregnancy or weight changes and can address some differences in size. It can use implants or, in selected cases, your own fat. Consultation starts with the change you want: greater fullness, more projection or different proportions in relation to your body.",
        },
      },
      {
        title: { es: "Beneficios que puedes buscar", en: "Benefits you may be looking for" },
        body: {
          es: "Puede aportar más plenitud al pecho, mejorar el equilibrio entre ambos lados y ajustar la relación entre pecho y caderas. El tamaño, la base y el perfil del implante permiten plantear cambios diferentes. No se trata de elegir una talla aislada: las medidas de tu tórax y el tejido disponible ayudan a definir una opción proporcionada.",
          en: "It can add breast fullness, improve balance between the two sides and adjust breast-to-hip proportions. Implant size, width and profile allow different changes to be planned. The choice goes beyond a cup size: chest measurements and available tissue help determine a proportionate option.",
        },
      },
      {
        title: { es: "Cómo se realiza", en: "How the procedure is performed" },
        body: {
          es: "Con la anestesia acordada, el implante se introduce por una incisión que puede situarse en el surco bajo el pecho, alrededor de la areola o en la axila. Su colocación respecto al músculo se decide según tu anatomía. En la transferencia de grasa, primero se obtiene grasa por liposucción y después se prepara e infiltra en el pecho.",
          en: "Under the agreed anesthesia, an implant is inserted through an incision that may be placed in the breast crease, around the areola or in the armpit. Placement in relation to the muscle is chosen for your anatomy. With fat transfer, fat is first harvested by liposuction, then processed and injected into the breasts.",
        },
      },
      {
        title: { es: "Aumento o levantamiento", en: "Augmentation or a lift" },
        body: {
          es: "Si lo que te preocupa es la pérdida de volumen, se valora el aumento. Si hay caída del pecho o el pezón está en una posición baja, puede ser necesario un levantamiento, solo o combinado con el aumento. La consulta permite separar ambos objetivos para evitar esperar de un implante un cambio de posición que no puede conseguir por sí solo.",
          en: "Loss of volume may be addressed with augmentation. Sagging or a low nipple position may call for a breast lift, either alone or alongside augmentation. Consultation separates these goals so you do not expect an implant to provide a change in position it cannot achieve on its own.",
        },
      },
      {
        title: { es: "Recuperación", en: "Recovery" },
        body: {
          es: "Al principio puede haber presión, sensibilidad e inflamación. Se suele indicar un sujetador de soporte y limitar los esfuerzos durante la cicatrización. El cirujano te explicará cómo cuidar las incisiones y cuándo retomar el trabajo, conducir y hacer ejercicio. La forma inicial irá cambiando mientras baja la inflamación y los tejidos se adaptan.",
          en: "Pressure, tenderness and swelling can occur at first. A support bra and limits on exertion are commonly advised during healing. Your surgeon will explain incision care and when to return to work, driving and exercise. The initial shape changes as swelling subsides and tissues settle.",
        },
      },
      {
        title: { es: "Resultados y seguimiento", en: "Results and follow-up" },
        body: {
          es: "El volumen cambia desde la cirugía, pero la forma se valora mejor después de que se asienten los tejidos. Los implantes requieren seguimiento y no son dispositivos para toda la vida: puede ser necesario retirarlos o reemplazarlos. Si eliges grasa propia, parte se reabsorbe. Los cambios de peso, los embarazos y el envejecimiento también influyen.",
          en: "Volume changes at surgery, but shape is better assessed once tissues settle. Implants need follow-up and are not lifetime devices; removal or replacement may be necessary. With fat transfer, some fat is reabsorbed. Weight changes, pregnancy and aging also affect the breasts.",
        },
      },
      {
        title: { es: "Qué debes conocer antes de decidir", en: "What to know before deciding" },
        body: {
          es: "Además de cicatrices, infección o cambios de sensibilidad, los implantes pueden presentar rotura o endurecimiento del tejido que los rodea, llamado contractura capsular. También existen riesgos poco frecuentes específicos de los implantes que deben revisarse con el cirujano. Pide la información del dispositivo y un plan de seguimiento antes de elegir.",
          en: "Alongside scarring, infection and changes in sensation, implants can rupture or develop tight surrounding scar tissue, called capsular contracture. There are also uncommon implant-specific risks to discuss with your surgeon. Ask for the device's patient information and a follow-up plan before choosing.",
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
      es: "Cirugías de pecho y abdomen para tratar cambios después del embarazo.",
      en: "Breast and abdominal surgery addressing changes after pregnancy.",
    },
    details: [
      {
        title: { es: "En qué consiste", en: "How it works" },
        body: {
          es: "Un Mommy Makeover reúne procedimientos para tratar cambios del pecho y el abdomen después del embarazo. Puede combinar abdominoplastia, liposucción, aumento, levantamiento o reducción de pecho. El plan se construye según las zonas que quieres cambiar: no todas las personas necesitan la misma combinación ni todas las intervenciones tienen que hacerse en una sola operación.",
          en: "A Mommy Makeover brings together procedures for breast and abdominal changes after pregnancy. It may combine a tummy tuck, liposuction, breast augmentation, a lift or a reduction. The plan is built around the areas you want to change; the same combination is not right for everyone, and procedures need not all take place in one operation.",
        },
      },
      {
        title: { es: "Beneficios de un plan combinado", en: "Benefits of a combined plan" },
        body: {
          es: "Permite valorar el pecho, el abdomen y la cintura como un conjunto. Puedes abordar piel abdominal sobrante, pérdida de volumen o caída del pecho y grasa localizada dentro de un mismo plan. Cuando es adecuado combinar cirugías, se coordinan su planificación y recuperación; si conviene dividirlas, el objetivo estético se mantiene a través de las etapas.",
          en: "It allows the breasts, abdomen and waist to be considered together. Excess abdominal skin, lost breast volume or sagging and localized fat can be addressed within one plan. When combining surgery is appropriate, planning and recovery can be coordinated. If separate operations are preferable, the overall aesthetic goal guides each stage.",
        },
      },
      {
        title: { es: "Cómo se elige la combinación", en: "How the combination is chosen" },
        body: {
          es: "La exploración distingue los cambios de piel, grasa, músculos y tejido mamario. A partir de ahí se seleccionan las técnicas y se decide si pueden realizarse juntas. Se tienen en cuenta la duración de la operación, los antecedentes, la anestesia y la ayuda que necesitarás después. Cada intervención conserva sus propias incisiones, cuidados y riesgos.",
          en: "Examination distinguishes changes in skin, fat, abdominal muscles and breast tissue. Techniques are then selected and their suitability for one operation assessed. Operation length, medical history, anesthesia and support at home all matter. Each procedure retains its own incisions, aftercare needs and risks.",
        },
      },
      {
        title: { es: "Elegir el momento", en: "Choosing the timing" },
        body: {
          es: "Conviene hablar de futuros embarazos, lactancia, estabilidad del peso y recuperación tras el parto antes de planificar la cirugía. También es importante contar con apoyo para cuidar de niños y tareas de casa durante el postoperatorio. La consulta ayuda a decidir cuándo estás preparada y qué cambios tienen sentido para ti.",
          en: "Discuss future pregnancies, breastfeeding, weight stability and recovery from childbirth before planning surgery. Arrange support with childcare and household tasks during recovery. Consultation helps establish suitable timing and which changes make sense for you.",
        },
      },
      {
        title: { es: "Recuperación", en: "Recovery" },
        body: {
          es: "La recuperación depende de las cirugías incluidas. Puede requerir sujetador de soporte, prenda abdominal, cuidado de varias incisiones y drenajes temporales. Planifica tiempo sin cargar niños ni realizar esfuerzos hasta tener autorización médica. Las revisiones permiten adaptar la actividad a tu evolución; combinar procedimientos no significa que los cuidados o los riesgos se reduzcan automáticamente.",
          en: "Recovery depends on the procedures included. It may involve a support bra, abdominal compression, care of several incisions and temporary drains. Plan time without lifting children or strenuous tasks until medically cleared. Follow-up visits help tailor activity to your progress; combining procedures does not automatically reduce aftercare needs or risks.",
        },
      },
      {
        title: { es: "Qué esperar del resultado", en: "What to expect from results" },
        body: {
          es: "Cada zona evoluciona a un ritmo distinto. La inflamación del abdomen y del pecho puede ocultar el contorno inicial y la forma continúa cambiando durante los meses siguientes. Un peso estable ayuda a mantener las proporciones. Las revisiones permiten valorar cómo se asientan las zonas tratadas y cuándo retomar tus actividades.",
          en: "Different areas heal at different rates. Abdominal and breast swelling can obscure the initial contour, and shape continues to change over the following months. A stable weight helps maintain proportions. Follow-up visits assess how the treated areas are settling and when you can return to your activities.",
        },
      },
      {
        title: { es: "Decidir con un plan completo", en: "Deciding with a complete plan" },
        body: {
          es: "Antes de dar el paso, revisa qué aporta cada intervención, dónde quedarán las cicatrices y qué supone recuperarte de la combinación. Se deben explicar riesgos como infección, sangrado, problemas de cicatrización o coágulos, además de los de cada cirugía. Lleva tus prioridades a la consulta para definir una combinación que responda a ellas.",
          en: "Before proceeding, review what each procedure adds, where scars will be placed and what recovery from the combination involves. Risks such as infection, bleeding, healing problems and blood clots should be explained alongside procedure-specific risks. Bring your priorities to consultation to shape a plan around them.",
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
      es: "Elevación y remodelación del pecho mediante la retirada de piel sobrante.",
      en: "Breast lifting and reshaping through excess-skin removal.",
    },
    details: [
      {
        title: { es: "En qué consiste", en: "How it works" },
        body: {
          es: "El levantamiento de pecho, o mastopexia, busca elevar y remodelar un pecho que ha cambiado de posición por el embarazo, la lactancia, las variaciones de peso o el paso del tiempo. Se retira piel sobrante y se reorganiza el tejido. Si te gusta tu volumen pero buscas otra posición o forma, esta es una de las opciones que puedes valorar.",
          en: "A breast lift, or mastopexy, raises and reshapes breasts whose position has changed after pregnancy, breastfeeding, weight changes or aging. Excess skin is removed and breast tissue is reshaped. If you like your breast volume but want a different position or shape, it is an option to consider.",
        },
      },
      {
        title: { es: "Qué puede mejorar", en: "What it can improve" },
        body: {
          es: "Puede elevar la posición del pecho y del pezón, mejorar un contorno alargado y reducir una areola ensanchada cuando está indicado. El objetivo es una forma más recogida y una relación más equilibrada entre el tejido y la piel. La consulta permite concretar qué cambio de posición buscas sin asumir que necesitas más volumen.",
          en: "It can raise breast and nipple position, reshape an elongated contour and reduce enlarged areolas where appropriate. The aim is a more lifted shape and a better balance between breast tissue and its skin envelope. Consultation helps define the change in position you want without assuming you need more volume.",
        },
      },
      {
        title: { es: "Cómo se realiza", en: "How the procedure is performed" },
        body: {
          es: "El patrón de incisión depende de la caída, de la piel sobrante y de la posición del pezón. Puede rodear la areola, extenderse verticalmente hacia el surco o añadir una línea en el pliegue bajo el pecho. Se remodela el tejido, se recoloca el conjunto pezón-areola y se retira la piel sobrante. Las cicatrices forman parte de la intervención.",
          en: "The incision pattern depends on sagging, excess skin and nipple position. It may run around the areola, vertically to the breast crease or also along the crease beneath the breast. Tissue is reshaped, the nipple-areola complex repositioned and excess skin removed. Scars are part of the procedure.",
        },
      },
      {
        title: { es: "¿Con implantes o sin ellos?", en: "With or without implants?" },
        body: {
          es: "Un levantamiento no suele aumentar de forma importante el tamaño del pecho ni rellenar por sí solo la parte superior. Si también quieres más volumen, se puede valorar un aumento combinado. Si buscas un pecho más pequeño, la reducción puede ser más apropiada. Diferenciar tamaño y posición ayuda a elegir la cirugía que responde a tus preferencias.",
          en: "A lift does not usually produce a substantial increase in breast size or upper-breast fullness by itself. If you also want more volume, combined augmentation can be considered. A reduction may be more appropriate if you want smaller breasts. Separating size from position helps identify the operation that matches your preferences.",
        },
      },
      {
        title: { es: "Recuperación", en: "Recovery" },
        body: {
          es: "Tras la cirugía se suelen utilizar apósitos y un sujetador de soporte. Puede haber inflamación, sensibilidad y sensación de tensión. Tendrás indicaciones para cuidar las incisiones y limitar esfuerzos mientras cicatrizan. Acuerda con el cirujano cuándo volver al trabajo, conducir y retomar ejercicio de brazos o pecho según tu evolución.",
          en: "Dressings and a support bra are commonly used after surgery. Swelling, tenderness and tightness may occur. You will receive incision-care instructions and limits on exertion while healing. Discuss when to return to work, driving and upper-body exercise based on your progress.",
        },
      },
      {
        title: { es: "Evolución de la forma", en: "How the shape develops" },
        body: {
          es: "La nueva posición se aprecia pronto, pero la forma se asienta conforme baja la inflamación. Las cicatrices maduran con el tiempo y permanecen visibles en distinto grado. Los embarazos, los cambios de peso y el envejecimiento pueden modificar el pecho de nuevo. Mantener el peso estable ayuda a conservar el resultado.",
          en: "The new position is visible early, while shape settles as swelling subsides. Scars mature over time and remain visible to varying degrees. Pregnancy, weight changes and aging can change the breasts again. Keeping a stable weight helps maintain the result.",
        },
      },
      {
        title: { es: "Qué revisar antes de decidir", en: "What to review before deciding" },
        body: {
          es: "La consulta debe abordar las cicatrices, posibles diferencias entre ambos pechos, cambios de sensibilidad y riesgos de infección o cicatrización. También conviene hablar de lactancia y futuros embarazos. Si tu prioridad es elevar el pecho conservando su volumen, lleva ese objetivo a la valoración para estudiar las opciones.",
          en: "Consultation should cover scarring, possible differences between the breasts, altered sensation and infection or healing risks. Discuss breastfeeding and future pregnancy as well. If your priority is a higher breast position while keeping your volume, bring that goal to the assessment.",
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
      es: "Reducción del tamaño y el peso del pecho mediante la retirada de piel y tejido mamario.",
      en: "Reduction of breast size and weight through skin and breast tissue removal.",
    },
    details: [
      {
        title: { es: "En qué consiste", en: "How it works" },
        body: {
          es: "La reducción de pecho retira tejido mamario, grasa y piel para disminuir el tamaño y el peso del pecho. También lo remodela y ajusta la posición del pezón y la areola. Puede interesarte si el volumen dificulta hacer ejercicio o encontrar ropa cómoda, o si el peso del pecho te produce molestias en la espalda, el cuello o los hombros.",
          en: "Breast reduction removes breast tissue, fat and skin to reduce breast size and weight. It also reshapes the breasts and adjusts nipple and areola position. It may interest you if breast volume makes exercise or comfortable clothing difficult, or contributes to strain in your back, neck or shoulders.",
        },
      },
      {
        title: { es: "Más comodidad en el día a día", en: "More everyday comfort" },
        body: {
          es: "Al reducir el peso, puede aliviar molestias relacionadas con el tamaño del pecho y hacer más cómoda la actividad física. También puede disminuir la irritación bajo el pecho y las marcas de los tirantes. El cambio de forma permite buscar una proporción que encaje mejor con tu cuerpo y con la manera en que quieres moverte y vestirte.",
          en: "Reducing breast weight can ease size-related discomfort and make physical activity more comfortable. It may also reduce irritation beneath the breasts and grooves from bra straps. Reshaping allows proportions to be planned around your body and the way you want to move and dress.",
        },
      },
      {
        title: { es: "Cómo se realiza", en: "How the procedure is performed" },
        body: {
          es: "La técnica se elige según el volumen que se quiere retirar, la caída y la calidad de la piel. Las incisiones suelen rodear la areola y extenderse hacia el surco; en algunos casos también recorren el pliegue inferior. Se retira el exceso de tejido y se remodela el pecho, recolocando el pezón y la areola según el plan.",
          en: "Technique depends on the amount to be removed, sagging and skin quality. Incisions commonly run around the areola and down toward the breast crease; some also follow the lower crease. Excess tissue is removed and the breasts reshaped, with nipple and areola position adjusted to the plan.",
        },
      },
      {
        title: { es: "Qué se define en la consulta", en: "What you define in consultation" },
        body: {
          es: "Explica qué molestias tienes, qué actividades limitan y qué tamaño te resultaría más cómodo. Se revisan las proporciones, los antecedentes médicos, la medicación y tus planes de embarazo o lactancia. El tamaño final se acuerda teniendo en cuenta tus preferencias y lo que permite el tejido; una talla de sujetador por sí sola no describe todo el cambio.",
          en: "Explain your symptoms, the activities they limit and the size that would feel more comfortable. Proportions, medical history, medications and pregnancy or breastfeeding plans are reviewed. Final size is discussed in relation to your preferences and tissue constraints; a bra cup size alone does not describe the whole change.",
        },
      },
      {
        title: { es: "Recuperación", en: "Recovery" },
        body: {
          es: "Se utilizan apósitos y un sujetador de soporte; pueden ser necesarios drenajes temporales. Al principio tendrás que limitar esfuerzos y cuidar las incisiones. Las molestias, los moretones y la inflamación van cambiando con la cicatrización. El regreso al trabajo y al ejercicio se ajusta a tu evolución y al tipo de actividad.",
          en: "Dressings and a support bra are used, and temporary drains may be needed. Early recovery involves limiting strain and caring for incisions. Discomfort, bruising and swelling change as healing progresses. Returning to work and exercise is tailored to your recovery and the activity involved.",
        },
      },
      {
        title: { es: "Resultados que se van asentando", en: "Results that settle over time" },
        body: {
          es: "La reducción de volumen se aprecia desde la cirugía, aunque la inflamación puede ocultar la forma inicial. El pecho se asienta durante los meses siguientes y las cicatrices continúan madurando. Los cambios de peso y los embarazos pueden alterar el resultado. En las revisiones se valora tanto la forma como la evolución de tus molestias.",
          en: "The reduction in volume is visible after surgery, although swelling can obscure the initial shape. The breasts settle over the following months while scars continue to mature. Weight changes and pregnancy can affect the result. Follow-up considers both breast shape and changes in your symptoms.",
        },
      },
      {
        title: { es: "Sensibilidad, lactancia y cicatrices", en: "Sensation, breastfeeding and scars" },
        body: {
          es: "La cirugía deja cicatrices y puede cambiar la sensibilidad del pecho o del pezón y la capacidad de amamantar. También existen riesgos de asimetría, infección o problemas de cicatrización. Si deseas tener hijos o la lactancia es importante para ti, coméntalo antes de decidir. La consulta permite sopesar estos aspectos junto al alivio y al cambio de tamaño que buscas.",
          en: "Surgery leaves scars and may affect breast or nipple sensation and the ability to breastfeed. Risks also include asymmetry, infection and healing problems. Discuss future children or the importance of breastfeeding before deciding. Consultation lets you weigh these considerations alongside the relief and size change you want.",
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
    details: [
      {
        title: { es: "En qué consiste", en: "How it works" },
        body: {
          es: "La rinoplastia modifica el hueso y el cartílago de la nariz para trabajar su forma y sus proporciones. Puede centrarse en el dorso, la punta, la anchura o ciertas asimetrías. Si también tienes dificultad para respirar, se estudia la estructura nasal para determinar si necesita un tratamiento funcional además del cambio estético.",
          en: "Rhinoplasty reshapes nasal bone and cartilage to address the nose's shape and proportions. It may focus on the bridge, tip, width or certain asymmetries. If you also have difficulty breathing, the nasal structure is assessed to establish whether functional treatment is needed alongside the aesthetic change.",
        },
      },
      {
        title: { es: "Beneficios para la armonía del rostro", en: "Benefits for facial balance" },
        body: {
          es: "Puede suavizar una prominencia del dorso, definir la punta o ajustar el tamaño de la nariz en relación con el resto del rostro. Cuando existe una causa estructural, el plan también puede abordar la respiración. El objetivo se define con tus rasgos como referencia: conviene concretar qué cambiar y qué quieres conservar.",
          en: "It can soften a bridge prominence, refine the tip or adjust nasal size in relation to other facial features. Where a structural cause is present, the plan may also address breathing. Your features guide the goal: discuss both what you want changed and what you want to preserve.",
        },
      },
      {
        title: { es: "Cómo se realiza", en: "How the procedure is performed" },
        body: {
          es: "Según los cambios necesarios, las incisiones pueden quedar dentro de la nariz o incluir la pequeña franja de piel entre las fosas nasales. Se remodelan el hueso y el cartílago; en algunos casos se añaden injertos para dar soporte. Si corresponde, se trata el tabique. Al terminar pueden colocarse férulas para proteger las estructuras durante la primera fase de cicatrización.",
          en: "Depending on the changes needed, incisions may be inside the nose or include the narrow strip of skin between the nostrils. Bone and cartilage are reshaped, and grafts may be added for support. The septum is addressed when appropriate. Splints may be placed to protect the structures during early healing.",
        },
      },
      {
        title: { es: "Lo que se estudia en tu caso", en: "What is assessed in your case" },
        body: {
          es: "Se revisan la piel, el dorso, la punta, el tabique y la relación con el mentón y los demás rasgos. También importan cirugías anteriores, lesiones y problemas respiratorios. Las fotografías de referencia pueden ayudar a explicar tus preferencias, pero la anatomía marca qué cambios son viables. El crecimiento facial debe haberse completado.",
          en: "Assessment covers skin, bridge, tip, septum and the relationship to the chin and other features. Previous surgery, injuries and breathing concerns also matter. Reference photographs can help explain preferences, but your anatomy determines what is achievable. Facial growth should be complete.",
        },
      },
      {
        title: { es: "Recuperación", en: "Recovery" },
        body: {
          es: "Al principio puede haber inflamación, moretones y sensación de congestión. Tendrás instrucciones sobre las férulas, la higiene y la protección de la nariz. Debes evitar golpes y los esfuerzos que indique el cirujano. En las revisiones se decide cuándo retomar el trabajo y el ejercicio según la técnica y tu recuperación.",
          en: "Swelling, bruising and congestion may occur initially. You will receive instructions on splints, hygiene and protecting your nose. Avoid impacts and the exertion your surgeon restricts. Follow-up visits guide your return to work and exercise according to technique and recovery.",
        },
      },
      {
        title: { es: "Un resultado que necesita tiempo", en: "Results take time" },
        body: {
          es: "Aunque parte de la inflamación baja en las primeras semanas, la definición final puede tardar hasta un año. La punta suele requerir paciencia mientras se refinan los tejidos. Compara la evolución en las revisiones, en lugar de tomar la imagen de los primeros días como resultado definitivo. No se puede prometer una simetría perfecta.",
          en: "Although some swelling subsides in the first weeks, the final contour can take up to a year to refine. The tip needs patience as tissues settle. Review progress at follow-up rather than judging the first few days as the final result. Perfect symmetry cannot be promised.",
        },
      },
      {
        title: { es: "Qué preguntar antes de decidir", en: "What to ask before deciding" },
        body: {
          es: "Pregunta cómo afectará el plan a la respiración y qué cicatrices puede dejar. Entre los riesgos están la infección, alteraciones de sensibilidad, dificultades respiratorias y la posibilidad de una nueva cirugía. Lleva a la consulta los cambios que te interesan y tus dudas funcionales para valorar juntos el alcance del tratamiento.",
          en: "Ask how the plan may affect breathing and what scars it can leave. Risks include infection, altered sensation, breathing difficulties and the possibility of further surgery. Bring both your desired changes and functional concerns to consultation to assess the scope of treatment.",
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
    details: [
      {
        title: { es: "En qué consiste", en: "How it works" },
        body: {
          es: "El lifting facial trata la flacidez y el descenso de tejidos que pueden cambiar las mejillas, la línea de la mandíbula y el cuello con el tiempo. Recoloca los tejidos y retira piel sobrante. Si buscas un contorno más definido y un aspecto más descansado, la consulta permite valorar qué zonas se beneficiarían de la cirugía y cuáles requieren otro enfoque.",
          en: "A facelift addresses sagging and tissue descent that can change the cheeks, jawline and neck over time. It repositions tissues and removes excess skin. If you want more defined contours and a more rested appearance, consultation helps identify which areas may benefit from surgery and which need a different approach.",
        },
      },
      {
        title: { es: "Qué cambios puede aportar", en: "What it can change" },
        body: {
          es: "Puede mejorar la definición de la mandíbula, reducir la apariencia de mejillas descendidas y tratar piel sobrante en el cuello según la técnica. El trabajo sobre los tejidos permite abordar la causa de parte de la flacidez. El objetivo es definir el contorno teniendo en cuenta la estructura de tu rostro y los rasgos que quieres mantener.",
          en: "Depending on technique, it can improve jawline definition, address descended cheeks and reduce excess neck skin. Working on underlying tissues addresses part of what causes sagging. The aim is a more defined contour that respects your facial structure and the features you want to keep.",
        },
      },
      {
        title: { es: "Cómo se realiza", en: "How the procedure is performed" },
        body: {
          es: "Las incisiones suelen seguir zonas del nacimiento del cabello y el contorno de la oreja; puede ser necesaria otra bajo el mentón para tratar el cuello. Se recolocan tejidos profundos, se redistribuye o trata grasa cuando corresponde y se adapta la piel sin dejar el exceso. La técnica y la extensión dependen de las zonas que se quieren mejorar.",
          en: "Incisions commonly follow parts of the hairline and ear contours; another beneath the chin may be needed to address the neck. Deeper tissues are repositioned, fat is addressed where appropriate and the skin is redraped with excess removed. Technique and extent depend on the areas you want to improve.",
        },
      },
      {
        title: { es: "Qué se valora en la consulta", en: "What your consultation assesses" },
        body: {
          es: "Se estudian la flacidez, el volumen facial, la elasticidad de la piel y el cuello, junto con tus antecedentes y la medicación. Una cirugía de párpados o un tratamiento de la piel responde a objetivos distintos y puede valorarse por separado. Tener claro qué te gustaría cambiar permite seleccionar el alcance de la intervención.",
          en: "Sagging, facial volume, skin elasticity and the neck are assessed alongside medical history and medications. Eyelid surgery or skin treatments address different goals and may be considered separately. Knowing what you want to change helps define the extent of surgery.",
        },
      },
      {
        title: { es: "Recuperación", en: "Recovery" },
        body: {
          es: "Puede haber vendajes y drenajes temporales, además de inflamación, moretones y sensación de tirantez. Recibirás indicaciones para cuidar las incisiones y retomar el lavado del rostro, el maquillaje y la actividad. Reserva tiempo para recuperarte antes de compromisos sociales importantes. Las revisiones permiten comprobar la cicatrización y ajustar los cuidados.",
          en: "Bandages and temporary drains may be used. Swelling, bruising and tightness can occur. Instructions cover incision care and returning to face washing, makeup and activity. Allow recovery time before important social events. Follow-up visits check healing and adjust aftercare.",
        },
      },
      {
        title: { es: "Resultado y envejecimiento", en: "Results and aging" },
        body: {
          es: "La mejoría se aprecia conforme disminuyen la inflamación y los moretones. El contorno sigue asentándose durante la recuperación y las cicatrices maduran con el tiempo. El lifting no detiene el envejecimiento ni cambia por completo la textura de la piel. La protección solar y el cuidado del peso ayudan a acompañar el mantenimiento del resultado.",
          en: "Improvements become clearer as swelling and bruising settle. Contours continue to settle during recovery and scars mature over time. A facelift does not stop aging or fully change skin texture. Sun protection and weight stability help support maintenance of the result.",
        },
      },
      {
        title: { es: "Una decisión bien informada", en: "An informed decision" },
        body: {
          es: "Se deben revisar las cicatrices, la posible asimetría y riesgos como sangrado, infección, alteraciones de sensibilidad o lesión de nervios faciales. La consulta es el momento de hablar del cambio que buscas, de las alternativas y de la recuperación que puedes organizar. Así podrás valorar si el beneficio esperado encaja con tus prioridades.",
          en: "Discuss scars, possible asymmetry and risks such as bleeding, infection, altered sensation or facial nerve injury. Consultation is the time to talk through your goals, alternatives and the recovery you can arrange. This helps you assess whether the expected benefit fits your priorities.",
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
