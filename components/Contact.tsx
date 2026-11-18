'use client';

import { useState } from 'react';
import { SERVICES } from '@/lib/services';
import { SITE, waLink } from '@/lib/site';
import { useConsult } from './ConsultContext';
import { InstagramIcon, WhatsAppIcon } from './Icons';

export default function Contact() {
  const { selected, toggle } = useConsult();
  const [nombre, setNombre] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errors, setErrors] = useState({ chips: false, nombre: false });
  const [popped, setPopped] = useState<string | null>(null);

  const names = SERVICES.filter((s) => selected.has(s.id)).map((s) => s.title);
  let msg = '¡Hola NexCore Andes! 👋';
  if (nombre.trim()) msg += `\nSoy ${nombre.trim()}${empresa.trim() ? ` de ${empresa.trim()}` : ''}.`;
  if (names.length) msg += `\nMe interesa: ${names.join(', ')}.`;
  if (mensaje.trim()) msg += `\n\n${mensaje.trim()}`;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = { chips: selected.size === 0, nombre: !nombre.trim() };
    setErrors(next);
    if (next.chips || next.nombre) {
      document.getElementById(next.chips ? 'chips' : 'fName')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    window.open(waLink(msg), '_blank', 'noopener');
  };

  return (
    <section className="section contact" id="contacto">
      <div className="contact__grid">
        <div className="contact__intro">
          <p className="kicker mono reveal">04 / contacto</p>
          <h2 className="section__title reveal">Hablemos de tu <span className="grad">próximo proyecto</span>.</h2>
          <p className="section__lead reveal">Elegí los servicios que te interesan, contanos un poco y seguimos la charla por WhatsApp. Sin compromiso.</p>
          <div className="direct reveal">
            <a href={waLink()} target="_blank" rel="noopener" className="direct__item">
              <span className="direct__ic wa"><WhatsAppIcon /></span>
              <span><small className="mono">whatsapp</small>{SITE.whatsappLabel}</span>
            </a>
            <a href={SITE.instagramUrl} target="_blank" rel="noopener" className="direct__item">
              <span className="direct__ic ig"><InstagramIcon /></span>
              <span><small className="mono">instagram</small>@{SITE.instagram}</span>
            </a>
          </div>
        </div>

        <form className="terminal reveal" onSubmit={onSubmit} noValidate>
          <div className="terminal__bar"><i /><i /><i /><span className="mono">nueva_consulta.sh</span></div>
          <div className="terminal__body">
            <fieldset>
              <legend className="mono"><span className="prompt">$</span> ¿Qué servicio necesitás? <span className="dim">(elegí uno o varios)</span></legend>
              <div className="chips" id="chips">
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`chip${popped === s.id ? ' pop' : ''}`}
                    aria-pressed={selected.has(s.id)}
                    onClick={() => { toggle(s.id); setPopped(s.id); setErrors((er) => ({ ...er, chips: false })); }}
                    onAnimationEnd={() => setPopped(null)}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
              {errors.chips && <p className="field__error mono">Elegí al menos un servicio.</p>}
            </fieldset>
            <div className="row">
              <label className="field">
                <span className="mono"><span className="prompt">$</span> tu nombre</span>
                <input id="fName" type="text" autoComplete="name" placeholder="Ej: Martina López" value={nombre}
                  className={errors.nombre ? 'invalid' : ''}
                  onChange={(e) => { setNombre(e.target.value); setErrors((er) => ({ ...er, nombre: false })); }} />
              </label>
              <label className="field">
                <span className="mono"><span className="prompt">$</span> empresa / negocio <span className="dim">(opcional)</span></span>
                <input type="text" autoComplete="organization" placeholder="Ej: Bodega Los Álamos" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
              </label>
            </div>
            <label className="field">
              <span className="mono"><span className="prompt">$</span> contanos tu idea <span className="dim">(opcional)</span></span>
              <textarea rows={3} placeholder="Necesito una web para mostrar mis productos y recibir pedidos…" value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
            </label>
            <div className="preview mono" aria-live="polite">
              <span className="dim">{'// vista previa del mensaje'}</span>
              <p>{msg}</p>
            </div>
            <button type="submit" className="btn btn--wa magnetic"><WhatsAppIcon /><span>Enviar por WhatsApp</span></button>
          </div>
        </form>
      </div>
    </section>
  );
}
