import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "../lib/language";
import { GalleryPage } from "./Pages";

describe("Destino de antes y después", () => {
  it("abre los resultados clínicos directamente sin mostrar modelos de campaña", () => {
    render(
      <MemoryRouter initialEntries={["/resultados?tipo=clinica"]}>
        <LanguageProvider>
          <GalleryPage />
        </LanguageProvider>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", {
        name: "Cómo evaluar un antes y después",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "Ampliar fotografía de referencia 1",
      }),
    ).not.toBeInTheDocument();
    expect(document.querySelector(".clinical-slot")).not.toBeInTheDocument();
  });
});
