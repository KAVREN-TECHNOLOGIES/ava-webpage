import type { Localized } from "../lib/language";

type LegalSection = Readonly<{ title: Localized; body: Localized }>;

// Original AVA copy. A&E's privacy page was a structural reference, not a source
// for AVA's business practices, contact details, consent or compliance claims.
export const privacySections: readonly LegalSection[] = [
  {
    title: { es: "Alcance de esta política", en: "Scope of this policy" },
    body: {
      es: "Esta política describe el tratamiento de la información en la web de AVA Cosmetic Surgery, incluidos el formulario de consulta y la calculadora de BMI. Se refiere a esta web; la atención médica y la información que compartas por otros canales pueden estar sujetas a avisos de privacidad específicos.",
      en: "This policy describes how information is handled on the AVA Cosmetic Surgery website, including the consultation form and BMI calculator. It covers this website; medical care and information you share through other channels may be subject to separate privacy notices.",
    },
  },
  {
    title: { es: "Información del formulario", en: "Consultation form information" },
    body: {
      es: "El formulario solicita tu nombre, apellidos, teléfono y correo electrónico. Si llegas desde el selector de combinaciones, también se conservan los procedimientos que hayas elegido. Facilita información exacta para que podamos contactarte.",
      en: "The form asks for your first name, last name, telephone number and email address. If you arrive from the combination selector, the procedures you selected are also retained. Provide accurate information so we can contact you.",
    },
  },
  {
    title: { es: "Calculadora de BMI", en: "BMI calculator" },
    body: {
      es: "La calculadora utiliza el peso y la estatura que introduces para estimar tu índice de masa corporal. Puedes corregir las medidas o reiniciar el cálculo en cualquier momento.",
      en: "The calculator uses the weight and height you enter to estimate your body mass index. You can correct the measurements or reset the calculation at any time.",
    },
  },
  {
    title: { es: "Información médica sensible", en: "Sensitive medical information" },
    body: {
      es: "Para compartir historias clínicas, documentos o fotografías médicas, utiliza el canal que te indique directamente el profesional que vaya a atenderte.",
      en: "To share medical records, documents or medical photographs, use the channel provided directly by the professional who will be treating you.",
    },
  },
  {
    title: { es: "Cookies y navegación", en: "Cookies and browsing" },
    body: {
      es: "Puedes administrar las cookies y otras preferencias de navegación desde la configuración de tu navegador. El alojamiento de la web puede generar registros técnicos para la entrega y seguridad del sitio, como datos de conexión, del navegador y de las páginas solicitadas.",
      en: "You can manage cookies and other browsing preferences through your browser settings. Website hosting may generate technical logs for delivery and security, such as connection details, browser information and pages requested.",
    },
  },
  {
    title: { es: "Preferencias de comunicación", en: "Communication preferences" },
    body: {
      es: "Si autorizas comunicaciones comerciales, puedes retirar tu consentimiento mediante las opciones indicadas en esas comunicaciones. La autorización para recibir publicidad se solicita de forma separada de la aceptación de la política de privacidad.",
      en: "If you authorize marketing communications, you can withdraw consent using the options provided in those communications. Permission to receive advertising is requested separately from acknowledgment of the privacy policy.",
    },
  },
  {
    title: { es: "Enlaces externos", en: "External links" },
    body: {
      es: "Al abrir un enlace externo, accedes a un servicio distinto de AVA. Revisa sus condiciones y su política de privacidad antes de facilitar información.",
      en: "Opening an external link takes you to a service separate from AVA. Review its terms and privacy policy before providing information.",
    },
  },
  {
    title: { es: "Control de tus datos", en: "Control over your information" },
    body: {
      es: "Las solicitudes sobre acceso, corrección o eliminación de tus datos personales deben dirigirse a AVA a través de sus canales oficiales. Los derechos que resulten aplicables dependen de la legislación y del tratamiento realizado.",
      en: "Requests to access, correct or delete your personal information should be directed to AVA through its official channels. Applicable rights depend on the law and the processing involved.",
    },
  },
  {
    title: { es: "Menores de edad", en: "Children and teenagers" },
    body: {
      es: "El contenido está orientado a personas adultas. La calculadora de BMI utiliza categorías para adultos de 20 años o más y no debe utilizarse para interpretar el crecimiento o el peso de menores.",
      en: "The content is intended for adults. The BMI calculator uses categories for adults aged 20 and older and should not be used to interpret children's growth or weight.",
    },
  },
  {
    title: { es: "Cambios en la política", en: "Policy changes" },
    body: {
      es: "Esta política se revisará cuando cambie el tratamiento de información o se incorporen nuevas funciones. La versión aplicable y su fecha de actualización se publicarán en esta página.",
      en: "This policy will be reviewed when information handling changes or new features are introduced. The applicable version and its update date will be published on this page.",
    },
  },
];

export const termsSections: readonly LegalSection[] = [
  {
    title: { es: "Uso de la web", en: "Using the website" },
    body: {
      es: "Estos términos regulan el uso de la web de AVA Cosmetic Surgery y de sus recursos informativos. Puedes consultar las páginas para conocer procedimientos, preparación, recuperación y otros temas relacionados con una consulta de cirugía estética. Utiliza el sitio de manera lícita y respetando los derechos de otras personas.",
      en: "These terms govern use of the AVA Cosmetic Surgery website and its informational resources. You may browse the pages to learn about procedures, preparation, recovery and other topics related to a cosmetic surgery consultation. Use the site lawfully and respect other people's rights.",
    },
  },
  {
    title: { es: "Información médica", en: "Medical information" },
    body: {
      es: "El contenido es general y educativo. No constituye un diagnóstico, una prescripción, una recomendación individual ni una autorización para operarte. La indicación de un procedimiento, sus riesgos, las alternativas y el consentimiento informado deben tratarse con un profesional cualificado tras una evaluación individual. El uso de la web no establece una relación médico-paciente.",
      en: "Content is general and educational. It is not a diagnosis, prescription, individual recommendation or clearance for surgery. The suitability of a procedure, its risks, alternatives and informed consent must be discussed with a qualified professional after an individual assessment. Using the website does not establish a doctor-patient relationship.",
    },
  },
  {
    title: { es: "Formulario y citas", en: "Forms and appointments" },
    body: {
      es: "Proporciona información de contacto exacta. Las citas y las condiciones de atención se coordinan directamente con AVA. No introduzcas datos de otras personas sin autorización.",
      en: "Provide accurate contact information. Appointments and care arrangements are coordinated directly with AVA. Do not enter another person's details without permission.",
    },
  },
  {
    title: { es: "Uso de la calculadora de BMI", en: "Using the BMI calculator" },
    body: {
      es: "La calculadora ofrece una estimación a partir del peso y la estatura que introduces. Comprueba las cifras y el sistema de unidades antes de calcular. Los rangos corresponden a adultos de 20 años o más; no sustituyen la valoración de la composición corporal, del embarazo ni de otras circunstancias clínicas. Ningún resultado confirma o descarta por sí solo la posibilidad de una cirugía.",
      en: "The calculator provides an estimate based on the weight and height you enter. Check the figures and measurement system before calculating. Ranges apply to adults aged 20 and older; they do not replace assessment of body composition, pregnancy or other clinical circumstances. No result on its own confirms or rules out suitability for surgery.",
    },
  },
  {
    title: { es: "Propiedad intelectual", en: "Intellectual property" },
    body: {
      es: "Las marcas, fotografías, textos y demás materiales pertenecen a sus respectivos titulares. El acceso al sitio no concede una licencia sobre esos derechos. La reproducción, distribución o explotación comercial requiere la autorización que corresponda, salvo los usos permitidos por la legislación aplicable. No elimines los avisos de autoría ni presentes contenido de terceros como propio.",
      en: "Trademarks, photographs, text and other materials belong to their respective rights holders. Access to the site does not grant a license to those rights. Reproduction, distribution or commercial use requires the appropriate permission, except where permitted by applicable law. Do not remove attribution notices or present third-party content as your own.",
    },
  },
  {
    title: { es: "Conductas no permitidas", en: "Prohibited conduct" },
    body: {
      es: "No utilices la web para introducir código malicioso, suplantar a otra persona, intentar acceder sin autorización a sistemas o datos, ni interferir en el funcionamiento del servicio. No emplees los formularios para introducir información falsa o vulnerar la privacidad de terceros.",
      en: "Do not use the website to introduce malicious code, impersonate another person, attempt unauthorized access to systems or data, or interfere with the service. Do not use forms to enter false information or violate another person's privacy.",
    },
  },
  {
    title: { es: "Servicios y enlaces de terceros", en: "Third-party services and links" },
    body: {
      es: "Los enlaces a fuentes médicas u otros servicios facilitan información adicional. El servicio de destino tiene sus propias condiciones y política de privacidad. La presencia de un enlace no convierte ese servicio en parte de AVA ni supone que AVA controle su contenido o disponibilidad.",
      en: "Links to medical sources or other services provide additional information. The destination service has its own terms and privacy policy. Including a link does not make that service part of AVA or mean that AVA controls its content or availability.",
    },
  },
  {
    title: { es: "Disponibilidad y límites", en: "Availability and limitations" },
    body: {
      es: "La información y las funciones pueden actualizarse, interrumpirse o contener errores. No se garantiza una disponibilidad continua ni que el contenido sea adecuado para una circunstancia médica concreta. Ninguna disposición de estos términos excluye responsabilidades ni limita derechos que no puedan excluirse o limitarse conforme a la legislación aplicable.",
      en: "Information and features may change, become unavailable or contain errors. Continuous availability and suitability for a particular medical circumstance are not guaranteed. Nothing in these terms excludes liability or limits rights that cannot lawfully be excluded or limited under applicable law.",
    },
  },
  {
    title: { es: "Privacidad", en: "Privacy" },
    body: {
      es: "El tratamiento de la información personal se describe en la política de privacidad. Revisa esa política antes de facilitar tus datos.",
      en: "The handling of personal information is described in the privacy policy. Review that policy before providing your details.",
    },
  },
  {
    title: { es: "Actualizaciones de estos términos", en: "Updates to these terms" },
    body: {
      es: "Estos términos pueden actualizarse. Las revisiones se publicarán en esta página con su correspondiente fecha de actualización.",
      en: "These terms may be updated. Revisions will be published on this page with their corresponding update date.",
    },
  },
];
