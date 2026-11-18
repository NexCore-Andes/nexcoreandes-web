'use client';

import { useEffect, useState } from 'react';
import { waLink } from '@/lib/site';
import { WhatsAppIcon } from './Icons';

export default function WhatsAppFloat() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a href={waLink('¡Hola NexCore Andes! 👋 Quiero hacer una consulta.')} className={`wa-float${show ? ' show' : ''}`}
      target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp">
      <WhatsAppIcon />
      <span className="wa-float__label">¿Hablamos?</span>
    </a>
  );
}
