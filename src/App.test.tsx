import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

vi.stubGlobal("scrollTo", vi.fn());
Element.prototype.scrollIntoView = vi.fn();
afterEach(() => window.history.replaceState({}, "", "/"));

describe("Diseño editorial principal", () => {
  it("publica la portada aprobada en la raíz con las fotografías de AVA", () => {
    window.history.replaceState({}, "", "/");
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cirugía estética");
    expect(document.querySelector(".ap-cover__photo")).toHaveAttribute("src", "/media/ava-hero.webp");
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
    expect(document.querySelector(".hero-photo,.procedure-tablist")).not.toBeInTheDocument();
  });

  it("lleva los enlaces guardados de la variante a la portada conservando su sección", async () => {
    window.history.replaceState({}, "", "/variante-apollo?origen=guardado#ap-preguntas");
    render(<App />);
    await waitFor(() => expect(window.location.pathname).toBe("/"));
    expect(window.location.hash).toBe("#ap-preguntas");
    expect(window.location.search).toBe("?origen=guardado");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cirugía estética");
  });

  it("ofrece navegación y un único pie editorial también en las páginas internas", () => {
    window.history.replaceState({}, "", "/procedimientos/reduccion-de-pecho");
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Reducción de pecho");
    expect(document.querySelector(".detail-image img")).toHaveAttribute("src", "/media/ava-breast-reduction.webp");
    expect(document.querySelector("footer .ap-footer")).toBeInTheDocument();
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
    screen.getAllByRole("link", { name: "AVA Cosmetic Surgery · Inicio" }).forEach(link => expect(link).toHaveAttribute("href", "/"));
  });

  it("abre la calculadora en su ruta y la enlaza desde la navegación", async () => {
    window.history.replaceState({}, "", "/bmi");
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Calculadora de BMI");
    await waitFor(() => expect(document.title).toBe("Calculadora de BMI · AVA Cosmetic Surgery"));
    expect(screen.getByRole("link", { name: "BMI" })).toHaveAttribute("href", "/bmi");
    expect(screen.getByRole("link", { name: "BMI" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Calculadora de BMI" })).toHaveAttribute("href", "/bmi");
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
  });
});
