import {chromium} from 'playwright';import http from 'http';import fs from 'fs';import path from 'path';
const root=process.argv[2],out=path.join(root,'shots');fs.mkdirSync(out,{recursive:true});
const MT={'.mp4':'video/mp4','.html':'text/html','.webp':'image/webp','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg','.yml':'text/yaml','.md':'text/markdown'};
const srv=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(q.url==='/')f=path.join(root,'index.html');fs.stat(f,(e,s)=>{if(e||s.isDirectory()){r.writeHead(404);return r.end()}const t=MT[path.extname(f)]||'application/octet-stream';const rg=q.headers.range;if(rg){const m=/bytes=(\d*)-(\d*)/.exec(rg);const a=+m[1]||0,b=m[2]?+m[2]:s.size-1;r.writeHead(206,{'Content-Type':t,'Content-Range':'bytes '+a+'-'+b+'/'+s.size,'Accept-Ranges':'bytes','Content-Length':b-a+1});fs.createReadStream(f,{start:a,end:b}).pipe(r)}else{r.writeHead(200,{'Content-Type':t,'Content-Length':s.size,'Accept-Ranges':'bytes'});fs.createReadStream(f).pipe(r)}})}).listen(8141);
const results=[];const ok=(n,c,d='')=>results.push([c?'PASS':'FAIL',n,d]);
const shot=async(p,o)=>{for(let i=0;i<6;i++){try{await p.screenshot(o);return}catch(e){await new Promise(r=>setTimeout(r,600))}}};
const br=await chromium.launch({channel:'msedge',args:['--autoplay-policy=no-user-gesture-required']});
async function abrirMenu(p,tag){
  await p.goto('http://localhost:8141/',{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>__boyacos.phase==='loop',null,{timeout:40000});
  await p.tap('#app',{position:{x:195,y:500}});
  await p.waitForFunction(()=>__boyacos.phase==='book',null,{timeout:40000});await p.waitForTimeout(900);
  await p.tap('#bk-menu');await p.waitForTimeout(800);
}
for(const [w,h] of [[390,844],[360,740]]){
  const tag=w+'x'+h;
  const ctx=await br.newContext({viewport:{width:w,height:h},hasTouch:true,isMobile:true,deviceScaleFactor:2});
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/fonts|ERR_|formsubmit/i.test(m.text()))errs.push(m.text())});
  await p.route('https://formsubmit.co/**',r=>r.fulfill({status:200,contentType:'application/json',body:'{"success":"true"}'}));
  await abrirMenu(p,tag);
  // --- inicio: banners y tarjetas
  const bn=await p.$$eval('#banners .banner',b=>b.map(x=>[x.querySelector('.b-txt').textContent,x.querySelector('.b-tag').textContent]));
  ok(tag+' 3 banners desde banners.json con su etiqueta',bn.length===3&&bn[0][1]==='Oferta'&&bn[1][1]==='20% off'&&bn[2][1]==='Gratis',JSON.stringify(bn.map(x=>x[1])));
  ok(tag+' banners encima de las tarjetas',await p.evaluate(()=>{const b=document.getElementById('banners').getBoundingClientRect(),c=document.querySelector('#v-home .cards').getBoundingClientRect();return b.bottom<=c.top+1}));
  const ord=await p.$$eval('#v-home .card',c=>c.map(x=>x.dataset.go));
  ok(tag+' 8 tarjetas: las 4 nuevas debajo de las existentes',ord.join()==='servicios,repuestos,vehiculos,ayuda,galeria,blog,redes,contacto',ord.join());
  const est=await p.evaluate(()=>{const b=document.querySelector('.banner');const cs=getComputedStyle(b);return [cs.backgroundColor,cs.borderLeftColor,cs.borderLeftWidth]});
  ok(tag+' estilo del banner (#1A1614, línea roja 3 px)',est[0]==='rgb(26, 22, 20)'&&est[1]==='rgb(200, 40, 30)'&&est[2]==='3px',est.join(' | '));
  await shot(p,{path:out+'/'+tag+'-p2-0-inicio.png'});
  await p.evaluate(()=>document.getElementById('body').scrollTo(0,9999));await p.waitForTimeout(200);
  await shot(p,{path:out+'/'+tag+'-p2-0b-inicio-tarjetas.png'});
  // --- galería
  await p.evaluate(()=>document.getElementById('body').scrollTo(0,0));
  await p.tap('[data-go=galeria]');await p.waitForTimeout(700);
  ok(tag+' galería: 12 fotos, 2 columnas, gap 8 px, radio 10 px, lazy',await p.evaluate(()=>{const g=document.getElementById('gal');const cs=getComputedStyle(g);const it=document.querySelector('.gal-item');const im=it.querySelector('img');return g.children.length===12&&cs.gridTemplateColumns.split(' ').length===2&&cs.columnGap==='8px'&&getComputedStyle(it).borderTopLeftRadius==='10px'&&im.loading==='lazy'}));
  const vis=async()=>p.$$eval('#gal li',l=>l.filter(x=>!x.hidden).length);
  await p.tap('.tab[data-cat=taller]');await p.waitForTimeout(150);const t1=await vis();
  await p.tap('.tab[data-cat=trabajos]');await p.waitForTimeout(150);const t2=await vis();
  await p.tap('.tab[data-cat=todo]');await p.waitForTimeout(150);const t3=await vis();
  ok(tag+' filtros Todo/Taller/Trabajos (12/6/6)',t1===6&&t2===6&&t3===12,[t3,t1,t2].join('/'));
  await shot(p,{path:out+'/'+tag+'-p2-1-galeria.png'});
  await p.tap('.gal-item >> nth=2');await p.waitForTimeout(250);
  ok(tag+' visor: abre ampliada con foco en cerrar',await p.isVisible('#lightbox')&&await p.evaluate(()=>document.activeElement.id==='lb-close'));
  await shot(p,{path:out+'/'+tag+'-p2-1b-visor.png'});
  await p.tap('#lb-close');await p.waitForTimeout(200);
  ok(tag+' visor: la X lo cierra',!(await p.isVisible('#lightbox')));
  await p.tap('.gal-item >> nth=1');await p.waitForTimeout(200);await p.keyboard.press('Escape');await p.waitForTimeout(200);
  ok(tag+' visor: Escape cierra solo el visor (la hoja sigue)',!(await p.isVisible('#lightbox'))&&await p.evaluate(()=>__boyacos.phase==='open'&&!document.getElementById('v-galeria').hidden));
  // --- blog
  await p.tap('#back');await p.waitForTimeout(300);
  await p.tap('[data-go=blog]');await p.waitForTimeout(700);
  ok(tag+' blog: 3 artículos con imagen 3:2, título, fecha y extracto de 2 líneas',await p.evaluate(()=>{const l=[...document.querySelectorAll('#blog-list .post')];if(l.length!==3)return false;const im=l[0].querySelector('img');const r=im.getBoundingClientRect();const ex=getComputedStyle(l[0].querySelector('.post-ex'));return Math.abs(r.width/r.height-1.5)<0.05&&l[0].querySelector('h3').textContent.length>5&&l[0].querySelector('time').textContent.includes('2026')&&ex.webkitLineClamp==='2'}));
  await shot(p,{path:out+'/'+tag+'-p2-2-blog.png'});
  await p.tap('#blog-list .post >> nth=0 >> button');await p.waitForTimeout(400);
  ok(tag+' blog: detalle con Volver, título, fecha, imagen y cuerpo',await p.evaluate(()=>!document.getElementById('v-blogpost').hidden&&document.getElementById('post-title').textContent.length>5&&document.getElementById('post-date').textContent.includes('2026')&&document.getElementById('post-img').src.includes('blog-01')&&document.querySelectorAll('#post-body p').length>=3&&!!document.getElementById('post-back')));
  await shot(p,{path:out+'/'+tag+'-p2-2b-articulo.png'});
  await p.tap('#post-back');await p.waitForTimeout(300);
  ok(tag+' blog: Volver regresa al listado',await p.evaluate(()=>!document.getElementById('v-blog').hidden));
  await p.tap('#blog-list .post >> nth=1 >> button');await p.waitForTimeout(300);await p.tap('#back');await p.waitForTimeout(300);
  ok(tag+' blog: "Atrás" del detalle vuelve al listado',await p.evaluate(()=>!document.getElementById('v-blog').hidden));
  await p.tap('#back');await p.waitForTimeout(300);
  // --- redes
  await p.tap('[data-go=redes]');await p.waitForTimeout(400);
  ok(tag+' redes: sin variables no se dibuja ninguna tarjeta y se avisa',await p.evaluate(()=>document.querySelectorAll('#redes-list .soc').length===0&&!document.getElementById('redes-vacio').hidden));
  await shot(p,{path:out+'/'+tag+'-p2-3-redes.png'});
  await p.tap('#back');await p.waitForTimeout(300);
  // --- contacto
  await p.tap('[data-go=contacto]');await p.waitForTimeout(400);
  await shot(p,{path:out+'/'+tag+'-p2-4-contacto.png'});
  ok(tag+' contacto: campos y honeypot',await p.evaluate(()=>{const f=document.getElementById('form-contacto');const q=n=>f.elements[n];return q('nombre').required&&q('whatsapp').required&&q('whatsapp').type==='tel'&&q('whatsapp').inputMode==='numeric'&&q('vehiculo').placeholder==='Marca y modelo'&&q('mensaje').rows===3&&q('autorizo').required&&q('_honey').tabIndex===-1&&getComputedStyle(q('_honey')).display==='none'}));
  await p.tap('#c-send');await p.waitForTimeout(200);
  ok(tag+' contacto: sin nombre avisa',(await p.textContent('#c-err')).includes('nombre'));
  await p.fill('#c-nombre','Ana Gómez');await p.fill('#c-wa','12');await p.tap('#c-send');await p.waitForTimeout(150);
  ok(tag+' contacto: WhatsApp inválido avisa',(await p.textContent('#c-err')).includes('WhatsApp'));
  await p.fill('#c-wa','300 123 4567');await p.tap('#c-send');await p.waitForTimeout(150);
  ok(tag+' contacto: exige la autorización de datos',(await p.textContent('#c-err')).includes('autorizar'));
  // privacidad desde el formulario
  await p.tap('#open-privacy');await p.waitForTimeout(250);
  ok(tag+' privacidad: el modal abre con foco en cerrar',await p.isVisible('#privacy')&&await p.evaluate(()=>document.activeElement.id==='pv-close'));
  await shot(p,{path:out+'/'+tag+'-p2-5-privacidad.png'});
  const hrefPv=await p.getAttribute('#privacy a.btn','href');const tgt=await p.getAttribute('#privacy a.btn','target');
  ok(tag+' privacidad: "Ver política completa" abre privacidad.html en pestaña nueva',hrefPv==='privacidad.html'&&tgt==='_blank');
  const foc=[];for(let i=0;i<4;i++){await p.keyboard.press('Tab');foc.push(await p.evaluate(()=>!!document.activeElement.closest('#privacy')))}
  ok(tag+' privacidad: el foco queda atrapado (Tab)',foc.every(Boolean));
  await p.keyboard.press('Shift+Tab');ok(tag+' privacidad: Shift+Tab también atrapa',await p.evaluate(()=>!!document.activeElement.closest('#privacy')));
  await p.keyboard.press('Escape');await p.waitForTimeout(200);
  ok(tag+' privacidad: Escape cierra y devuelve el foco',!(await p.isVisible('#privacy'))&&await p.evaluate(()=>document.activeElement.id==='open-privacy'));
  // fallo de envío (sin correo configurado) → WhatsApp con los datos
  await p.check('#c-auth');await p.fill('#c-veh','Mazda 3 2018');await p.fill('#c-msg','Me suena la suspensión');
  await p.tap('#c-send');await p.waitForTimeout(500);
  const wl=decodeURIComponent(await p.getAttribute('#c-wa-link','href'));
  ok(tag+' contacto: solo se ve el panel de error (no el de éxito ni el formulario)',await p.isVisible('#c-fail-panel')&&!(await p.isVisible('#c-ok-panel'))&&!(await p.isVisible('#form-contacto')));
  ok(tag+' contacto: si falla el envío, panel de error y WhatsApp con los datos',await p.isVisible('#c-fail-panel')&&wl.startsWith('https://wa.me/573144852891?text=')&&wl.includes('Ana Gómez')&&wl.includes('3001234567')&&wl.includes('Mazda 3 2018')&&wl.includes('suspensión'),wl);
  await shot(p,{path:out+'/'+tag+'-p2-6-contacto-error.png'});
  await p.tap('#c-fail-back');await p.waitForTimeout(200);
  // éxito simulado (correo configurado + FormSubmit responde ok)
  await p.evaluate(()=>{ /* el correo es una variable del cliente: se simula definiéndola como global */ });
  ok(tag+' contacto: vuelve al formulario con los datos',await p.evaluate(()=>!document.getElementById('form-contacto').hidden&&document.getElementById('c-nombre').value==='Ana Gómez'));
  // WhatsApp dinámico y enlaces en las vistas nuevas
  for(const v of ['galeria','blog','redes','contacto']){
    await p.evaluate(()=>document.getElementById('back').click());await p.waitForTimeout(250);
    await p.evaluate((v)=>document.querySelector('[data-go='+v+']').click(),v);await p.waitForTimeout(250);
    const hr=decodeURIComponent(await p.getAttribute('#bar-wa','href'));
    ok(tag+' WhatsApp dinámico en '+v,hr.startsWith('https://wa.me/573144852891?text=Hola Los Boyacos')&&hr.includes('sus servicios'));
  }
  const hrefs=await p.$$eval('a',as=>as.map(a=>a.getAttribute('href')));
  ok(tag+' ningún href vacío ni "#"',hrefs.every(x=>x&&x!=='#'),hrefs.length+' enlaces');
  // táctiles ≥ 44 en cada vista nueva
  const peq=[];
  for(const v of ['galeria','blog','redes','contacto']){
    await p.evaluate(()=>document.getElementById('back').click()).catch(()=>{});await p.waitForTimeout(150);
    await p.evaluate((v)=>{document.getElementById('back').hidden||document.getElementById('back').click();},v);
    await p.evaluate((v)=>{const h=document.getElementById('v-home');if(h.hidden) document.getElementById('back').click();},v);
    await p.evaluate((v)=>document.querySelector('[data-go='+v+']').click(),v);await p.waitForTimeout(300);
    const m=await p.$$eval('#v-'+v+' button, #v-'+v+' a, #v-'+v+' input:not(.hidden), #v-'+v+' textarea, #v-'+v+' .tab',els=>els.filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&(r.height<44-0.5||r.width<44-0.5)&&!e.closest('[hidden]')&&getComputedStyle(e).display!=='none'&&e.type!=='checkbox'}).map(e=>(e.id||e.className)+':'+Math.round(e.getBoundingClientRect().height)));
    if(m.length) peq.push(v+'→'+m.join());
  }
  ok(tag+' áreas táctiles ≥44 px en las vistas nuevas',peq.length===0,peq.join(' ; '));
  const sx=await p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth,document.getElementById('body').scrollWidth,document.getElementById('body').clientWidth]);
  ok(tag+' sin scroll horizontal',sx[0]<=sx[1]&&sx[2]<=sx[3],sx.join(','));
  ok(tag+' sin errores de consola',errs.length===0,errs.join(' | '));
  await ctx.close();
}
// envío correcto: correo configurado (variable del cliente) + FormSubmit responde bien; y honeypot
{const ctx=await br.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await ctx.newPage();
 await p.addInitScript(()=>{window.EMAIL_FORMULARIO='prueba@ejemplo.com'});
 let posts=0,cuerpo='';await p.route('https://formsubmit.co/**',r=>{posts++;cuerpo=r.request().postData()||'';r.fulfill({status:200,contentType:'application/json',body:'{"success":"true"}'})});
 await abrirMenu(p,'exito');await p.tap('[data-go=contacto]');await p.waitForTimeout(400);
 await p.fill('#c-nombre','Luis Pérez');await p.fill('#c-wa','3109876543');await p.fill('#c-veh','Kia Rio');await p.fill('#c-msg','Cotización de frenos');await p.check('#c-auth');
 await p.tap('#c-send');await p.waitForTimeout(600);
 ok('envío correcto: panel "¡Listo! Te contactamos pronto." y solo ese panel',await p.isVisible('#c-ok-panel')&&(await p.textContent('#c-ok-panel')).includes('¡Listo! Te contactamos pronto.')&&!(await p.isVisible('#c-fail-panel'))&&!(await p.isVisible('#form-contacto')));
 ok('envío correcto: llegó a FormSubmit con los datos',posts===1&&cuerpo.includes('Luis Pérez')&&cuerpo.includes('3109876543')&&cuerpo.includes('Kia Rio'),cuerpo.slice(0,120));
 await shot(p,{path:out+'/p2-7-contacto-exito.png'});
 await p.tap('#c-ok-close');await p.waitForTimeout(400);
 ok('envío correcto: "Cerrar" vuelve al inicio y el formulario queda limpio',await p.evaluate(()=>!document.getElementById('v-home').hidden&&document.getElementById('c-nombre').value===''));
 await p.tap('[data-go=contacto]');await p.waitForTimeout(300);
 await p.fill('#c-nombre','Bot');await p.fill('#c-wa','3000000000');await p.check('#c-auth');await p.evaluate(()=>{document.querySelector('[name=_honey]').value='spam'});
 const antes=posts;await p.tap('#c-send');await p.waitForTimeout(400);
 ok('honeypot: se descarta en silencio, sin enviar nada',posts===antes&&await p.isVisible('#c-ok-panel'));
 await ctx.close();}

// escritorio con marco de 430 px
{const ctx=await br.newContext({viewport:{width:1280,height:800}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8141/',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>__boyacos.phase==='loop',null,{timeout:40000});
 await p.mouse.click(640,520);await p.waitForFunction(()=>__boyacos.phase==='book',null,{timeout:40000});await p.waitForTimeout(900);
 await p.click('#bk-menu');await p.waitForTimeout(800);
 ok('escritorio: marco de 430 px con banners y tarjetas',await p.evaluate(()=>document.getElementById('app').clientWidth===430&&document.querySelectorAll('#banners .banner').length===3&&document.querySelectorAll('#v-home .card').length===8));
 await shot(p,{path:out+'/escritorio-p2-inicio.png'});
 await p.click('[data-go=contacto]');await p.waitForTimeout(400);await shot(p,{path:out+'/escritorio-p2-contacto.png'});
 ok('escritorio: sin errores de consola',errs.length===0,errs.join('|'));await ctx.close();}
await br.close();srv.close();
for(const r of results)console.log(r.join(' | '));
