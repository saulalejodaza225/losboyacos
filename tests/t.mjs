import {chromium} from 'playwright';
import http from 'http'; import fs from 'fs'; import path from 'path';
const root=process.argv[2], out=path.join(root,'shots');
fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html','.mp4':'video/mp4','.webp':'image/webp','.jpg':'image/jpeg'};
const srv=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(q.url==='/'||q.url.startsWith('/?'))f=path.join(root,'index.html');
 fs.stat(f,(e,s)=>{if(e){r.writeHead(404);return r.end()}
  const t=mime[path.extname(f)]||'application/octet-stream';const rg=q.headers.range;
  if(rg){const m=/bytes=(\d*)-(\d*)/.exec(rg);const a=+m[1]||0,b=m[2]?+m[2]:s.size-1;r.writeHead(206,{'Content-Type':t,'Content-Range':'bytes '+a+'-'+b+'/'+s.size,'Accept-Ranges':'bytes','Content-Length':b-a+1});fs.createReadStream(f,{start:a,end:b}).pipe(r)}
  else{r.writeHead(200,{'Content-Type':t,'Content-Length':s.size,'Accept-Ranges':'bytes'});fs.createReadStream(f).pipe(r)}})}).listen(8123);
const results=[];const ok=(n,c,d='')=>{results.push([c?'PASS':'FAIL',n,d]);};
const shot=async(pg,o)=>{for(let i=0;i<6;i++){try{await pg.screenshot(o);return}catch(e){await new Promise(r=>setTimeout(r,700))}}};
const phase=p=>p.evaluate(()=>__boyacos.phase);
const wf=(p,fn,t=20000)=>p.waitForFunction(fn,null,{timeout:t});
const br=await chromium.launch({channel:'msedge',args:['--autoplay-policy=no-user-gesture-required']});
for(const [w,h] of [[390,844],[360,740]]){
  const tag=w+'x'+h;
  const ctx=await br.newContext({viewport:{width:w,height:h},hasTouch:true,isMobile:true,deviceScaleFactor:2});
  const p=await ctx.newPage(); const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/fonts|ERR_/.test(m.text()))errs.push(m.text())});
  await p.addInitScript(()=>{window.__log=[];const t0=performance.now();const tick=()=>{const A=document.getElementById('vA'),B=document.getElementById('vB');if(A&&B){window.__log.push({o:+getComputedStyle(B).opacity,br:B.readyState,ar:A.readyState,ph:document.getElementById('app')&&document.getElementById('app').dataset.phase})}requestAnimationFrame(tick)};requestAnimationFrame(tick)});
  await p.goto('http://localhost:8123/',{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(300); await shot(p,{path:out+'/'+tag+'-1-carga.png'});
  await wf(p,()=>document.getElementById('app').dataset.phase==='intro',15000);
  await p.waitForTimeout(3000); await shot(p,{path:out+'/'+tag+'-2-intro.png'});
  await wf(p,()=>document.getElementById('app').dataset.phase==='loop');
  await p.waitForTimeout(2500); await shot(p,{path:out+'/'+tag+'-3-loop-invitacion.png'});
  const log=await p.evaluate(()=>window.__log);
  ok(tag+' sin parpadeo Clip1->Clip2',log.filter(x=>x.o>0&&x.br<2).length===0&&log.filter(x=>x.ph==='loop'&&x.o<1&&x.ar<2).length===0);
  await wf(p,()=>vC.readyState>=3&&vD.readyState>=3&&vE.readyState>=3,40000);
  ok(tag+' 3 tramos del catálogo precargados',true);
  // botones flotantes en el menú
  ok(tag+' flotantes WhatsApp y Maps visibles en el menú',await p.evaluate(()=>['fab-wa','fab-map'].every(i=>+getComputedStyle(document.getElementById(i).parentElement).opacity===1)));
  const fh=await p.evaluate(()=>[document.getElementById('fab-wa').href,document.getElementById('fab-map').href]);
  ok(tag+' flotantes: wa.me y Google Maps con la dirección',fh[0].startsWith('https://wa.me/573144852891')&&fh[1].includes('google.com/maps')&&decodeURIComponent(fh[1].split('+').join(' ')).includes('Carrera 94A #145A-83'),fh.join(' | '));
  await shot(p,{path:out+'/'+tag+'-3b-flotantes.png'});
  // abrir
  await p.tap('#app',{position:{x:w/2,y:h*0.6}}); await p.waitForTimeout(400);
  ok(tag+' toque inicia clip (agarra el catálogo)',await phase(p)==='opening'&&await p.evaluate(()=>!vC.paused));
  await p.waitForTimeout(1800); await shot(p,{path:out+'/'+tag+'-4-agarra.png'});
  await wf(p,()=>__boyacos.phase==='book',15000); await p.waitForTimeout(800);
  await shot(p,{path:out+'/'+tag+'-5-pagina1.png'});
  ok(tag+' libro: Cómo llegar a Maps',await p.evaluate(()=>{const a=document.querySelector('.dock a.btn.map');return !!a&&a.offsetParent!==null&&a.href.includes('google.com/maps')}));
  ok(tag+' pág. 1: Servicios y Repuestos sobre las hojas',await p.evaluate(()=>[...document.querySelectorAll('.pg.on')].map(e=>e.dataset.view).join()==='servicios,repuestos'&&+getComputedStyle(vC).opacity===1));
  // pasar página (sincronizado con el video)
  await p.tap('#next'); await p.waitForTimeout(500);
  ok(tag+' siguiente: video D gira la página y se ocultan las hojas',await phase(p)==='turning'&&await p.evaluate(()=>!vD.paused&&+getComputedStyle(document.getElementById('stage')).opacity<0.5));
  await shot(p,{path:out+'/'+tag+'-6-girando.png'});
  await wf(p,()=>__boyacos.phase==='book'&&__boyacos.page===2,8000); await p.waitForTimeout(800);
  await shot(p,{path:out+'/'+tag+'-7-pagina2.png'});
  ok(tag+' pág. 2: Vehículos y Ayuda sobre las hojas',await p.evaluate(()=>[...document.querySelectorAll('.pg.on')].map(e=>e.dataset.view).join()==='vehiculos,ayuda'&&+getComputedStyle(vD).opacity===1&&+getComputedStyle(vC).opacity===0));
  ok(tag+' pág. 2: siguiente deshabilitado',await p.getAttribute('#next','aria-disabled')==='true');
  ok(tag+' pág. 2: 10 marcas en Multimarca',await p.evaluate(()=>document.querySelectorAll('.pg[data-view=vehiculos] .brands li').length===11&&document.querySelectorAll('#v-vehiculos .chip').length===11));
  await p.tap('.pg.on[data-view=vehiculos]'); await p.waitForTimeout(900);
  await p.tap('#v-vehiculos .chip[data-other]'); await p.waitForTimeout(150);
  ok(tag+' Otro muestra el campo para escribir la marca',await p.isVisible('#otro-marca'));
  await p.fill('#otro-marca','Peugeot'); await p.waitForTimeout(100);
  const vh=decodeURIComponent(await p.getAttribute('#bar-wa','href'));
  ok(tag+' WA con la marca escrita',vh.includes('mi vehículo Peugeot')&&(await p.textContent('#bar-wa')).includes('Consultar: Peugeot'),vh);
  await shot(p,{path:out+'/'+tag+'-8b-multimarca-otro.png'});
  await p.tap('#v-vehiculos .chip[data-b=Kia]'); await p.waitForTimeout(100);
  ok(tag+' elegir una marca de la lista',decodeURIComponent(await p.getAttribute('#bar-wa','href')).includes('mi vehículo Kia')&&!(await p.isVisible('#otro-marca')));
  await p.tap('#back'); await p.waitForTimeout(700);
  // abrir hoja Ayuda
  await p.tap('.pg.on[data-view=ayuda]'); await p.waitForTimeout(900);
  ok(tag+' tocar hoja abre su vista',await phase(p)==='open'&&await p.isVisible('#v-ayuda'));
  await shot(p,{path:out+'/'+tag+'-8-hoja-ayuda.png'});
  const tels=await p.$$eval('#v-ayuda a',as=>as.map(a=>a.getAttribute('href')));
  ok(tag+' ayuda: Cómo llegar a Maps',await p.evaluate(()=>{const a=document.querySelector('#v-ayuda a.btn.map');return !!a&&a.offsetParent!==null&&a.href.includes('google.com/maps')}));
  ok(tag+' ayuda: llamada y WhatsApp',tels.length===3&&tels[0].startsWith('tel:')&&tels[1].startsWith('https://wa.me/'),tels.join());
  await p.tap('#back'); await p.waitForTimeout(700);
  ok(tag+' Atrás vuelve al libro (pág. 2)',await phase(p)==='book'&&await p.evaluate(()=>__boyacos.page===2));
  // volver (E: video al revés)
  await p.tap('#prev'); await p.waitForTimeout(500);
  ok(tag+' anterior: video E al revés',await phase(p)==='turning'&&await p.evaluate(()=>!vE.paused));
  await wf(p,()=>__boyacos.phase==='book'&&__boyacos.page===1,8000); await p.waitForTimeout(600);
  ok(tag+' vuelve a pág. 1',await p.evaluate(()=>+getComputedStyle(vC).opacity===1&&+getComputedStyle(vE).opacity===0));
  // hoja Servicios + elegir servicio
  await p.tap('.pg.on[data-view=servicios]'); await p.waitForTimeout(900);
  ok(tag+' tocar hoja Servicios',await phase(p)==='open'&&await p.isVisible('#v-servicios'));
  await p.tap('#v-servicios li:nth-child(6) .item'); await p.waitForTimeout(100);
  const hr=decodeURIComponent(await p.getAttribute('#bar-wa','href'));
  ok(tag+' WA con servicio elegido (Cambio de llantas)',hr.startsWith('https://wa.me/573144852891?text=')&&hr.includes('información sobre Cambio de llantas'),hr);
  ok(tag+' botón WA muestra el servicio y abre en la misma página',(await p.textContent('#bar-wa')).includes('Consultar: Cambio de llantas')&&(await p.getAttribute('#bar-wa','target'))===null);
  ok(tag+' hoja Servicios: Cómo llegar a Maps',await p.evaluate(()=>{const a=document.querySelector('#bar a.btn.map');return !!a&&a.offsetParent!==null&&a.href.includes('google.com/maps')}));
  await shot(p,{path:out+'/'+tag+'-9-hoja-servicios.png'});
  const small=await p.$$eval('#sheet button, #sheet a.btn, #book button, #book a.btn',els=>els.filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.height<44||r.width<44)}).map(e=>e.id||e.className));
  ok(tag+' áreas táctiles ≥44',small.length===0,small.join());
  await p.tap('#close'); await p.waitForTimeout(700);
  ok(tag+' cerrar hoja vuelve al libro',await phase(p)==='book');
  // deslizar
  await p.mouse.move(w*.8,h*.5);await p.mouse.down();await p.mouse.move(w*.2,h*.5,{steps:6});await p.mouse.up();
  await wf(p,()=>__boyacos.phase==='book'&&__boyacos.page===2,8000);
  ok(tag+' deslizar pasa de página',true);
  const hrefs=await p.$$eval('a',as=>as.map(a=>a.getAttribute('href')));
  ok(tag+' ningún href vacío o "#"',hrefs.every(x=>x&&x!=='#'),hrefs.length+' enlaces');
  const sx=await p.evaluate(()=>[document.documentElement.scrollWidth,document.body.scrollWidth,innerWidth]);
  ok(tag+' sin scroll horizontal',sx[0]<=sx[2]&&sx[1]<=sx[2],sx.join(','));
  // cerrar libro
  await p.tap('#bk-close'); await p.waitForTimeout(600);
  ok(tag+' cerrar catálogo vuelve al loop',await phase(p)==='loop'&&await p.evaluate(()=>[vC,vD,vE].every(v=>+getComputedStyle(v).opacity===0)));
  await shot(p,{path:out+'/'+tag+'-10-cerrado.png'});
  // reabrir y saltar la apertura con un toque
  await p.tap('#app',{position:{x:w/2,y:h*0.6}}); await p.waitForTimeout(1200);
  await p.tap('#app',{position:{x:w/2,y:h*0.3}}); await p.waitForTimeout(900);
  ok(tag+' toque durante la apertura salta a la pág. 1',await phase(p)==='book'&&await p.evaluate(()=>__boyacos.page===1&&+getComputedStyle(vC).opacity===1));
  await p.tap('#bk-close'); await p.waitForTimeout(400);
  ok(tag+' sin errores JS',errs.length===0,errs.join(';'));
  await ctx.close();
}
// con "reducir animaciones" y con ahorro de datos el video igualmente corre al cargar, sin botón "Ver video"
{const ctx=await br.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});const p=await ctx.newPage();await p.goto('http://localhost:8123/',{waitUntil:'domcontentloaded'});
 await wf(p,()=>document.getElementById('app').dataset.phase==='intro',20000);
 ok('reduced-motion: el video corre solo y no hay botón Ver video',await p.evaluate(()=>!vA.paused&&document.getElementById('enter').hidden&&document.getElementById('enter').textContent!=='Ver video'));await ctx.close();}
{const ctx=await br.newContext({viewport:{width:390,height:844},hasTouch:true});const p=await ctx.newPage();
 await p.addInitScript(()=>{Object.defineProperty(navigator,'connection',{value:{saveData:true,effectiveType:'2g'}})});
 await p.goto('http://localhost:8123/',{waitUntil:'domcontentloaded'});
 await wf(p,()=>document.getElementById('app').dataset.phase==='intro',20000);
 ok('save-data/2g: el video corre solo y no hay botón Ver video',await p.evaluate(()=>!vA.paused&&document.getElementById('enter').hidden));await ctx.close();}
{const b2=await chromium.launch({channel:'msedge'});
 const ctx=await b2.newContext({viewport:{width:390,height:844},hasTouch:true});const p=await ctx.newPage();
 await p.addInitScript(()=>{const o=HTMLMediaElement.prototype.play;let allow=false;window.__allow=()=>{allow=true};HTMLMediaElement.prototype.play=function(){return allow?o.call(this):Promise.reject(new DOMException('blocked','NotAllowedError'))}});
 await p.goto('http://localhost:8123/',{waitUntil:'domcontentloaded'});await p.waitForTimeout(3500);
 ok('autoplay bloqueado -> botón visible',await p.evaluate(()=>__boyacos.phase==='blocked'&&!document.getElementById('enter').hidden));
 await p.evaluate(()=>window.__allow());
 await shot(p,{path:out+'/390x844-12-toca-para-entrar.png'});await p.tap('#enter');await p.waitForTimeout(1500);ok('botón entrar inicia intro',await p.evaluate(()=>['intro','loop'].includes(__boyacos.phase)));
 await b2.close();}
{const ctx=await br.newContext({viewport:{width:1280,height:800}});const p=await ctx.newPage();await p.goto('http://localhost:8123/',{waitUntil:'domcontentloaded'});await p.waitForTimeout(4000);await shot(p,{path:out+'/escritorio.png'});await ctx.close();}
await br.close();srv.close();
for(const r of results)console.log(r.join(' | '));
