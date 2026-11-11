import { StrictMode, useEffect } from "react";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Site } from "./App";

const createScroll = vi.hoisted(() => vi.fn());
vi.mock("./lib/smoothScroll", () => ({ createSmoothScroll: createScroll }));

let instances: { onAnchor: (hash: string) => void; navigate: ReturnType<typeof vi.fn>; destroy: ReturnType<typeof vi.fn> }[];
let go: ReturnType<typeof useNavigate>;

function Controls() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => { go = navigate; }, [navigate]);
  return <output data-testid="current-location">{location.pathname}{location.search}{location.hash}</output>;
}

beforeEach(() => {
  instances = [];
  createScroll.mockReset().mockImplementation((onAnchor: (hash: string) => void) => {
    const instance = { onAnchor, navigate: vi.fn(), destroy: vi.fn() };
    instances.push(instance);
    return instance;
  });
});

describe("router scroll integration", () => {
  it("keeps the live engine through route changes and cleans up StrictMode mounts", () => {
    const view = render(<StrictMode><MemoryRouter><Site /><Controls /></MemoryRouter></StrictMode>);
    expect(createScroll).toHaveBeenCalledTimes(2);
    expect(instances[0].destroy).toHaveBeenCalledOnce();
    const active = instances[1];
    expect(active.navigate).toHaveBeenLastCalledWith(expect.objectContaining({ pathname: "/", type: "POP" }));
    act(() => go("/procedimientos"));
    expect(active.navigate).toHaveBeenLastCalledWith(expect.objectContaining({ pathname: "/procedimientos", hash: "", type: "PUSH" }));
    expect(createScroll).toHaveBeenCalledTimes(2);
    view.unmount();
    expect(active.destroy).toHaveBeenCalledOnce();
  });

  it("routes repeated anchor clicks with a fresh key while keeping the current URL query", () => {
    render(<MemoryRouter initialEntries={["/?campaign=qa"]}><Site /><Controls /></MemoryRouter>);
    const active = instances[0];
    act(() => active.onAnchor("#ap-procedimientos"));
    const first = active.navigate.mock.lastCall?.[0];
    expect(first).toMatchObject({ pathname: "/", hash: "#ap-procedimientos", type: "PUSH" });
    expect(screen.getByTestId("current-location")).toHaveTextContent("/?campaign=qa#ap-procedimientos");
    act(() => active.onAnchor("#ap-procedimientos"));
    expect(active.navigate.mock.lastCall?.[0].key).not.toBe(first.key);
    expect(createScroll).toHaveBeenCalledOnce();
  });
});
