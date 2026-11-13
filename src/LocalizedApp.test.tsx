import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

vi.stubGlobal("scrollTo", vi.fn());
Element.prototype.scrollIntoView = vi.fn();
afterEach(() => {
  window.history.replaceState({}, "", "/");
  document.querySelectorAll("[data-ava-seo]").forEach(node => node.remove());
});

describe("URL-driven language", () => {
  it("retains the ad campaign when changing gallery filters", async () => {
    window.history.replaceState({}, "", "/resultados?utm_source=fb_ad&utm_campaign=qa");
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Cómo evaluar resultados" }));
    expect(new URLSearchParams(window.location.search).get("utm_campaign")).toBe("qa");
    expect(new URLSearchParams(window.location.search).get("tipo")).toBe("clinica");
    await userEvent.click(screen.getByRole("button", { name: "Fotografías editoriales" }));
    expect(new URLSearchParams(window.location.search).get("utm_source")).toBe("fb_ad");
    expect(new URLSearchParams(window.location.search).has("tipo")).toBe(false);
  });
  it("loads an English procedure directly with localized content, navigation and metadata", () => {
    window.history.replaceState({}, "", "/en/procedures/tummy-tuck");
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Tummy Tuck");
    expect(document.documentElement.lang).toBe("en");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://avacosmetic.com/en/procedures/tummy-tuck");
    screen.getAllByRole("link", { name: "Procedures" }).forEach(link => expect(link).toHaveAttribute("href", "/en/procedures"));
    expect(screen.getByRole("link", { name: "privacy policy" })).toHaveAttribute("href", "/en/privacy-policy");
  });
  it("switches the equivalent procedure URL and metadata while preserving query and fragment", async () => {
    window.history.replaceState({}, "", "/procedimientos/liposuccion?origen=campana#contenido");
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "View in English" }));
    expect(window.location.pathname).toBe("/en/procedures/liposuction");
    expect(window.location.search).toBe("?origen=campana");
    expect(window.location.hash).toBe("#contenido");
    expect(document.documentElement.lang).toBe("en");
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(document.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
    await userEvent.click(screen.getByRole("button", { name: "Ver en español" }));
    expect(window.location.pathname).toBe("/procedimientos/liposuccion");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Liposucción");
  });
  it("keeps entered consultation values and combo context through language changes", async () => {
    window.history.replaceState({}, "", "/consulta?combo=bbl%2Cliposuccion");
    render(<App />);
    await userEvent.type(screen.getByLabelText("Nombre"), "Ana");
    await userEvent.click(screen.getByRole("button", { name: "View in English" }));
    expect(window.location.pathname).toBe("/en/contact");
    expect(window.location.search).toBe("?combo=bbl%2Cliposuccion");
    expect(screen.getByLabelText("First name")).toHaveValue("Ana");
  });
  it("uses the English home layout and renders unknown resource URLs as noindex 404 content", async () => {
    window.history.replaceState({}, "", "/en/resources/not-a-real-topic");
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Page not found");
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
    await userEvent.click(screen.getByRole("link", { name: "Back to home" }));
    await waitFor(() => expect(window.location.pathname).toBe("/en"));
    expect(document.querySelectorAll(".ap-cover")).toHaveLength(1);
    expect(document.querySelectorAll("header")).toHaveLength(1);
  });
});
