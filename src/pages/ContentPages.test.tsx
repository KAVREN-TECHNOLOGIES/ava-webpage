import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "../lib/language";
import { Home } from "./Home";
import { ConsultationPage, ProcedurePage, TeamPage } from "./Pages";

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
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Datos para la consulta");
    expect(screen.queryByRole("heading", { name: "Tu consulta" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Revisar mis datos" })).toBeInTheDocument();
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
