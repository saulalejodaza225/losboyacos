# Sesión v9 — videos móviles generados TODOS en una sola sesión de Gemini

Decisión del usuario (2 nov 2026): los videos v8 salieron desfasados entre sí (cada uno con distinto taller/puertas). Se rehacen todos en **un solo chat de Gemini** para que compartan estilo, y recién después se integran. Esto reemplaza a `docs/pipeline-videos-estado.md` y `prompts-videos-v8.md` (quedan como historial; el cron fue eliminado).

## Concepto
- **Cuadro maestro v9**: el taller (sofá, mesa con libro, etc.) visto sentado, con **las 3 puertas CERRADAS** (izquierda acero = Fotos, centro vidrio = Mostrador, derecha acero = Oficina).
- **Un clip por puerta**, todos con la misma cámara FIJA (POV sentado, manos en las rodillas) y el mismo primer cuadro: la puerta se abre sola, se ve la habitación, se mantiene quieta ~4 s y la puerta vuelve a cerrarse; el último cuadro = el cuadro maestro.
- Clip 4: **Catálogo vertical** (libro, parte de este mismo maestro).
- Sin personas (POV estricto), vertical 9:16, 10 s.

## Orden de trabajo (marcar con [x])
- [ ] 1. Cuadro maestro v9 (puertas cerradas): generado en Gemini → `docs/sesion-v9/maestro-v9-cerradas-9x16.png`
- [ ] 2. Clip Fotos (puerta izquierda)
- [ ] 3. Clip Mostrador (puerta de vidrio)
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
