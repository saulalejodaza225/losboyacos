#!/usr/bin/env bash
# Videos móviles v10 (720×1280) a partir de los clips de Gemini (mismo maestro, 3 puertas cerradas).
# Uso: tools/v10-movil.sh "<carpeta Mecanic walk in>"
#   assets/clip2-loop.mp4      bucle de la sala = V10-4-BUCLE en vaivén (adelante y atrás)
#   assets/clip1-entrada.mp4   intro = V11-INTRO-origen al revés (llega al local caminando y se sienta; termina en el encuadre del bucle)
#   assets/poster.webp         primer cuadro de la intro
#   assets/clip3a-agarra.mp4   catálogo, tramo C: 0 – 3,5 s de V10-5-CATALOGO (toma el libro y muestra la 1.ª doble)
#   assets/clip3b-pagina.mp4   catálogo, tramo D: 3,5 – 7,8 s (pasa la hoja y queda la 2.ª doble)
#   assets/cat-papel-1|2.webp  papel sin letras del último cuadro de cada doble, bajo el texto nítido de index.html
#   assets/clip3c-atras.mp4    catálogo, tramo E = D al revés
# Las habitaciones se procesan aparte: tools/procesar-habitaciones.sh (5.º campo «fijo»).
set -euo pipefail
SRC="${1:?Falta la carpeta con los videos originales}"
V9="$SRC/v9"; A=assets
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
ENC=(-c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -r 24 -an -movflags +faststart)
PP='setpts=PTS-STARTPTS,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[v]'

if [ "${SOLO:-}" != catalogo ]; then   # SOLO=catalogo rehace únicamente el catálogo
# 1) bucle: el clip completo adelante y atrás
ffmpeg -v error -y -i "$V9/V10-4-BUCLE.mp4" -filter_complex "[0:v]$PP" -map "[v]" "${ENC[@]}" "$A/clip2-loop.mp4"

# 2) intro: V11-INTRO se genera desde el maestro alejándose hacia atrás; al revés es «llega al local y se sienta» y termina exacto en el maestro
ffmpeg -v error -y -i "$V9/V11-INTRO-origen.mp4" -vf reverse "${ENC[@]}" "$A/clip1-entrada.mp4"
ffmpeg -v error -y -i "$A/clip1-entrada.mp4" -frames:v 1 -c:v libwebp -quality 80 "$A/poster.webp"


# 2b) burbujas de WhatsApp y Maps: saca el celular y lo mira (1,0 – 4,6 s de V11-3-CELULAR, a 1,4×)
ffmpeg -v error -y -ss 1.0 -t 3.6 -i "$V9/V11-3-CELULAR.mp4" -vf "setpts=(PTS-STARTPTS)/1.4" "${ENC[@]}" "$A/clip-celular.mp4"
fi

# 3) catálogo: C, D y E (D al revés). El corte es a los 3,5 s: las dos manos solo sostienen el libro.
ffmpeg -v error -y -t 3.5 -i "$V9/V10-5-CATALOGO.mp4" "${ENC[@]}" "$A/clip3a-agarra.mp4"
ffmpeg -v error -y -ss 3.5 -t 4.3 -i "$V9/V10-5-CATALOGO.mp4" "${ENC[@]}" "$A/clip3b-pagina.mp4"
ffmpeg -v error -y -i "$A/clip3b-pagina.mp4" -vf reverse "${ENC[@]}" "$A/clip3c-atras.mp4"

# 4) papel limpio: borra las letras del video en el último cuadro de cada doble (mediana ancha) para poner encima
#    texto real, nítido en cualquier pantalla. Solo se tapan las cajas de texto: los íconos rojos siguen siendo del video.
papel(){ # papel <clip> <salida> <cajas x,y,ancho,alto separadas por espacio>
  local clip="$1" out="$2" boxes="" b x y w h; shift 2
  for b in "$@"; do IFS=, read -r x y w h <<<"$b"; boxes+="drawbox=x=$x:y=$y:w=$w:h=$h:color=white:t=fill,"; done
  ffmpeg -v error -y -sseof -0.1 -i "$clip" -update 1 "$TMP/f.png"
  ffmpeg -v error -y -i "$TMP/f.png" -filter_complex "[0:v]median=radius=34,format=yuva420p[m];color=c=black:s=720x1280:d=1,format=gray,${boxes}gblur=sigma=3,lut=y='min(255,val*1.16)'[a];[m][a]alphamerge" -frames:v 1 -c:v libwebp -quality 90 "$out"
}
papel "$A/clip3a-agarra.mp4" "$A/cat-papel-1.webp" 142,580,182,40 404,584,200,40 146,688,168,136 432,690,156,136 172,850,102,30 458,852,104,30
papel "$A/clip3b-pagina.mp4" "$A/cat-papel-2.webp" 120,592,244,74 120,704,244,56 122,756,106,136 241,756,124,114 104,908,96,40 398,596,186,74 400,708,200,72 400,772,100,36 516,908,128,40
echo "Listo"; ls -la "$A"/clip*.mp4 "$A/poster.webp"
