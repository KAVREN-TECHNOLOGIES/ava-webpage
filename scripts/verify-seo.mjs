import { readFile, access } from "node:fs/promises";
import { JSDOM } from "jsdom";
import assert from "node:assert/strict";

const manifest = JSON.parse(await readFile(".prerender/route-manifest.json", "utf8"));
const knownPaths = new Set(manifest.flatMap(route => Object.values(route.paths)));
const titles = new Set();
let checked = 0;
for (const route of manifest) for (const language of ["es", "en"]) {
  const pathname = route.paths[language];
  const file = pathname === "/" ? "dist/index.html" : `dist${pathname}.html`;
  const html = await readFile(file, "utf8");
  const document = new JSDOM(html).window.document;
  const context = `${language} ${pathname}`;
  assert.equal(document.documentElement.lang, language, context);
  assert.equal(document.querySelectorAll("h1").length, 1, `One H1: ${context}`);
  assert.ok(document.querySelector("h1").textContent.trim(), context);
  assert.equal(document.querySelectorAll("title").length, 1, context);
  assert.equal(document.querySelectorAll('meta[name="description"]').length, 1, context);
  assert.equal(document.querySelector('link[rel="canonical"]').href, `https://avacosmetic.com${pathname}`, context);
  assert.equal(document.querySelector('meta[name="robots"]').content.includes("noindex"), route.noindex, context);
  for (const lang of ["es", "en", "x-default"]) {
    assert.equal(document.querySelector(`link[hreflang="${lang}"]`).href, `https://avacosmetic.com${route.paths[lang === "x-default" ? "es" : lang]}`, context);
  }
  assert.equal(document.querySelectorAll('script[type="application/ld+json"]').length, 1, context);
  const structured = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
  assert.ok(structured["@graph"].some(node => node["@type"] === "MedicalClinic"), context);
  if (route.id.startsWith("procedure:")) {
    assert.ok(structured["@graph"].some(node => node["@type"] === "Service"), context);
    assert.ok(structured["@graph"].some(node => node["@type"] === "MedicalProcedure"), context);
  }
  for (const anchor of document.querySelectorAll("a[href]")) {
    const url = new URL(anchor.getAttribute("href"), `https://avacosmetic.com${pathname}`);
    if (url.origin !== "https://avacosmetic.com") continue;
    assert.ok(knownPaths.has(url.pathname), `Broken internal destination ${url.pathname} from ${context}`);
    assert.equal(url.pathname === "/en" || url.pathname.startsWith("/en/"), language === "en", `Wrong-language destination ${url.pathname} from ${context}`);
    if (url.pathname === pathname && url.hash) assert.ok(document.getElementById(decodeURIComponent(url.hash.slice(1))), `Missing anchor ${url.hash} from ${context}`);
  }
  for (const image of document.querySelectorAll("img[src]")) {
    const src = image.getAttribute("src");
    if (src.startsWith("/")) await access(`dist${src}`);
  }
  titles.add(document.title);
  checked++;
}
assert.equal(titles.size, checked, "Unique titles across all translated pages");
const sitemap = new JSDOM(await readFile("dist/sitemap.xml", "utf8"), { contentType: "application/xml" }).window.document;
assert.equal(sitemap.getElementsByTagName("url").length, manifest.filter(route => !route.noindex).length * 2);
for (const route of manifest.filter(route => route.noindex)) for (const path of Object.values(route.paths)) {
  assert.ok(!Array.from(sitemap.getElementsByTagName("loc")).some(loc => loc.textContent === `https://avacosmetic.com${path}`), `Noindex route excluded from sitemap: ${path}`);
}
for (const [file, language] of [["dist/404.html", "es"], ["dist/en/404.html", "en"]]) {
  const document = new JSDOM(await readFile(file, "utf8")).window.document;
  assert.equal(document.documentElement.lang, language);
  assert.ok(document.querySelector('meta[name="robots"]').content.includes("noindex"));
  assert.equal(document.querySelector('link[rel="canonical"]'), null);
}
assert.ok((await readFile("dist/robots.txt", "utf8")).includes("Sitemap: https://avacosmetic.com/sitemap.xml"));
console.log(`Verified ${checked} prerendered pages: localized content and internal links, unique metadata, canonicals, reciprocal hreflang, JSON-LD, images, sitemap and both noindex 404s.`);
