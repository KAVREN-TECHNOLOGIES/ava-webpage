import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Site } from "./App";
import { pageMetadata, renderSeoHead } from "./lib/seo";

export { siteRoutes } from "./data/routes";
export { site } from "./data/site";

export function render(pathname: string) {
  const metadata = pageMetadata(pathname);
  return {
    html: renderToString(<StaticRouter location={pathname}><Site /></StaticRouter>),
    head: renderSeoHead(pathname),
    language: metadata.language,
    status: metadata.found ? 200 : 404,
  };
}
