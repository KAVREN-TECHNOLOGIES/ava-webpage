import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LanguageProvider, useLanguage } from "../lib/language";
import { ConsultationForm } from "./ConsultationForm";

function LanguageSwitch() {
  const { setLanguage } = useLanguage();
  return <button onClick={() => setLanguage("en")}>English</button>;
}
const setup = () => render(<MemoryRouter><LanguageProvider><LanguageSwitch /><ConsultationForm /></LanguageProvider></MemoryRouter>);

describe("Contacto simplificado", () => {
  it("asks only for the four reference fields and focuses the first invalid field", async () => {
    setup();
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(document.querySelector("textarea")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByText("Escribe tu nombre.")).toBeInTheDocument();
    expect(screen.getByText("Escribe tus apellidos.")).toBeInTheDocument();
    expect(screen.getByText("Escribe un correo válido.")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText("Nombre")).toHaveFocus());
    expect(screen.queryByRole("heading", { name: "Revisión de datos" })).not.toBeInTheDocument();
  });

  it("preserves all contact details when reviewing and editing", async () => {
    setup();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Nombre"), "Ana");
    await user.type(screen.getByLabelText("Apellidos"), "Pérez");
    await user.type(screen.getByLabelText("Teléfono"), "+1 (305) 555-0123");
    await user.type(screen.getByLabelText("Correo electrónico"), "ana@example.com");
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByText("Lee y acepta la política de privacidad para continuar.")).toBeInTheDocument();
    await user.click(screen.getByLabelText(/He leído la política de privacidad/));
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByRole("heading", { name: "Revisión de datos" })).toHaveFocus();
    for (const value of ["Ana", "Pérez", "+1 (305) 555-0123", "ana@example.com"]) expect(screen.getByText(value)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Corregir mis datos" }));
    expect(screen.getByLabelText("Nombre")).toHaveValue("Ana");
    expect(screen.getByLabelText("Apellidos")).toHaveValue("Pérez");
    expect(screen.getByLabelText("Correo electrónico")).toHaveValue("ana@example.com");
    expect(screen.getByLabelText(/He leído la política de privacidad/)).toBeChecked();
  });

  it("translates labels and existing validation errors without losing entered text", async () => {
    setup();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Nombre"), "Ana");
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    await user.click(screen.getByRole("button", { name: "English" }));
    expect(screen.getByLabelText("First name")).toHaveValue("Ana");
    expect(screen.getByText("Enter your last name.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email.")).toBeInTheDocument();
    expect(screen.queryByText("Escribe tus apellidos.")).not.toBeInTheDocument();
  });
});
