import { createContext, useContext } from "react";
import type { Store } from "./store";
export const HeaderTarget = createContext<HTMLElement | null>(null);
export const Context = createContext<Store | null>(null);
export function useHR() {
  const store = useContext(Context);
  if (!store) throw new Error("HRProvider missing");
  return store;
}
