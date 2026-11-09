import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "../lib/language";
import { ConsultationForm } from "./ConsultationForm";

const setup = () =>
  render(
    <MemoryRouter>
      <LanguageProvider>
        <ConsultationForm />
      </LanguageProvider>
    </MemoryRouter>,
  );

describe("Preparación de consulta", () => {
  it("explica qué falta antes de permitir revisar los datos", async () => {
    setup();
    await userEvent.click(
      screen.getByRole("button", { name: "Revisar mis datos" }),
    );
    expect(screen.getByText("Escribe tu nombre.")).toBeInTheDocument();
    expect(screen.getByText("Escribe un correo válido.")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Revisión de datos" }),
    ).not.toBeInTheDocument();
  });
  it("permite revisar y corregir la consulta sin fingir un envío", async () => {
    setup();
    await userEvent.type(
      screen.getByLabelText("Nombre completo *"),
      "Ana Pérez",
    );
    await userEvent.type(
      screen.getByLabelText("Correo electrónico *"),
      "ana@example.com",
    );
    await userEvent.type(screen.getByLabelText("Teléfono *"), "3055550123");
    await userEvent.selectOptions(
      screen.getByLabelText("Procedimiento de interés *"),
      "liposuccion",
    );
    await userEvent.click(
      screen.getByLabelText(/He leído la política de privacidad/),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Revisar mis datos" }),
    );
    expect(
      screen.getByRole("heading", { name: "Revisión de datos" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No se han enviado ni guardado/),
    ).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Corregir mis datos" }),
    );
    expect(screen.getByLabelText("Nombre completo *")).toHaveValue("Ana Pérez");
    expect(screen.getByLabelText("Correo electrónico *")).toHaveValue(
      "ana@example.com",
    );
  });
});
