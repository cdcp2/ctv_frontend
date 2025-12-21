# CTV Frontend (Astro)

Frontend público para el portal de noticias. Consume el backend Rust en `/api` (ver `.env`).

## Configuración
1) Instalar deps: `npm install`
2) Crear `.env` con:
```
PUBLIC_API_BASE=http://localhost:3000
PUBLIC_FALLBACK_YT_EMBED=https://www.youtube.com/embed/<id>   # opcional, embed directo para la señal
PUBLIC_FALLBACK_YT_IDS=id1,id2                              # opcional, pool rotativo cada 12h
``` 
3) Ejecutar:
- `npm run dev` (localhost:4321)
- `npm run build` (genera `dist/`)

> La página de artículo es SSR en runtime; para el build estático se deja sin prerender (getStaticPaths vacío), así que en despliegue estático no habrá rutas de artículo pre-renderizadas.

## Rutas actuales
- `/` Home con: señal en vivo (`site_config`), destacados (featured/breaking), últimas, más leídas, videos.
- `/article/[slug]` Detalle (incrementa vistas en el cliente, muestra video embed, tags y relacionadas).

## Datos que se consumen del backend
- `GET /api/categories` (header)
- `GET /api/site-config` (stream en vivo / banner)
- `GET /api/articles` con filtros (`is_featured`, `is_breaking`, `has_video`, `tag_id`)
- `GET /api/articles/featured|breaking|videos|most-read|:slug|:slug/related|:slug/tags`
- `POST /api/articles/:slug/view` (se llama en el detalle)
- Uploads servidos desde `/uploads/...`

## Pendientes (shortlist)
- Añadir páginas de categoría/búsqueda/tag.
- Mejorar estilos responsive/animaciones e integrar comentarios (FB).
- Panel interno (otra app) para CRUD y cuentas (cuando exista).
