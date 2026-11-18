'use client';

import { useEffect, useRef, useState } from 'react';
import { SERVICES } from '@/lib/services';
import { ServiceIcon } from './Icons';
import { useConsult } from './ConsultContext';

const pad = (n: number) => String(n).padStart(2, '0');
const GLYPHS = '<>/{}[]#$%01_=+*';

/** Título que se "decodifica" como código */
function Scramble({ text }: { text: string }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setOut(text); return; }
    let frame = 0;
    const total = 18;
    const id = window.setInterval(() => {
      frame++;
      const done = Math.floor((frame / total) * text.length);
      setOut(text.split('').map((ch, i) => (i < done || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(''));
      if (frame >= total) { window.clearInterval(id); setOut(text); }
    }, 28);
    return () => window.clearInterval(id);
  }, [text]);
  return <>{out}</>;
}

export default function Services() {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const finePointer = useRef(false);
  const { consult } = useConsult();
  const s = SERVICES[current];

  useEffect(() => {
    finePointer.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }, []);

  return (
    <section className="section services" id="servicios">
      <div className="section__head">
        <p className="kicker mono reveal">01 / servicios</p>
        <h2 className="section__title reveal">Soluciones digitales para <span className="grad">tu negocio</span>.</h2>
        <p className="section__lead reveal">Elegí un servicio para ver qué incluye. Podés consultarnos por uno o combinar varios: armamos la solución a tu medida.</p>
      </div>

      <div className="explorer reveal">
        <ul className="explorer__list" role="tablist" aria-label="Servicios">
          {SERVICES.map((svc, i) => (
            <li key={svc.id} className={`svc-item${open === i ? ' open' : ''}`}>
              <button
                className="svc-btn"
                role="tab"
                aria-selected={current === i}
                onClick={() => { setCurrent(i); setOpen(open === i ? null : i); }}
                onMouseEnter={() => { if (finePointer.current && window.innerWidth > 980) setCurrent(i); }}
              >
                <ServiceIcon name={svc.icon} />
                <span className="t">{svc.title}</span>
                <span className="n">{pad(i + 1)}</span>
              </button>
              <div className="acc"><div><div className="acc__inner">
                <p>{svc.desc}</p>
                <ul>{svc.feat.map((f) => <li key={f}>{f}</li>)}</ul>
                <button className="btn btn--primary" onClick={() => consult(svc.id)}><span>Consultar</span> <i aria-hidden="true">→</i></button>
              </div></div></div>
            </li>
          ))}
        </ul>

        <article className="explorer__panel tilt" aria-live="polite">
          <div className="panel__frame" aria-hidden="true" />
          <div className="panel__top">
            <span className="panel__idx mono">{pad(current + 1)}</span>
            <span className="panel__tag mono">{s.tag}</span>
          </div>
          <div key={`i${current}`} className="panel__icon panel-anim"><ServiceIcon name={s.icon} /></div>
          <h3 key={`t${current}`} className="panel__title panel-anim"><Scramble text={s.title} /></h3>
          <p key={`d${current}`} className="panel__desc panel-anim">{s.desc}</p>
          <ul key={`f${current}`} className="panel__features panel-anim">{s.feat.map((f) => <li key={f}>{f}</li>)}</ul>
          <button className="btn btn--primary magnetic" onClick={() => consult(s.id)}><span>Consultar este servicio</span> <i aria-hidden="true">→</i></button>
        </article>
      </div>
    </section>
  );
}
