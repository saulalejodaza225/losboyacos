# Videos generados en Gemini · pendientes de descargar

Estado a 22 oct 2026: **1 de 3 clips de habitaciones generado; ninguno descargado.** No se descarga nada hasta recibir la luz verde del cliente.

> **Límite de Gemini alcanzado** (plan Plus: uso 76 % de la ventana, 22 % del límite semanal). Gemini dijo: "Los vídeos volverán a estar disponibles el **23 oct a las 2:26**". Los clips M2 y M3 se generan después de esa hora.
Cuenta: la de Gemini del cliente (saulalejodaza@gmail.com). Modelo usado: Pro. Formato: vertical 9:16 (móvil).

## Principio de diseño
El video es el **escenario**, no el contenedor del contenido. Las superficies (marcos, pizarra, mapa, placas) salen **vacías** en el video; el contenido real (fotos, ofertas, textos) lo dibuja la página encima y lo edita el cliente desde el CMS.

## Convención de nombres (tanto en Gemini como aquí)
`BOYACOS · M<n> · <HABITACIÓN> · <qué es>` — por ejemplo `BOYACOS · M1 · FOTOS · entrada+reposo`.
(M = móvil 9:16. Las versiones de escritorio 16:9 serán `D<n>` y se harán en una segunda fase con los mismos prompts.)

## Mapa de habitaciones (4)
| Hab. | Nombre | Qué contiene | Contenido que pone la página |
|---|---|---|---|
| 1 | SALA (ya existe) | catálogo: servicios, repuestos, vehículos, ayuda | HTML sobre las hojas del libro |
| 2 | FOTOS | pared con 6 marcos vacíos | fotos reales + anécdota al tocar (galería, hasta 20) |
| 3 | OFICINA | mapa en la pared, tablón con 3 hojas en blanco, teléfono de escritorio | mapa real de Google (al tocar), blog, contacto |
| 4 | MOSTRADOR | pizarra negra vacía, TV apagada, 3 placas cuadradas en blanco | banners/ofertas (pizarra), redes (placas) |

Navegación prevista: sala ⇄ habitación con el mismo clip (hacia atrás para volver). El tramo final de cada clip (~4 s, cámara quieta) se usa como reposo con vaivén.

## Primer fotograma común (todas las habitaciones parten de aquí)
Último cuadro del video de entrada `gemini_generated_video_70302e36.mp4` (sala, sentado frente a la mesa). Archivo local: `start-frame.png` (se genera con ffmpeg, no se descarga).

## Clips
(Se completa con el enlace de cada conversación a medida que se generan.)

### M1 · FOTOS · entrada+reposo
- Estado: **GENERADO, no descargado** (revisado: pared con 6 marcos vacíos —3 columnas × 2 filas—, luces de cuadro, final frontal y quieto)
- Conversación Gemini: https://gemini.google.com/app/feb6fe0cb1a8902a  (título: `BOYACOS - M1 - FOTOS - entrada+reposo (NO descargado)`)
- Prompt:
```
Use the attached image as the exact first frame (same first-person POV, hands, room and warm amber lighting). Vertical 9:16, 10 seconds, one continuous shot, no cuts, smooth natural walking camera at eye height. The viewer stands up from the leather sofa and walks forward through an open dark doorway into the adjacent gallery room of the same premium automotive workshop: dark walnut slat walls, warm amber lighting, steel details, polished concrete floor. A feature wall faces him with exactly six empty picture frames arranged in two columns by three rows, slim black frames, each with a completely empty dark matte interior (no pictures, no text), softly lit by small amber picture lights. During the first 6 seconds he walks and arrives; during the last 4 seconds the camera is perfectly still, frontal and parallel to the wall, the six frames centered, large and sharp, filling the middle of the screen, hands out of view. Photorealistic, same lighting as the first frame, no other people, no text anywhere, no logos, no music, no speech.
```

### M2 · OFICINA · entrada+reposo
- Estado: **SIN VIDEO** — el prompt se envió pero Gemini lo bloqueó por límite. Reintentar con el botón "Reintentar" de esta conversación (o pegar el prompt en una nueva) después del 23 oct 2:26.
- Conversación Gemini: https://gemini.google.com/app/f52296467b2edfb4  (título: `BOYACOS - M2 - OFICINA - SIN VIDEO, reintentar tras el 23 oct 2:26 (limite)`)
- Prompt:
```
Use the attached image as the exact first frame (same first-person POV, hands, room and warm amber lighting). Vertical 9:16, 10 seconds, one continuous shot, no cuts, smooth natural walking camera at eye height. The viewer stands up from the leather sofa and walks to the right through another dark doorway into a small office of the same premium automotive workshop: dark walnut slat walls, warm amber lighting, steel details. A walnut desk holds a landline desk phone and a closed notepad. On the wall facing him, in the center, hangs a large framed stylized street map of a city drawn only with thin cream and red lines on dark paper, with no letters or labels at all; to its left a wooden notice board with exactly three blank white paper sheets pinned in a row, no writing. During the first 6 seconds he walks and arrives; during the last 4 seconds the camera is perfectly still, frontal and parallel to the wall, the map centered, large and sharp, the notice board visible on the left and the desk with the phone at the bottom, hands out of view. Photorealistic, same lighting as the first frame, no other people, no text anywhere, no logos, no music, no speech.
```

### M3 · MOSTRADOR · entrada+reposo
- Estado: **pendiente** (no se intentó por el límite). Generar tras el 23 oct 2:26 con el prompt de abajo; al terminar, renombrar la conversación a `BOYACOS - M3 - MOSTRADOR - entrada+reposo (NO descargado)`.
- Conversación Gemini: _—_
- Prompt:
```
Use the attached image as the exact first frame (same first-person POV, hands, room and warm amber lighting). Vertical 9:16, 10 seconds, one continuous shot, no cuts, smooth natural walking camera at eye height. The viewer stands up from the leather sofa and walks towards the reception counter of the same premium automotive workshop: dark walnut slat walls, warm amber lighting, steel details. A long walnut counter; behind it on the wall a clean black chalkboard menu board that is completely empty (no writing) and beside it a large flat TV that is switched off with a plain black screen. On the front of the counter, in a row, stand three small square blank white plaques, upright, with no marks on them. During the first 6 seconds he walks and arrives; during the last 4 seconds the camera is perfectly still, frontal and parallel to the wall, the chalkboard centered, large and sharp, the three plaques visible at the bottom, hands out of view. Photorealistic, same lighting as the first frame, no other people, no text anywhere, no logos, no music, no speech.
```

## Fotogramas (imágenes) generados para la fase de escritorio 16:9 — NO descargados
Se hicieron con "Crear imágenes" (Nano Banana, modelo Pro) a partir de los fotogramas verticales, sin gastar cuota de video. Sirven como **primer cuadro** de los videos de escritorio (el video nativo 16:9 se genera después con estos como imagen de partida).

| Etiqueta | Qué es | Conversación | Para qué clip de escritorio |
|---|---|---|---|
| `BOYACOS - D0 - IMAGEN 16x9 - SALA sentado` | Sala vista desde el sofá, en ancho: salón completo, puertas a izquierda y derecha, manos abajo (mismo centro que el vertical) | https://gemini.google.com/app/3632948bc30d222d | loop de la sala, catálogo (libro) y las 3 habitaciones (D1 fotos, D2 oficina, D3 mostrador) |
| `BOYACOS - D0b - IMAGEN 16x9 - ENTRADA inicio` | Inicio de la entrada, de pie detrás del sofá, en ancho: salón completo | https://gemini.google.com/app/df1c58a35b8da95a | clip de entrada de escritorio |

Prompts usados (misma base): "Create a 16:9 widescreen landscape version of exactly this scene and camera position … Keep the center of the picture identical and extend the scene naturally to the left and right at the same eye level so the whole premium automotive workshop lounge is visible … a dark doorway on the left and another on the right leading to adjacent rooms. Photorealistic, same lighting/colors/mood, no text, no logos."
Imágenes de partida (se regeneran con ffmpeg, no se descargan de Gemini): último cuadro y primer cuadro de `gemini_generated_video_70302e36.mp4`.

> Límite de Gemini: al generar la segunda imagen, Gemini avisó que el límite de **Pro** se agotó (se restablece el 23 oct) y cambió a Flash-Lite. Los videos pendientes (M2, M3) y todo lo de escritorio se generan con Pro después de esa fecha.

## Ya existentes (de sesiones anteriores, también en Gemini)
- `Automotive Catalog Video Generation …` y `Catálogo de Servicios Automotrices`: videos del libro (catálogo). El que el cliente indicó como generado quedó **sin descargar**.
- Descargados antes: `gemini_generated_video_70302e36.mp4` (entrada), `165b1a08` (loop), `42bd97e2` (catálogo v1 usado en producción), `6b4c7c12` (catálogo con texto, descartado).

## Checklist cuando haya luz verde
1. Descargar cada clip desde su conversación (botón "Descargar vídeo") y anotar el nombre del archivo en la tabla de abajo.
2. Recodificar (ffmpeg, crf ~18–20, sin audio, 720×1280, 24 fps).
3. Cortar entrada (≈0–6 s) y reposo (últimos ≈4 s, para vaivén). Medir las esquinas de cada superficie (marcos, mapa, tablón, pizarra, placas) con el seguimiento ya hecho para el libro.
4. Integrar: superficies tocables + contenido real encima (desde `contenido/*.json` / CMS).

| Etiqueta | Conversación | Archivo descargado |
|---|---|---|
| BOYACOS · M1 · FOTOS | feb6fe0cb1a8902a | _—_ |
| BOYACOS · M2 · OFICINA | f52296467b2edfb4 (sin video aún) | _—_ |
| BOYACOS · D0 · IMAGEN 16x9 SALA | 3632948bc30d222d | _—_ |
| BOYACOS · D0b · IMAGEN 16x9 ENTRADA | df1c58a35b8da95a | _—_ |
| BOYACOS · M3 · MOSTRADOR | _—_ | _—_ |
