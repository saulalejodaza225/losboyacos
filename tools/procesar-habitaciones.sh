#!/usr/bin/env bash
# Prepara los clips de las habitaciones para la página a partir de los videos originales de Gemini.
# Uso: tools/procesar-habitaciones.sh "<carpeta con M1-FOTOS-9x16.mp4 ...>" [carpeta_salida]
# Por habitación genera: <id>-entrada.mp4 (camina), <id>-reposo.mp4 (vaivén sin salto), <id>-salida.mp4 (entrada al revés) y <id>.webp (póster).
set -euo pipefail
SRC="${1:?Falta la carpeta con los videos originales}"
OUT="${2:-assets/habitaciones}"
mkdir -p "$OUT"
# id | archivo original | segundo en que empieza el reposo | segundo del póster | segundo en que termina el reposo (opcional; v9: la puerta se cierra después)
# Variable ONLY="fotos mostrador" procesa solo esas habitaciones.
# 5.º campo "fijo" (v9b, caminando): la entrada es el video entero y el reposo es su último fotograma quieto (el póster también).
HAB=(
  "fotos|v9/V9-1-FOTOS.mp4|99||fijo"
  "oficina|v9/V9-3-OFICINA.mp4|99||fijo"
  "mostrador|v9/V9-2-MOSTRADOR.mp4|99||fijo"
)
ENC=(-c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -r 24 -an -movflags +faststart)
for h in "${HAB[@]}"; do
  IFS="|" read -r id file stop pt rend <<<"$h"; pt="${pt:-9.6}"
  if [ -n "${ONLY:-}" ] && [[ " $ONLY " != *" $id "* ]]; then continue; fi
  RT=(); [ -n "${rend:-}" ] && [ "$rend" != fijo ] && RT=(-t "$(awk "BEGIN{print $rend-$stop}")")
  in="$SRC/$file"
  echo "== $id ($file, reposo desde ${stop}s)"
  # entrada: del inicio hasta que la cámara se detiene
  ffmpeg -v error -y -i "$in" -t "$stop" "${ENC[@]}" "$OUT/$id-entrada.mp4"
  # salida: la entrada al revés (para volver a la sala)
  ffmpeg -v error -y -i "$OUT/$id-entrada.mp4" -vf reverse "${ENC[@]}" "$OUT/$id-salida.mp4"
  if [ "${rend:-}" = fijo ]; then   # reposo y póster = último fotograma
    ffmpeg -v error -y -sseof -0.4 -i "$in" -update 1 "$OUT/$id-fijo.png"   # se queda con el último
    ffmpeg -v error -y -loop 1 -i "$OUT/$id-fijo.png" -t 4 "${ENC[@]}" "$OUT/$id-reposo.mp4"
    ffmpeg -v error -y -i "$OUT/$id-fijo.png" -c:v libwebp -quality 82 "$OUT/$id.webp"; rm -f "$OUT/$id-fijo.png"; continue
  fi
  # reposo: tramo quieto adelante y atrás (bucle continuo sin salto)
  ffmpeg -v error -y -ss "$stop" "${RT[@]}" -i "$in" -filter_complex \
    "[0:v]setpts=PTS-STARTPTS,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[v]" -map "[v]" "${ENC[@]}" "$OUT/$id-reposo.mp4"
  # póster: fotograma quieto del reposo
  ffmpeg -v error -y -ss "$pt" -i "$in" -frames:v 1 -c:v libwebp -quality 82 "$OUT/$id.webp"
done
echo "Listo:"; ls -la "$OUT"
