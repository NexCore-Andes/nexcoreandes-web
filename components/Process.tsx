'use client';

import { useEffect, useRef, useState } from 'react';

const STEPS = [
  { t: 'Diagnóstico', d: 'Escuchamos tu negocio, entendemos tus procesos y detectamos dónde la tecnología genera más impacto.', m: 'reunión · relevamiento · objetivos' },
  { t: 'Estrategia y diseño', d: 'Definimos alcance, tiempos y presupuesto. Diseñamos la experiencia y la arquitectura antes de escribir una línea de código.', m: 'propuesta · prototipo · UX' },
  { t: 'Desarrollo ágil', d: 'Construimos por etapas con entregas frecuentes: ves avances reales y opinás en cada paso.', m: 'sprints · demos · testing' },
  { t: 'Lanzamiento y soporte', d: 'Publicamos, capacitamos a tu equipo y seguimos a tu lado con mantenimiento, mejoras y métricas.', m: 'deploy · capacitación · evolución' },
];

export default function Process() {
  const wrap = useRef<HTMLDivElement>(null);
  const line = useRef<SVGLineElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  // React es el único dueño de las clases de cada paso: "shown" (visible) y "lit" (nodo encendido).
  const [shown, setShown] = useState<boolean[]>(STEPS.map(() => false));
  const [lit, setLit] = useState<boolean[]>(STEPS.map(() => false));

  useEffect(() => {
    const same = (a: boolean[], b: boolean[]) => a.every((v, i) => v === b[i]);
    const update = () => {
      const el = wrap.current;
      if (!el) return;
      const vh = innerHeight;
      const r = el.getBoundingClientRect();
      const p = Math.min(Math.max((vh * 0.6 - r.top) / r.height, 0), 1);
      if (line.current) line.current.style.strokeDashoffset = String(1000 - p * 1000);
      const tops = stepRefs.current.map((s) => (s ? s.getBoundingClientRect().top : Infinity));
      // visible cuando entra en pantalla; se mantiene visible al volver a subir
      setShown((prev) => { const next = prev.map((v, i) => v || tops[i] < vh * 0.9); return same(prev, next) ? prev : next; });
      // el nodo se enciende cuando la línea lo alcanza, y se apaga si volvés a subir
      setLit((prev) => { const next = tops.map((t) => t + 40 < vh * 0.6); return same(prev, next) ? prev : next; });
    };
    // Cálculo directo en cada scroll (son pocas mediciones y los estados repetidos no re-renderizan)
    update();
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    return () => { removeEventListener('scroll', update); removeEventListener('resize', update); };
  }, []);

  return (
    <section className="section process" id="proceso">
      <div className="section__head">
        <h2 className="section__title reveal">De la idea al <span className="grad">lanzamiento</span>, en un circuito claro.</h2>
      </div>
      <div className="circuit" ref={wrap}>
        <svg className="circuit__line" viewBox="0 0 4 1000" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="lineGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1000">
              <stop offset="0" stopColor="#8E2AFD" /><stop offset=".5" stopColor="#2776FF" /><stop offset="1" stopColor="#00DEFD" />
            </linearGradient>
          </defs>
          <line x1="2" y1="0" x2="2" y2="1000" className="circuit__bg" />
          <line x1="2" y1="0" x2="2" y2="1000" className="circuit__fg" ref={line} />
        </svg>
        {STEPS.map((s, i) => (
          <div key={s.t} className={`step${shown[i] ? ' shown' : ''}${lit[i] ? ' lit' : ''}`} ref={(el) => { stepRefs.current[i] = el; }}>
            <span className="step__node" />
            <div className="step__card">
              <div className="step__head">
                <span className="step__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="step__of mono">ETAPA {i + 1} DE {STEPS.length}</span>
              </div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <span className="step__bar" aria-hidden="true"><i style={{ width: `${((i + 1) / STEPS.length) * 100}%` }} /></span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
