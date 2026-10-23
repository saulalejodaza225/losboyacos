import {chromium} from 'playwright';import http from 'http';import fs from 'fs';import path from 'path';
const root=process.argv[2],out=path.join(root,'shots');fs.mkdirSync(out,{recursive:true});
const MT={'.mp4':'video/mp4','.html':'text/html','.webp':'image/webp','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const srv=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(q.url==='/')f=path.join(root,'index.html');fs.stat(f,(e,s)=>{if(e||s.isDirectory()){r.writeHead(404);return r.end()}const t=MT[path.extname(f)]||'application/octet-stream';const rg=q.headers.range;if(rg){const m=/bytes=(\d*)-(\d*)/.exec(rg);const a=+m[1]||0,b=m[2]?+m[2]:s.size-1;r.writeHead(206,{'Content-Type':t,'Content-Range':'bytes '+a+'-'+b+'/'+s.size,'Accept-Ranges':'bytes','Content-Length':b-a+1});fs.createReadStream(f,{start:a,end:b}).pipe(r)}else{r.writeHead(200,{'Content-Type':t,'Content-Length':s.size,'Accept-Ranges':'bytes'});fs.createReadStream(f).pipe(r)}})}).listen(8144);
const results=[];const ok=(n,c,d='')=>results.push([c?'PASS':'FAIL',n,d]);
const shot=async(p,o)=>{for(let i=0;i<6;i++){try{await p.screenshot(o);return}catch(e){await new Promise(r=>setTimeout(r,600))}}};
const br=await chromium.launch({channel:'msedge',args:['--autoplay-policy=no-user-gesture-required']});
for(const [w,h,mobile] of [[390,844,true],[360,740,true],[1280,800,false]]){
  const tag=mobile?w+'x'+h:'escritorio';
  const ctx=await br.newContext({viewport:{width:w,height:h},hasTouch:mobile,isMobile:mobile,deviceScaleFactor:mobile?2:1});
  await ctx.route(/google\.com\/maps/,r=>r.fulfill({status:200,contentType:'text/html',body:'<html></html>'}));
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/fonts|ERR_|google/i.test(m.text()))errs.push(m.text())});
  await p.goto('http://localhost:8144/',{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>__boyacos.phase==='loop',null,{timeout:40000});
  const click=mobile?async(sel)=>p.tap(sel):async(sel)=>p.click(sel);
  if(mobile){await p.tap('#app',{position:{x:w/2,y:h*0.6}});}else{await p.mouse.click(w/2,h*0.6);}
  await p.waitForFunction(()=>__boyacos.phase==='book',null,{timeout:40000});await p.waitForTimeout(900);
  await click('#bk-menu');await p.waitForTimeout(1200);
  const l=await p.evaluate(()=>{const a=document.querySelector('.legal'),b=document.getElementById('open-privacy-footer'),r=b.getBoundingClientRect(),ar=a.getBoundingClientRect();return {txt:a.textContent.replace(/\s+/g,' ').trim(),h:r.height,w:r.width,vis:ar.bottom<=innerHeight+1&&ar.top>=0,col:getComputedStyle(a).color}});
  ok(tag+' línea legal con el texto exacto',l.txt==='© 2026 Los Boyacos · Suba, Bogotá · Política de privacidad',l.txt);
  ok(tag+' línea legal visible en pantalla y objetivo táctil ≥44 px',l.vis&&l.h>=44,JSON.stringify([l.vis,l.h,l.w]));
  ok(tag+' línea legal en #A89E96',l.col==='rgb(168, 158, 150)',l.col);
  await click('#open-privacy-footer');await p.waitForTimeout(400);
  const m=await p.evaluate(()=>({open:!document.getElementById('privacy').hidden,foco:document.activeElement&&document.activeElement.id}));
  ok(tag+' el enlace abre el modal de privacidad con el foco en Cerrar',m.open&&m.foco==='pv-close',JSON.stringify(m));
  await shot(p,{path:out+'/'+tag+'-p5-modal.png'});
  await p.keyboard.press('Escape');await p.waitForTimeout(300);
  const c=await p.evaluate(()=>({cerrado:document.getElementById('privacy').hidden,foco:document.activeElement&&document.activeElement.id,sheet:document.getElementById('sheet').classList.contains('open')}));
  ok(tag+' Escape cierra el modal, devuelve el foco al enlace y la hoja sigue abierta',c.cerrado&&c.foco==='open-privacy-footer'&&c.sheet,JSON.stringify(c));
  await shot(p,{path:out+'/'+tag+'-p5-pie.png'});
  const hrefs=await p.evaluate(()=>[...document.querySelectorAll('a[href]')].filter(a=>a.getAttribute('href')==='#').length);
  ok(tag+' ningún href="#"',hrefs===0);
  ok(tag+' sin errores de consola',errs.length===0,errs.join('|'));
  const sx=await p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);ok(tag+' sin scroll horizontal',sx[0]<=sx[1],sx.join(','));
  // página de privacidad
  const pg=await ctx.newPage();await pg.goto('http://localhost:8144/privacidad.html',{waitUntil:'domcontentloaded'});
  const d=await pg.evaluate(()=>{const t=document.body.innerText,bg=getComputedStyle(document.body).backgroundColor,back=document.querySelector('.back'),bk=back.getBoundingClientRect();return {bg,t,h:bk.height,sx:document.documentElement.scrollWidth<=innerWidth,hash:[...document.querySelectorAll('a')].filter(a=>a.getAttribute('href')==='#').length,wa:document.querySelectorAll('a[href="https://wa.me/573144852891"]').length}});
  ok(tag+' privacidad.html: fondo #0E0C0B, Ley 1581, WhatsApp, dirección, © 2026',d.bg==='rgb(14, 12, 11)'&&/Ley 1581 de 2012/.test(d.t)&&/Carrera 94A #145A-83/.test(d.t)&&d.wa>=1&&/© 2026/.test(d.t));
  ok(tag+' privacidad.html: derechos del titular y objetivo táctil ≥44 px sin scroll horizontal',/Derechos del titular/i.test(d.t)&&d.h>=44&&d.sx&&d.hash===0,JSON.stringify([d.h,d.sx]));
  await shot(pg,{path:out+'/'+tag+'-p5-privacidad.png'});
  await ctx.close();
}
await br.close();srv.close();
for(const r of results)console.log(r.join(' | '));
