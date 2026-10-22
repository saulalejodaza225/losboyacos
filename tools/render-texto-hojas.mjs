// Renderiza, fotograma a fotograma, el texto del catálogo (HTML real) con la perspectiva de cada hoja
import {chromium} from 'playwright';
import fs from 'fs';
const HOME=process.env.USERPROFILE+'/AppData/Local/Temp/trk/';
const SITE=process.argv[2];                    // carpeta del proyecto (index.html)
const T=JSON.parse(fs.readFileSync(HOME+'track.json','utf8'));
const OUT=HOME+'ov/'; fs.mkdirSync(OUT,{recursive:true});
// ---------- matemática 3×3 ----------
const mul=(A,B)=>A.map((r,i)=>[0,1,2].map(j=>r[0]*B[0][j]+r[1]*B[1][j]+r[2]*B[2][j]));
const inv=m=>{const[a,b,c,d,e,f,g,h,i]=m.flat();const A=e*i-f*h,B=-(d*i-f*g),C=d*h-e*g,D=-(b*i-c*h),E=a*i-c*g,F=-(a*h-b*g),G=b*f-c*e,H=-(a*f-c*d),I=a*e-b*d;const det=a*A+b*B+c*C;return[[A/det,D/det,G/det],[B/det,E/det,H/det],[C/det,F/det,I/det]];};
const ap=(M,p)=>{const w=M[2][0]*p[0]+M[2][1]*p[1]+M[2][2];return[(M[0][0]*p[0]+M[0][1]*p[1]+M[0][2])/w,(M[1][0]*p[0]+M[1][1]*p[1]+M[1][2])/w];};
function quadToM(p){ // cuadrado unidad → cuadrilátero p (TL,TR,BR,BL)
  const[x0,y0]=p[0],[x1,y1]=p[1],[x2,y2]=p[2],[x3,y3]=p[3];
  const dx1=x1-x2,dx2=x3-x2,dy1=y1-y2,dy2=y3-y2,sx=x0-x1+x2-x3,sy=y0-y1+y2-y3;
  const den=dx1*dy2-dx2*dy1,g=(sx*dy2-dx2*sy)/den,h=(dx1*sy-sx*dy1)/den;
  return[[x1-x0+g*x1,x3-x0+h*x3,x0],[y1-y0+g*y1,y3-y0+h*y3,y0],[g,h,1]];
}
const homog=(src,dst)=>mul(quadToM(dst),inv(quadToM(src)));
const rectM=(p,w,h)=>mul(quadToM(p),[[1/w,0,0],[0,1/h,0],[0,0,1]]);   // rect w×h → p
const m3d=M=>`matrix3d(${[M[0][0],M[1][0],0,M[2][0], M[0][1],M[1][1],0,M[2][1], 0,0,1,0, M[0][2],M[1][2],0,1].join(',')})`;
const lerp=(a,b,t)=>a+(b-a)*t, lerpP=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t)], lerpQ=(A,B,t)=>A.map((p,i)=>lerpP(p,B[i],t));
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
// ---------- geometría de reposo (igual que index.html) ----------
const Q1L=[[80,490],[354,488],[357,880],[68,878]], Q1R=[[360,488],[615,486],[655,872],[360,880]];
const Q2L=[[88,516],[354,512],[358,920],[50,920]], Q2R=[[360,512],[618,508],[668,912],[358,920]];
const INS={L1:[.16,.13,.97,.88],R1:[.05,.13,.84,.88],L2:[.14,.07,.97,.82],R2:[.05,.07,.84,.84]};
const HOLD={L1:Q1L,R1:Q1R,L2:Q2L,R2:Q2R};
const bil=(q,u,v)=>{const t=lerpP(q[0],q[1],u),b=lerpP(q[3],q[2],u);return lerpP(t,b,v);};
const sub=(q,i)=>[bil(q,i[0],i[1]),bil(q,i[2],i[1]),bil(q,i[2],i[3]),bil(q,i[0],i[3])];
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const DIM={}; for(const k of Object.keys(HOLD)){const p=sub(HOLD[k],INS[k]);const qw=(dist(p[0],p[1])+dist(p[3],p[2]))/2,qh=(dist(p[0],p[3])+dist(p[1],p[2]))/2;DIM[k]=[300,Math.round(300*qh/qw)];}
// ---------- pistas ----------
const q=(name,n)=>T[name][n]&&T[name][n].q;
const S1=[Q1L[0],Q1R[1],Q1R[2],Q1L[3]];
const ramp=(n,a,b)=>clamp((n-a)/(b-a));
const taperEnd=n=>1;           // el texto del video llega completo al último fotograma
// punto de la hoja que gira: esquinas físicas (spineTop, outerTop, outerBot, spineBot)
const physFront=Q=>({st:Q[0],ot:Q[1],ob:Q[2],sb:Q[3]});
const physBack=Q=>({st:Q[1],ot:Q[0],ob:Q[3],sb:Q[2]});
const F139=physFront(q('front',139)), B156=physBack(q('back',156));
const leafAt=n=>{
  if(n<=139) return {ph:physFront(q('front',n)),face:'front'};
  if(n<156){const t=(n-139)/(156-139);const ph={};for(const k of ['st','ot','ob','sb'])ph[k]=lerpP(F139[k],B156[k],t);
    const face=(ph.ot[0]>ph.st[0])?'front':'back';return {ph,face};}
  return {ph:physBack(q('back',n)),face:'back'};
};
const faceQuad=(ph,face)=>face==='front'?[ph.st,ph.ot,ph.ob,ph.sb]:[ph.ot,ph.st,ph.sb,ph.ob];
function layersFor(n){
  const L=[];
  if(n<=123){
    const a=n<86?0:n<96?(n-86)/10:1;
    if(a>0&&T.lift[n]){const H=homog(S1,T.lift[n].q);
      L.push({id:'L1',quad:Q1L.map(p=>ap(H,p)),alpha:a});L.push({id:'R1',quad:Q1R.map(p=>ap(H,p)),alpha:a});}
    return L;
  }
  const r0=1, tap=taperEnd(n);
  const leaf=leafAt(n), leafPoly=[leaf.ph.st,leaf.ph.ot,leaf.ph.ob,leaf.ph.sb];
  // hoja izquierda (SERVICIOS), tapada por la hoja que gira
  if(n<=157){const qL=q('left',Math.min(n,150));L.push({id:'L1',quad:qL,alpha:r0,hole:leafPoly});}
  // hoja que gira: cara frontal (REPUESTOS) y dorso (VEHÍCULOS QUE ATENDEMOS)
  const fq=faceQuad(leaf.ph,leaf.face);
  L.push({id:leaf.face==='front'?'R1':'L2',quad:fq,alpha:(leaf.face==='front'?r0:1)*tap});
  // página derecha nueva (AYUDA EN CARRETERA), visible al despegarse la hoja
  const qR=n>=160?q('right2',n):lerpQ(Q1R,q('right2',160),clamp((n-123)/(160-123)));
  L.push({id:'R2',quad:qR,alpha:ramp(n,136,141)*tap,hole:leafPoly});
  return L;
}
// ---------- render ----------
const br=await chromium.launch({channel:'msedge'});
const page=await (await br.newContext({viewport:{width:720,height:1280},reducedMotion:'reduce'})).newPage();
await page.goto('file:///'+SITE.replace(/\\/g,'/')+'/index.html');
await page.addStyleTag({content:'html,body{background:transparent!important;overflow:visible!important}#app{width:720px!important;height:1280px!important;background:transparent!important;position:fixed!important;left:0;top:0;margin:0}#app>*:not(#book){display:none!important}#book{opacity:1!important;visibility:visible!important}#book .bk-top,#book .bk-hint,#book .bk-bottom{display:none!important}#stage{transform:none!important;opacity:1!important}.pg{transition:none!important;opacity:0}'});
await page.evaluate(()=>{ document.querySelectorAll('.pg').forEach(e=>e.classList.add('on')); document.fonts&&document.fonts.ready; });
await page.waitForTimeout(800);
const idx={L1:0,R1:1,L2:2,R2:3};
const from=+process.argv[3]||24, to=+process.argv[4]||180;
for(let n=from;n<=to;n++){
  const layers=layersFor(n);
  const st=['L1','R1','L2','R2'].map(id=>{
    const ly=layers.find(l=>l.id===id); if(!ly||ly.alpha<=0.001||!ly.quad) return {id,alpha:0};
    const p=sub(ly.quad,INS[id]);              // sub-rectángulo útil, ya en la perspectiva de ese fotograma
    // las esquinas del sub-rect: mapear desde el reposo con la homografía página→página actual
    const Hh=homog(HOLD[id],ly.quad), ph=sub(HOLD[id],INS[id]).map(pt=>ap(Hh,pt));
    const [w,h]=DIM[id]; const M=rectM(ph,w,h);
    let clip='none';
    if(ly.hole){const Mi=inv(M);const loc=ly.hole.map(pt=>ap(Mi,pt));clip='path(evenodd,"M -4000 -4000 H 6000 V 6000 H -4000 Z M '+loc.map(v=>v[0].toFixed(1)+' '+v[1].toFixed(1)).join(' L ')+' Z")';}
    return {id,alpha:ly.alpha,w,h,tf:m3d(M),clip};
  });
  await page.evaluate(st=>{const els=document.querySelectorAll('.pg');st.forEach((s,i)=>{const e=els[i];if(!s.alpha){e.style.opacity=0;return;}e.style.width=s.w+'px';e.style.height=s.h+'px';e.style.transform=s.tf;e.style.clipPath=s.clip;e.style.opacity=s.alpha;});},st);
  await page.screenshot({path:OUT+'o'+String(n).padStart(3,'0')+'.png',omitBackground:true});
}
await br.close(); console.log('listo',from,to);
