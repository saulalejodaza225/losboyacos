# Los Boyacos · sala de espera (móvil)

Página de una sola pantalla, solo HTML + CSS + JS, pensada para celular (360–430 px). En escritorio se muestra en un marco vertical de 430 px.

- `index.html` — toda la experiencia
- `assets/` — `clip1-entrada.mp4` (intro), `clip2-loop.mp4` (loop), `poster.webp`, `og.jpg`
- `tests/t.mjs` — prueba con Playwright (390×844 y 360×740); las capturas quedan en `shots/`

## Pendiente (variables al inicio del `<script>` en `index.html`)

- `WHATSAPP_NUMERO` — solo dígitos con indicativo (ej. 573001234567)
- `TELEFONO` — ej. +573001234567
- JSON-LD: reemplazar `[WHATSAPP_NUMERO]` en `contactPoint.url`; agregar `telephone`
- Dominio final para `og:url`, canonical y rutas absolutas de `og:image`
- ID de GA4 y Píxel de Meta (bloques comentados en `<head>`)
- Logo y colores del cliente: solo cambian las variables CSS de `:root`
