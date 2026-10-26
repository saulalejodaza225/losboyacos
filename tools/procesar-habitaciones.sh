#!/usr/bin/env bash
# Prepara los clips de las habitaciones para la página a partir de los videos originales de Gemini.
# Uso: tools/procesar-habitaciones.sh "<carpeta con M1-FOTOS-9x16.mp4 ...>" [carpeta_salida]
# Por habitación genera: <id>-entrada.mp4 (camina), <id>-reposo.mp4 (vaivén sin salto), <id>-salida.mp4 (entrada al revés) y <id>.webp (póster).
set -euo pipefail
SRC="${1:?Falta la carpeta con los videos originales}"
OUT="${2:-assets/habitaciones}"
mkdir -p "$OUT"
# id | archivo original | segundo en que la cámara se detiene (empieza el reposo)
HAB=(
  "fotos|M1-FOTOS-v8-9x16.mp4|8.0|9.3"
  "oficina|M2-OFICINA-9x16.mp4|6.25"
  "mostrador|M3-MOSTRADOR-v2-9x16.mp4|7.5|8.7"
)
ENC=(-c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -r 24 -an -movflags +faststart)
for h in "${HAB[@]}"; do
  IFS="|" read -r id file stop pt <<<"$h"; pt="${pt:-9.6}"
  in="$SRC/$file"
  echo "== $id ($file, reposo desde ${stop}s)"
  # entrada: del inicio hasta que la cámara se detiene
  ffmpeg -v error -y -i "$in" -t "$stop" "${ENC[@]}" "$OUT/$id-entrada.mp4"
  # salida: la entrada al revés (para volver a la sala)
  ffmpeg -v error -y -i "$OUT/$id-entrada.mp4" -vf reverse "${ENC[@]}" "$OUT/$id-salida.mp4"
  # reposo: tramo quieto adelante y atrás (bucle continuo sin salto)
  ffmpeg -v error -y -ss "$stop" -i "$in" -filter_complex \
    "[0:v]setpts=PTS-STARTPTS,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[v]" -map "[v]" "${ENC[@]}" "$OUT/$id-reposo.mp4"
  # póster: fotograma quieto del reposo
  ffmpeg -v error -y -ss "$pt" -i "$in" -frames:v 1 -c:v libwebp -quality 82 "$OUT/$id.webp"
done
echo "Listo:"; ls -la "$OUT"
