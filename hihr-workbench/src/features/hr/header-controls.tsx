import { useContext, type ReactNode } from 'react';
import { HeaderTarget } from './context';
import { createPortal } from 'react-dom';

export function HeaderControls({ children }: { children: ReactNode }) {
  const target = useContext(HeaderTarget);
  return target ? createPortal(<div className="flex min-w-0 items-center justify-between gap-2 [&>div]:mb-0 [&>div:first-child]:min-w-0">{children}</div>, target) : null;
}
