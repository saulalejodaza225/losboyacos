# Videos generados en Gemini · pendientes de descargar

Estado actualizado el 25 oct 2026: **los 9 clips de habitaciones y la entrada/loop/catálogo de escritorio están generados Y DESCARGADOS** (ver la sección DESCARGADOS al final).

> **Límite de Gemini alcanzado** (plan Plus: uso 76 % de la ventana, 22 % del límite semanal). Gemini dijo: "Los vídeos volverán a estar disponibles el **23 oct a las 2:26**". Los clips M2 y M3 se generan después de esa hora.
Cuenta: la de Gemini del cliente (saulalejodaza@gmail.com). Modelo usado: Pro. Formato: vertical 9:16 (móvil).

## Resumen del inventario (24 oct 2026) · NADA descargado de Gemini ni de Meta AI
| Generador | Qué | Cantidad | Estado |
|---|---|---|---|
| Gemini (videos) | Entrada, loop, catálogo v1, catálogo con texto (sesiones anteriores) | 4 | descargados antes; el catálogo v1 está en producción |
| Gemini (videos) | Catálogo "generado sin descargar" | 1 | sin descargar |
| Gemini (videos) | M1 FOTOS | 1 | generado, sin descargar |
| Gemini (videos) | M2 OFICINA, M3 MOSTRADOR | 2 | generados el 24 oct, sin descargar (M3 trae la palabra "MENU" en la pizarra) |
| Gemini (imágenes) | D0 sala 16:9, D0b entrada 16:9 | 2 | sin descargar; sustituidas por las de Meta AI |
| **Meta AI (imágenes)** | D0 sala 16:9, D0b entrada 16:9 | 2 | generadas, sin descargar |

**Regla vigente:** no se descarga nada hasta la luz verde del cliente (posiblemente en un par de días). Modelo: siempre el de razonamiento más avanzado (Gemini Pro, nunca Flash; Meta AI "Razonamiento", nunca "Instantáneo").

## Meta AI · generador de imágenes (desde el 24 oct 2026)
Cuenta: la del cliente, con la sesión iniciada en Chrome. Sitio: https://www.meta.ai. Modelo: **Razonamiento**. Se adjunta el fotograma de partida (se genera con ffmpeg desde `gemini_generated_video_70302e36.mp4`, no se descarga de ningún generador) y se envía el prompt. Convención de nombres igual que en Gemini, con el sufijo `(NO descargado)`.

| Etiqueta | Conversación (Meta AI) | Imagen de partida | Estado |
|---|---|---|---|
| `BOYACOS - D0 - IMAGEN 16x9 - SALA sentado (NO descargado)` | https://www.meta.ai/prompt/87767fc0-c06f-4bec-8937-daa5bb34d96c | último cuadro del video de entrada | generada, sin descargar |
| `BOYACOS - D0b - IMAGEN 16x9 - ENTRADA inicio (NO descargado)` | https://www.meta.ai/prompt/5baa0a5b-d9b4-4d9d-8682-b64e2ba7486c | primer cuadro del video de entrada | generada, sin descargar |

Prompt D0: "Create a 16:9 widescreen landscape version of exactly this scene and camera position. Keep the center of the picture identical and extend the scene naturally to the left and right at the same eye level so the whole premium automotive workshop lounge is visible: dark walnut slat walls, warm amber lighting, steel details, a leather sofa and low table in front, a dark doorway on the left and another dark doorway on the right leading to adjacent rooms. Keep the first-person point of view with the viewer's hands at the bottom. Photorealistic, same lighting, colors and mood, no text, no logos."
Prompt D0b: igual, sustituyendo la parte del sofá por "Keep the first-person point of view from standing behind the leather sofa."

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
- Estado: **GENERADO, no descargado** (24 oct, 10 s, 720×1280; revisado: mapa estilizado grande y nítido SIN letras, tablón de corcho a la izquierda con hojas en blanco —queda algo recortado por el borde—, final frontal y quieto; el teléfono de escritorio no se ve en el reposo)
- Conversación Gemini: https://gemini.google.com/app/f52296467b2edfb4  (título: `BOYACOS - M2 - OFICINA - entrada+reposo (NO descargado)`)
- Prompt:
```
Use the attached image as the exact first frame (same first-person POV, hands, room and warm amber lighting). Vertical 9:16, 10 seconds, one continuous shot, no cuts, smooth natural walking camera at eye height. The viewer stands up from the leather sofa and walks to the right through another dark doorway into a small office of the same premium automotive workshop: dark walnut slat walls, warm amber lighting, steel details. A walnut desk holds a landline desk phone and a closed notepad. On the wall facing him, in the center, hangs a large framed stylized street map of a city drawn only with thin cream and red lines on dark paper, with no letters or labels at all; to its left a wooden notice board with exactly three blank white paper sheets pinned in a row, no writing. During the first 6 seconds he walks and arrives; during the last 4 seconds the camera is perfectly still, frontal and parallel to the wall, the map centered, large and sharp, the notice board visible on the left and the desk with the phone at the bottom, hands out of view. Photorealistic, same lighting as the first frame, no other people, no text anywhere, no logos, no music, no speech.
```

### M3 · MOSTRADOR · entrada+reposo
- Estado: **GENERADO, no descargado** (24 oct, 10 s, 720×1280; el primer intento falló con "tráfico alto" y se reintentó con "Rehacer"). Revisado: pizarra negra al centro, TV apagada a la derecha (recortada por el borde), 3 placas blancas en blanco abajo, final frontal y quieto. **Defecto:** la pizarra trae escrita la palabra "MENU" en el borde superior; se cubre con el contenido de la página o se borra con ffmpeg (parche oscuro) al integrar.
- Conversación Gemini: https://gemini.google.com/app/b0e1bf86de3f6067  (título: `BOYACOS - M3 - MOSTRADOR - entrada+reposo (NO descargado)`)
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
| BOYACOS · M2 · OFICINA | f52296467b2edfb4 | _—_ |
| BOYACOS · D0 · IMAGEN 16x9 SALA | 3632948bc30d222d | _—_ |
| BOYACOS · D0b · IMAGEN 16x9 ENTRADA | df1c58a35b8da95a | _—_ |
| BOYACOS · M3 · MOSTRADOR | b0e1bf86de3f6067 | _—_ |
| BOYACOS · D0 · IMAGEN 16x9 SALA (Meta AI) | 87767fc0-c06f-4bec-8937-daa5bb34d96c | _—_ |
| BOYACOS · D0b · IMAGEN 16x9 ENTRADA (Meta AI) | 5baa0a5b-d9b4-4d9d-8682-b64e2ba7486c | _—_ |

## Prueba de video en Meta AI (24 oct 2026)
Se pidió a Meta AI (modo Razonamiento) animar la imagen D0 como video 16:9 de 10 s. Respuesta: "Video generation isn't available right now in Meta AI". **Meta AI solo sirve para imágenes por ahora**; los videos de escritorio (D1–D3, entrada, loop, catálogo) siguen siendo de Gemini. Volver a probar más adelante.

### Seguimiento (24 oct 2026): ¿por qué Meta AI no genera video y cuándo vuelve?
- Se repitió la prueba desde **Vibes** (https://www.meta.ai/vibes) con el modelo Razonamiento y el fotograma de sala: misma respuesta, "video generation isn't available right now… a new version is expected". Conversación de la prueba: https://www.meta.ai/prompt/d888d2b6-6093-4586-aa6c-6580acafeefa
- **Causa:** Meta no la ha explicado oficialmente. El aviso es del propio asistente y no da fecha. Hipótesis (no confirmada): se retiró el motor anterior mientras llega el modelo nuevo de imagen y video "Mango" (en prensa, previsto para 2026; sin demo pública, y Meta no ha confirmado el nombre).
- **Cuándo:** sin fecha oficial. Reprobar cada pocos días desde Vibes o el chat.
- Nota: el chat "Límite de fotos y videos" del propio usuario con Meta AI trae cifras de cuota (fotos/videos por día) y precios de Meta One; son estimaciones generadas por el asistente, no datos oficiales.

## Videos de escritorio 16:9 (fase 2) — Gemini Pro, NO descargados
**Método que funciona (24 oct 2026):** abrir la conversación de la imagen D0 → botón "Copiar imagen" (portapapeles, no es descarga) → recargar `gemini.google.com/app` → "+" → Crear vídeo → comprobar Relación de aspecto = Horizontal (16:9) → pegar la imagen con ctrl+v → escribir el prompt → enviar. Errores frecuentes: la primera respuesta sale "Solo soy una IA basada en texto" o "capacidad llena"; se resuelve con Rehacer → Reintentar (recargar la página antes si se queda colgado). Pedir el video dentro de la conversación de la imagen ("the image above") falla siempre.

| Etiqueta | Estado | Conversación |
|---|---|---|
| `BOYACOS - D1 - FOTOS 16x9 - entrada+reposo (NO descargado)` | **GENERADO** (10 s, 1280×720). Revisado: sala → puerta izquierda → pared con 6 marcos vacíos en 2 filas × 3 con luces de cuadro; final frontal y quieto | https://gemini.google.com/app/7fc8fe12e4be36a3 |
| `BOYACOS - D2 - OFICINA 16x9 - entrada+reposo (NO descargado)` | **GENERADO** (10 s, 1280×720; 4.º intento, tras 2 errores y un "hard time fulfilling"). Revisado: sala → puerta derecha → oficina; reposo frontal con mapa grande sin letras, tablón con las 3 hojas completas y escritorio con teléfono y libreta | https://gemini.google.com/app/b978bcf2dd491d9a |
| `BOYACOS - D3 - MOSTRADOR 16x9 - entrada+reposo (NO descargado)` | **GENERADO** (10 s, 1280×720; a la primera). Revisado: pizarra grande **completamente en blanco (sin la palabra MENU)**, TV apagada entera a la derecha, 3 placas blancas en el frente del mostrador; final frontal y quieto | https://gemini.google.com/app/2bdf525c530b0751 |
| D-entrada 16x9 (desde D0b) | pendiente | — |
| D-loop sala 16x9 | pendiente | — |
| D-catálogo 16x9 | pendiente | — |

Prompt D1 (con la imagen D0 pegada): "Use the attached image as the exact first frame (same first-person POV seated on the sofa, same hands, same room and warm amber lighting). Horizontal 16:9, 10 seconds, one continuous shot, no cuts, smooth natural walking camera at eye height. The viewer stands up from the leather sofa and walks forward through the open dark doorway on the left into the adjacent gallery room of the same premium automotive workshop: dark walnut slat walls, warm amber lighting, steel details, polished concrete floor. A feature wall faces him with exactly six empty picture frames arranged in two rows of three, slim black frames, each with a completely empty dark matte interior (no pictures, no text), softly lit by small amber picture lights. During the first 6 seconds he walks and arrives; during the last 4 seconds the camera is perfectly still, frontal and parallel to the wall, the six frames centered, large and sharp, hands out of view. Photorealistic, no other people, no text anywhere, no logos, no music, no speech."
Para D2 y D3: mismo método, cambiando la puerta (derecha para la oficina) y la descripción de la sala con el texto de los prompts M2/M3 en formato horizontal.

### Estado a 24 oct 2026 (tarde): 3 de 6 videos de escritorio hechos
Hechos y sin descargar: **D1 FOTOS, D2 OFICINA, D3 MOSTRADOR** (1280×720, 10 s). Pendientes: **D-entrada** (desde D0b), **D-loop sala** (desde D0), **D-catálogo** (libro).
- **Bloqueo:** al intentar el 4.º clip, la opción "Crear vídeo" del menú "+" de Gemini aparece **deshabilitada** (gris, sin mensaje) incluso sin imagen adjunta. Panel https://gemini.google.com/usage: uso actual 70 % (se restablece a las 18:26), límite semanal 7 % (se restablece el 30 oct 14:26). Probable tope diario de videos, aparte de la cuota general. Reintentar más tarde o mañana.
- **Imagen D0b de mejor calidad:** la versión de Meta AI mide 2048×1152 (la de Gemini, hecha con el modelo de respaldo, 1024×572). Se puede copiar al portapapeles desde Meta AI con JavaScript: `fetch(img.src,{mode:'cors',credentials:'omit'})` → `createImageBitmap` → canvas → PNG → `navigator.clipboard.write([new ClipboardItem({'image/png':blob})])`, y pegar con ctrl+v en el chat de Gemini (ya en modo vídeo). Funcionó el 24 oct; no se guarda ningún archivo.
- Pegar la imagen ANTES de activar "Crear vídeo" deja el botón gris; el orden correcto es: "+" → Crear vídeo → pegar imagen → escribir prompt.
- Prompt previsto D-entrada (con D0b pegada): primera persona de pie unos pasos detrás del sofá; camina rodeando el sofá, se sienta y apoya las manos en las rodillas; los últimos 3–4 s quietos mirando la mesa con el libro abierto (mismo encuadre que D0).

### D-entrada 16x9 (25 oct 2026) — intentos sin éxito
- Conversación: https://gemini.google.com/app/b039e77f8f960692 (imagen de partida: D0b de Meta AI, 2048×1152, pegada por portapapeles). Gemini mostró "I seem to be encountering an error" y luego 3 veces "I'm having a hard time fulfilling your request" (igual que D2 en sus primeros intentos; D2 salió al 4.º). La cuota estaba en 0 %.
- Prompt usado: "…first frame (same first-person POV standing a few steps behind the brown leather sofa…) Horizontal 16:9, 10 seconds… The viewer walks forward around the leather sofa and sits down on it, ending seated: hands on the knees at the bottom center, looking at the walnut coffee table with the open book, the coffee cup and the small silver model car… last 3 seconds the camera is perfectly still…".
- Siguiente intento sugerido: reintentar unas veces más; si persiste, simplificar el prompt (quitar "sits down" y los objetos de la mesa) o usar como imagen de partida la D0 de Gemini en vez de la D0b de Meta.
- Aviso técnico: la interfaz de Gemini cargó muy lenta durante esta sesión (el menú "+" salió vacío hasta esperar ~40 s tras recargar).

### D-entrada 16x9 — GENERADO (25 oct 2026), sin descargar
- `BOYACOS - D-entrada 16x9 - de pie a sentado (NO descargado)` · https://gemini.google.com/app/5797d439db57d795 · 10 s, 1280×720.
- Se usó el **prompt completo** (sin simplificar) con la imagen D0b de Meta AI (2048×1152) pegada, más "ultra-sharp high-detail image quality, stable gimbal-smooth motion" al final. Salió al 4.º intento (1 error de capacidad y 2 "hard time fulfilling"; el último "Rehacer" funcionó tras recargar).
- Revisado: parte de pie detrás del sofá, rodea el sofá y termina sentado con las manos sobre las rodillas, mesa con libro abierto, taza y carro plateado, puertas oscuras a izquierda y derecha, el taller al fondo y final quieto.
- Estado de los 6 videos de escritorio: D1 ✔, D2 ✔, D3 ✔, **D-entrada ✔**; pendientes **D-loop sala** y **D-catálogo**.

### D-loop SALA 16x9 — GENERADO (25 oct 2026), sin descargar
- `BOYACOS - D-loop SALA 16x9 - reposo en bucle (NO descargado)` · https://gemini.google.com/app/20b72e53f25b3db7 · 10 s, 1280×720. **A la primera**.
- Imagen de partida: la D0 de **Meta AI** (2048×1152) pegada por portapapeles. Prompt completo: reposo sentado casi inmóvil (respiración sutil, deriva de milímetros, manos casi quietas, hilo de vapor de la taza, destellos cálidos en los metales, brillo suave del taller al fondo) y "el último cuadro debe volver exactamente a la posición del primero". Calidad: "ultra-sharp high-detail image quality, stable motion".
- Revisado: el primer y el último cuadro coinciden (manos, mesa con libro/taza/carro, puertas a ambos lados, taller al fondo); el bucle cierra sin salto visible. Al integrar, repetir con `loop` y, si hiciera falta, un fundido cruzado de 0,3 s.
- Estado de los 6 videos de escritorio: D1 ✔, D2 ✔, D3 ✔, D-entrada ✔, **D-loop ✔**; pendiente solo **D-catálogo** (el libro).
- Nota técnica: si el envío se cuelga y el URL no cambia a /app/<id>, recargar: el mensaje no se envió y queda como borrador; hay que reactivar "Crear vídeo" y volver a pegar la imagen.

### D-catálogo 16x9 — PENDIENTE (25 oct 2026)
- Prompt listo en `docs/prompt-catalogo-escritorio.txt`: es el prompt aprobado del catálogo móvil, **con todo el texto y los dibujos minimalistas**, adaptado a horizontal 16:9 y con la frase de calidad añadida; no se simplificó nada. Imagen de partida: la D0 de Meta AI (2048×1152), copiada al portapapeles con el método de este documento.
- **Bloqueo al intentarlo:** en Gemini la opción "Crear vídeo" del menú "+" quedó **atenuada** (sin mensaje) tras más de 30 s de espera, igual que el 24 oct cuando se alcanzó el tope diario de videos (la cuota general marcaba 0 %). Ese día se habían generado/reintentado unos 8 videos; hoy llevamos unos 6 intentos (entrada y loop). Hipótesis: tope diario de videos, no de uso general. Reintentar más tarde o mañana.
- Orden previsto al reintentar: recargar → "+" → Crear vídeo (esperar a que deje de estar gris) → pegar D0 → pegar el prompt completo → enviar → "Rehacer" si da error.

### D-catálogo 16x9 — GENERADO (25 oct 2026, 12:41 pm), sin descargar
- `BOYACOS - D-catalogo 16x9 - libro y giro, video 1 (NO descargado)` · https://gemini.google.com/app/654bb33ab335de19 · la opción "Crear vídeo" volvió a estar activa (el tope diario se restableció) y la tarea programada pudo generarlo.
- Se usó el **prompt completo** de `docs/prompt-catalogo-escritorio.txt` (2536 caracteres, sin recortar) con la D0 de Meta AI (2048×1152) pegada. Hubo un primer envío con "Fallo de generación por tráfico"; al reenviar el borrador con la imagen salieron **dos videos** en la misma conversación (ambos 10 s, 1280×720).
- **Video 1 (el bueno):** a los 2,5 s el libro ya está agarrado y quieto con la primera doble en papel carbón oscuro: SERVICIOS (llave inglesa con líneas de velocidad, 5 líneas, VER TODO) y REPUESTOS (carro de perfil, 5 líneas, VER TODO), manos solo en las esquinas inferiores. A los ~5,8 s se está terminando el giro y aparece la segunda doble oscura: VEHÍCULOS QUE ATENDEMOS (carro, "Multimarca: atendemos todo tipo de carros.", dos columnas, VER MÁS) y AYUDA EN CARRETERA (carro, "¿Te has varado? Llámanos de inmediato.", PEDIR AYUDA). Final quieto y legible, sin dibujos sobre el texto.
  - **Defecto menor:** la columna derecha de marcas repite "Otro" dos veces (Nissan, Hyundai, Volkswagen, BYD, Otro, Otro); el prompt pedía uno. Se puede tapar o corregir al integrar (superposición de texto de la página) o regenerar.
- **Video 2 (alternativo, peor):** a los 2 s el libro aún se levanta y el texto sale borroso; el final tiene "OYD" en vez de "BYD". No usar salvo que se descarte el 1.
- **Estado de los 6 videos de escritorio: 6 de 6 generados** (D1, D2, D3, entrada, loop y catálogo), todos sin descargar. Pendiente para integrar: luz verde del cliente para descargar, y decidir si se regenera el catálogo para tener el texto sin el "Otro" repetido.

## DESCARGADOS (25 oct 2026) — luz verde del cliente
Carpeta: `C:\Users\COMPUMAX\Desktop\Modelos de páginas web\Videos\Mecanic walk in\` (10 archivos, h264, 24 fps, 10 s, sin audio relevante).

| Archivo | Formato | Conversación de Gemini |
|---|---|---|
| `M1-FOTOS-9x16.mp4` | 720×1280 | feb6fe0cb1a8902a |
| `M2-OFICINA-9x16.mp4` | 720×1280 | f52296467b2edfb4 |
| `M3-MOSTRADOR-9x16.mp4` | 720×1280 (trae "MENU" en la pizarra) | b0e1bf86de3f6067 |
| `D1-FOTOS-16x9.mp4` | 1280×720 | 7fc8fe12e4be36a3 |
| `D2-OFICINA-16x9.mp4` | 1280×720 | b978bcf2dd491d9a |
| `D3-MOSTRADOR-16x9.mp4` | 1280×720 | 2bdf525c530b0751 |
| `D-ENTRADA-16x9.mp4` | 1280×720 | 5797d439db57d795 |
| `D-LOOP-SALA-16x9.mp4` | 1280×720 (bucle) | 20b72e53f25b3db7 |
| `D-CATALOGO-16x9-video1.mp4` | 1280×720 (el bueno; "Otro" repetido en la 2.ª doble) | 654bb33ab335de19 |
| `D-CATALOGO-16x9-video2-alternativo.mp4` | 1280×720 (peor; "OYD" en vez de "BYD") | 654bb33ab335de19 |

- Las conversaciones de Gemini ya se renombraron con el sufijo "(DESCARGADO)" (25 oct 2026).
- **Método de descarga que funcionó:** abrir la conversación en una pestaña NUEVA (Chrome solo permite una descarga automática por pestaña), esperar a que cargue (~40 s), y desde la página hacer `fetch(video.currentSrc,{credentials:'include'})` → blob → enlace `<a download="NOMBRE.mp4">`. Llegan a `~/Downloads` y se mueven a la carpeta destino. Un receptor local en `127.0.0.1` NO sirve: Gemini bloquea esa conexión.
- No están descargados: las imágenes D0 y D0b (siguen en Meta AI/Gemini) ni los videos de sesiones anteriores ya usados en producción (`clip1-entrada`, `clip2-loop`, `clip3a/b/c`, ya en `assets/`).
- Siguiente fase: recodificar con ffmpeg (crf 18–20, sin audio, 24 fps), cortar entrada/reposo, medir esquinas de superficies, integrar habitaciones con contenido de la página encima, tapar "MENU" (M3) y el "Otro" repetido (catálogo).
