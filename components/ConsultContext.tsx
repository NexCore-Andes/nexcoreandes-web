'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type Ctx = {
  selected: Set<string>;
  toggle: (id: string, force?: boolean) => void;
  consult: (id: string) => void;
};

const ConsultCtx = createContext<Ctx | null>(null);

export function ConsultProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string, force?: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const on = force ?? !next.has(id);
      if (on) next.add(id); else next.delete(id);
      return next;
    });
  }, []);

  const consult = useCallback((id: string) => {
    toggle(id, true);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('contacto')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    window.setTimeout(() => (document.getElementById('fName') as HTMLInputElement | null)?.focus({ preventScroll: true }), 900);
  }, [toggle]);

  const value = useMemo(() => ({ selected, toggle, consult }), [selected, toggle, consult]);
  return <ConsultCtx.Provider value={value}>{children}</ConsultCtx.Provider>;
}

export function useConsult() {
  const ctx = useContext(ConsultCtx);
  if (!ctx) throw new Error('useConsult debe usarse dentro de ConsultProvider');
  return ctx;
}
