'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

const WORDS = ['impulsa', 'automatiza', 'conecta', 'hace crecer', 'digitaliza'];

export default function Hero() {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      setPhase('out');
      window.setTimeout(() => {
        setI((v) => (v + 1) % WORDS.length);
        setPhase('in');
        requestAnimationFrame(() => requestAnimationFrame(() => setPhase('idle')));
      }, 550);
    }, 2800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="hero" id="inicio">
      <HeroScene />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__content">
        <h1 className="hero__title reveal">
          Tecnología que{' '}
          <span className="rotator" aria-live="polite">
            <span className={`grad${phase === 'idle' ? '' : ` ${phase}`}`}>{WORDS[i]}</span>
          </span>
          <br />tu negocio.
        </h1>
        <p className="hero__sub reveal">
          Te ayudamos a vender más, conseguir nuevos clientes y ordenar tu negocio con páginas web,
          tiendas online, sistemas a medida, automatizaciones e inteligencia artificial.
        </p>
        <div className="hero__ctas reveal">
          <a href="#contacto" className="btn btn--primary"><span>Hablemos de tu proyecto</span> <i aria-hidden="true">→</i></a>
          <a href="#servicios" className="btn btn--ghost"><span>Ver servicios</span></a>
        </div>
      </div>
    </section>
  );
}
