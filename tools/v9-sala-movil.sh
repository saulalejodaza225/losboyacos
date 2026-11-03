#!/usr/bin/env bash
# Sala móvil v9 (puertas CERRADAS) a partir de los clips v9 de Gemini.
# Uso: tools/v9-sala-movil.sh "<carpeta Mecanic walk in>"
# Genera (solo móvil, 720×1280):
#   assets/clip2-loop.mp4      bucle de la sala: tramo quieto inicial de V9-1-FOTOS en vaivén
#   assets/clip1-entrada.mp4   intro: el plano se asienta (zoom suave hacia atrás) sobre ese mismo bucle
#   assets/poster.webp         primer fotograma de la intro (se ve mientras carga)
#   assets/clip3a-agarra.mp4   catálogo provisional: acercamiento al libro + fundido al libro en las manos (clip anterior)
#   assets/habitaciones/oficina-{entrada,salida}.mp4  oficina provisional: fundido desde la sala v9 al clip anterior
# Cuando existan los clips v9 de Catálogo y Oficina se reemplazan los provisionales.
set -euo pipefail
SRC="${1:?Falta la carpeta con los videos originales}"
V9="$SRC/v9"; A=assets; H=assets/habitaciones
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
ENC=(-c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -r 24 -an -movflags +faststart)
QUIETO=0.6   # segundos iniciales de V9-1-FOTOS sin movimiento (medido con tblend+signalstats)

# 1) bucle: 0–0,6 s adelante y atrás, ×10 (12,5 s: el salto del bucle casi no ocurre; empieza y termina en el fotograma 0 = primer cuadro de cada habitación)
ffmpeg -v error -y -t "$QUIETO" -i "$V9/V9-1-FOTOS.mp4" -filter_complex \
  "[0:v]setpts=PTS-STARTPTS,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[v]" -map "[v]" "${ENC[@]}" "$TMP/pp1.mp4"
ffmpeg -v error -y -stream_loop 9 -i "$TMP/pp1.mp4" "${ENC[@]}" "$TMP/pp.mp4"
cp "$TMP/pp.mp4" "$A/clip2-loop.mp4"

# 2) intro de 2,5 s (2 vaivenes completos: termina en el fotograma con que arranca el bucle): zoom 1,32 → 1 con salida suave, centrado en las puertas, sobre el bucle (el vapor del café se mueve)
ffmpeg -v error -y -i "$TMP/pp.mp4" -t 2.5 -vf \
  "scale=1440:2560:flags=lanczos,zoompan=z='1+0.32*pow(1-min(on/56\,1)\,3)':x='iw/2-iw/zoom/2':y='(ih*0.40)-(ih*0.40)/zoom':d=1:s=720x1280:fps=24" \
  "${ENC[@]}" "$A/clip1-entrada.mp4"
ffmpeg -v error -y -i "$A/clip1-entrada.mp4" -frames:v 1 -c:v libwebp -quality 80 "$A/poster.webp"

# 3) catálogo provisional: 0,8 s de acercamiento al libro (centro del libro en 280,785 → centro de pantalla) desde la sala v9
#    y fundido de 0,35 s al libro ya en las manos del clip anterior (termina en el mismo fotograma: las hojas siguen alineadas)
FU="$V9/fuentes"   # copias de los clips v7 que se usan como fuente
ffmpeg -v error -y -i "$TMP/pp.mp4" -ss 2.75 -i "$FU/clip3a-agarra-v7.mp4" -filter_complex \
  "[0:v]trim=0:1.15,setpts=PTS-STARTPTS,scale=1440:2560:flags=lanczos,zoompan=z='1+0.9*pow(min(on/19\,1)\,2)':x='560-(560*(1-min(on/19\,1))+720*min(on/19\,1))/zoom':y='1570-(1570*(1-min(on/19\,1))+1280*min(on/19\,1))/zoom':d=1:s=720x1280:fps=24,format=yuv420p,settb=AVTB[a];[1:v]setpts=PTS-STARTPTS,fps=24,format=yuv420p,settb=AVTB[b];[a][b]xfade=transition=fade:duration=0.35:offset=0.8[v]" \
  -map "[v]" "${ENC[@]}" "$A/clip3a-agarra.mp4"

# 4) oficina provisional: 0,3 s de sala v9 y fundido de 0,5 s al clip anterior (la salida es la entrada al revés)
ffmpeg -v error -y -i "$TMP/pp.mp4" -t 6.25 -i "$SRC/M2-OFICINA-9x16.mp4" -filter_complex \
  "[0:v]trim=0:0.8,setpts=PTS-STARTPTS,format=yuv420p,settb=AVTB[a];[1:v]setpts=PTS-STARTPTS,fps=24,scale=720:1280,format=yuv420p,settb=AVTB[b];[a][b]xfade=transition=fade:duration=0.5:offset=0.3[v]" \
  -map "[v]" "${ENC[@]}" "$H/oficina-entrada.mp4"
ffmpeg -v error -y -i "$H/oficina-entrada.mp4" -vf reverse "${ENC[@]}" "$H/oficina-salida.mp4"
echo "Listo"; ls -la "$A"/clip*.mp4 "$A/poster.webp" "$H"/oficina-*.mp4
