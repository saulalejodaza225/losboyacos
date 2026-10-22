# uso: comp.sh base.mp4 startnum out.mp4 [rev]
BASE=$1; START=$2; OUT=$3; REV=$4
R=""; [ "$REV" = "rev" ] && R=",reverse"
ffmpeg -v error -y -i "$BASE" -framerate 24 -start_number $START -i ov/o%03d.png -filter_complex "
[0:v]split=3[base][b1][b2];
[b1]format=gbrp,extractplanes=r[r];
[b2]format=gbrp,extractplanes=b[b];
[r][b]blend=all_expr='if(gt(A-B,44),255,0)',dilation,dilation,gblur=sigma=1.5,negate[ns];
[1:v]format=rgba${R},split[o1][o2];
[o2]alphaextract[al];
[al][ns]blend=all_mode=darken[al2];
[o1][al2]alphamerge[ov];
[base][ov]overlay=format=auto,format=yuv420p[o]" -map "[o]" -an -c:v libx264 -preset slow -crf 16 -profile:v high -pix_fmt yuv420p -r 24 -movflags +faststart -frames:v $5 "$OUT"
