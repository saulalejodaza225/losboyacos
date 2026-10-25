# Analítica de Los Boyacos

Todo está **desactivado** hasta que el cliente entregue los IDs. Los tres bloques están comentados en el `<head>` de `index.html` (busca `ANALÍTICA`).

## Cómo activar una herramienta
1. Crea la cuenta o el ID (abajo se indica dónde).
2. En `index.html` reemplaza el marcador por el ID real.
3. Quita `<!--` y `-->` que rodean ese bloque.
4. Publica (`git push`; Vercel despliega solo).
5. Comprueba en la propia herramienta que llegan visitas y eventos (GA4: Informes > Tiempo real).

| Herramienta | Marcador | Dónde se obtiene el ID | Obligatoria |
|---|---|---|---|
| Google Analytics 4 | `G-XXXXXXXXXX` (2 sitios) | analytics.google.com > Administrar > Flujos de datos | Recomendada |
| Hotjar | `hjid:0000000` | hotjar.com > Sites | Opcional |
| Píxel de Meta | `000000000000000` | business.facebook.com > Administrador de eventos | Solo si harán anuncios |

## Eventos que la página ya envía
La función `track(nombre, parámetros)` los manda a GA4 (`gtag`), al Píxel de Meta (`fbq trackCustom`) y a `window.dataLayer`.

| Evento | Cuándo se dispara |
|---|---|
| `abrir_catalogo` | El visitante toca el libro y se abre el catálogo |
| `pasar_pagina` | Pasa de página dentro del libro (`pagina`) |
| `ver_servicios`, `ver_repuestos`, `ayuda_carretera` | Abre esa sección |
| `abrir_galeria` | Abre la galería |
| `ver_blog` | Abre el blog |
| `ver_redes` | Abre las redes |
| `abrir_contacto` | Abre el formulario de contacto |
| `envio_formulario` | El formulario se envió correctamente |
| `envio_formulario_error` | El envío falló y se ofreció WhatsApp |
| `entrar_habitacion`, `salir_habitacion` | Entra o sale de una habitación (`habitacion`: fotos, oficina, mostrador) |
| `habitacion_lista` | El video de la habitación terminó de caminar y ya se puede tocar |
| `toque_habitacion` | Toca un objeto de la habitación (`zona`: foto, ver_todas, mapa, blog, articulo, ofertas, red_…) |
| `whatsapp`, `llamar`, `como_llegar` | Pulsa esos botones (`origen` indica desde dónde y `tema` el servicio) |

## Privacidad
`privacidad.html` ya menciona Google Analytics, Hotjar y Meta. Si se añade otra herramienta, actualiza esa política antes de activarla.
