# Pipeline de videos móviles v8 — estado y procedimiento (autónomo)

Objetivo (decidido por el usuario el 26 oct 2026, estará fuera todo el día): generar los 4 videos móviles que faltan, descargarlos, procesarlos e integrarlos solo en móvil. Si se agota el cupo, esperar el plazo y reintentar. El escritorio NO se toca hasta terminar el móvil.

## Insumos (ya listos, en `docs/fotogramas/`)
- `maestro-puertas-9x16.jpg` (1536×2752): primer cuadro de TODOS los videos (3 puertas visibles).
- `fin-oficina-con-mapa-9x16.jpg`: cuadro final de la Oficina (mapa de Bogotá del usuario).
- Prompts de los 4 videos: `docs/prompts-videos-v8.md`.
- Bucle de la sala v7 ya integrado (`assets/clip2-loop.mp4`, commit bbdeea8).

## Estado (actualizar al terminar cada paso)
| Video | Generador | Estado |
|---|---|---|
| Oficina (inicio+fin) | Higgsfield `wan3_0` (acepta start_image y end_image; Gemini no tiene "fin") | pendiente |
| Fotos | Gemini (Crear vídeo, Vertical 9:16, Pro) | pendiente |
| Mostrador | Gemini | pendiente |
| Catálogo vertical | Gemini | pendiente |

## Dónde guardar
Carpeta `C:\Users\COMPUMAX\Desktop\Modelos de páginas web\Videos\Mecanic walk in\` con los nombres `M1-FOTOS-v8-9x16.mp4`, `M2-OFICINA-v8-9x16.mp4`, `M3-MOSTRADOR-v8-9x16.mp4`, `CATALOGO-v8-9x16.mp4`. Los videos de Gemini se descargan a `~/Downloads` (a veces con nombre automático): renombrar y mover.

## Gemini (Chrome, extensión "Claude in Chrome")
- `tabs_context_mcp` (con createIfEmpty si no hay grupo) y usar UNA pestaña. https://gemini.google.com/app → esperar ~20 s (la página es lenta).
- Clic en "+" (≈498,336) → esperar 10 s → "Subir archivos" (≈573,385) → `find` "input type=file" → `file_upload` con el maestro → "+" (≈498,503 con imagen adjunta) → "Crear vídeo" → relación de aspecto (find "Relación de aspecto") → "Vertical (9:16)" → clic en el cuadro "Describe tu vídeo" (≈700,485) → escribir prompt → flecha (≈1092,536).
- Verificar la miniatura del maestro antes de enviar. NUNCA pulsar el menú "⋮" de la conversación sin screenshot (una vez abrió "Compartir" y creó un enlace público; ya se borró).
- Errores conocidos ("something went wrong", "capacidad llena", "hard time fulfilling"): recargar la URL de la conversación y pulsar "Rehacer" (≈513,427–452; usar `find`). Pueden hacer falta hasta 10 intentos. No simplificar el prompt.
- Si "Crear vídeo" aparece atenuado o sale "No puedes crear más vídeos por ahora… disponibles el <fecha> a las <hora>": anotar la hora aquí y reintentar después.
- Descarga: nueva pestaña por archivo, fetch del `<video>` → blob → `<a download>` (funciona la primera vez por pestaña); o botón "Descargar imagen a tamaño completo" para imágenes.

## Higgsfield (Oficina con inicio+fin)
- Subir imágenes con `media_upload` + `curl -X PUT` + `media_confirm`.
- `generate_video` model `wan3_0`, aspect_ratio 9:16, duration 10, resolution 720p, generate_audio false, medias: maestro con role `start_image`, fin con role `end_image`. Costo 17,5 créditos; saldo 23,5 (alcanza para UNO). Límite diario "grace period": si responde "daily generation limit", reintentar más tarde.

## Revisión de cada video (antes de integrar)
Cuadros cada ~1 s: debe empezar en el maestro, SIN personas (ni de espaldas), puertas estables, final quieto (los últimos 3 s). Medir cuándo se detiene la cámara con `tblend=all_mode=difference,signalstats`. Si hay una persona o el primer cuadro no es el maestro: descartar y repetir.

## Integración móvil (después de aprobar cada video)
1. Procesar con `tools/procesar-habitaciones.sh` (agregar el archivo nuevo y el segundo de reposo): genera `assets/habitaciones/<id>-entrada|reposo|salida.mp4` y `<id>.webp`.
2. Medir zonas sobre el póster (marcos de Fotos; pizarra y 3 placas de Mostrador; mapa, tablón y teléfono de Oficina) y actualizar la rama móvil de `buildFotos/buildOficina/buildMostrador` en `index.html` y los números de `tests/habitaciones.mjs`.
3. Oficina: el mapa ya viene dentro del video; la zona "Ver mapa" debe quedar sobre el mapa SIN dibujar encima el mapa de OpenStreetMap (zona transparente con el pill).
4. Catálogo vertical: nueva rama móvil con el texto dentro del video (clips abre/pasa/atrás, zonas táctiles invisibles, parche si hay palabras repetidas), igual que en escritorio.
5. Regresión móvil completa + escritorio solo para comprobar que no se rompe; commit con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` y push; verificar en Vercel.
