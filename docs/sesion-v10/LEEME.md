# Sesión v10 — rehacer TODOS los videos móviles desde el mismo maestro (5 nov 2026)

Decisión del usuario (5 nov): los clips actuales de las salas «no funcionan, todo está desordenado». Se empieza de nuevo. Los videos anteriores (65 mp4) están copiados en `Escritorio\Videos Los Boyacos - anteriores (borrar)`; el usuario borra esa carpeta cuando quiera. NO se integra nada en `index.html` hasta tener todos los clips aprobados y avisar. Mismo maestro para todos: `docs/sesion-v9/maestro-v9-cerradas-9x16.jpg` (3 puertas CERRADAS). Escritorio y la nave/bahías (plan de la sesión en la nube, `docs/recorrido-taller.md`) van DESPUÉS de terminar el móvil.

## Videos a generar (móvil 9:16, UN solo chat de Gemini «Crear vídeo», Vertical, Pro, maestro adjunto en cada petición)
El resto sale con ffmpeg: salida = entrada al revés, reposo = último cuadro quieto, volver atrás del catálogo = pasar la página al revés.

| # | Clip | Qué hace | Archivo | Estado |
|---|---|---|---|---|
| 1 | Fotos | se levanta, rodea la mesa por la IZQUIERDA, la puerta izquierda se abre sola, entra a la galería de 6 marcos y se detiene | `V9-1-FOTOS.mp4` | HECHO (4 nov, 1.er intento) |
| 2 | Oficina | igual por la DERECHA: oficina con mapa de Bogotá, tablón y teléfono | `V9-3-OFICINA.mp4` | HECHO (4 nov, 1.er intento) |
| 3 | Mostrador | por la izquierda, puerta de vidrio del centro, recepción con caja y 3 placas | `V9-2-MOSTRADOR.mp4` (el de cámara fija quedó como `-fija-reemplazado`) | HECHO (5 nov, 1.er intento) |
| 4 | Bucle de la sala | casi inmóvil, 3 puertas cerradas, vapor del café y luz; ping-pong sin salto | `V10-4-BUCLE.mp4` | HECHO (5 nov, 1.er intento; diff medio 0,16, puertas cerradas) |
| 5 | Catálogo | UN solo video: las manos toman el libro, 1.ª doble SERVICIOS/REPUESTOS quieta 2 s, pasa la hoja, 2.ª doble VEHÍCULOS/AYUDA quieta; ffmpeg lo parte en C (agarra), D (pasa) y E (D al revés) | `V10-5-CATALOGO.mp4` | PENDIENTE (prompt: `docs/prompts-videos-v8.md` §4) |
| 6 | Intro | primer cuadro = maestro; plano que se asienta sobre la sala; termina en el cuadro con que arranca el bucle | `V10-6-INTRO.mp4` | PENDIENTE (si no sale, derivar con ffmpeg como `tools/v9-sala-movil.sh`) |

Total móvil = 6 (ya hay 2). El catálogo cuenta 1 porque se parte con ffmpeg (antes se pensó 2).

## Reglas
- Un solo chat de Gemini, mismo maestro adjunto cada vez. Prompts COMPLETOS, no simplificar. Errores → recargar la URL + Rehacer. Cupo agotado → anotar la hora y reprogramar.
- Cámara estrictamente en primera persona, SIN personas, sin cortes/fundidos/transiciones dentro del clip; la sala del primer cuadro no cambia (mismas 3 puertas, sofá, mesa).
- Prompts de las habitaciones caminando: `docs/sesion-v9/prompts.md` §«v9b». Revisar cada clip con ffmpeg (mosaico de fotogramas + quietud del final con `tblend+signalstats`).
- Descarga: `fetch(video.currentSrc,{credentials:'include'})` → blob → `a[download]`; mover de `~/Downloads` a `Videos\Mecanic walk in\v9\`.
- Higgsfield (35,7 créditos ≈ 2 clips Wan) solo como plan B.

## Bitácora
- 5 nov: carpeta de videos anteriores creada; sincronizado con la sesión en la nube (rama `main-pexueb`); el usuario confirma maestro cerrado y empezar por los clips del móvil.
- 5 nov ~02:00: Mostrador caminando (se levanta, rodea la mesa, abre la puerta de vidrio, recepción con caja/3 placas/pizarra vacía) y Bucle aprobados, ambos al 1.er intento, en el mismo chat `0dbea89327741b21`. Cupo agotado: «los vídeos volverán a estar disponibles el 5 nov a las 5:26». Pendiente: Catálogo (prompt §4 de prompts-videos-v8.md con «three CLOSED doors» en el primer cuadro) e Intro. Con los 6 aprobados: procesar (procesar-habitaciones.sh + partir catálogo), medir zonas, integrar, regresión, push.
