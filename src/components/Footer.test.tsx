import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import { LanguageProvider } from "../lib/language";
import { Footer } from "./Footer";

it("presenta la ubicación, una marca enlazada y cuatro destinos principales", () => {
  render(<MemoryRouter><LanguageProvider><Footer /></LanguageProvider></MemoryRouter>);
  const footer = screen.getByRole("contentinfo");
  expect(within(footer).getByRole("link", { name: "AVA Cosmetic Surgery · Inicio" })).toHaveAttribute("href", "/");
  expect(within(footer).getByText(/Miami, Florida/)).toBeInTheDocument();
  expect(within(within(footer).getByRole("navigation", { name: "Enlaces del pie de página" })).getAllByRole("link")).toHaveLength(4);
  expect(within(footer).getByRole("link", { name: "Privacidad" })).toHaveAttribute("href", "/privacidad");
});
