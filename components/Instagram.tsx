import Image from 'next/image';
import { SITE } from '@/lib/site';
import { getLatestPosts } from '@/lib/instagram';

// Se muestran si todavía no hay token de Instagram o si la API no responde
const FALLBACK = [
  { src: '/social/post-somos.webp', alt: 'Publicación: Somos NexCore Andes, tecnología que impulsa negocios' },
  { src: '/social/post-servicios.webp', alt: 'Publicación: Soluciones digitales para tu negocio' },
  { src: '/social/post-solucion.webp', alt: 'Publicación: ¿Tu negocio necesita una solución digital?' },
];

const short = (text: string, max = 110) => (text.length > max ? `${text.slice(0, max).trimEnd()}…` : text);

export default async function Instagram() {
  const posts = await getLatestPosts(3);

  return (
    <section className="section insta" id="instagram">
      <div className="section__head">
        <h2 className="section__title reveal">
          Seguinos en <a href={SITE.instagramUrl} target="_blank" rel="noopener" className="grad">@{SITE.instagram}</a>
        </h2>
      </div>

      <div className="insta__stage">
        {posts
          ? posts.map((p) => (
              <a key={p.id} className="post tilt reveal" href={p.permalink} target="_blank" rel="noopener">
                {/* URL de Instagram que vence cada tanto: se usa <img> directo, sin optimizar */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.caption ? short(p.caption, 120) : 'Publicación de NexCore Andes en Instagram'} loading="lazy" />
                {p.isVideo && <span className="post__badge mono" aria-hidden="true">▶ video</span>}
                {p.caption && <span className="post__caption">{short(p.caption)}</span>}
              </a>
            ))
          : FALLBACK.map((p) => (
              <a key={p.src} className="post tilt reveal" href={SITE.instagramUrl} target="_blank" rel="noopener">
                <Image src={p.src} alt={p.alt} width={1122} height={1402} sizes="(max-width: 980px) 78vw, 33vw" />
              </a>
            ))}
      </div>

      <div className="insta__cta reveal">
        <a href={SITE.instagramUrl} target="_blank" rel="noopener" className="btn btn--ghost">
          <span>Ver más en Instagram</span> <i aria-hidden="true">→</i>
        </a>
      </div>
    </section>
  );
}
