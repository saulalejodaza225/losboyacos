# Sesión v9 — videos móviles generados TODOS en una sola sesión de Gemini

Decisión del usuario (2 nov 2026): los videos v8 salieron desfasados entre sí (cada uno con distinto taller/puertas). Se rehacen todos en **un solo chat de Gemini** para que compartan estilo, y recién después se integran. Esto reemplaza a `docs/pipeline-videos-estado.md` y `prompts-videos-v8.md` (quedan como historial; el cron fue eliminado).

## Concepto
- **Cuadro maestro v9**: el taller (sofá, mesa con libro, etc.) visto sentado, con **las 3 puertas CERRADAS** (izquierda acero = Fotos, centro vidrio = Mostrador, derecha acero = Oficina).
- **Un clip por puerta**, todos con la misma cámara FIJA (POV sentado, manos en las rodillas) y el mismo primer cuadro: la puerta se abre sola, se ve la habitación, se mantiene quieta ~4 s y la puerta vuelve a cerrarse; el último cuadro = el cuadro maestro.
- Clip 4: **Catálogo vertical** (libro, parte de este mismo maestro).
- Sin personas (POV estricto), vertical 9:16, 10 s.

## Orden de trabajo (marcar con [x])
- [x] 1. Cuadro maestro v9 (puertas cerradas) HECHO → `docs/sesion-v9/maestro-v9-cerradas-9x16.jpg` (copia en la carpeta de videos: Videos/Mecanic walk in/v9/V9-0-maestro-cerradas-9x16.jpg). Chat de imagen: https://gemini.google.com/app/3c0026ad575cdad2
- [x] 2. Clip Fotos (puerta izquierda) HECHO y revisado: V9-1-FOTOS.mp4 (cámara fija, 6 marcos vacíos, cierra igual)
- [x] 3. Clip Mostrador (puerta de vidrio) HECHO y revisado: V9-2-MOSTRADOR.mp4 (caja registradora, 3 placas en fila, pizarra vacía; 1er intento)
- [ ] 4. Clip Oficina (puerta derecha)
- [ ] 5. Clip Catálogo vertical
- [ ] 6. Revisión de los 4 (mismo taller, sin personas, cierra igual al maestro)
- [ ] 7. Integración móvil (procesar, medir zonas, index.html, tests, regresión, push)
- Escritorio solo DESPUÉS de terminar móvil.

## Reglas
- UN solo chat de Gemini (misma conversación, "Crear vídeo", Vertical 9:16, Pro); el maestro v9 adjunto en cada petición. Anotar abajo el URL de la conversación.
- Prompts completos, no simplificar. Errores → recargar URL + Rehacer. Cupo agotado → anotar hora y esperar.
- Descarga de video: `fetch(video.currentSrc,{credentials:'include'})` → blob → `a[download]`; guardar en `Videos\Mecanic walk in\v9\` con los nombres `V9-0-maestro`, `V9-1-FOTOS`, `V9-2-MOSTRADOR`, `V9-3-OFICINA`, `V9-4-CATALOGO`.
- Higgsfield: 35,7 créditos (≈2 clips Wan 3.0); solo como plan B para un clip.
- Prompts: `docs/sesion-v9/prompts.md`.

## Bitácora
- 2 nov: carpeta y prompts creados; arrancando el maestro v9 en Gemini.
- 2 nov: maestro v9 generado y aprobado (3 puertas cerradas, mismo taller). Siguiente: abrir UN chat de Crear vídeo (Vertical 9:16, Pro) con el maestro v9 adjunto y lanzar Fotos, luego Mostrador, Oficina y Catálogo en ese mismo chat (anotar su URL aquí). Pestaña Chrome de la sesión: 1149769238.
- 2 nov ~14:20: CHAT ÚNICO DE VÍDEOS v9 = https://gemini.google.com/app/0dbea89327741b21 (maestro v9 adjunto, Vertical, Pro). Clip 1 FOTOS enviado y 'generando'. Para los demás: en ESTE mismo chat escribir el siguiente prompt (adjuntar de nuevo el maestro v9 si Gemini no lo conserva). Si sale error: recargar la URL + Rehacer. Descarga: fetch(video.currentSrc,{credentials:'include'}) → V9-1-FOTOS.mp4 en Videos/Mecanic walk in/v9/.
- 2 nov ~14:35: V9-1-FOTOS.mp4 descargado a Videos/Mecanic walk in/v9/ y aprobado (1er intento). Siguiente: Mostrador en el mismo chat.
- 2 nov ~15:00: V9-2-MOSTRADOR.mp4 aprobado (1er intento, mismo chat). Siguiente: Oficina (puerta derecha), luego Catálogo.
- 2 nov: CUPO GEMINI AGOTADO tras 2 vídeos (Fotos y Mostrador). 'Los vídeos volverán a estar disponibles el 2 nov a las 17:26'. Pendiente en el MISMO chat (0dbea89327741b21): Oficina (puerta derecha) y luego Catálogo; cada ventana de cupo permite ~2 vídeos, así que Catálogo probablemente caiga en la ventana siguiente. Prompts en docs/sesion-v9/prompts.md (Oficina: usar la base + sección 3; el prompt completo ya probado para Fotos/Mostrador sustituye <PUERTA>/<HABITACIÓN>).
- 2 nov ~15:10: INTEGRADOS en móvil Fotos y Mostrador v9 (rama móvil de index.html + tools/procesar-habitaciones.sh con ONLY="fotos mostrador" y 5.º campo = fin del reposo + tests/habitaciones.mjs). Entrada = puerta abriéndose (0–4,6 s Fotos / 0–5,8 s Mostrador); reposo = sala quieta (4,6–6,7 s / 5,8–6,9 s) en vaivén; salida = entrada al revés (la puerta se cierra). Zonas móviles: Fotos X=[279,334],[351,407],[424,480] Y=[320,395],[412,485]; Mostrador pizarra rq(340,259,549,451), placas rq(247,573,305,631)/(326,574,384,631)/(404,574,463,631); zonas táctiles ampliadas con ::after (≥44 px) y textos del tablero/placas reducidos solo en móvil.
- 2 nov ~17:45: Oficina intento 1 (prompt base + sección 3) DESCARTADO → v9/V9-3-OFICINA-descartado1.mp4: la cámara se acerca, la pared del fondo se transforma (desaparece la puerta de vidrio) y la puerta queda abierta al final.
- 2 nov ~17:52: Oficina intento 2 (base + LAYOUT reforzado, ver prompts.md «3b») DESCARTADO → V9-3-OFICINA-descartado2.mp4: a los 3 s hace una transición circular (wipe) a otro plano y vuelve. CUPO AGOTADO: 'Los vídeos volverán a estar disponibles el 2 nov a las 22:26'. Siguiente: intento 3 con el prompt 3b + en AVOID «cuts, transitions, wipes, circular reveals» (mismo chat), luego Catálogo.
- Pendiente de integrar: bucle de la sala con puertas CERRADAS (mantener el v7 hasta tener los 4 clips: el catálogo y la oficina siguen usando la escena anterior), Oficina y Catálogo vertical.
