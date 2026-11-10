import { company } from "../data/company";
import { media } from "../data/media";
import { patientQuestions } from "../data/patientContent";
import { procedures } from "../data/procedures";
import { resolveRoute } from "../data/routes";
import { site } from "../data/site";

type SchemaNode = Record<string, unknown>;
export type HeadElement = { tag: "title" | "meta" | "link" | "script"; attributes: Record<string, string>; content?: string };
export const absoluteUrl = (path: string) => new URL(path, site.origin).href;

export function pageMetadata(pathname: string) {
  const { route, language } = resolveRoute(pathname);
  const procedure = procedures.find(item => item.slug === route?.procedureSlug);
  const title = `${route?.title[language] ?? (language === "es" ? "Página no encontrada" : "Page not found")} · ${site.name}`;
  const description = route?.description[language] ?? (language === "es" ? "La página solicitada no se encuentra en AVA Cosmetic Surgery." : "The requested page could not be found at AVA Cosmetic Surgery.");
  const canonical = route ? absoluteUrl(route.paths[language]) : undefined;
  const image = absoluteUrl(procedure?.image ?? media.hero);
  const imageAlt = language === "es" ? `Fotografía editorial de ${site.name}` : `Editorial photograph from ${site.name}`;
  const alternates = route ? { es: absoluteUrl(route.paths.es), en: absoluteUrl(route.paths.en) } : undefined;
  const graph: SchemaNode[] = [];
  if (route && canonical) {
    const clinicId = absoluteUrl("/#clinic");
    const websiteId = absoluteUrl("/#website");
    const pageId = `${canonical}#webpage`;
    graph.push({
      "@type": "MedicalClinic", "@id": clinicId, name: site.name, url: absoluteUrl("/"),
      logo: absoluteUrl("/brand/ava-lockup.svg"), image: absoluteUrl(media.contact),
      medicalSpecialty: "https://schema.org/PlasticSurgery",
      address: { "@type": "PostalAddress", streetAddress: `${company.street}, ${company.suite}`, addressLocality: company.city, addressRegion: company.region, postalCode: company.postalCode, addressCountry: company.country },
      hasMap: company.mapsUrl, areaServed: { "@type": "City", name: "Miami" },
    }, {
      "@type": "WebSite", "@id": websiteId, url: absoluteUrl("/"), name: site.name, inLanguage: ["es", "en"], publisher: { "@id": clinicId },
    });
    const page: SchemaNode = {
      "@type": procedure ? "MedicalWebPage" : route.id === "resources" ? "FAQPage" : "WebPage",
      "@id": pageId, url: canonical, name: title, description, inLanguage: language,
      isPartOf: { "@id": websiteId }, publisher: { "@id": clinicId }, about: { "@id": clinicId },
      primaryImageOfPage: { "@type": "ImageObject", url: image, caption: imageAlt },
    };
    if (route.kind !== "home") {
      const breadcrumbId = `${canonical}#breadcrumb`;
      page.breadcrumb = { "@id": breadcrumbId };
      graph.push({ "@type": "BreadcrumbList", "@id": breadcrumbId, itemListElement: [
        { "@type": "ListItem", position: 1, name: language === "es" ? "Inicio" : "Home", item: absoluteUrl(language === "es" ? "/" : "/en") },
        { "@type": "ListItem", position: 2, name: procedure?.name[language] ?? route.title[language], item: canonical },
      ] });
    }
    if (procedure) {
      const procedureId = `${canonical}#procedure`;
      const serviceId = `${canonical}#service`;
      page.about = { "@id": procedureId };
      page.mainEntity = { "@id": serviceId };
      page.citation = procedure.source;
      graph.push({ "@type": "MedicalProcedure", "@id": procedureId, name: procedure.name[language], description: procedure.description[language], howPerformed: procedure.details[0]?.body[language], followup: procedure.details.find(detail => detail.title.en === "Recovery")?.body[language], url: canonical, mainEntityOfPage: { "@id": pageId } }, {
        "@type": "Service", "@id": serviceId, name: procedure.name[language], serviceType: procedure.name[language], description: procedure.description[language], provider: { "@id": clinicId }, areaServed: { "@type": "City", name: "Miami" }, url: canonical, mainEntityOfPage: { "@id": pageId },
      });
    }
    if (route.id === "resources") {
      page.mainEntity = patientQuestions.map(item => ({ "@type": "Question", name: item.question[language], acceptedAnswer: { "@type": "Answer", text: item.answer[language] } }));
    }
    graph.push(page);
  }
  return { title, description, canonical, alternates, language, image, imageAlt, graph, found: !!route };
}

export function headElements(pathname: string): HeadElement[] {
  const meta = pageMetadata(pathname);
  const elements: HeadElement[] = [];
  const named = (name: string, content: string) => elements.push({ tag: "meta", attributes: { name, content } });
  const property = (property: string, content: string) => elements.push({ tag: "meta", attributes: { property, content } });
  elements.push({ tag: "title", attributes: {}, content: meta.title });
  named("description", meta.description);
  named("robots", meta.found ? "index, follow, max-image-preview:large" : "noindex, follow");
  if (meta.canonical && meta.alternates) {
    elements.push({ tag: "link", attributes: { rel: "canonical", href: meta.canonical } });
    for (const [hreflang, href] of Object.entries({ ...meta.alternates, "x-default": meta.alternates.es })) {
      elements.push({ tag: "link", attributes: { rel: "alternate", hreflang, href } });
    }
    property("og:url", meta.canonical);
  }
  property("og:type", "website");
  property("og:site_name", site.name);
  property("og:title", meta.title);
  property("og:description", meta.description);
  property("og:locale", site.locale[meta.language]);
  property("og:locale:alternate", site.locale[meta.language === "es" ? "en" : "es"]);
  property("og:image", meta.image);
  property("og:image:alt", meta.imageAlt);
  named("twitter:card", "summary_large_image");
  named("twitter:title", meta.title);
  named("twitter:description", meta.description);
  named("twitter:image", meta.image);
  named("twitter:image:alt", meta.imageAlt);
  if (meta.graph.length) elements.push({ tag: "script", attributes: { type: "application/ld+json", id: "ava-structured-data" }, content: JSON.stringify({ "@context": "https://schema.org", "@graph": meta.graph }).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029") });
  return elements;
}

export const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
export function renderSeoHead(pathname: string) {
  return headElements(pathname).map(element => {
    const attributes = Object.entries({ "data-ava-seo": "", ...element.attributes }).map(([key, value]) => ` ${key}="${escapeHtml(value)}"`).join("");
    const start = `<${element.tag}${attributes}>`;
    return element.tag === "link" || element.tag === "meta" ? start : `${start}${element.tag === "script" ? element.content : escapeHtml(element.content ?? "")}</${element.tag}>`;
  }).join("\n");
}
