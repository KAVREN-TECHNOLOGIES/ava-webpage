import { act, screen } from "@testing-library/react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App, Site } from "./App";

vi.stubGlobal("scrollTo", vi.fn());
let root: Root | undefined;
let container: HTMLDivElement | undefined;
afterEach(async () => {
  await act(async () => root?.unmount());
  container?.remove();
  root = undefined;
  window.history.replaceState({}, "", "/");
  document.querySelectorAll("[data-ava-seo]").forEach(node => node.remove());
});

async function hydrateQuery(base: string, requested: string) {
  const html = renderToString(<StaticRouter location={base}><Site /></StaticRouter>);
  window.history.replaceState({}, "", requested);
  document.documentElement.lang = "en";
  container = document.createElement("div");
  container.innerHTML = html;
  document.body.append(container);
  const onRecoverableError = vi.fn();
  await act(async () => { root = hydrateRoot(container!, <App />, { onRecoverableError }); });
  expect(onRecoverableError).not.toHaveBeenCalled();
}

describe("Static HTML with per-visit query state", () => {
  it("hydrates the canonical contact HTML and then applies the complete combo", async () => {
    await hydrateQuery("/en/contact", "/en/contact?combo=bbl%2Cliposuccion");
    expect(screen.getByText(/Brazilian Butt Lift \+ Liposuction/)).toBeInTheDocument();
    expect(document.querySelector('input[name="combo"]')).toHaveValue("bbl,liposuccion");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://avacosmetic.com/en/contact");
  });
  it("hydrates the canonical gallery HTML and then applies its selected view", async () => {
    await hydrateQuery("/en/photography", "/en/photography?tipo=clinica");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Evaluating results");
    expect(screen.getByRole("button", { name: "Evaluating results" })).toHaveAttribute("aria-pressed", "true");
  });
});
