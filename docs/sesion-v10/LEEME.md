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
| 5 | Catálogo | UN solo video: las manos toman el libro, 1.ª doble SERVICIOS/REPUESTOS quieta 2 s, pasa la hoja, 2.ª doble VEHÍCULOS/AYUDA quieta; ffmpeg lo parte en C (agarra), D (pasa) y E (D al revés) | `V10-5-CATALOGO.mp4` | HECHO (5 nov; chat nuevo `d55a20bb88b2eef8`: en el chat largo se atascó 2 veces) |
| 6 | Intro | mira alrededor sentado y vuelve al frente; termina como el primer cuadro | `V10-6-INTRO.mp4` | HECHO (9 nov, chat `b6f3ac32330d9521`) |

Total móvil = 6 (los 6 hechos). El catálogo cuenta 1 porque se parte con ffmpeg (antes se pensó 2).

## Reglas
- Un solo chat de Gemini, mismo maestro adjunto cada vez. Prompts COMPLETOS, no simplificar. Errores → recargar la URL + Rehacer. Cupo agotado → anotar la hora y reprogramar.
- Cámara estrictamente en primera persona, SIN personas, sin cortes/fundidos/transiciones dentro del clip; la sala del primer cuadro no cambia (mismas 3 puertas, sofá, mesa).
- Prompts de las habitaciones caminando: `docs/sesion-v9/prompts.md` §«v9b». Revisar cada clip con ffmpeg (mosaico de fotogramas + quietud del final con `tblend+signalstats`).
- Descarga: `fetch(video.currentSrc,{credentials:'include'})` → blob → `a[download]`; mover de `~/Downloads` a `Videos\Mecanic walk in\v9\`.
- Higgsfield (35,7 créditos ≈ 2 clips Wan) solo como plan B.

## Bitácora
- 5 nov: carpeta de videos anteriores creada; sincronizado con la sesión en la nube (rama `main-pexueb`); el usuario confirma maestro cerrado y empezar por los clips del móvil.
- 5 nov ~02:00: Mostrador caminando (se levanta, rodea la mesa, abre la puerta de vidrio, recepción con caja/3 placas/pizarra vacía) y Bucle aprobados, ambos al 1.er intento, en el mismo chat `0dbea89327741b21`. Cupo agotado: «los vídeos volverán a estar disponibles el 5 nov a las 5:26». Pendiente: Catálogo (prompt §4 de prompts-videos-v8.md con «three CLOSED doors» en el primer cuadro) e Intro. Con los 6 aprobados: procesar (procesar-habitaciones.sh + partir catálogo), medir zonas, integrar, regresión, push.
- 5 nov: Catálogo aprobado (textos exactos en las dos dobles). Cortes: C = 0–4,4 s, D = 4,4–7,8 s, E = D al revés. Las hojas móviles pasan a ser zonas táctiles transparentes (el texto va en el video). Clips procesados a `assets` con `tools/v10-movil.sh` y `tools/procesar-habitaciones.sh`.

## Sesión v11 (9 nov): correcciones pedidas por el usuario
Orden acordado: 1) Fotos e Intro (HECHOS) → 2) Mostrador (cuando vuelva el cupo) → 3) videos de escritorio → 4) video del celular para las burbujas de WhatsApp y Maps: se GENERA y se espera la aprobación del usuario ANTES de implementarlo.
- `V11-1-FOTOS.mp4` (chat `31c4a1d61a654c04`): sin la silla inventada y termina a ~1 m de la pared (6 marcos grandes). Se reforzó «NO new furniture» y el recorrido entre la mesa y la butaca. Interiores de los marcos en el cuadro final: X 96–212, 308–427, 523–639; Y 312–471, 556–716.
- `V11-INTRO-origen.mp4` (chat `daa3e30cebc42923`): la cámara sale del maestro, se levanta, se aparta a la derecha y RETROCEDE sin girar hasta cruzar la puerta de entrada. `tools/v10-movil.sh` lo invierte: llega al local, pasa junto al sofá y se sienta, terminando exactamente en el maestro. Truco clave: Gemini solo fija el PRIMER cuadro, y un video invertido solo parece caminar hacia adelante si en el original la cámara retrocede mirando al frente.
- Gemini: un chat recién creado se quedó 12 min sin respuesta al cambiar de página durante la generación (`b724bba783b05352`); no navegar mientras se genera. Se canceló y el reintento salió en 4 min.
- Mostrador HECHO y aprobado (`V11-2-MOSTRADOR.mp4`, chat `f2a49ef02fe0a5cb`): el carro ya no desaparece; cruza la puerta de vidrio, camina junto al elevador, gira a su IZQUIERDA y llega a la recepción. Detalle menor aceptado: en el frente del mostrador salió escrito «FRONT FACE». `prompt-mostrador-v11.md` trae correcciones posteriores (sin ese texto y con las puertas sólidas fijas) que aún no se han usado: sirven si se rehace.
- Catálogo móvil: pausa a los 3,5 s (ambas manos solo sostienen el libro), deslizar horizontal en toda la pantalla, y letras nítidas: `tools/v10-movil.sh` genera `assets/cat-papel-1|2.webp` (papel sin letras del último cuadro) y `index.html` pone texto real encima (`.nitido`). Si cambian los cortes hay que regenerar el papel.
- Todos los enlaces a WhatsApp, Google Maps y llamadas en móvil (burbujas, catálogo, hojas, salas; se detectan por la dirección del enlace): `V11-3-CELULAR.mp4` (chat `836b16efcd010224`, prompt en `prompt-celular-v11.md`) → `assets/clip-celular.mp4`, saca el celular, lo mira y se abre la acción. El celular no se desbloquea.

## PENDIENTE cuando haya cupo: video del celular con desbloqueo (reemplaza a `V11-3-CELULAR`)
Pedido del usuario (9 nov): el sujeto desbloquea el celular y entra a la aplicación que corresponda según el botón tocado: WhatsApp, Maps o Llamar. No gastar cupo en dos videos.
Plan práctico: UN solo video desde el maestro y partirlo con ffmpeg en tres tramos que comparten el cuadro de la pantalla de inicio: A) saca el celular y desbloquea, hasta la pantalla de inicio quieta con tres íconos; B) toca el ícono de chat verde y se abre; C) vuelve a la misma pantalla de inicio, toca el ícono de mapa y se abre; D) vuelve a la misma pantalla de inicio, toca el ícono de teléfono y se abre la pantalla de llamada. Cada botón reproduce A + su tramo (C y D sin su regreso inicial). Cuidados: 1) A + tramo debe durar menos de unos 4 s en total, o el navegador puede bloquear la apertura (hoy hay plan B en la misma pestaña); 2) Gemini suele deformar logos y textos de pantalla: pedir íconos genéricos sin letras, y si hace falta poner el ícono real encima con HTML; 3) la pantalla de inicio debe quedar quieta en el punto de corte para que el empalme no salte.

## Prompt de la Intro v10, reemplazada (maestro adjunto, chat `d55a20bb88b2eef8`, Vídeos, Vertical, Pro)
FIRST FRAME (must match the attached image exactly): first-person view seated on a brown leather sofa in a premium automotive workshop lounge, the viewer's two hands resting on his knees, dark walnut coffee table with an open book, espresso cup and silver toy car, three CLOSED doors in the back wall (left steel-framed door, center frameless glass door, right steel-framed door). Warm amber, dark, moody lighting. Vertical 9:16.

ACTION (strictly first-person POV, one continuous smooth shot, 10 seconds, the viewer stays seated the whole time): 0.0–1.0 s still. 1.0–4.0 s he slowly turns his head a little to the left, looking at the armchair and the wall. 4.0–7.0 s he slowly turns his head a little to the right, looking at the lit shelves. 7.0–9.0 s he slowly returns to looking straight ahead. 9.0–10.0 s completely still, the view identical to the first frame. The hands stay resting on the knees.

CONSISTENCY: all three doors stay CLOSED; the room, sofa, table, book, toy car, armchair, plant and shelves never change; no wall appears, disappears or morphs. The last frame must be identical to the first frame.

AVOID: any other person anywhere, a third-person view, standing up, walking, doors opening, extra doors, cuts, transitions, zoom, shake, text, logos, watermarks, music and speech.
Photorealistic, same lighting and color grading as the first frame.

- 9 nov: Intro generada y aprobada (sentado, mira a la izquierda y a la derecha, vuelve al frente). Lección: en un chat con videos previos Gemini se queda colgado con «Detener» activo; cancelar (no gasta cupo) y usar un chat nuevo (Vídeos, Vertical, Pro). 2.ª doble del catálogo: «PEDIR AYUDA» salía dos veces, se tapa la de arriba con `assets/cat-parche-movil.webp`. INTEGRADOS los 6 en móvil (`tools/v10-movil.sh` + `tools/procesar-habitaciones.sh`). Pendiente: escritorio (imagen maestra 16:9 + 5 o 6 videos) y luego la nave.
