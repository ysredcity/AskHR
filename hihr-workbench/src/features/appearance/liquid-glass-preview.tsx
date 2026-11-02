import { useEffect, useState } from 'react';
import { Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHR } from '@/features/hr/context';

type Appearance = 'classic' | 'glass';
const storageKey = 'askhr:appearance-experiment';
function initialAppearance(): Appearance {
  const query = new URLSearchParams(window.location.search).get('appearance');
  if (query === 'classic' || query === 'glass') return query;
  try { return localStorage.getItem(storageKey) === 'classic' ? 'classic' : 'glass'; }
  catch { return 'glass'; }
}

/** Experimental branch only: the switch changes styling without remounting the workspace. */
export function LiquidGlassPreview() {
  const { route } = useHR();
  const [appearance, setAppearance] = useState<Appearance>(initialAppearance);
  const enabled = ['home', 'team', 'organization', 'hall'].includes(route);
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
  if (!enabled) return null;
  return <div className="appearance-preview" role="group" aria-label="外观对比">
    <Gem className="size-3.5 shrink-0" aria-hidden="true" />
    <Button size="xs" variant="ghost" aria-pressed={appearance === 'classic'} onClick={() => choose('classic')}>原版</Button>
    <Button size="xs" variant="ghost" aria-pressed={appearance === 'glass'} onClick={() => choose('glass')}>玻璃</Button>
  </div>;
}
