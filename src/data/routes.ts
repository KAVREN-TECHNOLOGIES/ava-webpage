import type { Language, Localized } from "../lib/language";
import { procedures } from "./procedures";

export type PageKind = "home" | "procedures" | "procedure" | "gallery" | "team" | "experience" | "services" | "finance" | "location" | "contact" | "thank-you" | "resources" | "bmi" | "privacy" | "terms" | "accessibility";
export type SiteRoute = Readonly<{
  id: string;
  kind: PageKind;
  paths: Localized;
  title: Localized;
  description: Localized;
  procedureSlug?: string;
  topic?: string;
  noindex?: boolean;
}>;

export const siteRoutes: readonly SiteRoute[] = [
  { id: "thank-you", kind: "thank-you", noindex: true, paths: { es: "/gracias", en: "/en/thank-you" }, title: { es: "Gracias por contactar con AVA", en: "Thank you for contacting AVA" }, description: { es: "Gracias por tu interés en AVA Cosmetic Surgery. Conoce qué información preparar y qué preguntas hacer antes de tu primera consulta de cirugía estética.", en: "Thank you for your interest in AVA Cosmetic Surgery. Find out what information to prepare and which questions to ask before your first cosmetic surgery consultation." } },
  { id: "home", kind: "home", paths: { es: "/", en: "/en" }, title: { es: "Cirugía estética en Miami", en: "Cosmetic surgery in Miami" }, description: { es: "Conoce los procedimientos de cuerpo, pecho y rostro de AVA Cosmetic Surgery en Miami. Explora tus opciones y prepara una consulta personalizada.", en: "Explore body, breast and facial procedures at AVA Cosmetic Surgery in Miami. Learn about your options and prepare for a personalized consultation." } },
  { id: "procedures", kind: "procedures", paths: { es: "/procedimientos", en: "/en/procedures" }, title: { es: "Procedimientos de cirugía estética en Miami", en: "Cosmetic surgery procedures in Miami" }, description: { es: "Explora BBL, liposucción, abdominoplastia, cirugía de pecho y procedimientos faciales en AVA Miami. Conoce en qué consiste cada intervención.", en: "Explore BBL, liposuction, tummy tuck, breast surgery and facial procedures at AVA Miami. Learn what each procedure involves and discuss your options." } },
  { id: "gallery", kind: "gallery", paths: { es: "/resultados", en: "/en/photography" }, title: { es: "Fotografía editorial", en: "Editorial photography" }, description: { es: "Explora la fotografía editorial de AVA Cosmetic Surgery y consulta qué aspectos revisar al comparar imágenes de resultados de cirugía estética.", en: "Explore AVA Cosmetic Surgery's editorial photography and learn which details to consider when comparing photographs of cosmetic surgery results." } },
  { id: "team", kind: "team", paths: { es: "/equipo", en: "/en/medical-credentials" }, title: { es: "Cómo comprobar las credenciales de un cirujano", en: "How to check a surgeon's credentials" }, description: { es: "Conoce qué comprobar sobre licencia médica, certificación, experiencia y centro quirúrgico antes de elegir un cirujano para tu procedimiento.", en: "Learn what to check about medical licenses, certification, experience and surgical facilities before choosing a surgeon for your procedure." } },
  { id: "experience", kind: "experience", paths: { es: "/experiencia", en: "/en/surgical-consultation" }, title: { es: "Consulta de cirugía estética en Miami", en: "Cosmetic surgery consultation in Miami" }, description: { es: "Conoce cómo se revisan tus antecedentes, objetivos, alternativas y riesgos en una consulta de cirugía estética. Prepara tus preguntas con AVA Miami.", en: "Learn how a cosmetic surgery consultation reviews your history, goals, alternatives and risks. Prepare your questions with AVA Cosmetic Surgery Miami." } },
  { id: "services", kind: "services", paths: { es: "/servicios", en: "/en/services" }, title: { es: "Preparación y cuidados de cirugía estética", en: "Cosmetic surgery preparation and aftercare" }, description: { es: "Consulta información sobre evaluación, planificación y cuidados de cirugía estética: indicaciones por escrito, revisiones y preparación de tu consulta.", en: "Read about cosmetic surgery assessment, planning and aftercare, including written instructions, follow-up visits and preparation for your consultation." } },
  { id: "finance", kind: "finance", paths: { es: "/financiamiento", en: "/en/surgery-costs" }, title: { es: "Costos de cirugía estética en Miami", en: "Cosmetic surgery costs in Miami" }, description: { es: "Conoce los conceptos que debe incluir un presupuesto de cirugía estética: procedimiento, anestesia, centro quirúrgico, revisiones y condiciones de pago.", en: "Learn what an itemized cosmetic surgery quote should include: procedure, anesthesia, surgical facility, follow-up visits and payment terms." } },
  { id: "location", kind: "location", paths: { es: "/ubicacion", en: "/en/location" }, title: { es: "Ubicación de AVA en Kendall, Miami", en: "AVA location in Kendall, Miami" }, description: { es: "Encuentra AVA Cosmetic Surgery en 8700 North Kendall Drive, Suite 103, Miami, FL 33176. Consulta información para organizar tu visita desde otra ciudad.", en: "Find AVA Cosmetic Surgery at 8700 North Kendall Drive, Suite 103, Miami, FL 33176. Read information to help plan a visit from another city." } },
  { id: "contact", kind: "contact", paths: { es: "/consulta", en: "/en/contact" }, title: { es: "Contacto y consulta en Miami", en: "Contact and consultation in Miami" }, description: { es: "Contacta con AVA Cosmetic Surgery en Miami. Comparte tus datos de contacto para conversar sobre los procedimientos que tienes en mente.", en: "Contact AVA Cosmetic Surgery in Miami. Share your contact details to discuss the body, breast or facial procedures you have in mind." } },
  { id: "resources", kind: "resources", paths: { es: "/recursos", en: "/en/resources" }, title: { es: "Preguntas frecuentes sobre cirugía estética", en: "Cosmetic surgery frequently asked questions" }, description: { es: "Resuelve preguntas sobre consulta, procedimientos, seguridad, resultados y recuperación de cirugía estética con los recursos para pacientes de AVA.", en: "Find answers about cosmetic surgery consultations, procedures, safety, results and recovery in AVA Cosmetic Surgery's patient resources." } },
  { id: "bmi", kind: "bmi", paths: { es: "/bmi", en: "/en/bmi" }, title: { es: "Calculadora de BMI", en: "BMI calculator" }, description: { es: "Calcula tu índice de masa corporal con medidas métricas o estadounidenses. Consulta las categorías de BMI para adultos y prepara tu consulta en AVA Miami.", en: "Calculate your body mass index using metric or US measurements. Read about adult BMI categories and prepare for your AVA Miami consultation." } },
  { id: "safety", kind: "resources", topic: "seguridad", paths: { es: "/recursos/seguridad", en: "/en/resources/surgery-preparation" }, title: { es: "Evaluación y preparación antes de la cirugía", en: "Assessment and preparation before surgery" }, description: { es: "Prepara tu consulta de cirugía estética: evaluación médica, planificación, riesgos, alternativas e indicaciones que debes confirmar antes de operarte.", en: "Prepare for a cosmetic surgery consultation: medical assessment, planning, risks, alternatives and instructions to confirm before your operation." } },
  { id: "travel", kind: "resources", topic: "pacientes-de-fuera", paths: { es: "/recursos/pacientes-de-fuera", en: "/en/resources/out-of-town-patients" }, title: { es: "Pacientes de otras ciudades: cirugía en Miami", en: "Out-of-town patients: surgery in Miami" }, description: { es: "Organiza tu visita a Miami para una cirugía estética. Consulta qué confirmar sobre estancia, acompañante, revisiones y autorización del viaje de regreso.", en: "Plan a visit to Miami for cosmetic surgery. Learn what to confirm about your stay, companion, follow-up appointments and clearance for return travel." } },
  { id: "privacy", kind: "privacy", paths: { es: "/privacidad", en: "/en/privacy-policy" }, title: { es: "Política de privacidad", en: "Privacy policy" }, description: { es: "Consulta la política de privacidad de AVA Cosmetic Surgery: información personal, usos de los datos, proveedores, derechos y datos de la empresa.", en: "Read AVA Cosmetic Surgery's privacy policy, including personal information, data use, service providers, your rights and company information." } },
  { id: "terms", kind: "terms", paths: { es: "/terminos", en: "/en/terms-of-service" }, title: { es: "Términos de servicio", en: "Terms of service" }, description: { es: "Consulta los términos de uso del sitio de AVA Cosmetic Surgery, sus contenidos, enlaces, propiedad intelectual y condiciones aplicables.", en: "Read the terms of use for the AVA Cosmetic Surgery website, including its content, links, intellectual property and applicable conditions." } },
  { id: "accessibility", kind: "accessibility", paths: { es: "/accesibilidad", en: "/en/accessibility" }, title: { es: "Accesibilidad", en: "Accessibility" }, description: { es: "Conoce las opciones de accesibilidad de AVA Cosmetic Surgery: navegación con teclado, ampliación del contenido, formularios y movimiento reducido.", en: "Learn about AVA Cosmetic Surgery's accessibility features, including keyboard navigation, content zoom, forms and reduced-motion preferences." } },
  ...procedures.map(procedure => {
    const englishSlugs: Record<string, string> = { bbl: "bbl", liposuccion: "liposuction", abdominoplastia: "tummy-tuck", "aumento-de-pecho": "breast-augmentation", "mommy-makeover": "mommy-makeover", "levantamiento-de-pecho": "breast-lift", "reduccion-de-pecho": "breast-reduction", rinoplastia: "rhinoplasty", "lifting-facial": "facelift" };
    const englishSlug = englishSlugs[procedure.slug];
    if (!englishSlug) throw new Error(`Missing English route for ${procedure.slug}`);
    return { id: `procedure:${procedure.slug}`, kind: "procedure" as const, procedureSlug: procedure.slug, paths: { es: `/procedimientos/${procedure.slug}`, en: `/en/procedures/${englishSlug}` }, title: { es: `${procedure.name.es} en Miami`, en: `${procedure.name.en} in Miami` }, description: { es: `${procedure.description.es} Conoce la evaluación, la técnica y la recuperación con AVA Cosmetic Surgery en Miami.`, en: `${procedure.description.en} Learn about assessment, the procedure and recovery with AVA Cosmetic Surgery in Miami.` } };
  }),
];

export function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}
export function resolveRoute(pathname: string): { route: SiteRoute | undefined; language: Language } {
  const path = normalizePath(pathname);
  const language = path === "/en" || path.startsWith("/en/") ? "en" : "es";
  return { route: siteRoutes.find(route => route.paths[language] === path), language };
}
export function localizePath(destination: string, language: Language): string {
  if (!destination.startsWith("/") || destination.startsWith("//")) return destination;
  const separator = destination.search(/[?#]/);
  const pathname = separator === -1 ? destination : destination.slice(0, separator);
  const suffix = separator === -1 ? "" : destination.slice(separator);
  const { route } = resolveRoute(pathname);
  return (route?.paths[language] ?? pathname) + suffix;
}
