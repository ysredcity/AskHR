import { createContext, useContext } from 'react';

export type Appearance = 'classic' | 'glass';
export const AppearanceContext = createContext<{ appearance: Appearance; chooseAppearance: (appearance: Appearance) => void } | null>(null);
export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) throw new Error('useAppearance requires AppearanceProvider');
  return context;
}
