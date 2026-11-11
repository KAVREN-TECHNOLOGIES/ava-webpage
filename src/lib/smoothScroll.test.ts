import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { LenisOptions } from "lenis";
import { createSmoothScroll } from "./smoothScroll";

const constructLenis = vi.hoisted(() => vi.fn());
vi.mock("lenis", () => ({
  default: class {
    constructor(options: LenisOptions) {
      return constructLenis(options);
    }
  },
}));

function mockEngine() {
  return { scrollTo: vi.fn(), resize: vi.fn(), stop: vi.fn(), start: vi.fn(), destroy: vi.fn() };
}

let engines: ReturnType<typeof mockEngine>[];
let reduced: boolean;
let media: EventTarget;
let frames: Map<number, FrameRequestCallback>;
let cleanups: (() => void)[];

function controller() {
  const onAnchorNavigate = vi.fn();
  const scroll = createSmoothScroll(onAnchorNavigate);
  cleanups.push(scroll.destroy);
  return { scroll, onAnchorNavigate };
}

function flushFrame() {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach(callback => callback(0));
}

function setReducedMotion(value: boolean) {
  reduced = value;
  media.dispatchEvent(new Event("change"));
}

beforeEach(() => {
  engines = [];
  reduced = false;
  frames = new Map();
  cleanups = [];
  let frameId = 0;
  media = Object.defineProperty(new EventTarget(), "matches", { get: () => reduced });
  constructLenis.mockReset().mockImplementation(() => {
    const engine = mockEngine();
    engines.push(engine);
    return engine;
  });
  vi.stubGlobal("matchMedia", vi.fn(() => media));
  vi.stubGlobal("requestAnimationFrame", vi.fn((callback: FrameRequestCallback) => {
    frames.set(++frameId, callback);
    return frameId;
  }));
  vi.stubGlobal("cancelAnimationFrame", vi.fn((id: number) => frames.delete(id)));
  vi.stubGlobal("scrollTo", vi.fn());
  vi.stubGlobal("scrollY", 0);
  Element.prototype.scrollIntoView = vi.fn();
  window.history.replaceState({}, "", "/");
});

afterEach(() => {
  cleanups.forEach(cleanup => cleanup());
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});

describe("smooth scroll lifecycle", () => {
  it("keeps page scrolling over the horizontal carousel and isolates menus and dialogs", () => {
    const { scroll } = controller();
    const options = constructLenis.mock.calls[0][0] as LenisOptions;
    expect(options).toMatchObject({ autoRaf: true, smoothWheel: true, syncTouch: false, anchors: false });
    const nested = document.createElement("div");
    nested.className = "ap-carousel-track";
    expect(options.prevent?.(nested)).toBe(false);
    nested.className = "ap-mobile-nav";
    expect(options.prevent?.(nested)).toBe(true);
    expect(options.prevent?.(document.createElement("dialog"))).toBe(true);
    expect(options.prevent?.(document.createElement("section"))).toBe(false);

    scroll.navigate({ key: "home", pathname: "/", hash: "", type: "POP" });
    flushFrame();
    scroll.navigate({ key: "next", pathname: "/procedimientos", hash: "", type: "PUSH" });
    flushFrame();
    expect(constructLenis).toHaveBeenCalledTimes(1);
    expect(engines[0].scrollTo).toHaveBeenLastCalledWith(0, expect.objectContaining({ immediate: true }));
  });

  it("destroys smoothing while reduced motion is enabled and follows preference changes", () => {
    reduced = true;
    const { scroll } = controller();
    expect(constructLenis).not.toHaveBeenCalled();
    scroll.navigate({ key: "first", pathname: "/", hash: "", type: "POP" });
    flushFrame();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "instant" });

    setReducedMotion(false);
    expect(constructLenis).toHaveBeenCalledTimes(1);
    setReducedMotion(true);
    expect(engines[0].destroy).toHaveBeenCalledOnce();
    setReducedMotion(false);
    expect(constructLenis).toHaveBeenCalledTimes(2);
  });

  it("stops immediately for menu/dialog body locks and resumes without rewriting overflow", async () => {
    const { scroll } = controller();
    document.body.style.overflow = "hidden";
    await Promise.resolve();
    expect(engines[0].stop).toHaveBeenCalledOnce();
    expect(document.documentElement.style.overflow).toBe("");
    document.body.style.overflow = "";
    await Promise.resolve();
    expect(engines[0].start).toHaveBeenCalledOnce();

    scroll.destroy();
    document.body.style.overflow = "hidden";
    await Promise.resolve();
    expect(engines[0].stop).toHaveBeenCalledOnce();
    expect(engines[0].destroy).toHaveBeenCalledOnce();
  });

  it("cleans up pending work and preference listeners safely on repeated teardown", () => {
    const { scroll } = controller();
    scroll.navigate({ key: "home", pathname: "/", hash: "#contenido", type: "POP" });
    scroll.destroy();
    scroll.destroy();
    flushFrame();
    setReducedMotion(true);
    setReducedMotion(false);
    expect(engines[0].destroy).toHaveBeenCalledOnce();
    expect(constructLenis).toHaveBeenCalledTimes(1);
    expect(engines[0].resize).not.toHaveBeenCalled();
  });
});

describe("route and anchor scrolling", () => {
  it("decodes initial hashes, then smooths repeat hashes through one route scroll path", () => {
    const target = document.createElement("section");
    target.id = "cirugía";
    document.body.append(target);
    const { scroll } = controller();
    scroll.navigate({ key: "first", pathname: "/", hash: "#cirug%C3%ADa", type: "POP" });
    flushFrame();
    expect(engines[0].scrollTo).toHaveBeenLastCalledWith(target, expect.objectContaining({ immediate: true }));

    scroll.navigate({ key: "repeat", pathname: "/", hash: "#cirug%C3%ADa", type: "PUSH" });
    flushFrame();
    expect(engines[0].scrollTo).toHaveBeenLastCalledWith(target, expect.objectContaining({ immediate: false }));
    expect(target.scrollIntoView).not.toHaveBeenCalled();
  });

  it("routes native hash clicks without a browser jump, while preserving modified clicks", () => {
    const { onAnchorNavigate } = controller();
    const link = document.createElement("a");
    link.href = "#ap-procedimientos";
    document.body.append(link);
    const click = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
    link.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    expect(onAnchorNavigate).toHaveBeenCalledWith("#ap-procedimientos");
    expect(engines[0].scrollTo).not.toHaveBeenCalled();
    onAnchorNavigate.mockClear();
    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true }));
    expect(onAnchorNavigate).not.toHaveBeenCalled();
  });

  it("leaves React Router, download and new-tab clicks to their existing handlers", () => {
    const { onAnchorNavigate } = controller();
    const link = document.createElement("a");
    link.href = "#ap-consulta";
    document.body.append(link);
    const handled = new MouseEvent("click", { bubbles: true, cancelable: true });
    handled.preventDefault();
    link.dispatchEvent(handled);
    link.target = "_blank";
    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    link.target = "";
    link.download = "file";
    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(onAnchorNavigate).not.toHaveBeenCalled();
  });

  it("cancels an obsolete hash scroll when the visitor navigates again", () => {
    const target = document.createElement("section");
    target.id = "ap-consulta";
    document.body.append(target);
    const { scroll } = controller();
    scroll.navigate({ key: "one", pathname: "/", hash: "#ap-consulta", type: "PUSH" });
    scroll.navigate({ key: "two", pathname: "/procedimientos", hash: "", type: "PUSH" });
    flushFrame();
    expect(engines[0].scrollTo).not.toHaveBeenCalledWith(target, expect.anything());
    expect(engines[0].scrollTo).toHaveBeenLastCalledWith(0, expect.objectContaining({ immediate: true }));
  });

  it("restores a saved position on Back and preserves scroll for query-only updates", () => {
    const { scroll } = controller();
    scroll.navigate({ key: "home", pathname: "/", hash: "", type: "POP" });
    flushFrame();
    vi.stubGlobal("scrollY", 640);
    scroll.navigate({ key: "procedure", pathname: "/procedimientos", hash: "", type: "PUSH" });
    flushFrame();
    vi.stubGlobal("scrollY", 0);
    scroll.navigate({ key: "home", pathname: "/", hash: "", type: "POP" });
    flushFrame();
    expect(engines[0].scrollTo).toHaveBeenLastCalledWith(640, expect.objectContaining({ immediate: true }));
    engines[0].scrollTo.mockClear();
    scroll.navigate({ key: "query", pathname: "/", hash: "", type: "PUSH" });
    flushFrame();
    expect(engines[0].scrollTo).not.toHaveBeenCalled();
  });

  it("uses native, immediate hash scrolling without a browser motion API", () => {
    vi.stubGlobal("matchMedia", undefined);
    const target = document.createElement("main");
    target.id = "contenido";
    target.tabIndex = -1;
    document.body.append(target);
    const { scroll } = controller();
    scroll.navigate({ key: "first", pathname: "/", hash: "#contenido", type: "POP" });
    flushFrame();
    expect(constructLenis).not.toHaveBeenCalled();
    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: "instant", block: "start" });
    expect(document.activeElement).toBe(target);
  });
});
