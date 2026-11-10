import { build } from "vite";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

await build();
await build({ build: { ssr: "src/entry-server.tsx", outDir: ".prerender", emptyOutDir: true } });
const { render, siteRoutes, site } = await import(pathToFileURL(resolve(".prerender/entry-server.js")).href);
const template = await readFile("dist/index.html", "utf8");
function htmlFor(pathname) {
  const page = render(pathname);
  return template.replace('<html lang="es">', `<html lang="${page.language}">`)
    .replace(/<!--ava:seo:start-->[\s\S]*?<!--ava:seo:end-->/, `<!--ava:seo:start-->\n${page.head}\n<!--ava:seo:end-->`)
    .replace('<div id="root"></div>', `<div id="root">${page.html}</div>`);
}
const escapeXml = value => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const entries = [];
for (const route of siteRoutes) {
  for (const language of ["es", "en"]) {
    const pathname = route.paths[language];
    const file = pathname === "/" ? "dist/index.html" : `dist${pathname}.html`;
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, htmlFor(pathname));
    const absolute = path => new URL(path, site.origin).href;
    entries.push(`<url><loc>${escapeXml(absolute(pathname))}</loc>${Object.entries({ ...route.paths, "x-default": route.paths.es }).map(([lang, path]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(absolute(path))}"/>`).join("")}</url>`);
  }
}
await writeFile("dist/404.html", htmlFor("/pagina-no-encontrada"));
await writeFile("dist/en/404.html", htmlFor("/en/page-not-found"));
await writeFile("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`);
await writeFile("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);
await writeFile(".prerender/route-manifest.json", JSON.stringify(siteRoutes.map(route => ({ id: route.id, paths: route.paths })), null, 2));
console.log(`Prerendered ${entries.length} localized pages, two 404 pages, sitemap.xml and robots.txt for ${site.origin}.`);
