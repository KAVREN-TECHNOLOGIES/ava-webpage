import { act, render } from "@testing-library/react";
import { StrictMode, useEffect } from "react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Site } from "./App";

let navigate: ReturnType<typeof useNavigate>;
function Navigation() {
  const go = useNavigate();
  useEffect(() => { navigate = go; }, [go]);
  return null;
}

afterEach(() => {
  document.getElementById("ava-ghl-tracking")?.remove();
  Reflect.deleteProperty(window, "_lcTracking");
});

describe("GHL external tracking installation", () => {
  it("loads the account script once after forms mount, including StrictMode and route changes", () => {
    const page = render(<StrictMode><MemoryRouter><Site /><Navigation /></MemoryRouter></StrictMode>);
    const script = document.getElementById("ava-ghl-tracking")!;
    expect(script).toHaveAttribute("src", "https://link.msgsndr.com/js/external-tracking.js");
    expect(script).toHaveAttribute("data-tracking-id", "tk_c94b2b94d91140cc804c4e934610176c");
    expect(document.querySelectorAll('script[src*="external-tracking.js"]')).toHaveLength(1);
    expect(document.getElementById("ava-consultation")).toBeInTheDocument();
    act(() => navigate("/consulta"));
    expect(document.getElementById("ava-ghl-tracking")).toBe(script);
    page.unmount();
    expect(document.getElementById("ava-ghl-tracking")).toBe(script);
  });

  it("tracks SPA page navigation in the same SDK session without double-counting anchors", () => {
    const sendEvent = vi.fn().mockResolvedValue(undefined);
    render(<MemoryRouter><Site /><Navigation /></MemoryRouter>);
    Object.assign(window, { _lcTracking: { tracker: { sendEvent } } });
    act(() => document.getElementById("ava-ghl-tracking")!.dispatchEvent(new Event("load")));
    expect(sendEvent).not.toHaveBeenCalled();
    act(() => navigate("/procedimientos?utm_source=google&utm_medium=cpc"));
    expect(sendEvent).toHaveBeenCalledOnce();
    expect(sendEvent).toHaveBeenLastCalledWith(expect.objectContaining({ type: "external_script_page_view", path: "/procedimientos", url: expect.stringContaining("utm_source=google") }));
    act(() => navigate("/procedimientos?utm_source=google&utm_medium=cpc#body"));
    expect(sendEvent).toHaveBeenCalledOnce();
    act(() => navigate("/en/contact"));
    expect(sendEvent).toHaveBeenCalledTimes(2);
    expect(document.querySelectorAll('script[src*="external-tracking.js"]')).toHaveLength(1);
  });
});
