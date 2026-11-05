# Recorrido navegable del taller (borrador, 5 nov 2026)

Base: `docs/plano-taller.svg`. Cada tramo entre dos áreas es un clip; el visitante toca una puerta y camina hasta el área.

## Mapa de conexiones
- Sala de espera → Galería de fotos, Recepción, Oficina (existentes, 3 clips c/u).
- Recepción → Nave (hub: pasillo de servicio) → Bahía 1, Bahía 2, Bahía 3, Bodega (nuevos).

## Clips que ya existen (por formato): 14
Sala (entrada, bucle, catálogo ×3) + Fotos, Oficina y Mostrador (entrada, reposo, salida).

## Clips nuevos (por formato)
| Tramo | Entrada | Reposo | Salida |
|---|---|---|---|
| Recepción → Nave | 1 | 1 | 1 |
| Nave → Bahía 1 | 1 | 1 | 1 |
| Nave → Bahía 2 | 1 | 1 | 1 |
| Nave → Bahía 3 | 1 | 1 | 1 |
| Nave → Bodega | 1 | 1 | 1 |
| **Total** | 5 | 5 | 5 = **15** |

Móvil + escritorio = **30 clips nuevos**; junto a los 28 actuales, 58 archivos.

## Cómo reducir generación con IA
Solo las **entradas** (5 por formato, 10 en total) necesitan IA. Con ffmpeg:
- la **salida** = la entrada reproducida al revés;
- el **reposo** = los últimos segundos de la entrada en bucle (como ya mide `tools/procesar-habitaciones.sh`).
Cada entrada debe mostrar el vano abierto desde el primer cuadro (ver `docs/prompts-transiciones-puertas.md`).
