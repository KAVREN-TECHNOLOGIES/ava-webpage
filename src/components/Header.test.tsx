import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "../lib/language";
import { Header } from "./Header";

describe("Navegación móvil", () => {
  it("incluye el botón de cerrar en el recorrido de teclado", async () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Header />
        </LanguageProvider>
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Abrir menú" }));
    const closeButton = screen.getByRole("button", { name: "Cerrar menú" });
    await userEvent.tab({ shift: true });
    expect(closeButton).toHaveFocus();
    await userEvent.tab();
    expect(
      screen.getByRole("navigation", { name: "Menú móvil" }).querySelector("a"),
    ).toHaveFocus();
  });
  it("abre el menú, se cierra con Escape y devuelve el foco", async () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Header />
        </LanguageProvider>
      </MemoryRouter>,
    );
    const trigger = screen.getByRole("button", { name: "Abrir menú" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });
});
