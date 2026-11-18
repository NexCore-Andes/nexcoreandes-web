import { SITE, waLink } from '@/lib/site';
import { Logo } from './Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__big" aria-hidden="true">NEXCORE<span>ANDES</span></div>
      <svg className="footer__peaks" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 120 L120 70 L180 90 L300 30 L360 60 L420 40 L520 95 L620 20 L700 70 L760 50 L860 100 L960 35 L1040 75 L1120 55 L1200 90 L1200 120 Z" />
      </svg>
      <div className="footer__row">
        <a href="#inicio" className="brand" aria-label="NexCore Andes, volver al inicio"><Logo width={190} /></a>
        <p className="mono dim">© {new Date().getFullYear()} {SITE.name} · {SITE.tagline}</p>
        <div className="footer__social">
          <a href={waLink()} target="_blank" rel="noopener">WhatsApp</a>
          <a href={SITE.instagramUrl} target="_blank" rel="noopener">Instagram</a>
        </div>
      </div>
    </footer>
  );
}
