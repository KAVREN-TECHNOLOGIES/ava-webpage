import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "../lib/language";
import { Home } from "./Home";

function renderHome() {
  render(
    <MemoryRouter>
      <LanguageProvider>
        <Home />
      </LanguageProvider>
    </MemoryRouter>,
  );
}

describe("Portada editorial de AVA", () => {
  it("mantiene el destino durante el desplazamiento suave y permite interrumpirlo", async () => {
    renderHome();
    const carousel = screen.getByRole("group", {
      name: "Carrusel de procedimientos",
    });
    Object.defineProperties(carousel, {
      clientWidth: { value: 320 },
      scrollWidth: { value: 1280 },
      scrollLeft: { value: 40, writable: true },
    });
    Array.from(carousel.children).forEach((card, index) => {
      Object.defineProperties(card, {
        offsetWidth: { value: 300 },
        offsetLeft: { value: index * 320 },
      });
    });
    const last = screen.getByRole("button", { name: "Ir al grupo 4" });
    await userEvent.click(last);
    fireEvent.scroll(carousel);
    expect(last).toHaveAttribute("aria-current", "true");
    fireEvent(carousel, new Event("scrollend"));
    expect(last).toHaveAttribute("aria-current", "true");
    carousel.scrollLeft = 950;
    fireEvent(carousel, new Event("scrollend"));
    carousel.scrollLeft = 300;
    fireEvent.scroll(carousel);
    expect(
      screen.getByRole("button", { name: "Ir al grupo 2" }),
    ).toHaveAttribute("aria-current", "true");
    await userEvent.click(last);
    fireEvent.wheel(carousel);
    carousel.scrollLeft = 300;
    fireEvent.scroll(carousel);
    expect(
      screen.getByRole("button", { name: "Ir al grupo 2" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("recorre el carrusel con flechas, puntos y teclado y lo reinicia al cambiar de categoría", async () => {
    renderHome();
    const explorer = screen.getByRole("region", { name: "Procedimientos" });
    const previous = within(explorer).getByRole("button", {
      name: "Procedimiento anterior",
    });
    const next = within(explorer).getByRole("button", {
      name: "Procedimiento siguiente",
    });
    expect(previous).toBeDisabled();
    await userEvent.click(next);
    expect(previous).toBeEnabled();
    expect(
      within(explorer).getByRole("button", { name: "Ir al grupo 2" }),
    ).toHaveAttribute("aria-current", "true");
    const carousel = within(explorer).getByRole("group", {
      name: "Carrusel de procedimientos",
    });
    carousel.focus();
    await userEvent.keyboard("{End}");
    expect(next).toBeDisabled();
    await userEvent.keyboard("{Home}");
    expect(previous).toBeDisabled();
    await userEvent.click(
      within(explorer).getByRole("button", { name: "Ir al grupo 3" }),
    );
    expect(
      within(explorer).getByRole("button", { name: "Ir al grupo 3" }),
    ).toHaveAttribute("aria-current", "true");
    await userEvent.click(
      within(explorer).getByRole("button", { name: "Rostro" }),
    );
    expect(previous).toBeDisabled();
    expect(
      within(explorer).getByRole("link", { name: /Rinoplastia/ }),
    ).toHaveAttribute("href", "/procedimientos/rinoplastia");
  });

  it("filtra los procedimientos y conserva destinos reales por categoría", async () => {
    renderHome();
    const explorer = screen.getByRole("region", { name: "Procedimientos" });
    expect(
      within(explorer).getByRole("link", { name: /Liposucción/ }),
    ).toHaveAttribute("href", "/procedimientos/liposuccion");
    await userEvent.click(
      within(explorer).getByRole("button", { name: "Pecho" }),
    );
    expect(
      within(explorer).getByRole("button", { name: "Pecho" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      within(explorer).queryByRole("link", { name: /Liposucción/ }),
    ).not.toBeInTheDocument();
    expect(
      within(explorer).getByRole("link", { name: /Aumento de pecho/ }),
    ).toHaveAttribute("href", "/procedimientos/aumento-de-pecho");
    await userEvent.click(
      within(explorer).getByRole("button", { name: "Rostro" }),
    );
    expect(
      within(explorer).getByRole("link", { name: /Rinoplastia/ }),
    ).toHaveAttribute("href", "/procedimientos/rinoplastia");
  });

  it("cierra la navegación compacta al salir y permite cambiar el idioma", async () => {
    renderHome();
    const trigger = screen.getByRole("button", { name: "Abrir menú" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await userEvent.click(
      within(
        screen.getByRole("navigation", { name: "Menú móvil" }),
      ).getByRole("link", { name: "Procedimientos" }),
    );
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(
      screen.getByRole("button", { name: "View in English" }),
    );
    expect(
      screen.getByRole("heading", { name: "Procedures" }),
    ).toBeInTheDocument();
  });
});
