import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { LanguageProvider, useLanguage } from "../lib/language";
import { ConsultationForm } from "./ConsultationForm";
import { ThankYouPage } from "../pages/ThankYouPage";

function LanguageSwitch() {
  const { setLanguage } = useLanguage();
  return <button onClick={() => setLanguage("en")}>English</button>;
}
const setup = () => render(<MemoryRouter><LanguageProvider><LanguageSwitch /><Routes>
  <Route path="/" element={<ConsultationForm />} />
  <Route path="/gracias" element={<ThankYouPage />} />
  <Route path="/en/thank-you" element={<ThankYouPage />} />
</Routes></LanguageProvider></MemoryRouter>);

function listenLikeExternalTracking() {
  const form = document.querySelector("form")!;
  const onClick = vi.fn();
  const onSubmit = vi.fn(() => Object.fromEntries(new FormData(form)));
  form.addEventListener("submit", onSubmit, { capture: true });
  form.querySelector('button[type="submit"]')!.addEventListener("click", onClick, { capture: true });
  return { form, onClick, onSubmit };
}

async function enterContact() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Nombre"), "AVA QA");
  await user.type(screen.getByLabelText("Apellidos"), "Attribution Test");
  await user.type(screen.getByLabelText("Teléfono"), "+1 202 555 0101");
  await user.type(screen.getByLabelText("Correo electrónico"), "ava-qa@example.com");
  return user;
}

describe("Contacto simplificado", () => {
  it("has a stable external-tracking form identifier and standard CRM field names", () => {
    setup();
    const form = document.querySelector("form")!;
    expect(form.id).toBe("ava-consultation");
    expect([...form.querySelectorAll('input:not([type="checkbox"]):not([type="hidden"])')].map(input => input.getAttribute("name")))
      .toEqual(["first_name", "last_name", "phone", "email"]);
  });

  it("blocks native tracker click and submit listeners for invalid entries", async () => {
    setup();
    const native = listenLikeExternalTracking();
    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(native.onClick).not.toHaveBeenCalled();
    expect(native.onSubmit).not.toHaveBeenCalled();
    fireEvent.submit(native.form);
    expect(native.onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Escribe tu nombre.")).toBeInTheDocument();
  });

  it("does not expose complete contact data to tracker listeners without privacy consent", async () => {
    setup();
    const user = await enterContact();
    const native = listenLikeExternalTracking();
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(native.onClick).not.toHaveBeenCalled();
    expect(native.onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Lee y acepta la política de privacidad para continuar.")).toBeInTheDocument();
  });

  it("lets the external tracker read a valid consented submission before the redirect unmounts it", async () => {
    setup();
    const user = await enterContact();
    await user.click(screen.getByLabelText(/He leído la política de privacidad/));
    const native = listenLikeExternalTracking();
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(native.onClick).toHaveBeenCalledOnce();
    expect(native.onSubmit).toHaveBeenCalledOnce();
    expect(native.onSubmit.mock.results[0].value).toMatchObject({ first_name: "AVA QA", last_name: "Attribution Test", email: "ava-qa@example.com", privacy_consent: "on" });
    expect(screen.getByRole("heading", { name: "Gracias por contactarnos." })).toBeInTheDocument();
  });

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

  it("keeps entered details after a consent error and redirects only after consent", async () => {
    setup();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Nombre"), "Ana");
    await user.type(screen.getByLabelText("Apellidos"), "Pérez");
    await user.type(screen.getByLabelText("Teléfono"), "+1 (305) 555-0123");
    await user.type(screen.getByLabelText("Correo electrónico"), "ana@example.com");
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByText("Lee y acepta la política de privacidad para continuar.")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Ana");
    expect(screen.getByLabelText("Apellidos")).toHaveValue("Pérez");
    expect(screen.getByLabelText("Correo electrónico")).toHaveValue("ana@example.com");
    await user.click(screen.getByLabelText(/He leído la política de privacidad/));
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByRole("heading", { name: "Gracias por contactarnos." })).toHaveFocus();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByText("ana@example.com")).not.toBeInTheDocument();
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
