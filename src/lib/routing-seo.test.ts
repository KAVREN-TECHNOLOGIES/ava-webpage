import { describe, expect, it } from "vitest";
import { localizePath, resolveRoute, siteRoutes } from "../data/routes";
import { patientQuestions } from "../data/patientContent";
import { pageMetadata, renderSeoHead } from "./seo";

describe("Localized URLs and metadata", () => {
  it("resolves every translated route to the same page and back without collisions", () => {
    const paths = siteRoutes.flatMap(route => [route.paths.es, route.paths.en]);
    expect(new Set(paths).size).toBe(paths.length);
    for (const route of siteRoutes) {
      for (const language of ["es", "en"] as const) {
        const path = route.paths[language];
        expect(resolveRoute(`${path === "/" ? "" : path}/`).route?.id).toBe(route.id);
        expect(localizePath(path, "es")).toBe(route.paths.es);
        expect(localizePath(path, "en")).toBe(route.paths.en);
      }
    }
  });
  it("preserves combo parameters, fragments and external destinations", () => {
    expect(localizePath("/consulta?combo=bbl%2Cliposuccion#consulta", "en")).toBe("/en/contact?combo=bbl%2Cliposuccion#consulta");
    expect(localizePath("/en/procedures/tummy-tuck#contenido", "es")).toBe("/procedimientos/abdominoplastia#contenido");
    expect(localizePath("https://example.com/consulta", "en")).toBe("https://example.com/consulta");
    expect(localizePath("#ap-preguntas", "en")).toBe("#ap-preguntas");
  });
  it("provides unique metadata, self-canonicals and reciprocal hreflang for all pages", () => {
    const titles = new Set();
    const descriptions = new Set();
    for (const route of siteRoutes) for (const language of ["es", "en"] as const) {
      const meta = pageMetadata(route.paths[language]);
      expect(meta.language).toBe(language);
      expect(meta.canonical).toBe(`https://avacosmetic.com${route.paths[language]}`);
      expect(meta.alternates).toEqual({ es: `https://avacosmetic.com${route.paths.es}`, en: `https://avacosmetic.com${route.paths.en}` });
      expect(meta.description.length).toBeGreaterThan(90);
      expect(meta.description.length).toBeLessThan(210);
      titles.add(meta.title);
      descriptions.add(meta.description);
    }
    expect(titles.size).toBe(siteRoutes.length * 2);
    expect(descriptions.size).toBe(siteRoutes.length * 2);
  });
  it("uses the supplied clinic address without inventing credentials, ratings or prices", () => {
    const meta = pageMetadata("/en/procedures/liposuction");
    const clinic = meta.graph.find(node => node["@type"] === "MedicalClinic")!;
    expect(clinic.name).toBe("AVA Cosmetic Surgery");
    expect(clinic.address).toEqual({ "@type": "PostalAddress", streetAddress: "8700 North Kendall Drive, Suite 103", addressLocality: "Miami", addressRegion: "FL", postalCode: "33176", addressCountry: "US" });
    expect(clinic).not.toHaveProperty("aggregateRating");
    expect(clinic).not.toHaveProperty("telephone");
    expect(clinic).not.toHaveProperty("legalName");
    expect(meta.graph.find(node => node["@type"] === "Service")?.name).toBe("Liposuction");
    expect(meta.graph.find(node => node["@type"] === "MedicalProcedure")?.name).toBe("Liposuction");
    expect(meta.graph.some(node => node["@type"] === "MedicalWebPage")).toBe(true);
  });
  it("only marks up the questions and answers visible on the FAQ page", () => {
    const faq = pageMetadata("/en/resources").graph.find(node => node["@type"] === "FAQPage")!;
    expect(faq.mainEntity).toEqual(patientQuestions.map(item => ({ "@type": "Question", name: item.question.en, acceptedAnswer: { "@type": "Answer", text: item.answer.en } })));
    expect(pageMetadata("/en/services").graph.some(node => node["@type"] === "FAQPage")).toBe(false);
  });
  it("does not index unknown routes or assign them a home canonical", () => {
    const meta = pageMetadata("/en/resources/unknown");
    expect(meta.found).toBe(false);
    expect(meta.language).toBe("en");
    expect(meta.canonical).toBeUndefined();
    expect(meta.alternates).toBeUndefined();
    expect(renderSeoHead("/en/resources/unknown")).toContain('content="noindex, follow"');
  });
});
