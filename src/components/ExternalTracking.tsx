import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const scriptId = "ava-ghl-tracking";
const trackingId = "tk_c94b2b94d91140cc804c4e934610176c";
const scriptUrl = "https://link.msgsndr.com/js/external-tracking.js";

type PageView = {
  type: "external_script_page_view";
  timestamp: number;
  title: string;
  url: string;
  path: string;
  referrer: string;
  userAgent: string;
  formId?: string;
};

declare global {
  interface Window {
    _lcTracking?: { tracker?: { sendEvent: (event: PageView) => Promise<void> } };
  }
}

/** Load once after the React forms exist; the SDK handles their submissions. */
export function ExternalTracking() {
  const { pathname, search } = useLocation();
  const page = pathname + search;
  const currentPage = useRef(page);
  const lastPage = useRef<string | null>(null);
  currentPage.current = page;

  useEffect(() => {
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = scriptUrl;
      script.async = true;
      script.dataset.trackingId = trackingId;
      script.dataset.status = "loading";
      document.body.append(script);
    }
    const ready = () => {
      script.dataset.status = window._lcTracking?.tracker ? "ready" : "error";
      // The SDK sends the initial view itself. Do not send it a second time.
      lastPage.current = currentPage.current;
    };
    const failed = () => { script.dataset.status = "error"; };
    script.addEventListener("load", ready);
    script.addEventListener("error", failed);
    if (window._lcTracking?.tracker) ready();
    return () => {
      script.removeEventListener("load", ready);
      script.removeEventListener("error", failed);
      // Removing the tag does not remove SDK observers; keep the singleton.
    };
  }, []);

  useEffect(() => {
    const tracker = window._lcTracking?.tracker;
    if (!tracker || lastPage.current === null || lastPage.current === page) return;
    const previous = lastPage.current;
    lastPage.current = page;
    const formId = document.querySelector<HTMLFormElement>("form.consultation-form")?.id;
    // The supplied SDK only sends an initial view. Reuse its session for SPA routes.
    void tracker.sendEvent({
      type: "external_script_page_view",
      timestamp: Date.now(),
      title: document.title,
      url: new URL(page, window.location.origin).href,
      path: pathname,
      referrer: new URL(previous, window.location.origin).href,
      userAgent: navigator.userAgent,
      ...(formId ? { formId } : {}),
    }).catch(() => { console.warn("AVA page tracking could not be recorded."); });
  }, [page, pathname]);

  return null;
}
