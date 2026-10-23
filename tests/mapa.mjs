import {chromium} from 'playwright';import http from 'http';import fs from 'fs';import path from 'path';
const root=process.argv[2],out=path.join(root,'shots');fs.mkdirSync(out,{recursive:true});
const MT={'.mp4':'video/mp4','.html':'text/html','.webp':'image/webp','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const srv=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(q.url==='/')f=path.join(root,'index.html');fs.stat(f,(e,s)=>{if(e||s.isDirectory()){r.writeHead(404);return r.end()}const t=MT[path.extname(f)]||'application/octet-stream';const rg=q.headers.range;if(rg){const m=/bytes=(\d*)-(\d*)/.exec(rg);const a=+m[1]||0,b=m[2]?+m[2]:s.size-1;r.writeHead(206,{'Content-Type':t,'Content-Range':'bytes '+a+'-'+b+'/'+s.size,'Accept-Ranges':'bytes','Content-Length':b-a+1});fs.createReadStream(f,{start:a,end:b}).pipe(r)}else{r.writeHead(200,{'Content-Type':t,'Content-Length':s.size,'Accept-Ranges':'bytes'});fs.createReadStream(f).pipe(r)}})}).listen(8143);
const results=[];const ok=(n,c,d='')=>results.push([c?'PASS':'FAIL',n,d]);
const shot=async(p,o)=>{for(let i=0;i<6;i++){try{await p.screenshot(o);return}catch(e){await new Promise(r=>setTimeout(r,600))}}};
const br=await chromium.launch({channel:'msedge',args:['--autoplay-policy=no-user-gesture-required']});
for(const [w,h,mobile] of [[390,844,true],[360,740,true],[1280,800,false]]){
  const tag=mobile?w+'x'+h:'escritorio';
  const ctx=await br.newContext({viewport:{width:w,height:h},hasTouch:mobile,isMobile:mobile,deviceScaleFactor:mobile?2:1});
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/fonts|ERR_|google/i.test(m.text()))errs.push(m.text())});
  const reqs=[];p.on('request',r=>{if(/google\.com\/maps/.test(r.url()))reqs.push(r.url())});
  await ctx.route('https://www.google.com/maps**',r=>r.fulfill({status:200,contentType:'text/html',body:'<html><body style="margin:0;background:#233;color:#9ab;font:14px sans-serif;display:grid;place-items:center;height:100vh">Mapa (simulado en la prueba)</body></html>'}));
  await ctx.route('https://maps.google.com/**',r=>r.fulfill({status:200,contentType:'text/html',body:'<html>ok</html>'}));
  await p.goto('http://localhost:8143/',{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>__boyacos.phase==='loop',null,{timeout:40000});
  ok(tag+' carga diferida: al cargar la página el iframe NO tiene src ni hay petición al mapa',await p.evaluate(()=>!document.getElementById('mapa-iframe').getAttribute('src'))&&reqs.length===0);
  const click=mobile?async(sel)=>p.tap(sel):async(sel)=>p.click(sel);
  if(mobile){await p.tap('#app',{position:{x:w/2,y:h*0.6}});}else{await p.mouse.click(w/2,h*0.6);}
  await p.waitForFunction(()=>__boyacos.phase==='book',null,{timeout:40000});await p.waitForTimeout(900);
  ok(tag+' carga diferida: con el libro abierto (hoja cerrada) sigue sin cargarse',await p.evaluate(()=>!document.getElementById('mapa-iframe').getAttribute('src'))&&reqs.length===0);
  await click('#bk-menu');await p.waitForTimeout(1500);
  const src=await p.getAttribute('#mapa-iframe','src');
  ok(tag+' carga diferida: al entrar en pantalla se asigna el src (una sola vez)',!!src&&src.includes('output=embed')&&src.includes('Carrera+94A')&&reqs.length===1,String(reqs.length));
  const m=await p.evaluate(()=>{const f=document.getElementById('mapa-iframe'),c=document.getElementById('mapa-frame'),b=document.getElementById('banners').getBoundingClientRect(),mp=document.getElementById('mapa').getBoundingClientRect(),d=document.querySelector('.mapa-dir'),btn=document.querySelector('.mapa-btn');const cs=getComputedStyle(c),fs=getComputedStyle(f),ds=getComputedStyle(d),bs=getComputedStyle(btn);return {h:Math.round(c.getBoundingClientRect().height),rad:cs.borderTopLeftRadius,fw:f.getBoundingClientRect().width,cw:c.getBoundingClientRect().width,border:fs.borderTopWidth,arriba:mp.bottom<=b.top+1,col:ds.color,txt:d.textContent,fs:parseFloat(ds.fontSize),bb:bs.borderTopColor,bw:bs.borderTopWidth,bc:bs.color,bh:btn.getBoundingClientRect().height,href:btn.getAttribute('href'),tgt:btn.target,rel:btn.rel,title:f.title}});
  ok(tag+' iframe: 180 px de alto, radio 10 px, sin borde, 100 % de ancho',m.h===180&&m.rad==='10px'&&m.border==='0px'&&Math.abs(m.fw-m.cw)<1,JSON.stringify([m.h,m.rad,m.border,m.fw,m.cw]));
  ok(tag+' texto de la dirección en #A89E96 y pequeño',m.txt==='Carrera 94A #145A-83 · Suba, Bogotá'&&m.col==='rgb(168, 158, 150)'&&m.fs<=14,m.txt+' | '+m.col+' | '+m.fs);
  ok(tag+' el mapa va justo arriba de los banners',m.arriba);
  ok(tag+' botón Cómo llegar: borde y texto blancos, ≥44 px, abre Maps en pestaña nueva',m.bb==='rgb(255, 255, 255)'&&m.bw==='1px'&&m.bc==='rgb(255, 255, 255)'&&m.bh>=44&&m.href==='https://maps.google.com/?q=Carrera+94A+%23145A-83+Suba+Bogota+Colombia'&&m.tgt==='_blank'&&m.rel.includes('noopener'),JSON.stringify([m.bb,m.bw,m.bc,m.bh,m.href,m.tgt]));
  ok(tag+' iframe accesible (title)',m.title.includes('Los Boyacos'));
  await shot(p,{path:out+'/'+tag+'-p4-mapa.png'});
  // evento como_llegar
  await p.evaluate(()=>{window.dataLayer=[]});
  const [pop]=await Promise.all([ctx.waitForEvent('page',{timeout:8000}).catch(()=>null),click('.mapa-btn')]);
  await p.waitForTimeout(300);
  const ev=await p.evaluate(()=>(window.dataLayer||[]).filter(x=>x.event==='como_llegar').map(x=>x.params&&x.params.origen));
  ok(tag+' evento como_llegar al pulsar el botón',ev.length===1&&ev[0]==='inicio_mapa'&&!!pop,JSON.stringify(ev));
  if(pop) await pop.close();
  ok(tag+' sin errores de consola',errs.length===0,errs.join('|'));
  const sx=await p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);ok(tag+' sin scroll horizontal',sx[0]<=sx[1],sx.join(','));
  await ctx.close();
}
await br.close();srv.close();
for(const r of results)console.log(r.join(' | '));
