# Prompts v9 (copiar tal cual)

## 0) Cuadro maestro — Gemini "Crear imagen", adjuntar `docs/fotogramas/maestro-puertas-9x16.jpg`
Edit the attached image. Keep EVERYTHING exactly the same (same first-person seated view, the viewer's two hands on his knees at the bottom, same brown leather sofa, same dark walnut coffee table with the open book, espresso cup and silver toy car, same armchair and plant, same dark walnut slat walls, red neon line, steering wheel, piston and lit shelves, same warm amber moody lighting, same composition and framing), with ONE change: the three doors in the back wall must all be completely CLOSED. On the left a closed solid dark steel-framed door with a dark walnut slat panel; in the center the glass partition with its frameless glass door closed flush, brushed steel handle visible; on the right a closed solid dark steel-framed door matching the left one. The three closed doors are clearly visible side by side, evenly spaced, not hidden by furniture. Behind the glass you can only see a faint dark blur. No people. Vertical 9:16, photorealistic.

## Base de los 4 clips (Gemini "Crear vídeo", Vertical, adjuntar el maestro v9 en cada petición)
FIRST FRAME (must match the attached image exactly): first-person view seated on a brown leather sofa in a premium automotive workshop lounge, the viewer's two hands resting on his knees, dark walnut coffee table with an open book, espresso cup and silver toy car, three CLOSED doors in the back wall (left steel-framed door, center frameless glass door, right steel-framed door). Warm amber, dark, moody lighting. Vertical 9:16.

CAMERA: completely FIXED, locked-off, strictly first-person from the seated position, the hands stay resting on the knees the whole time. No camera movement, no standing up, no walking. NO person, silhouette, arm or body appears anywhere; doors open and close by themselves smoothly. Duration 10 seconds, one continuous shot.

TIMING: 0.0–1.0 s everything still, all doors closed. 1.0–3.0 s the <PUERTA> opens slowly and fully. 3.0–7.0 s the door stays open, perfectly still, and the <HABITACIÓN> beyond is clearly visible, sharp and well lit. 7.0–9.0 s the door closes slowly by itself. 9.0–10.0 s everything still again, all three doors closed exactly as in the first frame.

CONSISTENCY: the room, sofa, table and the other two doors never change; no wall appears, disappears or morphs; the closed door at the end is identical to the first frame.

AVOID: any person anywhere, a third-person view, camera shake or movement, standing up, extra doors, changing the room, text, logos, watermarks, music and speech.
Photorealistic, same lighting and color grading as the first frame.

## 1) FOTOS — sustituir en TIMING `<PUERTA>` = "LEFT steel-framed door" y `<HABITACIÓN>` por:
dark gallery room, dark walnut slat walls, polished dark concrete floor, warm amber light, a feature wall facing the camera with exactly six empty picture frames in two rows of three, slim black frames with thin cream mats and completely empty dark matte interiors, lit by small brass picture lights; no text.

## 2) MOSTRADOR — `<PUERTA>` = "CENTER frameless glass door" y `<HABITACIÓN>` por:
small service reception of a car repair shop (NOT the open workshop floor, no cars, no lifts): a heavy dark walnut and steel counter with a vintage brass mechanical cash register, a small brass desk bell, a pen holder and a clipboard; on the FRONT FACE of the counter ONE straight horizontal row of exactly three small square blank white acrylic plaques of identical size, evenly spaced; behind it on the dark walnut slat wall a matte black key rack with car keys and a large wall panel in a thin brushed steel frame with an LED strip above whose surface is completely empty dark slate.

## 3) OFICINA — `<PUERTA>` = "RIGHT steel-framed door" y `<HABITACIÓN>` por:
small warm office with dark walnut slat walls: a large HORIZONTAL framed map of the city of Bogotá with a brown wooden frame hanging in the upper center of the wall, large and sharp; a wooden notice board with three blank white paper sheets on the left; a walnut desk with a black landline desk phone at the bottom.

### 3b) OFICINA reforzado (tras el intento 1 que transformó la pared). Sobre la base con la sección 3:
- CAMERA: añadir «No camera movement, no zoom, no dolly, no reframing: the framing is identical in every frame.»
- Nuevo bloque tras CAMERA: «LAYOUT: the back wall keeps exactly the same three doors in exactly the same positions for all 10 seconds. The LEFT door stays closed. The CENTER glass door stays closed and visible the whole time. ONLY the RIGHT door swings open. The office is seen ONLY through the open right doorway; it does not replace or cover the wall, and the left and center doors never move or disappear.»
- CONSISTENCY: añadir «The last frame must be identical to the first frame.»
- AVOID: añadir «zooming in», «the door staying open at the end» y (intento 3) «cuts, transitions, wipes, circular reveals».

## 4) CATÁLOGO — NO usa la base anterior; usar el prompt 4 de `docs/prompts-videos-v8.md` (manos toman el libro), con el maestro v9 adjunto y el primer cuadro con las puertas cerradas.

## v9b — CAMINANDO (pedido del usuario, 4 nov): la persona se levanta, camina hasta la puerta, entra y se detiene
Reemplaza la base de cámara fija (el usuario no quiere que la persona se quede sentada mientras la puerta se abre). Entrada = 0–8,5 s; reposo = 8,5–10 s quieto en vaivén; salida = entrada al revés (vuelve caminando y se sienta en el cuadro de la sala).
Plantilla (sustituir `<LADO>`, `<PUERTA>`, `<SALA>` y `<DESCRIPCIÓN>`):

FIRST FRAME (must match the attached image exactly): (igual que la base)

ACTION (strictly first-person POV, one continuous smooth gimbal-like shot, 10 seconds): 0.0–1.0 s still, seated, hands on the knees. 1.0–2.5 s the viewer stands up smoothly from the sofa; the camera rises to standing eye level and the hands leave the frame. 2.5–6.0 s he walks slowly and steadily forward, passing to the <LADO> of the coffee table, straight toward the <PUERTA>; as he approaches, the door swings open by itself. 6.0–8.5 s he walks through the open doorway into <SALA> and stops facing its back wall. 8.5–10.0 s the camera is completely still at standing eye level, perfectly steady, looking at <DESCRIPCIÓN>.

CONSISTENCY: while walking, the lounge stays exactly the same as the first frame: same sofa, table, armchair, shelves and the same three doors in the same positions; only the <PUERTA> opens. <SALA> is a small enclosed room behind that door, NOT the open workshop floor. No cuts, no transitions, no wipes, no dissolves, no circular reveals, no teleporting: the viewer physically walks the whole way.

AVOID: any other person anywhere, a third-person view, seeing the viewer's body, camera shake, zoom tricks, flying camera, walking into the workshop, cars, car lifts, extra doors, text, logos, watermarks, music and speech.
Photorealistic, same lighting and color grading as the first frame.

- Fotos: LADO = LEFT, PUERTA = LEFT steel-framed wooden door, SALA = a dark gallery room, DESCRIPCIÓN = texto de la sección 1.
- Mostrador: LADO = LEFT, PUERTA = CENTER frameless glass door, SALA = a small service reception, DESCRIPCIÓN = texto de la sección 2.
- Oficina: LADO = RIGHT, PUERTA = RIGHT steel-framed wooden door, SALA = a small warm office, DESCRIPCIÓN = texto de la sección 3.
