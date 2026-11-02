import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}
const getSnapshot = () => window.innerWidth;
const getServerSnapshot = () => 1024;
export function useViewportWidth() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
