# uso: seg.sh "<filtros de selección>" salida.mp4
SEL=$1; OUT=$2; S=~/Downloads/gemini_generated_video_42bd97e2.mp4
ER6="erosion,erosion,erosion,erosion,erosion,erosion"; DI6="dilation,dilation,dilation,dilation,dilation,dilation"
ER14="$ER6,erosion,erosion,erosion,erosion,erosion,erosion,erosion,erosion"
ffmpeg -v error -y -i $S -filter_complex "
[0:v]$SEL,format=gbrp,split=3[a][b][c];
[b]$ER6,$DI6[op];
[op]split[op1][op2];
[op2]format=gray,gblur=sigma=3,lutyuv=y='if(lt(val,135),255,0)',$ER14[dkn];
[c][op1]blend=all_mode=subtract,format=gray,lutyuv=y='if(gt(val,12),255,0)',dilation,dilation,dilation[tm];
[tm][dkn]blend=all_mode=darken,drawbox=x=0:y=0:w=iw:h=430:color=black:t=fill,drawbox=x=0:y=1010:w=iw:h=300:color=black:t=fill,gblur=sigma=1.2,split[m1][m2];
[m1]negate,format=gbrp,split=4[i1][i2][i3][i4];
[a]split=3[a1][a2][a3];
[a2][i1]blend=all_mode=multiply,gblur=sigma=7[n1];
[i2]gblur=sigma=7,split[d1][d1m];
[n1][d1]blend=all_expr='clip(A/max(B,2)*255,0,255)'[f1];
[a3][i3]blend=all_mode=multiply,gblur=sigma=26[n2];
[i4]gblur=sigma=26[d2];
[n2][d2]blend=all_expr='clip(A/max(B,2)*255,0,255)'[f2];
[d1m]format=gray,lutyuv=y='if(gt(val,110),255,0)',gblur=sigma=2,format=gbrp[ok];
[f2][f1][ok]maskedmerge[fill];
[m2]format=gbrp[mask];
[a1][fill][mask]maskedmerge,format=yuv420p[o]" -map "[o]" -an -c:v libx264 -preset slow -crf 16 -profile:v high -pix_fmt yuv420p -r 24 -movflags +faststart "$OUT"
