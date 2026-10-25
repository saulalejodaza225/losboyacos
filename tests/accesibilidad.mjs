// Auditoría de accesibilidad con axe-core (WCAG 2.1 A/AA) en las pantallas principales + alternativa sin JavaScript.
// Requiere: npm i axe-core   (en la misma carpeta donde está Playwright; se ejecuta desde ahí)
import {chromium} from 'playwright';import http from 'http';import fs from 'fs';import path from 'path';import {createRequire} from 'module';
const root=process.argv[2];const require=createRequire(process.cwd()+'/x.js');
const axeSrc=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const MT={'.mp4':'video/mp4','.html':'text/html','.webp':'image/webp','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const srv=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(q.url==='/')f=path.join(root,'index.html');fs.stat(f,(e,s)=>{if(e||s.isDirectory()){r.writeHead(404);return r.end()}const t=MT[path.extname(f)]||'application/octet-stream';const rg=q.headers.range;if(rg){const m=/bytes=(\d*)-(\d*)/.exec(rg);const a=+m[1]||0,b=m[2]?+m[2]:s.size-1;r.writeHead(206,{'Content-Type':t,'Content-Range':'bytes '+a+'-'+b+'/'+s.size,'Accept-Ranges':'bytes','Content-Length':b-a+1});fs.createReadStream(f,{start:a,end:b}).pipe(r)}else{r.writeHead(200,{'Content-Type':t,'Content-Length':s.size,'Accept-Ranges':'bytes'});fs.createReadStream(f).pipe(r)}})}).listen(8146);
const results=[];const ok=(n,c,d='')=>results.push([c?'PASS':'FAIL',n,d]);
const br=await chromium.launch({channel:'msedge',args:['--autoplay-policy=no-user-gesture-required']});
const ctx=await br.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
await ctx.route(/google\.com\/maps/,r=>r.fulfill({status:200,contentType:'text/html',body:'<html><title>mapa</title></html>'}));
const p=await ctx.newPage();
const audit=async(nombre)=>{
  await p.evaluate(src=>{ if(!window.axe) (0,eval)(src); },axeSrc);
  const r=await p.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']}}));
  const graves=r.violations.filter(v=>v.impact==='critical'||v.impact==='serious'), otras=r.violations.filter(v=>!(v.impact==='critical'||v.impact==='serious'));
  ok('axe · '+nombre+': 0 problemas críticos o serios',graves.length===0,graves.map(v=>v.id+'('+v.nodes.length+'): '+v.nodes.slice(0,3).map(n=>n.target.join(' ')).join(' ; ')).join(' || '));
  ok('axe · '+nombre+': 0 problemas moderados o menores',otras.length===0,otras.map(v=>v.id+'['+v.impact+']('+v.nodes.length+'): '+v.nodes.slice(0,3).map(n=>n.target.join(' ')).join(' ; ')).join(' || '));
};
await p.goto('http://localhost:8146/',{waitUntil:'domcontentloaded'});
await p.waitForFunction(()=>__boyacos.phase==='loop',null,{timeout:40000});
await audit('escena (loop)');
await p.tap('#app',{position:{x:195,y:500}});
await p.waitForFunction(()=>__boyacos.phase==='book',null,{timeout:40000});await p.waitForTimeout(1000);
await audit('libro abierto');
await p.tap('#bk-menu');await p.waitForTimeout(1500);
await audit('hoja · inicio (mapa y banners)');
for(const [go,n] of [['servicios','servicios'],['galeria','galería'],['blog','blog'],['contacto','contacto']]){
  await p.tap('[data-go="'+go+'"]');await p.waitForTimeout(700);await audit('vista '+n);await p.tap('#back');await p.waitForTimeout(400);
}
await p.tap('#open-privacy-footer');await p.waitForTimeout(500);await audit('modal de privacidad');
await p.keyboard.press('Escape');
await p.goto('http://localhost:8146/privacidad.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(800);
await audit('privacidad.html');
// sin JavaScript
const c2=await br.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
const q=await c2.newPage();await q.goto('http://localhost:8146/',{waitUntil:'domcontentloaded'});await q.waitForTimeout(500);
const txt=await q.locator("body").innerText();
ok("sin JavaScript: se muestra el aviso con nombre y dirección (no una pantalla vacía)",/Los Boyacos/i.test(txt)&&/Carrera 94A/i.test(txt),txt.slice(0,80).split('\n').join(' '));
const html=await q.content();
ok('sin JavaScript: el HTML trae el bloque con enlaces de contacto (wa.me, tel:, Maps, privacidad)',/wa\.me\/573144852891/.test(html)&&/tel:\+573144852891/.test(html)&&/maps\.google\.com/.test(html)&&/privacidad\.html/.test(html));
const vis=await q.locator('a[href^="https://wa.me"]').first().boundingBox();
ok('sin JavaScript: el botón de WhatsApp es visible y mide ≥ 44 px de alto',!!vis&&vis.height>=44&&vis.width>=44,JSON.stringify(vis));
await br.close();srv.close();
for(const r of results)console.log(r.join(' | ').slice(0,700));
