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
const br=await chromium.launch({channel:'msedge',args:['--autoplay-policy=no-user-gesture-required']});
for(const [w,h] of [[390,844],[360,740]]){
  const tag=w+'x'+h;
  const ctx=await br.newContext({viewport:{width:w,height:h},hasTouch:true,isMobile:true,deviceScaleFactor:2});
  const p=await ctx.newPage(); const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/fonts|ERR_/.test(m.text()))errs.push(m.text())});
  await p.addInitScript(()=>{window.__log=[];const t0=performance.now();const tick=()=>{const A=document.getElementById('vA'),B=document.getElementById('vB');if(A&&B){window.__log.push({t:Math.round(performance.now()-t0),o:+getComputedStyle(B).opacity,bt:B.currentTime,bp:B.paused,br:B.readyState,at:A.currentTime,ar:A.readyState,ap:A.paused,ph:document.getElementById('app')&&document.getElementById('app').dataset.phase})}requestAnimationFrame(tick)};requestAnimationFrame(tick)});
  await p.goto('http://localhost:8123/');
  await p.waitForTimeout(300); await p.screenshot({path:out+'/'+tag+'-1-carga.png'});
  await p.waitForFunction(()=>document.getElementById('app').dataset.phase==='intro',null,{timeout:15000});
  await p.waitForTimeout(3000); await p.screenshot({path:out+'/'+tag+'-2-intro.png'});
  await p.waitForFunction(()=>document.getElementById('app').dataset.phase==='loop',null,{timeout:20000});
  ok(tag+' intro->loop',true);
  await p.waitForTimeout(2500); await p.screenshot({path:out+'/'+tag+'-3-loop-invitacion.png'});
  const log=await p.evaluate(()=>window.__log);
  const bad=log.filter(x=>x.o>0&&x.br<2);
  const gaps=log.filter(x=>x.ph==='loop'&&x.o<1&&x.ar<2);
  const sw=log.filter(x=>x.o>0&&x.o<1);
  ok(tag+' sin parpadeo Clip1->Clip2',bad.length===0&&gaps.length===0,'bad='+bad.length+' gaps='+gaps.length+' fadeSamples='+sw.length+' total='+log.length);
  const fin=log[log.length-1]; ok(tag+' loop avanza',fin.bt>0.5&&!fin.bp,'bt='+fin.bt.toFixed(2));
  await p.waitForFunction(()=>vC.readyState>=3,null,{timeout:20000});
  await p.tap('#app',{position:{x:w/2,y:h*0.6}}); await p.waitForTimeout(300);
  ok(tag+' toque inicia clip del catálogo',await p.evaluate(()=>__boyacos.phase==='opening'&&!vC.paused));
  await p.waitForTimeout(2200); await p.screenshot({path:out+'/'+tag+'-4a-clip-agarra.png'});
  await p.waitForTimeout(2500); await p.screenshot({path:out+'/'+tag+'-4b-clip-paginas.png'});
  await p.waitForFunction(()=>__boyacos.phase==='open',null,{timeout:15000});
  await p.waitForTimeout(800); await p.screenshot({path:out+'/'+tag+'-5-catalogo.png'});
  ok(tag+' al terminar el clip se abre la hoja',await p.evaluate(()=>__boyacos.phase==='open'&&vC.currentTime>7));
  for(const [k,n] of [['servicios',6],['repuestos',7],['vehiculos',8],['ayuda',9]]){
    await p.tap('[data-go='+k+']'); await p.waitForTimeout(300);
    if(k==='servicios'){await p.tap('#v-servicios li:nth-child(2) .item');await p.waitForTimeout(100);
      const hr=decodeURIComponent(await p.getAttribute('#bar-wa','href'));ok(tag+' WA con servicio elegido',hr.includes('información sobre Suspensión'),hr)}
    await p.screenshot({path:out+'/'+tag+'-'+n+'-'+k+'.png'});
    ok(tag+' vista '+k, await p.isVisible('#v-'+k));
    await p.tap('#back'); await p.waitForTimeout(250);
  }
  const hrefs=await p.$$eval('a',as=>as.map(a=>a.getAttribute('href')));
  ok(tag+' ningún href vacío o "#"',hrefs.every(h=>h&&h!=='#'),hrefs.length+' enlaces');
  const sx=await p.evaluate(()=>[document.documentElement.scrollWidth,document.body.scrollWidth,innerWidth]);
  ok(tag+' sin scroll horizontal',sx[0]<=sx[2]&&sx[1]<=sx[2],sx.join(','));
  ok(tag+' hoja sin overflow-x',await p.$eval('#body',b=>b.scrollWidth<=b.clientWidth));
  const small=await p.$$eval('#sheet button, #sheet a.btn',els=>els.filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.height<44||r.width<44)}).map(e=>e.id||e.className));
  ok(tag+' áreas táctiles ≥44',small.length===0,small.join());
  await p.tap('#close'); await p.waitForTimeout(700);
  ok(tag+' cerrar vuelve al loop',await p.evaluate(()=>__boyacos.phase==='loop'&&!getComputedStyle(vC).opacity!=='x'));
  await p.waitForTimeout(400);ok(tag+' clip oculto tras cerrar',await p.evaluate(()=>+getComputedStyle(vC).opacity===0&&vC.paused));
  await p.screenshot({path:out+'/'+tag+'-10-cerrado.png'});
  // reabrir y saltar con un toque
  await p.tap('#app',{position:{x:w/2,y:h*0.6}}); await p.waitForTimeout(1500);
  await p.tap('#app',{position:{x:w/2,y:h*0.3}}); await p.waitForTimeout(900);
  ok(tag+' toque durante el clip salta a la hoja',await p.evaluate(()=>__boyacos.phase==='open'&&vC.currentTime<6),'');
  await p.tap('#close'); await p.waitForTimeout(500);
  ok(tag+' sin errores JS',errs.length===0,errs.join(';'));
  await ctx.close();
}
{const ctx=await br.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});const p=await ctx.newPage();await p.goto('http://localhost:8123/');await p.waitForTimeout(1800);
 ok('reduced-motion: sin Clip 1, póster + invitación',await p.evaluate(()=>document.getElementById('vA').hidden&&__boyacos.phase==='loop'&&document.getElementById('vA').currentTime===0));
 await p.tap('#app',{position:{x:195,y:500}});await p.waitForTimeout(500);await p.screenshot({path:out+'/390x844-11-reduced-motion.png'});ok('reduced-motion abre catálogo',await p.evaluate(()=>__boyacos.phase==='open'));await ctx.close();}
{const ctx=await br.newContext({viewport:{width:390,height:844},hasTouch:true});const p=await ctx.newPage();
 await p.addInitScript(()=>{Object.defineProperty(navigator,'connection',{value:{saveData:true,effectiveType:'4g'}})});
 const reqs=[];p.on('request',r=>reqs.push(r.url()));await p.goto('http://localhost:8123/');await p.waitForTimeout(1800);
 ok('save-data: no descarga mp4',!reqs.some(u=>u.endsWith('.mp4')),reqs.filter(u=>u.includes('mp4')).join());await ctx.close();}
{const b2=await chromium.launch({channel:'msedge'});
 const ctx=await b2.newContext({viewport:{width:390,height:844},hasTouch:true});const p=await ctx.newPage();
 await p.addInitScript(()=>{const o=HTMLMediaElement.prototype.play;let allow=false;window.__allow=()=>{allow=true};HTMLMediaElement.prototype.play=function(){return allow?o.call(this):Promise.reject(new DOMException('blocked','NotAllowedError'))}});
 await p.goto('http://localhost:8123/');await p.waitForTimeout(3500);
 ok('autoplay bloqueado -> botón visible',await p.evaluate(()=>__boyacos.phase==='blocked'&&!document.getElementById('enter').hidden));
 await p.evaluate(()=>window.__allow());
 const st=await p.evaluate(()=>[__boyacos.phase,!document.getElementById('enter').hidden]);ok('autoplay: reproduce o muestra botón',st[0]==='blocked'?st[1]:true,st.join());
 if(st[0]==='blocked'){await p.screenshot({path:out+'/390x844-12-toca-para-entrar.png'});await p.tap('#enter');await p.waitForTimeout(1500);ok('botón entrar inicia intro',await p.evaluate(()=>['intro','loop'].includes(__boyacos.phase)))}
 await b2.close();}
// escritorio
{const ctx=await br.newContext({viewport:{width:1280,height:800}});const p=await ctx.newPage();await p.goto('http://localhost:8123/');await p.waitForTimeout(4000);await p.screenshot({path:out+'/escritorio.png'});await ctx.close();}
await br.close();srv.close();
for(const r of results)console.log(r.join(' | '));
