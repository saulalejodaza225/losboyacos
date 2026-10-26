// Habitaciones (Fotos, Oficina, Mostrador): entrada, superficies sobre el video, toques, salida y entrada desde la hoja.
import {chromium} from 'playwright';import http from 'http';import fs from 'fs';import path from 'path';
const root=process.argv[2],out=path.join(root,'shots');fs.mkdirSync(out,{recursive:true});
const MT={'.mp4':'video/mp4','.html':'text/html','.webp':'image/webp','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const srv=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(q.url==='/')f=path.join(root,'index.html');fs.stat(f,(e,s)=>{if(e||s.isDirectory()){r.writeHead(404);return r.end()}const t=MT[path.extname(f)]||'application/octet-stream';const rg=q.headers.range;if(rg){const m=/bytes=(\d*)-(\d*)/.exec(rg);const a=+m[1]||0,b=m[2]?+m[2]:s.size-1;r.writeHead(206,{'Content-Type':t,'Content-Range':'bytes '+a+'-'+b+'/'+s.size,'Accept-Ranges':'bytes','Content-Length':b-a+1});fs.createReadStream(f,{start:a,end:b}).pipe(r)}else{r.writeHead(200,{'Content-Type':t,'Content-Length':s.size,'Accept-Ranges':'bytes'});fs.createReadStream(f).pipe(r)}})}).listen(8147);
const results=[];const ok=(n,c,d='')=>results.push([c?'PASS':'FAIL',n,d]);
const shot=async(p,o)=>{for(let i=0;i<6;i++){try{await p.screenshot(o);return}catch(e){await new Promise(r=>setTimeout(r,600))}}};
const br=await chromium.launch({channel:'msedge',args:['--autoplay-policy=no-user-gesture-required']});
// posiciones esperadas (coordenadas del video 720x1280) → pantalla (recorte "cover")
const esp=(w,h)=>{const s=Math.max(w/720,h/1280);return (x,y)=>[(w-720*s)/2+x*s,(h-1280*s)/2+y*s,s]};
for(const [w,h] of [[390,844],[360,740]]){
  const tag=w+'x'+h;
  const ctx=await br.newContext({viewport:{width:w,height:h},hasTouch:true,isMobile:true,deviceScaleFactor:2});
  await ctx.route(/google\.com\/maps/,r=>r.fulfill({status:200,contentType:'text/html',body:'<html><title>mapa</title></html>'}));
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/fonts|ERR_|google/i.test(m.text()))errs.push(m.text())});
  await p.goto('http://localhost:8147/',{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>__boyacos.phase==='loop',null,{timeout:45000});await p.waitForTimeout(2200);
  // chips en el bucle
  const chips=await p.evaluate(()=>[...document.querySelectorAll('#rooms-nav .rchip')].map(b=>{const r=b.getBoundingClientRect();return {t:b.textContent.trim(),x:r.left,y:r.top,w:r.width,h:r.height,op:getComputedStyle(b.parentElement).opacity}}));
  const inv=await p.evaluate(()=>{const r=document.getElementById('invite').getBoundingClientRect();return {b:r.bottom}});
  ok(tag+' chips de habitaciones visibles en el bucle (3, ≥44 px, dentro de pantalla, bajo el título)',chips.length===3&&chips.every(c=>c.h>=44&&c.x>=0&&c.x+c.w<=w&&+c.op>0.9&&c.y>=inv.b-2),JSON.stringify(chips.map(c=>[c.t,Math.round(c.x),Math.round(c.y),Math.round(c.w),Math.round(c.h)]))+' inviteBottom='+Math.round(inv.b));
  await shot(p,{path:out+'/'+tag+'-hab-0-bucle.png'});
  const f=esp(w,h);
  for(const id of ['fotos','oficina','mostrador']){
    await p.tap('.rchip[data-room="'+id+'"]');
    await p.waitForFunction(()=>__boyacos.phase==='room',null,{timeout:6000});
    ok(tag+' '+id+': al tocar el chip entra en fase room',await p.evaluate(i=>__boyacos.roomId===i,id));
    await p.waitForTimeout(2500);await shot(p,{path:out+'/'+tag+'-hab-'+id+'-1-camina.png'});
    await p.waitForFunction(()=>__boyacos.roomReady,null,{timeout:60000});
    await p.waitForSelector('#rstage.ready',{timeout:20000});await p.waitForTimeout(1500);
    await shot(p,{path:out+'/'+tag+'-hab-'+id+'-2-reposo.png'});
    const surf=await p.evaluate(()=>[...document.querySelectorAll('#rstage .rs')].map(e=>{const r=e.getBoundingClientRect();return {c:e.className,x:r.left,y:r.top,w:r.width,h:r.height,tag:e.tagName,lbl:e.getAttribute('aria-label')||''}}));
    const bar=await p.evaluate(()=>{const r=document.querySelector('.r-top').getBoundingClientRect();const b=document.getElementById('r-back').getBoundingClientRect();return {hb:b.height,wb:b.width,t:document.getElementById('r-title').textContent}});
    ok(tag+' '+id+': barra superior con botón Sala ≥44 px y título',bar.hb>=44&&bar.wb>=44&&bar.t.length>0,JSON.stringify(bar));
    if(id==='fotos'){
      const ph=surf.filter(s=>/photo/.test(s.c));
      const [cx,cy,s]=f(173,365.5);const m=ph[0];
      ok(tag+' fotos: 6 fotos colocadas sobre los 6 marcos',ph.length===6,String(ph.length));
      ok(tag+' fotos: la 1.ª foto cae sobre el marco 1 (±3 px)',Math.abs(m.x+m.w/2-cx)<3&&Math.abs(m.y+m.h/2-cy)<3,JSON.stringify([m.x+m.w/2,m.y+m.h/2,cx,cy]));
      const m6=ph[5],[c6x,c6y]=f(546,571);
      ok(tag+' fotos: la 6.ª foto cae sobre el marco 6 (±3 px)',Math.abs(m6.x+m6.w/2-c6x)<3&&Math.abs(m6.y+m6.h/2-c6y)<3,JSON.stringify([m6.x+m6.w/2,m6.y+m6.h/2,c6x,c6y]));
      ok(tag+' fotos: cada foto mide ≥44 px por lado',ph.every(x=>x.w>=44&&x.h>=44),JSON.stringify(ph.map(x=>[Math.round(x.w),Math.round(x.h)])));
      await p.tap('#rstage .photo >> nth=1');await p.waitForTimeout(500);
      ok(tag+' fotos: tocar una foto abre la imagen ampliada',await p.evaluate(()=>!document.getElementById('lightbox').hidden));
      await p.tap('#lb-close');await p.waitForTimeout(300);
      await p.tap('#r-pill');await p.waitForTimeout(900);
      ok(tag+' fotos: «Ver todas las fotos» abre la galería (fase open)',await p.evaluate(()=>__boyacos.phase==='open'&&!document.getElementById('v-galeria').hidden));
      await shot(p,{path:out+'/'+tag+'-hab-fotos-3-galeria.png'});
      await p.tap('#close');await p.waitForTimeout(700);
      ok(tag+' fotos: al cerrar la hoja se vuelve a la habitación (fase room, contenido intacto)',await p.evaluate(()=>__boyacos.phase==='room'&&__boyacos.roomId==='fotos'&&document.querySelectorAll('#rstage .photo').length===6));
    }
    if(id==='oficina'){
      const mp=surf.find(s=>/map/.test(s.c)),[mx,my]=f(436,514);
      ok(tag+' oficina: la zona del mapa cae sobre el cuadro del mapa (±3 px)',!!mp&&Math.abs(mp.x+mp.w/2-mx)<3&&Math.abs(mp.y+mp.h/2-my)<3,JSON.stringify(mp));
      const sh=surf.filter(s=>/sheet/.test(s.c));
      ok(tag+' oficina: 2 hojas del tablón con el título de un artículo',sh.length===2);
      const ph=surf.find(s=>/phone/.test(s.c));const href=await p.getAttribute('#rstage a.phone','href');
      ok(tag+' oficina: el teléfono es un enlace tel: con evento',!!ph&&/^tel:\+57\d{10}$/.test(href),href);
      await p.tap('#rstage .map');await p.waitForTimeout(1300);
      ok(tag+' oficina: tocar el mapa abre la hoja en el inicio con el mapa visible',await p.evaluate(()=>{const b=document.getElementById('mapa').getBoundingClientRect();return __boyacos.phase==='open'&&b.top<innerHeight&&b.bottom>0}));
      await shot(p,{path:out+'/'+tag+'-hab-oficina-3-mapa.png'});
      await p.tap('#close');await p.waitForTimeout(700);
      ok(tag+' oficina: al cerrar la hoja se vuelve a la oficina',await p.evaluate(()=>__boyacos.phase==='room'&&__boyacos.roomId==='oficina'));
      await p.tap('#rstage .sheet >> nth=1');await p.waitForTimeout(1800);
      ok(tag+' oficina: tocar una hoja del tablón abre el artículo',await p.evaluate(()=>__boyacos.phase==='open'&&!document.getElementById('v-blogpost').hidden&&document.getElementById('post-title').textContent.length>5));
      await shot(p,{path:out+'/'+tag+'-hab-oficina-4-articulo.png'});
      await p.tap('#close');await p.waitForTimeout(700);
    }
    if(id==='mostrador'){
      const pl=surf.filter(s=>/plaque/.test(s.c));
      ok(tag+' mostrador: 3 placas de redes sobre las 3 placas',pl.length===3);
      const [p2x,p2y]=f(376,878.5);ok(tag+' mostrador: la placa central cae sobre la placa (±3 px)',Math.abs(pl[1].x+pl[1].w/2-p2x)<3&&Math.abs(pl[1].y+pl[1].h/2-p2y)<3,JSON.stringify([pl[1].x+pl[1].w/2,pl[1].y+pl[1].h/2,p2x,p2y]));
      const bd=surf.find(s=>/board/.test(s.c)),[bx,by]=f(402,420);
      ok(tag+' mostrador: la pizarra cae sobre el pizarrón (±3 px)',!!bd&&Math.abs(bd.x+bd.w/2-bx)<3&&Math.abs(bd.y+bd.h/2-by)<3,JSON.stringify(bd));
      const txt=await p.evaluate(()=>document.querySelector('#rstage .board').innerText);
      ok(tag+' mostrador: la pizarra muestra las ofertas de banners.json (y tapa la palabra MENU del video)',/OFERTAS/i.test(txt)&&/Frenos completos/i.test(txt)&&!/MENU/i.test(txt),txt.replace(/\n/g,' | ').slice(0,120));
      await p.tap('#rstage .plaque >> nth=1');await p.waitForTimeout(1300);
      ok(tag+' mostrador: tocar una placa sin red configurada abre «Nuestras redes»',await p.evaluate(()=>__boyacos.phase==='open'&&!document.getElementById('v-redes').hidden));
      await p.tap('#close');await p.waitForTimeout(700);
      await p.tap('#rstage .board');await p.waitForTimeout(1300);
      ok(tag+' mostrador: tocar la pizarra abre las ofertas',await p.evaluate(()=>{const b=document.getElementById('banners');const r=b.getBoundingClientRect();return __boyacos.phase==='open'&&!b.hidden&&r.top<innerHeight}));
      await p.tap('#close');await p.waitForTimeout(700);
    }
    // volver a la sala
    await p.tap('#r-back');
    await p.waitForFunction(()=>__boyacos.phase==='loop',null,{timeout:20000});await p.waitForTimeout(1800);
    const back=await p.evaluate(()=>({inv:document.getElementById('invite').classList.contains('on'),nav:getComputedStyle(document.getElementById('rooms-nav')).opacity,vB:!document.getElementById('vB').paused,room:document.getElementById('room').classList.contains('on'),id:__boyacos.roomId}));
    ok(tag+' '+id+': el botón Sala regresa al bucle de la sala (invitación y chips de vuelta, bucle corriendo)',back.inv&&+back.nav>0.9&&back.vB&&!back.room&&back.id==null,JSON.stringify(back));
    await shot(p,{path:out+'/'+tag+'-hab-'+id+'-9-vuelta.png'});
  }
  // entrada desde la hoja del catálogo
  await p.tap('#app',{position:{x:w/2,y:h*0.6}});
  await p.waitForFunction(()=>__boyacos.phase==='book',null,{timeout:45000});await p.waitForTimeout(1200);
  await p.tap('#bk-menu');await p.waitForTimeout(1500);
  const cards=await p.evaluate(()=>[...document.querySelectorAll('#sheet .card[data-room]')].map(b=>({t:b.textContent.trim().replace(/\s+/g,' ').slice(0,30),h:b.getBoundingClientRect().height})));
  ok(tag+' hoja: 3 tarjetas de habitaciones (≥44 px)',cards.length===3&&cards.every(c=>c.h>=44),JSON.stringify(cards));
  await shot(p,{path:out+'/'+tag+'-hab-5-hoja.png'});
  await p.tap('#sheet .card[data-room="oficina"]');
  await p.waitForFunction(()=>__boyacos.phase==='room'&&__boyacos.roomId==='oficina',null,{timeout:10000});
  ok(tag+' hoja: la tarjeta «Oficina» cierra la hoja y entra a la habitación',true);
  await p.waitForFunction(()=>__boyacos.roomReady,null,{timeout:60000});
  // salir mientras camina (otra entrada)
  await p.tap('#r-back');await p.waitForFunction(()=>__boyacos.phase==='loop',null,{timeout:20000});await p.waitForTimeout(800);
  await p.tap('.rchip[data-room="mostrador"]');await p.waitForFunction(()=>__boyacos.phase==='room',null,{timeout:6000});await p.waitForTimeout(700);
  await p.tap('#r-back');await p.waitForFunction(()=>__boyacos.phase==='loop',null,{timeout:12000});
  ok(tag+' salir mientras camina vuelve al bucle sin atascarse',await p.evaluate(()=>__boyacos.roomId==null&&!document.getElementById('vB').paused));
  ok(tag+' sin errores de consola',errs.length===0,errs.join('|'));
  const sx=await p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);ok(tag+' sin scroll horizontal',sx[0]<=sx[1],sx.join(','));
  await ctx.close();
}
await br.close();srv.close();
for(const r of results)console.log(r.join(' | ').slice(0,420));
