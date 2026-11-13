import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { LocalizedLink, LocalizedNavLink, RoutedLanguageProvider } from "./LocalizedRouting";

function Journey() {
  const location = useLocation();
  return <>
    <LocalizedLink to="/procedimientos/liposuccion">Procedure</LocalizedLink>
    <LocalizedNavLink to={{ pathname: "/consulta", search: "?combo=bbl&ad_id=destination", hash: "#form" }}>Consultation</LocalizedNavLink>
    <LocalizedLink to="https://example.com/">External</LocalizedLink>
    <output aria-label="Current URL">{location.pathname + location.search + location.hash}</output>
  </>;
}

describe("campaign attribution through localized navigation", () => {
  it("retains campaign tags across a multi-page journey without carrying unrelated form data", async () => {
    render(<MemoryRouter initialEntries={["/en?utm_source=fb_ad&utm_campaign=Summer+Miami&campaign_id=123&ad_id=source&fbclid=test-click&email=private%40example.com&combo=liposuccion"]}>
      <RoutedLanguageProvider><Journey /></RoutedLanguageProvider>
    </MemoryRouter>);
    await userEvent.click(screen.getByRole("link", { name: "Procedure" }));
    const page = screen.getByLabelText("Current URL").textContent!;
    expect(page).toContain("/en/procedures/liposuction?");
    expect(page).toContain("utm_source=fb_ad");
    expect(page).toContain("utm_campaign=Summer+Miami");
    expect(page).toContain("campaign_id=123");
    expect(page).toContain("fbclid=test-click");
    expect(page).not.toMatch(/email=|combo=/);
    await userEvent.click(screen.getByRole("link", { name: "Consultation" }));
    expect(screen.getByLabelText("Current URL")).toHaveTextContent("/en/contact?combo=bbl&ad_id=destination&utm_source=fb_ad&utm_campaign=Summer+Miami&campaign_id=123&fbclid=test-click#form");
    expect(screen.getByRole("link", { name: "External" })).toHaveAttribute("href", "https://example.com/");
  });

  it("leaves normal links unchanged when no campaign is present", () => {
    render(<MemoryRouter initialEntries={["/?email=private%40example.com"]}><RoutedLanguageProvider><Journey /></RoutedLanguageProvider></MemoryRouter>);
    expect(screen.getByRole("link", { name: "Procedure" })).toHaveAttribute("href", "/procedimientos/liposuccion");
  });

  it("hydrates canonical HTML on an ad URL without mismatched links", async () => {
    const view = (entry: string) => <MemoryRouter initialEntries={[entry]}><RoutedLanguageProvider>
      <LocalizedLink to="/consulta">Consultation</LocalizedLink>
    </RoutedLanguageProvider></MemoryRouter>;
    const container = document.createElement("div");
    container.innerHTML = renderToString(view("/"));
    document.body.append(container);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    let root: ReturnType<typeof hydrateRoot>;
    try {
      await act(async () => { root = hydrateRoot(container, view("/?utm_source=adwords&utm_campaign=qa")); });
      expect(error).not.toHaveBeenCalled();
      expect(container.querySelector("a")).toHaveAttribute("href", "/consulta?utm_source=adwords&utm_campaign=qa");
    } finally {
      await act(async () => root!.unmount());
      container.remove();
      error.mockRestore();
    }
  });
});
