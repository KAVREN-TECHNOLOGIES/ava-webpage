import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "../lib/language";
import { Home } from "./Home";
import { ConsultationPage, ProcedurePage, TeamPage } from "./Pages";
import { ThankYouPage } from "./ThankYouPage";

function page(content: ReactNode, path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider>{content}</LanguageProvider>
    </MemoryRouter>,
  );
}

describe("Contenido público de AVA", () => {
  it("abre la consulta directamente sin repetir su introducción", () => {
    page(<ConsultationPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Hablemos de tu cirugía.");
    expect(screen.queryByRole("heading", { name: "Tu consulta" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continuar" })).toBeInTheDocument();
  });
  it("abre la página de agradecimiento después de enviar el formulario", async () => {
    page(<Routes>
      <Route path="/consulta" element={<ConsultationPage />} />
      <Route path="/gracias" element={<ThankYouPage />} />
    </Routes>, "/consulta");
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Nombre"), "Ana");
    await user.type(screen.getByLabelText("Apellidos"), "Pérez");
    await user.type(screen.getByLabelText("Teléfono"), "3055550123");
    await user.type(screen.getByLabelText("Correo electrónico"), "ana@example.com");
    await user.click(screen.getByLabelText(/He leído la política de privacidad/));
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Gracias por contactarnos.");
    expect(screen.queryByText("Completa tus datos de contacto.")).not.toBeInTheDocument();
    expect(document.querySelector("form")).toBeNull();
  });
  it("presenta los procedimientos sin lemas de relleno ni perfiles sin confirmar", () => {
    page(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Cirugía estética",
    );
    expect(
      screen.getByRole("link", { name: "Ver procedimientos" }),
    ).toHaveAttribute("href", "#ap-procedimientos");
    expect(document.body).not.toHaveTextContent(
      /BE YOU|YOUR CALL|próximo capítulo|cada cuerpo tiene su historia|pendiente|próximamente|vista previa local/i,
    );
    expect(document.querySelector('a[href="/equipo"]')).not.toBeInTheDocument();
  });
  it("retira del inicio los bloques de cirujanos, instalaciones y resultados sin datos", () => {
    page(<Home />);
    expect(
      document.querySelector(
        ".empty-portrait,.facility-placeholder,.clinical-slot",
      ),
    ).not.toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(
      /por anunciar|pendiente|próximamente|tu propia esencia|una nueva mirada/i,
    );
  });
  it("explica el procedimiento concreto y enlaza la fuente médica", () => {
    page(
      <Routes>
        <Route path="/procedimientos/:slug" element={<ProcedurePage />} />
      </Routes>,
      "/procedimientos/liposuccion",
    );
    expect(
      screen.getByRole("heading", { name: "En qué consiste" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/no es un tratamiento para la obesidad/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /American Society of Plastic Surgeons/,
      }),
    ).toHaveAttribute(
      "href",
      "https://www.plasticsurgery.org/cosmetic-procedures/liposuction",
    );
  });
  it("ofrece información sobre credenciales sin inventar un equipo médico", () => {
    page(<TeamPage />);
    expect(
      document.querySelector(".empty-portrait,.team-card"),
    ).not.toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/por anunciar|pendiente|Dr\./i);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Credenciales médicas",
    );
  });
});
