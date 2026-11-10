import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import { LanguageProvider } from "../lib/language";
import { Footer } from "./Footer";

it("presenta la ubicación, una marca enlazada y cuatro destinos principales", () => {
  render(<MemoryRouter><LanguageProvider><Footer /></LanguageProvider></MemoryRouter>);
  const footer = screen.getByRole("contentinfo");
  expect(within(footer).getByRole("link", { name: "AVA Cosmetic Surgery · Inicio" })).toHaveAttribute("href", "/");
  const address = within(footer).getByRole("link", { name: /8700 North Kendall Drive\s*Suite 103\s*Miami, FL 33176/ });
  expect(address.closest(".ap-footer__top")).not.toBeNull();
  expect(footer.querySelector(".ap-footer__notes address")).not.toBeInTheDocument();
  expect(within(within(footer).getByRole("navigation", { name: "Enlaces del pie de página" })).getAllByRole("link")).toHaveLength(4);
  expect(within(footer).getByRole("link", { name: "Privacidad" })).toHaveAttribute("href", "/privacidad");
});
