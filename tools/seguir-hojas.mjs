// Seguimiento de las hojas del libro con OpenCV.js (flujo óptico LK + homografía RANSAC)
import cvm from '@techstark/opencv-js';
import {PNG} from 'pngjs';
import fs from 'fs';
const cv = await (cvm instanceof Promise ? cvm : (cvm.ready ?? Promise.resolve(cvm)));
const FR = process.env.USERPROFILE + '/AppData/Local/Temp/trk/fr/';
const OUT = process.env.USERPROFILE + '/AppData/Local/Temp/trk/track.json';
const W = 720, H = 1280;
const cache = new Map();
function gray(n){
  if(cache.has(n)) return cache.get(n);
  const png = PNG.sync.read(fs.readFileSync(FR + 'f' + String(n).padStart(3,'0') + '.png'));
  const g = new Uint8Array(W*H);
  for(let i=0;i<W*H;i++){ const r=png.data[i*4],gg=png.data[i*4+1],b=png.data[i*4+2]; g[i]=(0.299*r+0.587*gg+0.114*b)|0; }
  const m = cv.matFromArray(H,W,cv.CV_8UC1,Array.from(g));
  const o = {m, g}; cache.set(n,o);
  if(cache.size>6){ const k=cache.keys().next().value; cache.get(k).m.delete(); cache.delete(k); }
  return o;
}
function inPoly(p,q){ let s=0; for(let i=0;i<4;i++){ const a=q[i],b=q[(i+1)%4]; const c=(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]); if(c===0) continue; const sg=c>0?1:-1; if(s===0) s=sg; else if(s!==sg) return false; } return true; }
function samplePts(g,q,step=9,maxN=400){
  const xs=q.map(p=>p[0]), ys=q.map(p=>p[1]);
  const x0=Math.max(2,Math.floor(Math.min(...xs))), x1=Math.min(W-3,Math.ceil(Math.max(...xs)));
  const y0=Math.max(2,Math.floor(Math.min(...ys))), y1=Math.min(H-3,Math.ceil(Math.max(...ys)));
  const c=[];
  for(let y=y0;y<=y1;y+=step) for(let x=x0;x<=x1;x+=step){
    if(!inPoly([x,y],q)) continue;
    const i=y*W+x; const gx=Math.abs(g[i+1]-g[i-1]), gy=Math.abs(g[i+W]-g[i-W]);
    const sc=gx+gy; if(sc>14) c.push([x,y,sc]);
  }
  c.sort((a,b)=>b[2]-a[2]); return c.slice(0,maxN).map(p=>[p[0],p[1]]);
}
function applyH(Hm,p){ const d=Hm[6]*p[0]+Hm[7]*p[1]+Hm[8]; return [(Hm[0]*p[0]+Hm[1]*p[1]+Hm[2])/d,(Hm[3]*p[0]+Hm[4]*p[1]+Hm[5])/d]; }
function step(nA,nB,q){            // sigue el cuadrilátero q de la imagen nA a la nB
  const A=gray(nA), B=gray(nB);
  const pts=samplePts(A.g,q);
  if(pts.length<12) return {q:null,inl:0};
  const src=cv.matFromArray(pts.length,1,cv.CV_32FC2,pts.flat());
  const dst=new cv.Mat(), st=new cv.Mat(), er=new cv.Mat();
  cv.calcOpticalFlowPyrLK(A.m,B.m,src,dst,st,er,new cv.Size(31,31),4,new cv.TermCriteria(cv.TermCriteria_EPS|cv.TermCriteria_COUNT,30,0.01));
  const sp=[],dp=[];
  for(let i=0;i<pts.length;i++){ if(st.data[i]){ sp.push(pts[i][0],pts[i][1]); dp.push(dst.data32F[i*2],dst.data32F[i*2+1]); } }
  src.delete();dst.delete();st.delete();er.delete();
  if(sp.length<16) return {q:null,inl:0};
  const sm=cv.matFromArray(sp.length/2,1,cv.CV_32FC2,sp), dm=cv.matFromArray(dp.length/2,1,cv.CV_32FC2,dp);
  const mask=new cv.Mat(); const Hm=cv.findHomography(sm,dm,cv.RANSAC,2.5,mask);
  let inl=0; for(let i=0;i<mask.rows;i++) inl+=mask.data[i]?1:0;
  sm.delete();dm.delete();mask.delete();
  if(Hm.empty()) return {q:null,inl:0};
  const h=Array.from(Hm.data64F); Hm.delete();
  return {q:q.map(p=>applyH(h,p)),inl,n:sp.length/2};
}
function track(from,to,q0,label){
  const res={}; res[from]={q:q0,inl:999}; let q=q0; const dir=to>from?1:-1;
  for(let n=from;n!==to;n+=dir){
    const r=step(n,n+dir,q);
    if(!r.q){ console.log(label,'perdido en',n+dir); break; }
    q=r.q; res[n+dir]={q,inl:r.inl,n:r.n};
  }
  return res;
}
// cuadriláteros de reposo (TL,TR,BR,BL) medidos en el cuadro 720×1280
const Q1L=[[80,490],[354,488],[357,880],[68,878]], Q1R=[[360,488],[615,486],[655,872],[360,880]];
const Q2L=[[88,516],[354,512],[358,920],[50,920]], Q2R=[[360,512],[618,508],[668,912],[358,920]];
const which=process.argv[2]||'all';
const out=fs.existsSync(OUT)?JSON.parse(fs.readFileSync(OUT,'utf8')):{};
const S1=[Q1L[0],Q1R[1],Q1R[2],Q1L[3]];
const jobs={
  lift:()=>track(123,62,S1,'lift'),
  left:()=>track(123,160,Q1L,'left'),
  front:()=>track(123,150,Q1R,'front'),
  back:()=>track(180,140,Q2L,'back'),
  right2:()=>track(180,130,Q2R,'right2'),
};
for(const k of Object.keys(jobs)){ if(which!=='all'&&which!==k) continue; console.log('→',k); out[k]=jobs[k](); fs.writeFileSync(OUT,JSON.stringify(out)); }
console.log('listo');
