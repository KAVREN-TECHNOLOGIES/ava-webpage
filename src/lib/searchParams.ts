import { useSyncExternalStore } from "react";
import { useSearchParams } from "react-router-dom";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const emptySearchParams = new URLSearchParams();

// Static HTML represents the canonical page. Apply per-visit combo/filter state
// after hydration so the first client tree matches that canonical HTML.
export function usePageSearchParams() {
  const [params, setParams] = useSearchParams();
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  return [hydrated ? params : emptySearchParams, setParams] as const;
}
