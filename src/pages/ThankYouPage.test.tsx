import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { Site } from "../App";
import { renderSeoHead } from "../lib/seo";

vi.stubGlobal("scrollTo", vi.fn());

function CurrentUrl() {
  const location = useLocation();
  return <output aria-label="Current URL">{location.pathname + location.search}</output>;
}

describe("Post-submission thank-you page", () => {
  it.each([
    { entry: "/consulta", first: "Nombre", last: "Apellidos", phone: "Teléfono", email: "Correo electrónico", consent: /He leído la política/, submit: "Continuar", destination: "/gracias", title: "Gracias por contactarnos." },
    { entry: "/en/contact", first: "First name", last: "Last name", phone: "Phone number", email: "Email", consent: /I have read the privacy/, submit: "Continue", destination: "/en/thank-you", title: "Thank you for reaching out." },
    { entry: "/", first: "Nombre", last: "Apellidos", phone: "Teléfono", email: "Correo electrónico", consent: /He leído la política/, submit: "Continuar", destination: "/gracias", title: "Gracias por contactarnos." },
  ])("redirects from $entry after the tracker reads the valid form", async fields => {
    render(<MemoryRouter initialEntries={[`${fields.entry}?utm_source=fb_ad&utm_campaign=AVA_QA_THANK_YOU`]}><Site /><CurrentUrl /></MemoryRouter>);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(fields.first), "AVA QA");
    await user.type(screen.getByLabelText(fields.last), "ThankYou Test");
    await user.type(screen.getByLabelText(fields.phone), "+1 202 555 0105");
    await user.type(screen.getByLabelText(fields.email), "ava.qa.thankyou@example.com");
    await user.click(screen.getByRole("checkbox", { name: fields.consent }));
    const form = document.querySelector("form")!;
    const tracker = vi.fn(() => ({ data: Object.fromEntries(new FormData(form)), url: screen.getByLabelText("Current URL").textContent }));
    form.addEventListener("submit", tracker, { capture: true });
    await user.click(screen.getByRole("button", { name: fields.submit }));
    expect(tracker).toHaveBeenCalledOnce();
    expect(tracker.mock.results[0].value).toEqual({
      data: expect.objectContaining({ first_name: "AVA QA", last_name: "ThankYou Test", email: "ava.qa.thankyou@example.com", privacy_consent: "on" }),
      url: `${fields.entry}?utm_source=fb_ad&utm_campaign=AVA_QA_THANK_YOU`,
    });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(fields.title);
    expect(screen.getByLabelText("Current URL")).toHaveTextContent(`${fields.destination}?utm_source=fb_ad&utm_campaign=AVA_QA_THANK_YOU`);
    expect(screen.getByLabelText("Current URL")).not.toHaveTextContent(/example.com|ThankYou/);
    expect(document.querySelector("form")).toBeNull();
  });

  it.each(["/gracias", "/en/thank-you"])("provides a directly loadable, noindex page at %s", pathname => {
    render(<MemoryRouter initialEntries={[pathname]}><Site /></MemoryRouter>);
    const english = pathname.startsWith("/en");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(english ? "Thank you for reaching out." : "Gracias por contactarnos.");
    expect(screen.getByRole("link", { name: english ? "Prepare for your consultation" : "Prepara tu consulta" })).toHaveAttribute("href", english ? "/en/surgical-consultation" : "/experiencia");
    expect(screen.getByRole("link", { name: english ? "Back to home" : "Volver al inicio" })).toHaveAttribute("href", english ? "/en" : "/");
    expect(renderSeoHead(pathname)).toContain('content="noindex, follow"');
  });
});
