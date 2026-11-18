// Lee las últimas publicaciones de @nexcoreandes con la API oficial de Instagram
// ("Instagram API with Instagram Login"). Requiere una cuenta Profesional (Empresa o Creador)
// y un token de acceso de larga duración en la variable INSTAGRAM_ACCESS_TOKEN.
// Si no hay token o la API falla, devuelve null y el sitio muestra las publicaciones de respaldo.

export type InstaPost = {
  id: string;
  image: string;
  permalink: string;
  caption: string;
  isVideo: boolean;
};

type ApiMedia = {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
};

const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';

export async function getLatestPosts(limit = 3): Promise<InstaPost[] | null> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return null;

  try {
    const url = `https://graph.instagram.com/me/media?fields=${FIELDS}&limit=${limit}&access_token=${encodeURIComponent(token)}`;
    // Se vuelve a consultar como máximo una vez por hora (las URLs de imagen de Instagram vencen)
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error('[instagram] La API respondió', res.status, await res.text());
      return null;
    }
    const json = (await res.json()) as { data?: ApiMedia[] };
    const posts = (json.data ?? [])
      .map((m) => ({
        id: m.id,
        image: (m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url) ?? '',
        permalink: m.permalink,
        caption: (m.caption ?? '').trim(),
        isVideo: m.media_type === 'VIDEO',
      }))
      .filter((p) => p.image)
      .slice(0, limit);
    return posts.length ? posts : null;
  } catch (err) {
    console.error('[instagram] No se pudieron leer las publicaciones', err);
    return null;
  }
}
