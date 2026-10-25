#!/usr/bin/env bash
# Prepara los clips de ESCRITORIO (16:9, 1280x720) a partir de los videos originales de Gemini.
# Uso: tools/procesar-escritorio.sh "<carpeta con D1-FOTOS-16x9.mp4 ...>"
# Genera: assets/escritorio/entrada.mp4, loop.mp4 (vaivén sin salto), poster.webp
#         assets/habitaciones/<id>-16x9-entrada.mp4, -reposo.mp4, -salida.mp4 y <id>-16x9.webp
set -euo pipefail
SRC="${1:?Falta la carpeta con los videos originales}"
ESC="assets/escritorio"; HAB="assets/habitaciones"
mkdir -p "$ESC" "$HAB"
ENC=(-c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -r 24 -an -movflags +faststart)
echo "== sala"
ffmpeg -v error -y -i "$SRC/D-ENTRADA-16x9.mp4" "${ENC[@]}" "$ESC/entrada.mp4"
ffmpeg -v error -y -i "$SRC/D-LOOP-SALA-16x9.mp4" -filter_complex \
  "[0:v]setpts=PTS-STARTPTS,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[v]" -map "[v]" "${ENC[@]}" "$ESC/loop.mp4"
ffmpeg -v error -y -i "$SRC/D-ENTRADA-16x9.mp4" -frames:v 1 -c:v libwebp -quality 82 "$ESC/poster.webp"
# id | archivo | segundo en que la cámara se detiene
for h in "fotos|D1-FOTOS-16x9.mp4|8.6|9.6" "oficina|D2-OFICINA-16x9.mp4|8.4|9.6" "mostrador|D3-MOSTRADOR-v2-16x9.mp4|8.6|9.3"; do
  IFS="|" read -r id file stop pt <<<"$h"; in="$SRC/$file"
  echo "== $id (reposo desde ${stop}s)"
  ffmpeg -v error -y -i "$in" -t "$stop" "${ENC[@]}" "$HAB/$id-16x9-entrada.mp4"
  ffmpeg -v error -y -i "$HAB/$id-16x9-entrada.mp4" -vf reverse "${ENC[@]}" "$HAB/$id-16x9-salida.mp4"
  ffmpeg -v error -y -ss "$stop" -i "$in" -filter_complex \
    "[0:v]setpts=PTS-STARTPTS,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[v]" -map "[v]" "${ENC[@]}" "$HAB/$id-16x9-reposo.mp4"
  ffmpeg -v error -y -ss "$pt" -i "$in" -frames:v 1 -c:v libwebp -quality 82 "$HAB/$id-16x9.webp"
done


# catálogo: abre (0–4.2 s, termina en la 1.ª doble), pasa (4.2–7.2 s, termina en la 2.ª doble) y atrás (pasa al revés)
echo "== catálogo"
CAT="$SRC/D-CATALOGO-16x9-video1.mp4"
ffmpeg -v error -y -i "$CAT" -t 4.2 "${ENC[@]}" "$ESC/cat-abre.mp4"
ffmpeg -v error -y -ss 4.2 -i "$CAT" -t 3.0 "${ENC[@]}" "$ESC/cat-pasa.mp4"
ffmpeg -v error -y -i "$ESC/cat-pasa.mp4" -vf reverse "${ENC[@]}" "$ESC/cat-atras.mp4"
ls -la "$ESC"
