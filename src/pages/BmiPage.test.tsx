import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LanguageProvider, useLanguage } from "../lib/language";
import { BmiPage } from "./BmiPage";

function LanguageSwitch() {
  const { setLanguage } = useLanguage();
  return <button onClick={() => setLanguage("en")}>English</button>;
}

function renderPage() {
  return render(<MemoryRouter><LanguageProvider><LanguageSwitch /><BmiPage /></LanguageProvider></MemoryRouter>);
}

describe("BMI calculator", () => {
  it("validates missing data, calculates metric BMI, clears stale results and resets", async () => {
    renderPage();
    const user = userEvent.setup();
    const weight = screen.getByLabelText("Peso (kg)");
    const height = screen.getByLabelText("Estatura (cm)");
    await user.click(screen.getByRole("button", { name: "Calcular mi BMI" }));
    expect(weight).toHaveAttribute("aria-invalid", "true");
    expect(weight).toHaveFocus();
    await user.type(weight, "65,5");
    await user.type(height, "165");
    await user.click(screen.getByRole("button", { name: "Calcular mi BMI" }));
    expect(screen.getByRole("status")).toHaveTextContent(/24,1/);
    expect(screen.getByRole("status")).toHaveTextContent("Peso saludable");
    expect(screen.getByText("Tu rango")).toBeInTheDocument();
    await user.type(height, "0");
    expect(screen.getByRole("status")).toHaveTextContent("Introduce tus medidas para comenzar.");
    expect(screen.queryByText("Tu rango")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Reiniciar" }));
    expect(weight).toHaveValue("");
    expect(height).toHaveValue("");
    expect(weight).toHaveFocus();
  });

  it("calculates US BMI, validates inches and keeps measurements when switching units", async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Estadounidense/ }));
    await user.type(screen.getByLabelText("Peso (lb)"), "200");
    await user.type(screen.getByLabelText("Pies (ft)"), "5");
    const inches = screen.getByLabelText("Pulgadas (in)");
    await user.type(inches, "12");
    await user.click(screen.getByRole("button", { name: "Calcular mi BMI" }));
    expect(inches).toHaveAttribute("aria-invalid", "true");
    await user.clear(inches);
    await user.type(inches, "8");
    await user.click(screen.getByRole("button", { name: "Calcular mi BMI" }));
    expect(screen.getByRole("status")).toHaveTextContent("30,4");
    expect(screen.getByRole("status")).toHaveTextContent("Obesidad");
    await user.click(screen.getByRole("button", { name: /Métrico/ }));
    expect(Number((screen.getByLabelText("Peso (kg)") as HTMLInputElement).value)).toBeCloseTo(90.718, 3);
    expect(screen.getByLabelText("Estatura (cm)")).toHaveValue("172.72");
    await user.click(screen.getByRole("button", { name: "Calcular mi BMI" }));
    expect(screen.getByRole("status")).toHaveTextContent("30,4");
    await user.click(screen.getByRole("button", { name: /Estadounidense/ }));
    expect(screen.getByLabelText("Pies (ft)")).toHaveValue("5");
    expect(screen.getByLabelText("Pulgadas (in)")).toHaveValue("8");
  });

  it("translates the result and validation without losing entered measurements", async () => {
    renderPage();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Peso (kg)"), "70");
    await user.type(screen.getByLabelText("Estatura (cm)"), "175");
    await user.click(screen.getByRole("button", { name: "Calcular mi BMI" }));
    await user.click(screen.getByRole("button", { name: "English" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("BMI calculator");
    expect(screen.getByLabelText("Weight (kg)")).toHaveValue("70");
    expect(screen.getByRole("status")).toHaveTextContent("22.9");
    expect(screen.getByRole("status")).toHaveTextContent("Healthy weight");
    await user.clear(screen.getByLabelText("Weight (kg)"));
    await user.click(screen.getByRole("button", { name: "Calculate my BMI" }));
    expect(screen.getByText("Enter a number greater than 0.")).toBeInTheDocument();
    expect(within(screen.getByRole("status")).getByText("Enter your measurements to get started.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Source: CDC/ })).toHaveAttribute("href", "https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html");
    expect(screen.getByRole("link", { name: "Prepare my consultation" })).toHaveAttribute("href", "/en/contact");
  });
});
