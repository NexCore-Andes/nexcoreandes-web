'use client';

import { useEffect, useState } from 'react';
import { Logo } from './Logo';

const LINKS = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#proceso', label: 'Proceso' },
  { href: '#nosotros', label: 'Nosotros' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`}>
      <a href="#inicio" className="brand" aria-label="NexCore Andes, inicio">
        <Logo width={196} priority />
      </a>
      <nav className={`nav__links${open ? ' open' : ''}`} onClick={(e) => { if ((e.target as Element).closest('a')) setOpen(false); }}>
        {LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
        <a href="#contacto" className="nav__cta">Contacto <span aria-hidden="true">→</span></a>
      </nav>
      <button className="nav__burger" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} onClick={() => setOpen(!open)}>
        <span /><span />
      </button>
    </header>
  );
}
