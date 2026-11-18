# NexCore Andes · Sitio web

Sitio en **Next.js 16** (App Router + TypeScript) con escena 3D en **Three.js**.

## Comandos

```bash
npm install      # instalar dependencias
npm run dev      # desarrollo en http://localhost:3000
npm run build    # compilar para producción
npm start        # servir la versión compilada
```

## Dónde editar

| Qué | Archivo |
| --- | --- |
| Servicios (lista, textos, íconos) | `lib/services.ts` |
| WhatsApp, Instagram, nombre | `lib/site.ts` |
| Colores, tipografía, estilos | `app/globals.css` (paleta del Manual de Marca en `:root`) |
| Escena 3D del inicio | `components/HeroScene.tsx` |
| Logos transparentes | `public/brand/` |
| Dominio para redes (Open Graph) | `app/layout.tsx` → `metadataBase` o variable `NEXT_PUBLIC_SITE_URL` |

## Instagram: últimas 3 publicaciones

La sección "Seguinos en @nexcoreandes" lee las 3 publicaciones más recientes con la API oficial de Instagram
(`lib/instagram.ts`) y se actualiza sola como máximo una vez por hora. Mientras no haya token, muestra las 3 imágenes
de respaldo de `public/social/`.

### Conseguir el token (una sola vez)

1. La cuenta @nexcoreandes tiene que ser **Profesional** (Empresa o Creador). Se cambia desde la app de Instagram:
   Configuración → Tipo de cuenta y herramientas → Cambiar a cuenta profesional.
2. Entrá a [developers.facebook.com](https://developers.facebook.com/apps), creá una app de tipo **Empresa** y agregale
   el producto **Instagram** → *API con inicio de sesión de Instagram*.
3. En **Generar tokens de acceso**, agregá la cuenta @nexcoreandes, iniciá sesión con ella y generá el token
   (permiso `instagram_business_basic`).
4. Copiá `.env.example` como `.env.local` y pegá el token en `INSTAGRAM_ACCESS_TOKEN`.
   Al publicar en Vercel, cargá la misma variable en *Settings → Environment Variables*.
5. Reiniciá `npm run dev` y las publicaciones aparecen.

### Renovarlo

El token dura **60 días**. Para extenderlo otros 60, abrí esta URL (con tu token) antes de que venza:

```
https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=TU_TOKEN
```

Si la respuesta trae un token distinto, reemplazalo en `.env.local` y en Vercel. Si el token vence, el sitio no se
rompe: vuelve a mostrar las publicaciones de respaldo.

## Publicar (Hostinger · Docker Manager)

1. Cada cambio que se sube a `main` dispara GitHub Actions (`.github/workflows/docker.yml`), que arma la imagen
   `ghcr.io/nexcore-andes/nexcoreandes-web:latest`.
2. En Hostinger → Docker Manager → Crear proyecto → **Editor .yaml**, pegá el contenido de `docker-compose.yml` y desplegá.
3. Para actualizar el sitio después de un cambio: esperá que termine la Action y en Hostinger tocá **Redesplegar**
   (vuelve a bajar la imagen `latest`).

La imagen tiene que poder descargarse desde el VPS: o el paquete es público
(GitHub → organización → Packages → nexcoreandes-web → Package settings → Change visibility → Public),
o en el VPS se hace `docker login ghcr.io` con un token que tenga permiso `read:packages`.
