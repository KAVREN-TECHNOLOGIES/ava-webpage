import Lenis from "lenis";

type ScrollLocation = {
  key: string;
  pathname: string;
  hash: string;
  type: "POP" | "PUSH" | "REPLACE";
};

function anchorTarget(hash: string): HTMLElement | 0 | null {
  if (hash === "#") return 0;
  let id = hash.slice(1);
  try { id = decodeURIComponent(id); } catch { /* Keep literal IDs for malformed URLs. */ }
  return document.getElementById(id) ?? (id === "top" ? 0 : null);
}

function hasScrollLock() {
  return [document.body, document.documentElement].some(element =>
    [element.style.overflow, element.style.overflowY].some(value => value === "hidden" || value === "clip"),
  );
}

/** One page-level engine; visual animation remains in CSS. Called only after mount. */
export function createSmoothScroll(onAnchorNavigate: (hash: string) => void) {
  const media = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const positions = new Map<string, number>();
  const previousRestoration = window.history.scrollRestoration;
  if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  let engine: Lenis | null = null;
  let current: ScrollLocation | null = null;
  let frame: number | null = null;
  let locked = false;
  let destroyed = false;
  let sequence = 0;

  const synchronizeLock = () => {
    if (!engine) return;
    const nextLocked = hasScrollLock();
    if (nextLocked === locked) return;
    locked = nextLocked;
    if (locked) engine.stop();
    else engine.start();
  };

  const synchronizeMotionPreference = () => {
    if (destroyed) return;
    if (!media || media.matches) {
      engine?.destroy();
      engine = null;
      return;
    }
    if (engine) return;
    engine = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.1,
      anchors: false,
      // Body locks are synchronous and work without discrete overflow transitions.
      autoToggle: false,
      respectReducedMotion: true,
      prevent: node => node.matches(".ap-mobile-nav, dialog"),
    });
    locked = false;
    synchronizeLock();
  };

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.composedPath().find(node => node instanceof HTMLAnchorElement);
    if (!(link instanceof HTMLAnchorElement) || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.search !== window.location.search) return;
    if (!url.hash && !link.getAttribute("href")?.endsWith("#")) return;
    event.preventDefault();
    // Router state owns the hash, so there is no native jump racing a smooth scroll.
    onAnchorNavigate(url.hash || "#");
  };

  const locks = new MutationObserver(synchronizeLock);
  [document.body, document.documentElement].forEach(element => locks.observe(element, { attributes: true, attributeFilter: ["style"] }));
  document.addEventListener("click", onClick);
  media?.addEventListener("change", synchronizeMotionPreference);
  synchronizeMotionPreference();

  return {
    navigate(location: ScrollLocation) {
      if (destroyed) return;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      const previous = current;
      if (previous) positions.set(previous.key, window.scrollY);
      const restored = location.type === "POP" ? positions.get(location.key) : undefined;
      current = location;
      const visit = ++sequence;
      if (previous?.pathname === location.pathname && previous.hash === location.hash && !location.hash && restored === undefined) return;

      // Cancel the outgoing page's inertia before resolving the new page's layout.
      engine?.scrollTo(window.scrollY, { immediate: true, force: true });
      frame = requestAnimationFrame(() => {
        frame = null;
        if (destroyed) return;
        const target = restored ?? (location.hash ? anchorTarget(location.hash) : 0);
        if (target === null) return;
        const focusTarget = () => {
          if (visit === sequence && target instanceof HTMLElement && target.matches("a, button, input, select, textarea, [tabindex]")) {
            target.focus({ preventScroll: true });
          }
        };
        if (engine) {
          engine.resize();
          engine.scrollTo(target, {
            immediate: !previous || restored !== undefined || !location.hash,
            force: true,
            onComplete: focusTarget,
          });
        } else {
          if (target instanceof HTMLElement) target.scrollIntoView({ behavior: "instant", block: "start" });
          else window.scrollTo({ top: target, behavior: "instant" });
          focusTarget();
        }
      });
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (frame !== null) cancelAnimationFrame(frame);
      locks.disconnect();
      document.removeEventListener("click", onClick);
      media?.removeEventListener("change", synchronizeMotionPreference);
      engine?.destroy();
      engine = null;
      if ("scrollRestoration" in window.history) window.history.scrollRestoration = previousRestoration;
    },
  };
}
