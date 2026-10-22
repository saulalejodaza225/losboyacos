import {chromium} from 'playwright';import http from 'http';import fs from 'fs';import path from 'path';
const root=process.argv[2];
const srv=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(q.url==='/')f=path.join(root,'index.html');fs.stat(f,(e,s)=>{if(e){r.writeHead(404);return r.end()}const t=f.endsWith('mp4')?'video/mp4':f.endsWith('html')?'text/html':f.endsWith('webp')?'image/webp':'application/octet-stream';const rg=q.headers.range;if(rg){const m=/bytes=(\d*)-(\d*)/.exec(rg);const a=+m[1]||0,b=m[2]?+m[2]:s.size-1;r.writeHead(206,{'Content-Type':t,'Content-Range':'bytes '+a+'-'+b+'/'+s.size,'Accept-Ranges':'bytes','Content-Length':b-a+1});fs.createReadStream(f,{start:a,end:b}).pipe(r)}else{r.writeHead(200,{'Content-Type':t,'Content-Length':s.size,'Accept-Ranges':'bytes'});fs.createReadStream(f).pipe(r)}})}).listen(8134);
const br=await chromium.launch({channel:'msedge',args:['--autoplay-policy=no-user-gesture-required']});
for(const [w,h,mobile] of [[390,844,true],[1280,800,false]]){
  const p=await (await br.newContext({viewport:{width:w,height:h},hasTouch:mobile,isMobile:mobile})).newPage();
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:8134/',{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>__boyacos.phase==='loop',null,{timeout:40000});
  // dónde caerá la hoja "Servicios": tocar justo ahí y simular el clic fantasma del navegador táctil
  const box=await p.evaluate(()=>{const e=document.querySelector('.pg[data-view=servicios]').getBoundingClientRect();return [e.x+e.width/2,e.y+e.height/2]});
  const [x,y]=box;
  if(mobile){await p.touchscreen.tap(x,y);}else{await p.mouse.move(x,y);await p.mouse.down();await p.mouse.up();}
  // clic fantasma: llega unos ms después, sobre el elemento que ahora está bajo el dedo
  await p.waitForTimeout(40);
  await p.evaluate(([x,y])=>{const el=document.elementFromPoint(x,y);el&&el.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:x,clientY:y}));},[x,y]);
  await p.waitForTimeout(300);
  const st=await p.evaluate(()=>[__boyacos.phase,document.getElementById('sheet').classList.contains('open'),!document.getElementById('vC').paused]);
  console.log((mobile?'móvil':'escritorio'),'-> fase:',st[0],'| panel abierto:',st[1],'| clip corre:',st[2],'| errores:',errs.length);
  await p.close();
}
await br.close();srv.close();
