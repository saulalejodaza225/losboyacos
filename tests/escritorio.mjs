// Escritorio (pantalla ancha 16:9): sala con clips 16:9, panel lateral, habitaciones alineadas y el móvil intacto.
import {chromium} from 'playwright';import http from 'http';import fs from 'fs';import path from 'path';
const root=process.argv[2],out=path.join(root,'shots');fs.mkdirSync(out,{recursive:true});
const MT={'.mp4':'video/mp4','.html':'text/html','.webp':'image/webp','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const srv=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(q.url==='/')f=path.join(root,'index.html');fs.stat(f,(e,s)=>{if(e||s.isDirectory()){r.writeHead(404);return r.end()}const t=MT[path.extname(f)]||'application/octet-stream';
  const rg=q.headers.range;if(rg&&t==='video/mp4'){const m=/bytes=(\d*)-(\d*)/.exec(rg),a=+m[1],b=m[2]?+m[2]:s.size-1;r.writeHead(206,{'Content-Type':t,'Accept-Ranges':'bytes','Content-Range':'bytes '+a+'-'+b+'/'+s.size,'Content-Length':b-a+1});return fs.createReadStream(f,{start:a,end:b}).pipe(r)}
  r.writeHead(200,{'Content-Type':t,'Content-Length':s.size,'Accept-Ranges':'bytes'});fs.createReadStream(f).pipe(r)})}).listen(8152);
const results=[];const ok=(n,c,d='')=>results.push([c?'PASS':'FAIL',n,d]);
const shot=async(p,o)=>{for(let i=0;i<6;i++){try{await p.screenshot(o);return}catch(e){await new Promise(r=>setTimeout(r,600))}}};
const br=await chromium.launch({channel:'msedge',args:['--autoplay-policy=no-user-gesture-required']});
const esp=(w,h)=>{const s=Math.max(w/1280,h/720);return (x,y)=>[(w-1280*s)/2+x*s,(h-720*s)/2+y*s,s]};
for(const [w,h] of [[1440,900],[1280,720],[1920,1080]]){
  const tag='escritorio '+w+'x'+h;
  const ctx=await br.newContext({viewport:{width:w,height:h}});
  await ctx.route(/google\.com\/maps/,r=>r.fulfill({status:200,contentType:'text/html',body:'<html><title>mapa</title></html>'}));
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/fonts|ERR_|google/i.test(m.text()))errs.push(m.text())});
  await p.goto('http://localhost:8152/',{waitUntil:'domcontentloaded'});
  ok(tag+': clase wide y #app ocupa todo el ancho',await p.evaluate(()=>document.documentElement.classList.contains('wide')&&document.getElementById('app').clientWidth===innerWidth));
  await p.waitForFunction(()=>__boyacos.phase==='intro'||__boyacos.phase==='loop',null,{timeout:45000});
  ok(tag+': la intro usa el clip 16:9',await p.evaluate(()=>/escritorio\/entrada\.mp4/.test(document.getElementById('vA').currentSrc||document.getElementById('vA').src)));
  await shot(p,{path:out+'/'+tag+'-1-intro.png'});
  await p.waitForFunction(()=>__boyacos.phase==='loop',null,{timeout:45000});await p.waitForTimeout(2600);
  ok(tag+': el bucle usa el clip 16:9 y el libro los clips del catálogo 16:9',await p.evaluate(()=>/escritorio\/loop\.mp4/.test(document.getElementById('vB').currentSrc)&&/escritorio\/cat-abre\.mp4/.test(document.getElementById('vC').src)));
  const chips=await p.evaluate(()=>[...document.querySelectorAll('#rooms-nav .rchip')].map(b=>{const r=b.getBoundingClientRect();return {h:r.height,x:r.left,w:r.width,op:getComputedStyle(b.parentElement).opacity}}));
  ok(tag+': 3 chips de habitaciones visibles',chips.length===3&&chips.every(c=>c.h>=44&&c.x>=0&&c.x+c.w<=w&&+c.op>0.9));
  await shot(p,{path:out+'/'+tag+'-2-bucle.png'});
  const f=esp(w,h);
  // catálogo en video 16:9: abre, 1.ª doble, pasa a la 2.ª, panel de detalle, vuelve y cierra
  await p.mouse.click(w*0.5,h*0.75);
  await p.waitForFunction(()=>__boyacos.phase==='book',null,{timeout:30000});await p.waitForTimeout(900);
  ok(tag+': tocar la sala abre el libro con los clips 16:9',await p.evaluate(()=>/cat-abre.mp4/.test(document.getElementById('vC').currentSrc)&&__boyacos.page===1));
  const pgs=await p.evaluate(()=>[...document.querySelectorAll('#stage .pg.on')].map(e=>{const r=e.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height,v:e.dataset.view}}));
  const [lx,ly]=f(450,372),[rx,ry]=f(815,375);
  ok(tag+': 1.ª doble: 2 zonas táctiles sobre las hojas (±12 px) y ≥44 px',pgs.length===2&&Math.abs(pgs[0].x+pgs[0].w/2-lx)<12&&Math.abs(pgs[1].x+pgs[1].w/2-rx)<12&&Math.abs(pgs[0].y+pgs[0].h/2-ly)<12&&pgs.every(g=>g.w>=44&&g.h>=44),JSON.stringify(pgs));
  ok(tag+': el texto HTML de las hojas no se ve (ya viene en el video)',await p.evaluate(()=>[...document.querySelectorAll('#stage .pg.on>*')].every(e=>getComputedStyle(e).visibility==='hidden')));
  await shot(p,{path:out+'/'+tag+'-3-libro1.png'});
  await p.click('#next');await p.waitForFunction(()=>__boyacos.phase==='book'&&__boyacos.page===2,null,{timeout:20000});await p.waitForTimeout(800);
  ok(tag+': pasar de página usa el clip 16:9 y muestra el parche del "Otro" repetido',await p.evaluate(()=>/cat-pasa.mp4/.test(document.getElementById('vD').currentSrc)&&getComputedStyle(document.querySelector('#stage .parche')).display==='block'));
  await shot(p,{path:out+'/'+tag+'-4-libro2.png'});
  await p.click('#stage .pg.on >> nth=0');await p.waitForTimeout(1000);
  const sh=await p.evaluate(()=>{const r=document.getElementById('sheet').getBoundingClientRect();return {r:r.right,w:r.width,t:r.top,b:r.bottom,ph:__boyacos.phase}});
  ok(tag+': tocar una hoja abre el detalle como panel a la derecha (≤460 px, altura completa)',sh.ph==='open'&&Math.abs(sh.r-w)<2&&sh.w<=461&&sh.t<=1&&Math.abs(sh.b-h)<2,JSON.stringify(sh));
  await shot(p,{path:out+'/'+tag+'-5-panel.png'});
  await p.click('#close');await p.waitForTimeout(800);
  ok(tag+': cerrar el panel vuelve al libro',await p.evaluate(()=>__boyacos.phase==='book'&&__boyacos.page===2));
  await p.click('#prev');await p.waitForFunction(()=>__boyacos.phase==='book'&&__boyacos.page===1,null,{timeout:20000});
  ok(tag+': volver a la 1.ª doble (clip al revés) y se oculta el parche',await p.evaluate(()=>getComputedStyle(document.querySelector('#stage .parche')).display==='none'));
  await p.click('#bk-close');await p.waitForTimeout(800);
  ok(tag+': cerrar el libro vuelve al bucle',await p.evaluate(()=>__boyacos.phase==='loop'));
  await p.waitForTimeout(1500);
  for(const id of ['fotos','oficina','mostrador']){
    await p.click('.rchip[data-room="'+id+'"]');
    await p.waitForFunction(()=>__boyacos.phase==='room',null,{timeout:6000});
    await p.waitForTimeout(2000);
    await p.waitForFunction(()=>__boyacos.roomReady,null,{timeout:60000});
    await p.waitForSelector('#rstage.ready',{timeout:20000});await p.waitForTimeout(1500);
    ok(tag+' '+id+': usa los clips 16:9',await p.evaluate(i=>new RegExp(i+'-16x9-reposo').test(document.getElementById('vRR').currentSrc),id));
    await shot(p,{path:out+'/'+tag+'-hab-'+id+'.png'});
    const surf=await p.evaluate(()=>[...document.querySelectorAll('#rstage .rs')].map(e=>{const r=e.getBoundingClientRect();return {c:e.className,x:r.left,y:r.top,w:r.width,h:r.height}}));
    const near=(m,cx,cy)=>!!m&&Math.abs(m.x+m.w/2-cx)<3&&Math.abs(m.y+m.h/2-cy)<3;
    if(id==='fotos'){
      const ph=surf.filter(s=>/photo/.test(s.c));const [a,b]=f(450,190),[c,d]=f(830,407.5);
      ok(tag+' fotos: 6 fotos; 1.ª y 6.ª sobre su marco (±3 px)',ph.length===6&&near(ph[0],a,b)&&near(ph[5],c,d),JSON.stringify([ph[0],ph[5],a,b,c,d]));
      ok(tag+' fotos: cada foto ≥44 px',ph.every(x=>x.w>=44&&x.h>=44));
      await p.click('#rstage .photo >> nth=1');await p.waitForTimeout(500);
      ok(tag+' fotos: tocar una foto abre la imagen ampliada',await p.evaluate(()=>!document.getElementById('lightbox').hidden));
      await p.click('#lb-close');await p.waitForTimeout(300);
    }
    if(id==='oficina'){
      const mp=surf.find(s=>/map/.test(s.c)),[mx,my]=f(650.5,275);
      ok(tag+' oficina: la zona del mapa cae sobre el cuadro (±3 px)',near(mp,mx,my),JSON.stringify(mp));
      ok(tag+' oficina: 2 hojas del tablón',surf.filter(s=>/sheet/.test(s.c)).length===2);
      ok(tag+' oficina: el teléfono es enlace tel:',/^tel:\+57\d{10}$/.test(await p.getAttribute('#rstage a.phone','href')));
      await p.click('#rstage .map');await p.waitForTimeout(1200);
      ok(tag+' oficina: el mapa abre el panel lateral',await p.evaluate(()=>__boyacos.phase==='open'));
      await p.click('#close');await p.waitForTimeout(700);
    }
    if(id==='mostrador'){
      const bd=surf.find(s=>/board/.test(s.c)),[bx,by]=f(639,207);const pl=surf.filter(s=>/plaque/.test(s.c));
      ok(tag+' mostrador: la pizarra cae sobre el pizarrón (±3 px)',near(bd,bx,by),JSON.stringify(bd));
      const [p1x,p1y]=f(480.5,594.5);
      ok(tag+' mostrador: 3 placas; la 1.ª sobre su placa (±4 px)',pl.length===3&&Math.abs(pl[0].x+pl[0].w/2-p1x)<4&&Math.abs(pl[0].y+pl[0].h/2-p1y)<4,JSON.stringify(pl[0]));
      ok(tag+' mostrador: ofertas dentro de la pizarra sin desbordar',await p.evaluate(()=>{const b=document.querySelector('#rstage .board');return b.scrollHeight<=b.clientHeight+2}),'');
    }
    await p.click('#r-back');await p.waitForFunction(()=>__boyacos.phase==='loop',null,{timeout:15000});await p.waitForTimeout(800);
  }
  ok(tag+': sin scroll horizontal',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  ok(tag+': sin errores de consola',errs.length===0,errs.join(' | ').slice(0,200));
  await ctx.close();
}
{const ctx=await br.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await ctx.newPage();
 await p.goto('http://localhost:8152/',{waitUntil:'domcontentloaded'});await p.waitForTimeout(1500);
 ok('móvil 390: sin clase wide, #app de 390 px y clips 9:16',await p.evaluate(()=>!document.documentElement.classList.contains('wide')&&document.getElementById('app').clientWidth===390&&/clip1-entrada/.test(document.getElementById('vA').dataset.src)));
 await ctx.close();}
await br.close();srv.close();
for(const r of results)console.log(r.join(' | '));
console.log('\n'+results.filter(r=>r[0]==='PASS').length+' PASS, '+results.filter(r=>r[0]==='FAIL').length+' FAIL');
