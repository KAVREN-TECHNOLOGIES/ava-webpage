import React from "react";
import ReactDOM from "react-dom/client";
import "lenis/dist/lenis.css";
import "@fontsource/marcellus/latin-400.css";
import "@fontsource/cormorant-garamond/latin-300.css";
import "@fontsource/cormorant-garamond/latin-300-italic.css";
import "@fontsource/jost/latin-300.css";
import "@fontsource/jost/latin-400.css";
import "@fontsource/jost/latin-500.css";
import { App } from "./App";
import "./styles.css";
import "./motion.css";
import { resolveRoute } from "./data/routes";

const root = document.getElementById("root")!;
const app = <React.StrictMode><App /></React.StrictMode>;
if (root.hasChildNodes() && document.documentElement.lang === resolveRoute(window.location.pathname).language) {
  ReactDOM.hydrateRoot(root, app);
} else {
  ReactDOM.createRoot(root).render(app);
}
