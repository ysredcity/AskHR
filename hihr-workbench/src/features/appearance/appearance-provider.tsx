import { useEffect, useState, type ReactNode } from 'react';
import { AppearanceContext, type Appearance } from './context';
import { useHR } from '@/features/hr/context';

const storageKey = 'askhr:appearance-experiment';
function initialAppearance(): Appearance {
  const query = new URLSearchParams(window.location.search).get('appearance');
  if (query === 'classic' || query === 'glass') return query;
  try { return localStorage.getItem(storageKey) === 'classic' ? 'classic' : 'glass'; }
  catch { return 'glass'; }
}

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const { route } = useHR();
  const [appearance, setAppearance] = useState<Appearance>(initialAppearance);
  const enabled = ['home', 'employee', 'team', 'organization', 'tasks', 'hall'].includes(route);
  useEffect(() => {
    document.documentElement.dataset.askhrAppearance = enabled ? appearance : 'classic';
    return () => { delete document.documentElement.dataset.askhrAppearance; };
  }, [appearance, enabled]);
  const choose = (next: Appearance) => {
    setAppearance(next);
    const url = new URL(window.location.href);
    url.searchParams.set('appearance', next);
    window.history.replaceState(null, '', url);
    try { localStorage.setItem(storageKey, next); } catch { /* The URL still keeps the preview shareable. */ }
  };
  return <AppearanceContext.Provider value={{ appearance, chooseAppearance: choose }}>{children}</AppearanceContext.Provider>;
}
