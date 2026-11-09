#!/usr/bin/env bash
# Videos móviles v10 (720×1280) a partir de los clips de Gemini (mismo maestro, 3 puertas cerradas).
# Uso: tools/v10-movil.sh "<carpeta Mecanic walk in>"
#   assets/clip2-loop.mp4      bucle de la sala = V10-4-BUCLE en vaivén (adelante y atrás)
#   assets/clip1-entrada.mp4   intro = V10-6-INTRO (mira alrededor sentado y vuelve al frente; termina en el encuadre del bucle)
#   assets/poster.webp         primer cuadro de la intro
#   assets/clip3a-agarra.mp4   catálogo, tramo C: 0 – 4,4 s de V10-5-CATALOGO (toma el libro y muestra la 1.ª doble)
#   assets/clip3b-pagina.mp4   catálogo, tramo D: 4,4 – 7,8 s (pasa la hoja y queda la 2.ª doble)
#   assets/clip3c-atras.mp4    catálogo, tramo E = D al revés
# Las habitaciones se procesan aparte: tools/procesar-habitaciones.sh (5.º campo «fijo»).
set -euo pipefail
SRC="${1:?Falta la carpeta con los videos originales}"
V9="$SRC/v9"; A=assets
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
ENC=(-c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -r 24 -an -movflags +faststart)
PP='setpts=PTS-STARTPTS,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[v]'

# 1) bucle: el clip completo adelante y atrás
ffmpeg -v error -y -i "$V9/V10-4-BUCLE.mp4" -filter_complex "[0:v]$PP" -map "[v]" "${ENC[@]}" "$A/clip2-loop.mp4"

# 2) intro: el clip tal cual
ffmpeg -v error -y -i "$V9/V10-6-INTRO.mp4" "${ENC[@]}" "$A/clip1-entrada.mp4"
ffmpeg -v error -y -i "$A/clip1-entrada.mp4" -frames:v 1 -c:v libwebp -quality 80 "$A/poster.webp"

# 3) catálogo: C, D y E (D al revés)
ffmpeg -v error -y -t 4.4 -i "$V9/V10-5-CATALOGO.mp4" "${ENC[@]}" "$A/clip3a-agarra.mp4"
ffmpeg -v error -y -ss 4.4 -t 3.4 -i "$V9/V10-5-CATALOGO.mp4" "${ENC[@]}" "$A/clip3b-pagina.mp4"
ffmpeg -v error -y -i "$A/clip3b-pagina.mp4" -vf reverse "${ENC[@]}" "$A/clip3c-atras.mp4"
# 4) parche: la 2.ª doble trae «PEDIR AYUDA» dos veces; se tapa la de arriba con papel de justo debajo
ffmpeg -v error -y -sseof -0.2 -i "$A/clip3b-pagina.mp4" -update 1 -vf "crop=89:24:403:803" -c:v libwebp -quality 92 "$A/cat-parche-movil.webp"
echo "Listo"; ls -la "$A"/clip*.mp4 "$A/poster.webp"
