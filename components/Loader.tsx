'use client';

import { useEffect, useState } from 'react';
import { Isotipo } from './Logo';

const MSGS = ['iniciando núcleo', 'cargando cordillera', 'conectando servicios', 'listo'];

export default function Loader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.classList.add('loading');
    let loaded = document.readyState === 'complete';
    const onLoad = () => { loaded = true; };
    window.addEventListener('load', onLoad);
    const safety = window.setTimeout(() => { loaded = true; }, 4000);
    let p = 0;
    const tick = window.setInterval(() => {
      p = Math.min(p + (loaded ? 9 : Math.random() * 4), loaded ? 100 : 90);
      setPct(p);
      if (p >= 100) {
        window.clearInterval(tick);
        window.setTimeout(() => { setDone(true); document.body.classList.remove('loading'); }, 250);
      }
    }, 40);
    return () => {
      window.clearInterval(tick); window.clearTimeout(safety);
      window.removeEventListener('load', onLoad);
      document.body.classList.remove('loading');
    };
  }, []);

  return (
    <div className={`loader${done ? ' done' : ''}`} aria-hidden="true">
      <Isotipo width={150} className="loader__mark" priority />
      <div className="loader__text mono">
        <span>{MSGS[Math.min(Math.floor(pct / 34), 3)]}</span>
        <span className="loader__pct">{Math.round(pct)}%</span>
      </div>
      <div className="loader__bar"><span style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
