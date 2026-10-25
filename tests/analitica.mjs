import {chromium} from 'playwright';import http from 'http';import fs from 'fs';import path from 'path';
const root=process.argv[2];
const MT={'.mp4':'video/mp4','.html':'text/html','.webp':'image/webp','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const srv=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(q.url==='/')f=path.join(root,'index.html');fs.stat(f,(e,s)=>{if(e||s.isDirectory()){r.writeHead(404);return r.end()}const t=MT[path.extname(f)]||'application/octet-stream';const rg=q.headers.range;if(rg){const m=/bytes=(\d*)-(\d*)/.exec(rg);const a=+m[1]||0,b=m[2]?+m[2]:s.size-1;r.writeHead(206,{'Content-Type':t,'Content-Range':'bytes '+a+'-'+b+'/'+s.size,'Accept-Ranges':'bytes','Content-Length':b-a+1});fs.createReadStream(f,{start:a,end:b}).pipe(r)}else{r.writeHead(200,{'Content-Type':t,'Content-Length':s.size,'Accept-Ranges':'bytes'});fs.createReadStream(f).pipe(r)}})}).listen(8145);
const results=[];const ok=(n,c,d='')=>results.push([c?'PASS':'FAIL',n,d]);
const br=await chromium.launch({channel:'msedge',args:['--autoplay-policy=no-user-gesture-required']});
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
// el head no activa nada por sí solo
ok('analítica: GA4, Hotjar y Meta siguen comentados (no hay scripts activos)',!/<script[^>]*googletagmanager|static\.hotjar|fbevents\.js/.test(html.replace(/<!--[\s\S]*?-->/g,'')));
ok('analítica: los tres bloques traen marcador de ID e instrucciones',/G-XXXXXXXXXX/.test(html)&&/hjid:0000000/.test(html)&&/fbq\('init','000000000000000'\)/.test(html)&&/CÓMO ACTIVARLA/.test(html));
for(const mode of ['sin-correo','con-correo']){
  const ctx=await br.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  if(mode==='con-correo'){
    await ctx.addInitScript(()=>{window.EMAIL_FORMULARIO='prueba@example.com'});
    await ctx.route('https://formsubmit.co/**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:'true'})}));
  }
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:8145/',{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>__boyacos.phase==='loop',null,{timeout:40000});
  await p.tap('#app',{position:{x:195,y:500}});
  await p.waitForFunction(()=>__boyacos.phase==='book',null,{timeout:40000});await p.waitForTimeout(900);
  await p.evaluate(()=>{window.dataLayer=[]});
  await p.tap('#bk-menu');await p.waitForTimeout(1200);
  const abrir=async(go)=>{ await p.tap('[data-go="'+go+'"]'); await p.waitForTimeout(500); await p.tap('#back'); await p.waitForTimeout(400); };
  for(const go of ['galeria','blog','redes','contacto']) await abrir(go);
  const evs=await p.evaluate(()=>window.dataLayer.map(x=>x.event));
  ok(mode+' eventos de vistas: abrir_galeria, ver_blog, ver_redes, abrir_contacto',['abrir_galeria','ver_blog','ver_redes','abrir_contacto'].every(e=>evs.includes(e)),evs.join(','));
  ok(mode+' ya no se envían los nombres antiguos ver_galeria / ver_contacto',!evs.includes('ver_galeria')&&!evs.includes('ver_contacto'));
  await p.tap('[data-go="contacto"]');await p.waitForTimeout(400);
  await p.fill('#c-nombre','Prueba');await p.fill('#c-wa','3001234567');await p.check('#c-auth');
  await p.evaluate(()=>{window.dataLayer=[]});
  await p.tap('#c-send');await p.waitForTimeout(1500);
  const ev2=await p.evaluate(()=>window.dataLayer.map(x=>x.event));
  if(mode==='con-correo') ok('envío correcto dispara envio_formulario (y no el de error)',ev2.includes('envio_formulario')&&!ev2.includes('envio_formulario_error'),ev2.join(','));
  else ok('envío sin correo configurado dispara envio_formulario_error (y no el correcto)',ev2.includes('envio_formulario_error')&&!ev2.includes('envio_formulario'),ev2.join(','));
  ok(mode+' sin errores de JavaScript',errs.length===0,errs.join('|'));
  await ctx.close();
}
await br.close();srv.close();
for(const r of results)console.log(r.join(' | '));
