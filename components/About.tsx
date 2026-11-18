import { Isotipo } from './Logo';

const VALUES = [
  { k: '</>', t: 'Código propio', d: 'Nada de plantillas genéricas. Cada solución se construye para tu caso.' },
  { k: '→', t: 'Comunicación directa', d: 'Hablás con quienes desarrollan tu proyecto, sin intermediarios.' },
  { k: '∞', t: 'Acompañamiento', d: 'No desaparecemos al entregar: soporte, mejoras y evolución continua.' },
  { k: '↗', t: 'Pensado para escalar', d: 'Arquitecturas que crecen con tu negocio, sin rehacer todo después.' },
];

const TRAITS = [
  { t: 'Profesional', d: 'Claridad y confianza.' },
  { t: 'Cercana', d: 'Comunicación sencilla.' },
  { t: 'Innovadora', d: 'Tecnología aplicada.' },
  { t: 'Resolutiva', d: 'Enfocada en impacto.' },
];

export default function About() {
  return (
    <section className="section about" id="nosotros">
      <div className="about__grid">
        <div className="about__text">
          <h2 className="section__title reveal">Tecnología con <span className="grad">propósito</span>.</h2>
          <p className="section__lead reveal">
            Somos NexCore Andes. Ayudamos a negocios y emprendimientos a transformar necesidades reales en soluciones digitales concretas.
            Nuestra promesa: <strong>construir herramientas claras, útiles y escalables para simplificar el trabajo e impulsar resultados.</strong>
          </p>
          <div className="values">
            {VALUES.map((v) => (
              <div key={v.t} className="value reveal">
                <span className="value__k mono">{v.k}</span>
                <div><h4>{v.t}</h4><p>{v.d}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="about__visual reveal" aria-hidden="true">
          <div className="emblem tilt">
            <svg className="emblem__circuit" viewBox="0 0 400 400" fill="none">
              <path d="M20 330 C 120 330, 120 250, 200 250 S 300 170, 380 170" />
              <path d="M40 90 H 140 C 170 90, 170 130, 200 130 H 360" />
              <rect x="133" y="83" width="14" height="14" rx="3" className="node" />
              <rect x="293" y="203" width="14" height="14" rx="3" className="node n2" />
            </svg>
            <Isotipo width={360} className="emblem__logo" />
            <div className="emblem__traits">
              {TRAITS.map((t) => (
                <span key={t.t} className="trait mono"><b>{t.t}</b>{t.d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
