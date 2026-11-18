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
        <p className="eyebrow mono reveal"><span className="pulse" /> {'// desde los Andes, para el mundo'}</p>
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
          <a href="#contacto" className="btn btn--primary magnetic"><span>Hablemos de tu proyecto</span> <i aria-hidden="true">→</i></a>
          <a href="#servicios" className="btn btn--ghost magnetic"><span>Ver servicios</span></a>
        </div>
      </div>
      <div className="hero__hud mono" aria-hidden="true">
        <div><span className="dim">LAT</span> 34.61°S</div>
        <div><span className="dim">LON</span> 68.33°W</div>
        <div><span className="dim">SYS</span> <span className="ok">ONLINE</span></div>
      </div>
      <a href="#servicios" className="hero__scroll mono" aria-label="Bajar a servicios"><span>scroll</span><i /></a>
    </section>
  );
}
