# Los Boyacos · sala de espera (móvil)

Página de una sola pantalla, solo HTML + CSS + JS (sin frameworks), pensada para celular (360–430 px). En escritorio se muestra en un marco vertical de 430 px. En línea: https://losboyacos.vercel.app (Vercel, rama `main`; cada `git push` publica).

## Estructura
| Ruta | Qué es |
|---|---|
| `index.html` | Toda la experiencia (estilos y script incluidos) |
| `privacidad.html` | Política de tratamiento de datos (Ley 1581 de 2012) |
| `assets/` | Videos (`clip1-entrada`, `clip2-loop`, `clip3a/b/c`), `poster.webp`, `og.jpg` y `img/` (imágenes de ejemplo) |
| `assets/habitaciones/` | Las 3 habitaciones móviles (fotos, oficina, mostrador): por cada una `-entrada`, `-reposo`, `-salida` (mp4 720×1280) y un póster `.webp` |
| `assets/escritorio/` | Sala para pantallas anchas (16:9, ≥900 px): `entrada.mp4`, `loop.mp4` y `poster.webp`. Las habitaciones de escritorio son `assets/habitaciones/<id>-16x9-*.mp4` y `<id>-16x9.webp`. También `cat-abre`, `cat-pasa`, `cat-atras` (catálogo en video 16:9) y `cat-parche.webp`. En escritorio el texto de las hojas viene dentro del video (las hojas HTML son solo zonas táctiles invisibles), el detalle sale como panel a la derecha y `cat-parche.webp` tapa el "Otro" repetido de la 2.ª doble. Si cambian las marcas del catálogo hay que regenerar el video |
| `contenido/` | `banners.json`, `galeria.json`, `blog.json`: contenido editable (también desde el CMS) |
| `admin/`, `api/` | Panel de contenido (Decap CMS) y su acceso con GitHub. Guía: `README-CMS.md`; plantillas reutilizables en `docs/cms/` (una para Claude y otra para el cliente) |
| `robots.txt`, `sitemap.xml` | SEO (apuntan al dominio final losboyacos.com) |
| `docs/` | `analitica.md` (cómo activar GA4/Hotjar/Meta) y `videos-gemini-pendientes.md` (registro de videos e imágenes generados con IA, pendientes de descargar) |
| `tests/` | Pruebas con Playwright (ver abajo) |
| `tools/` | Utilidades de video usadas en la producción (seguimiento de hojas, texto sobre el libro) `procesar-escritorio.sh` (lo mismo para los videos 16:9 de escritorio: sala y habitaciones) y `procesar-habitaciones.sh` (recorta los videos de Gemini y genera entrada/reposo/salida/póster con ffmpeg) |

## Pruebas
Necesitan Playwright con Microsoft Edge. Cada archivo recibe la carpeta del proyecto como argumento: `node tests/<archivo>.mjs <ruta-del-proyecto>`. Las capturas quedan en `shots/` (no se versiona).

| Archivo | Cubre |
|---|---|
| `t.mjs` | Flujo principal (carga, entrada, catálogo, hojas, WhatsApp) |
| `vistas-nuevas.mjs` | Galería, blog, redes, contacto, banners, buscador de marcas |
| `mapa.mjs` | Mapa embebido con carga diferida |
| `privacidad.mjs` | Línea legal, modal y `privacidad.html` |
| `analitica.mjs` | Eventos de analítica y bloques desactivados |
| `cms.mjs` | Configuración del CMS y funciones de acceso |
| `seo.mjs` | Canonical, og:url, JSON-LD, robots.txt y sitemap.xml (no necesita navegador) |
| `accesibilidad.mjs` | Auditoría axe-core (WCAG 2.1 A/AA) en 9 pantallas y alternativa sin JavaScript. Requiere `npm i axe-core` junto a Playwright |
| `habitaciones.mjs` | Las 3 habitaciones: acceso, alineación de fotos/mapa/placas/pizarra, hojas, lightbox y regreso a la sala |
| `escritorio.mjs` | Pantalla ancha (1440×900, 1280×720, 1920×1080): clips 16:9, panel lateral, habitaciones alineadas, y que el móvil no cambie |
| `clic-fantasma.mjs`, `clips-lentos.mjs` | Casos límite de toque y de conexión lenta |

## Pendiente (lo entrega el cliente)
Variables al inicio del `<script>` de `index.html`:
- `MAPA_EMBED`: enlace oficial de "Insertar un mapa" de Google Maps (hoy usa el mapa por dirección).
- `EMAIL_FORMULARIO`: correo que recibe el formulario de contacto (sin él, el formulario ofrece enviar por WhatsApp).
- `INSTAGRAM`, `FACEBOOK`, `TIKTOK`: usuarios de las redes (vacío = la sección muestra un aviso).

Otros datos:
- Razón social y NIT para `privacidad.html` (hay un comentario con el lugar exacto).
- IDs de GA4, Hotjar y Píxel de Meta (ver `docs/analitica.md`).
- Claves de acceso del CMS en Vercel (ver `README-CMS.md`).
- Fotos reales, ofertas y artículos reales (reemplazan el contenido de ejemplo en `contenido/`).
- Conectar el dominio losboyacos.com a Vercel: el canonical, `og:url`, `sitemap.xml` y `robots.txt` ya apuntan a él.
- Logo y colores del cliente: solo cambian las variables CSS de `:root`.

## Hoja de ruta (videos)
Las habitaciones con video (fotos, oficina, mostrador) y la versión de escritorio están generadas pero **sin descargar**; el estado exacto y los enlaces están en `docs/videos-gemini-pendientes.md`.
