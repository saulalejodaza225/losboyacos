// Catálogo móvil: pasar la hoja con un deslizamiento táctil real (CDP) y texto nítido sobre el papel limpio.
import {chromium} from 'playwright';
import http from 'http'; import fs from 'fs'; import path from 'path';
const root=process.argv[2], out=path.join(root,'shots');
const mime={'.html':'text/html','.mp4':'video/mp4','.webp':'image/webp','.jpg':'image/jpeg'};
const srv=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(q.url==='/'||q.url.startsWith('/?'))f=path.join(root,'index.html');
 fs.stat(f,(e,s)=>{if(e){r.writeHead(404);return r.end()}
  const t=mime[path.extname(f)]||'application/octet-stream';const rg=q.headers.range;
  if(rg){const m=/bytes=(\d*)-(\d*)/.exec(rg);const a=+m[1]||0,b=m[2]?+m[2]:s.size-1;r.writeHead(206,{'Content-Type':t,'Content-Range':'bytes '+a+'-'+b+'/'+s.size,'Accept-Ranges':'bytes','Content-Length':b-a+1});fs.createReadStream(f,{start:a,end:b}).pipe(r)}
  else{r.writeHead(200,{'Content-Type':t,'Content-Length':s.size,'Accept-Ranges':'bytes'});fs.createReadStream(f).pipe(r)}})}).listen(8123);
let pass=0,fail=0;const ok=(n,c,d='')=>{c?pass++:fail++;console.log((c?'PASS':'FAIL')+' | '+n+' | '+d)};
const br=await chromium.launch({channel:'msedge',args:['--autoplay-policy=no-user-gesture-required']});
for(const [w,h] of [[390,844],[360,740]]){
  const tag=w+'x'+h;
  const ctx=await br.newContext({viewport:{width:w,height:h},hasTouch:true,isMobile:true,deviceScaleFactor:3});
  const p=await ctx.newPage(); const errs=[];p.on('pageerror',e=>errs.push(e.message));
  const cdp=await ctx.newCDPSession(p);
  const swipe=async(x0,y0,x1,y1)=>{
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x0,y:y0}]});
    for(let i=1;i<=8;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x0+(x1-x0)*i/8,y:y0+(y1-y0)*i/8}]});await p.waitForTimeout(16)}
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  };
  const book=n=>p.waitForFunction(k=>__boyacos.phase==='book'&&__boyacos.page===k,n,{timeout:15000});
  await p.goto('http://localhost:8123/',{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>document.getElementById('app').dataset.phase==='loop',null,{timeout:20000});
  await p.waitForTimeout(800);
  // burbujas: el clip del celular corre y luego se ejecuta la acción
  await p.waitForFunction(()=>vP.readyState>=3,null,{timeout:20000});
  await p.evaluate(()=>{window.__abiertos=[];window.open=(u,t)=>{__abiertos.push(u);return {opener:1}}});
  await p.tap('#fab-map'); await p.waitForTimeout(600);
  ok(tag+' burbuja Maps: corre el clip del celular y aún no abre',await p.evaluate(()=>vP.classList.contains('show')&&!vP.paused&&__abiertos.length===0));
  await p.waitForFunction(()=>__abiertos.length>0,null,{timeout:6000});
  ok(tag+' burbuja Maps: abre Google Maps al terminar',await p.evaluate(()=>__abiertos[0].includes('google.com/maps')));
  await p.waitForFunction(()=>__boyacos.phase==='loop'&&!vP.classList.contains('show'),null,{timeout:3000}); await p.waitForTimeout(1600);
  ok(tag+' burbuja Maps: vuelve al menú con las burbujas',await p.evaluate(()=>!vP.classList.contains('show')&&+getComputedStyle(document.getElementById('fab-wa').parentElement).opacity>0));
  let waUrl=''; await p.route(/wa.me/,r=>{waUrl=r.request().url();r.fulfill({status:204})});
  await p.waitForTimeout(1200);
  await p.tap('#fab-wa'); await p.waitForTimeout(600);
  ok(tag+' burbuja WhatsApp: corre el clip antes de abrir',await p.evaluate(()=>vP.classList.contains('show'))&&waUrl==='');
  await p.waitForFunction(()=>!vP.classList.contains('show'),null,{timeout:6000});
  await p.waitForTimeout(300);
  ok(tag+' burbuja WhatsApp: abre wa.me al terminar',waUrl.includes('wa.me/'),waUrl);
  await p.goto('http://localhost:8123/',{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>document.getElementById('app').dataset.phase==='loop',null,{timeout:20000});
  await p.waitForTimeout(800);
  await p.tap('#app',{position:{x:w/2,y:h*0.6}});
  await book(1); await p.waitForTimeout(800);
  await p.screenshot({path:out+'/'+tag+'-cat-1.png'});
  ok(tag+' pág. 1: el texto nítido y el papel limpio están visibles',await p.evaluate(()=>{const n=document.querySelector('.nitido[data-spread="1"]');return getComputedStyle(n).display==='block'&&/cat-papel-1/.test(getComputedStyle(n).backgroundImage)&&getComputedStyle(document.querySelector('.nitido[data-spread="2"]')).display==='none'}));
  ok(tag+' pág. 1: el clip se detiene antes de que la mano pase la hoja',await p.evaluate(()=>vC.duration<3.7));
  // deslizar sobre el fondo, fuera de las hojas, hacia la izquierda: siguiente
  await swipe(w*0.85,h*0.2,w*0.25,h*0.21);
  await p.waitForTimeout(250);
  ok(tag+' deslizar a la izquierda pasa a la pág. 2',await p.evaluate(()=>__boyacos.phase==='turning'&&!vD.paused),await p.evaluate(()=>__boyacos.phase));
  await book(2); await p.waitForTimeout(800);
  await p.screenshot({path:out+'/'+tag+'-cat-2.png'});
  ok(tag+' pág. 2: cambia el texto nítido',await p.evaluate(()=>getComputedStyle(document.querySelector('.nitido[data-spread="2"]')).display==='block'&&getComputedStyle(document.querySelector('.nitido[data-spread="1"]')).display==='none'));
  // deslizar sobre una hoja hacia la derecha: anterior, sin abrir la hoja
  const c=await p.evaluate(()=>{const r=document.querySelector('.pg.on').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]});
  await swipe(Math.max(30,c[0]-60),c[1],Math.min(w-20,c[0]+170),c[1]+8);
  await p.waitForTimeout(250);
  ok(tag+' deslizar a la derecha sobre una hoja vuelve sin abrirla',await p.evaluate(()=>__boyacos.phase==='turning'&&!vE.paused),await p.evaluate(()=>__boyacos.phase));
  await book(1); await p.waitForTimeout(800);
  // en el límite no hace nada ni abre la hoja
  await swipe(c[0]-60,c[1],c[0]+170,c[1]);
  await p.waitForTimeout(500);
  ok(tag+' deslizar en la pág. 1 hacia atrás no hace nada',await p.evaluate(()=>__boyacos.phase==='book'&&__boyacos.page===1));
  // un gesto vertical no pasa la página
  await swipe(w/2,h*0.65,w/2+12,h*0.3);
  await p.waitForTimeout(400);
  ok(tag+' un gesto vertical no pasa la página',await p.evaluate(()=>__boyacos.phase==='book'&&__boyacos.page===1));
  // el botón de Maps del catálogo también usa el clip, y el video queda por encima de todo
  await p.evaluate(()=>{window.__abiertos=[];window.open=(u,t)=>{__abiertos.push(u);return {opener:1}}});
  await p.waitForFunction(()=>vP.readyState>=3,null,{timeout:20000});
  await p.tap('.dock a.btn.map'); await p.waitForTimeout(600);
  ok(tag+' catálogo, Cómo llegar: corre el clip por encima de todo y sigue en el libro',await p.evaluate(()=>{const e=document.elementFromPoint(innerWidth/2,innerHeight-40);return e===vP&&!vP.paused&&__boyacos.phase==='book'&&__abiertos.length===0}));
  await p.waitForFunction(()=>__abiertos.length>0&&!vP.classList.contains('show'),null,{timeout:6000});
  ok(tag+' catálogo, Cómo llegar: abre Maps y vuelve al libro',await p.evaluate(()=>__abiertos[0].includes('google.com/maps')&&__boyacos.phase==='book'));
  // tocar una hoja sigue abriéndola
  await p.waitForTimeout(700);
  await p.tap('.pg.on[data-view=servicios]'); await p.waitForTimeout(900);
  ok(tag+' tocar una hoja sigue abriéndola',await p.evaluate(()=>__boyacos.phase==='open'));
  // WhatsApp desde una hoja (se deja de último porque navega)
  waUrl=''; await p.tap('#bar-wa'); await p.waitForTimeout(600);
  ok(tag+' hoja, WhatsApp: corre el clip y sigue en la hoja',await p.evaluate(()=>vP.classList.contains('show')&&__boyacos.phase==='open')&&waUrl==='');
  await p.waitForFunction(()=>!vP.classList.contains('show'),null,{timeout:6000}); await p.waitForTimeout(300);
  ok(tag+' hoja, WhatsApp: abre wa.me al terminar',waUrl.includes('wa.me/'),waUrl.slice(0,60));
  // Llamar: en su propia pestaña, porque el navegador de pruebas deja colgado el enlace tel:
  const q=await ctx.newPage(); q.on('pageerror',e=>errs.push(e.message));
  await q.goto('http://localhost:8123/',{waitUntil:'domcontentloaded'});
  await q.waitForFunction(()=>document.getElementById('app').dataset.phase==='loop',null,{timeout:20000});
  await q.waitForTimeout(800);
  await q.tap('#app',{position:{x:w/2,y:h*0.6}});
  await q.waitForFunction(()=>__boyacos.phase==='book'&&__boyacos.page===1,null,{timeout:15000});
  await q.waitForFunction(()=>vP.readyState>=3,null,{timeout:20000}); await q.waitForTimeout(900);
  await q.tap('.dock a.btn.call'); await q.waitForTimeout(600);
  ok(tag+' catálogo, Llamar: corre el clip del celular',await q.evaluate(()=>vP.classList.contains('show')&&!vP.paused&&__boyacos.phase==='book'));
  await q.waitForFunction(()=>!vP.classList.contains('show'),null,{timeout:6000});
  ok(tag+' catálogo, Llamar: al terminar sigue en el libro',await q.evaluate(()=>__boyacos.phase==='book'));
  ok(tag+' sin errores de JavaScript',errs.length===0,errs.join(' ; '));
  await ctx.close();
}
await br.close(); srv.close();
console.log(pass+' PASS, '+fail+' FAIL');
process.exit(fail?1:0);
