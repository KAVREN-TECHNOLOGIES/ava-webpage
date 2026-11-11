import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider, useLanguage } from "../lib/language";
import { ComboExplorer } from "./ComboExplorer";
import { ConsultationForm } from "./ConsultationForm";

beforeEach(() => {
  vi.stubGlobal("Image", class {
    onload: null | (() => void) = null;
    onerror: null | (() => void) = null;
    set src(_value: string) { queueMicrotask(() => this.onload?.()); }
  });
});
afterEach(() => vi.unstubAllGlobals());

function controlledImages() {
  const requests: { src: string; onload: null | (() => void); onerror: null | (() => void) }[] = [];
  vi.stubGlobal("Image", class {
    src = "";
    onload = null;
    onerror = null;
    constructor() { requests.push(this); }
  });
  return requests;
}

function LanguageSwitch() {
  const { setLanguage } = useLanguage();
  return <button onClick={() => setLanguage("en")}>English</button>;
}

function setup(path = "/") {
  return render(<MemoryRouter initialEntries={[path]}><LanguageProvider><LanguageSwitch /><Routes>
    <Route path="/" element={<ComboExplorer />} />
    <Route path="/consulta" element={<ConsultationForm />} />
  </Routes></LanguageProvider></MemoryRouter>);
}
const shownImage = () => screen.getByRole("img").querySelector("img");

describe("Try your combo", () => {
  it("keeps stale loads from replacing a newer complete combination", async () => {
    const requests = controlledImages();
    setup();
    const user = userEvent.setup();
    const oldBaseLoad = requests[0].onload!;
    await user.click(screen.getByRole("button", { name: "Brazilian Butt Lift" }));
    const staleComboLoad = requests.at(-1)!.onload!;
    await user.click(screen.getByRole("button", { name: "Liposucción" }));
    await act(async () => { requests.slice(-2).forEach(image => image.onload?.()); });
    expect(screen.getByRole("img")).toHaveAttribute("aria-busy", "false");
    expect(shownImage()).toHaveAttribute("src", "/media/combo-ae/bbl__liposuccion-front.webp");
    await act(async () => { oldBaseLoad(); staleComboLoad(); });
    expect(shownImage()).toHaveAttribute("src", "/media/combo-ae/bbl__liposuccion-front.webp");
  });

  it("does not let a stale front load replace the requested back view", async () => {
    const requests = controlledImages();
    setup();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Brazilian Butt Lift" }));
    const frontLoad = requests.at(-1)!.onload!;
    await user.click(screen.getByRole("button", { name: "Espalda" }));
    await act(async () => { requests.slice(-2).forEach(image => image.onload?.()); });
    expect(shownImage()).toHaveAttribute("src", "/media/combo-ae/bbl-back.webp");
    await act(async () => { frontLoad(); });
    expect(shownImage()).toHaveAttribute("src", "/media/combo-ae/bbl-back.webp");
  });

  it("recovers from failure without showing an unrelated image", async () => {
    const requests = controlledImages();
    setup();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Liposucción" }));
    await act(async () => { requests.at(-1)!.onerror?.(); });
    expect(shownImage()).toBeNull();
    expect(screen.getByRole("button", { name: "Comparar" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Volver a cargar la vista" }));
    await act(async () => { requests.slice(-2).forEach(image => image.onload?.()); });
    expect(shownImage()).toHaveAttribute("src", "/media/combo-ae/liposuccion-front.webp");
    expect(screen.getByRole("button", { name: "Comparar" })).toBeEnabled();
  });

  it("limits choices to three and keeps selected options removable", async () => {
    setup();
    const user = userEvent.setup();
    const combo = screen.getByRole("region", { name: "Prueba tu combo" });
    const option = (name: string) => within(combo).getByRole("button", { name });
    expect(option("Consultar mi combo")).toBeDisabled();
    for (const name of ["Brazilian Butt Lift", "Liposucción", "Aumento de pecho"]) await user.click(option(name));
    expect(screen.getByLabelText("Procedimientos seleccionados")).toHaveTextContent("3 / 3");
    expect(option("Abdominoplastia")).toBeDisabled();
    expect(option("Brazilian Butt Lift")).toBeEnabled();
    expect(screen.getByRole("img")).toHaveAccessibleName("Frente: Brazilian Butt Lift + Liposucción + Aumento de pecho");
    await user.click(option("Liposucción"));
    expect(option("Abdominoplastia")).toBeEnabled();
    await user.click(option("Reiniciar"));
    expect(screen.getByLabelText("Procedimientos seleccionados")).toHaveTextContent("0 / 3");
    expect(screen.getByRole("img")).toHaveAccessibleName("Frente: cuerpo base");
    expect(option("Consultar mi combo")).toBeDisabled();
  });

  it("enables only source-backed combinations and restores choices after deselection", async () => {
    setup();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Brazilian Butt Lift" }));
    await user.click(screen.getByRole("button", { name: "Abdominoplastia" }));
    expect(screen.getByRole("button", { name: "Reducción de pecho" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Liposucción" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Aumento de pecho" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Levantamiento de pecho" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Brazilian Butt Lift" }));
    expect(screen.getByRole("button", { name: "Reducción de pecho" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Liposucción" })).toBeEnabled();
  });

  it("replaces breast options at the limit without dropping body choices", async () => {
    setup();
    const user = userEvent.setup();
    for (const name of ["Brazilian Butt Lift", "Liposucción", "Aumento de pecho"]) await user.click(screen.getByRole("button", { name }));
    await user.click(screen.getByRole("button", { name: "Levantamiento de pecho" }));
    expect(screen.getByRole("button", { name: "Aumento de pecho" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Levantamiento de pecho" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Brazilian Butt Lift" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("Procedimientos seleccionados")).toHaveTextContent("3 / 3");
    await waitFor(() => expect(shownImage()).toHaveAttribute("src", "/media/combo-ae/bbl__liposuccion__levantamiento-de-pecho-front.webp"));
  });

  it("switches camera and language while preserving the complete combo", async () => {
    setup();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Liposucción" }));
    await user.click(screen.getByRole("button", { name: "Espalda" }));
    await user.click(screen.getByRole("button", { name: "English" }));
    expect(screen.getByRole("heading", { name: "Try your combo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Liposuction" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Back" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("img")).toHaveAccessibleName("Back: Liposuction");
    expect(screen.queryByRole("button", { name: "Side" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Discuss my combo" })).toHaveAttribute("href", "/en/contact?combo=liposuccion");
  });

  it("carries every selected procedure into the four-field consultation", async () => {
    setup();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Brazilian Butt Lift" }));
    await user.click(screen.getByRole("button", { name: "Aumento de pecho" }));
    await user.click(screen.getByRole("link", { name: "Consultar mi combo" }));
    expect(screen.getByLabelText("Combo seleccionado")).toHaveTextContent("Brazilian Butt Lift + Aumento de pecho");
    expect(document.querySelector('input[name="combo"]')).toHaveValue("bbl,aumento-de-pecho");
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
  });

  it("compares base and combination in the same camera view and resets", async () => {
    setup();
    const user = userEvent.setup();
    expect(screen.getByRole("button", { name: "Comparar" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Liposucción" }));
    await user.click(screen.getByRole("button", { name: "Espalda" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Comparar" })).toBeEnabled());
    await user.click(screen.getByRole("button", { name: "Comparar" }));
    const range = screen.getByRole("slider", { name: "Comparar base y combo" });
    expect(range).toHaveValue("50");
    fireEvent.change(range, { target: { value: "72" } });
    expect(range).toHaveValue("72");
    expect(Array.from(screen.getByRole("img").querySelectorAll("img")).map(image => image.getAttribute("src"))).toEqual([
      "/media/combo-ae/liposuccion-back.webp", "/media/combo-ae/base-back.webp",
    ]);
    await user.click(screen.getByRole("button", { name: "Reiniciar" }));
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Comparar" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Espalda" })).toHaveAttribute("aria-pressed", "true");
  });

  it.each([
    { camera: "Frente", suffix: "front" },
    { camera: "Espalda", suffix: "back" },
  ])("keeps transparent base and combo images on separate sides in $camera", async ({ camera, suffix }) => {
    setup();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Brazilian Butt Lift" }));
    await user.click(screen.getByRole("button", { name: camera }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Comparar" })).toBeEnabled());
    await user.click(screen.getByRole("button", { name: "Comparar" }));

    const [combo, base] = Array.from(screen.getByRole("img").querySelectorAll("img"));
    expect(combo).toHaveAttribute("src", `/media/combo-ae/bbl-${suffix}.webp`);
    expect(base).toHaveAttribute("src", `/media/combo-ae/base-${suffix}.webp`);
    const slider = screen.getByRole("slider", { name: "Comparar base y combo" });
    for (const position of [50, 5, 95, 72]) {
      fireEvent.change(slider, { target: { value: String(position) } });
      expect(combo).toHaveStyle({ clipPath: `inset(0 0 0 ${position}%)` });
      expect(base.parentElement).toHaveStyle({ clipPath: `inset(0 ${100 - position}% 0 0)` });
    }

    await user.click(screen.getByRole("button", { name: "Comparar" }));
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
    expect(shownImage()?.style.clipPath).toBe("");
    expect(screen.getByRole("img").querySelectorAll("img")).toHaveLength(1);
  });

  it("ignores unknown and duplicate procedures in a shared consultation link", () => {
    setup("/consulta?combo=unknown,bbl,bbl,liposuccion,abdominoplastia,aumento-de-pecho");
    expect(screen.getByLabelText("Combo seleccionado")).toHaveTextContent("Brazilian Butt Lift + Liposucción + Abdominoplastia");
    expect(document.querySelector('input[name="combo"]')).toHaveValue("bbl,liposuccion,abdominoplastia");
  });
});
