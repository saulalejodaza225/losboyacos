// Descarga los tiles de OpenStreetMap (z13, 5x5, centro Bogotá) para armar assets/habitaciones/mapa-bogota.webp.
// Después: unir los 25 tiles (ffmpeg hstack/vstack), 'negate,hue=s=0,lutyuv=y=clip((val-11)*2.3,0,255),gblur=sigma=0.5,eq=gamma=1.15,colorchannelmixer=rr=.95:gg=.88:bb=.74', recortar 1020x1020 en (260,260) y dibujar el punto del taller en (475,259). Atribución obligatoria: © OpenStreetMap contributors.
import fs from 'fs';
const z=13, lat=4.70, lon=-74.10;           // centro: Bogotá
const n=2**z, cx=Math.floor((lon+180)/360*n), cy=Math.floor((1-Math.log(Math.tan(lat*Math.PI/180)+1/Math.cos(lat*Math.PI/180))/Math.PI)/2*n);
console.log('centro',cx,cy);
const R=2; // 5x5 tiles
for(let dy=-R;dy<=R;dy++)for(let dx=-R;dx<=R;dx++){
  const x=cx+dx,y=cy+dy,f=`t_${dx+R}_${dy+R}.png`;
  if(fs.existsSync(f)) continue;
  const r=await fetch(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`,{headers:{'User-Agent':'LosBoyacosWeb/1.0 (saulalejodaza@gmail.com; one-off static map render)'}});
  if(!r.ok){console.log('fallo',x,y,r.status);continue}
  fs.writeFileSync(f,Buffer.from(await r.arrayBuffer()));
  await new Promise(s=>setTimeout(s,400));
}
console.log(JSON.stringify({z,cx,cy}));
