// Flecha atrás del celular: vuelve a la sección anterior dentro de la página y solo sale del sitio desde la sala.
import {chromium} from 'playwright';
import http from 'http'; import fs from 'fs'; import path from 'path';
const root=process.argv[2];
const mime={'.html':'text/html','.mp4':'video/mp4','.webp':'image/webp','.jpg':'image/jpeg'};
const srv=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(q.url==='/'||q.url.startsWith('/?'))f=path.join(root,'index.html');
 fs.stat(f,(e,s)=>{if(e){r.writeHead(404);return r.end()}
  const t=mime[path.extname(f)]||'application/octet-stream';const rg=q.headers.range;
  if(rg){const m=/bytes=(\d*)-(\d*)/.exec(rg);const a=+m[1]||0,b=m[2]?+m[2]:s.size-1;r.writeHead(206,{'Content-Type':t,'Content-Range':'bytes '+a+'-'+b+'/'+s.size,'Accept-Ranges':'bytes','Content-Length':b-a+1});fs.createReadStream(f,{start:a,end:b}).pipe(r)}
  else{r.writeHead(200,{'Content-Type':t,'Content-Length':s.size,'Accept-Ranges':'bytes'});fs.createReadStream(f).pipe(r)}})}).listen(8123);
let pass=0,fail=0;const ok=(n,c,d='')=>{c?pass++:fail++;console.log((c?'PASS':'FAIL')+' | '+n+' | '+d)};
const br=await chromium.launch({channel:'msedge',args:['--autoplay-policy=no-user-gesture-required']});
const ctx=await br.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:2});
const p=await ctx.newPage(); const errs=[];p.on('pageerror',e=>errs.push(e.message));
const fase=()=>p.evaluate(()=>__boyacos.phase);
const pila=()=>p.evaluate(()=>__boyacos.pila.join(' > '));
const atras=async()=>{await p.evaluate(()=>history.back());await p.waitForTimeout(350)};
const espera=(fn,arg,t=15000)=>p.waitForFunction(fn,arg,{timeout:t});
const libro=n=>espera(k=>__boyacos.phase==='book'&&__boyacos.page===k&&document.getElementById('book').classList.contains('ready'),n);
const sala=async()=>{await espera(()=>__boyacos.phase==='loop');await p.waitForTimeout(700)};
await p.goto('about:blank');
await p.goto('http://localhost:8123/',{waitUntil:'domcontentloaded'});
await espera(()=>document.getElementById('app').dataset.phase==='loop',null,20000);
await p.waitForTimeout(800);
ok('la sala es la entrada raíz',await pila()==='loop',await pila());

// catálogo: página 2 -> página 1 -> sala
await p.tap('#app',{position:{x:195,y:500}}); await libro(1); await p.waitForTimeout(700);
await p.tap('#next'); await libro(2); await p.waitForTimeout(700);
ok('catálogo agrega sus páginas al historial',await pila()==='loop > book:1 > book:2',await pila());
await atras();
ok('atrás en la pág. 2 gira la hoja hacia atrás',await fase()==='turning',await fase());
await libro(1); await p.waitForTimeout(700);
ok('llega a la pág. 1 sin salir del catálogo',await pila()==='loop > book:1',await pila());
await atras(); await sala();
ok('atrás en la pág. 1 vuelve a la sala',await pila()==='loop'&&p.url().startsWith('http://localhost:8123'),await pila());

// hoja abierta desde el catálogo y secciones dentro del menú
await p.waitForTimeout(800);
await p.tap('#app',{position:{x:195,y:500}}); await libro(1); await p.waitForTimeout(900);
await p.tap('.pg.on[data-view=servicios]'); await espera(()=>__boyacos.phase==='open'); await p.waitForTimeout(600);
ok('hoja desde el catálogo',await pila()==='loop > book:1 > sheet:servicios',await pila());
await atras();
ok('atrás cierra la hoja y queda en el catálogo',await fase()==='book'&&await p.evaluate(()=>__boyacos.page===1),await fase());
await p.waitForTimeout(900);
await p.tap('#bk-menu'); await espera(()=>__boyacos.phase==='open'); await p.waitForTimeout(600);
await p.tap('[data-go="contacto"]'); await p.waitForTimeout(400);
ok('menú y sección quedan en el historial',await pila()==='loop > book:1 > sheet:home > sheet:contacto',await pila());
await atras();
ok('atrás en una sección vuelve al menú',await pila()==='loop > book:1 > sheet:home'&&await p.evaluate(()=>!document.getElementById('v-home').hidden&&__boyacos.phase==='open'),await pila());
await atras();
ok('atrás en el menú vuelve al catálogo',await fase()==='book',await fase());

// botones de la página y flecha quedan sincronizados
await p.waitForTimeout(900);
await p.tap('.pg.on[data-view=repuestos]'); await espera(()=>__boyacos.phase==='open'); await p.waitForTimeout(600);
await p.tap('#close'); await p.waitForTimeout(700);
ok('cerrar con la X retira la entrada',await pila()==='loop > book:1'&&await fase()==='book',await pila());
await atras(); await sala();
ok('después de la X, una sola flecha vuelve a la sala',await pila()==='loop',await pila());

// habitación
await p.waitForTimeout(800);
await p.evaluate(()=>__boyacos.room('fotos'));
await espera(()=>__boyacos.phase==='room'&&__boyacos.roomReady,null,20000); await p.waitForTimeout(600);
ok('habitación en el historial',await pila()==='loop > room:fotos',await pila());
await atras(); await sala();
ok('atrás en la habitación vuelve a la sala',await pila()==='loop'&&await p.evaluate(()=>__boyacos.roomId===null),await pila());

// desde la sala la flecha sí sale del sitio
await p.goBack().catch(()=>{}); await p.waitForTimeout(1200);
ok('en la sala, atrás sale del sitio',p.url()==='about:blank',p.url());
ok('sin errores de JavaScript',errs.length===0,errs.join(' ; '));
await br.close(); srv.close();
console.log(pass+' PASS, '+fail+' FAIL');
process.exit(fail?1:0);
