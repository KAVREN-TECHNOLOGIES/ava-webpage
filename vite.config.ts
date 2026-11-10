import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { readFile } from "node:fs/promises";
import { resolveRoute, normalizePath } from "./src/data/routes";

export default defineConfig(({ isPreview }) => ({
  appType: isPreview ? "mpa" : "spa",
  plugins: [react(), {
    name: "ava-static-preview",
    configurePreviewServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const url = new URL(request.url ?? "/", "http://localhost");
        const pathname = normalizePath(url.pathname);
        if (pathname === "/variante-apollo") {
          response.writeHead(308, { Location: `/${url.search}` });
          response.end();
          return;
        }
        const { route, language } = resolveRoute(pathname);
        if (route) {
          if (url.pathname !== pathname) {
            response.writeHead(308, { Location: `${pathname}${url.search}` });
            response.end();
            return;
          }
          if (pathname !== "/") request.url = `${pathname}.html${url.search}`;
          next();
          return;
        }
        if (pathname === "/index.html") {
          response.writeHead(308, { Location: `/${url.search}` });
          response.end();
          return;
        }
        if (pathname.endsWith(".html") && resolveRoute(pathname.slice(0, -5)).route) {
          response.writeHead(308, { Location: `${pathname.slice(0, -5)}${url.search}` });
          response.end();
          return;
        }
        if (/\.[a-z0-9]+$/i.test(pathname) && !pathname.endsWith(".html")) { next(); return; }
        try {
          const html = await readFile(`dist/${language === "en" ? "en/" : ""}404.html`, "utf8");
          response.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" });
          response.end(request.method === "HEAD" ? undefined : html);
        } catch { next(); }
      });
    },
  }],
  server: { port: 5173, strictPort: true },
  test: { environment: "jsdom", setupFiles: "./src/test/setup.ts", css: false },
}));
