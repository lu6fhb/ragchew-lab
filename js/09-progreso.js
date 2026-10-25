// ---- Progreso: historial, gráficos y matriz de confusiones (guardado en este navegador)
const HK='cwb_hist',CK='cwb_conf';
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
function align(a,b){const n=a.length,m=b.length,D=Array.from({length:n+1},(_,i)=>[i]);for(let j=1;j<=m;j++)D[0][j]=j;
for(let i=1;i<=n;i++)for(let j=1;j<=m;j++)D[i][j]=Math.min(D[i-1][j]+1,D[i][j-1]+1,D[i-1][j-1]+(a[i-1]==b[j-1]?0:1));
const ops=[];let i=n,j=m;while(i>0||j>0){if(i&&j&&D[i][j]==D[i-1][j-1]+(a[i-1]==b[j-1]?0:1)){ops.push([a[i-1],b[j-1]]);i--;j--}else if(i&&D[i][j]==D[i-1][j]+1){ops.push([a[i-1],'']);i--}else{ops.push(['',b[j-1]]);j--}}return ops}
function recConf(sent,copied){const C=ld(CK,{c:{},s:{}}),cl=x=>x.toUpperCase().replace(/[^A-Z0-9ÑÇ?\/.,]/g,'');
align(cl(sent),cl(copied)).forEach(([x,y])=>{if(!x)return;C.s[x]=(C.s[x]||0)+1;if(x!=y){const r=C.c[x]=C.c[x]||{},k=y||'·';r[k]=(r[k]||0)+1}});sv(CK,C)}
function recSession(){const H=ld(HK,[]),a=rx.filter(r=>!r.self).map(r=>r.acc),ra=K.dh.length>2&&K.dt.length>2?mean(K.dh)/mean(K.dt):null;
if(!K.lg.length&&!a.length)return;H.push({d:Date.now(),w:num('wpm'),m:mode(),lg:K.lg.length?mean(K.lg):null,wg:K.wg.length?mean(K.wg):null,bad:K.bad,acc:a.length?mean(a):null,ra});sv(HK,H.slice(-80))}
function spark(t,v,ideal,max){const ok=v.filter(x=>x!=null);if(!ok.length)return'';const W=300,H=90,P=24,y0=H-12,y1=14,mx=Math.max(max||0,...ok,ideal||0)*1.1,Y=y=>y0-(y/mx)*(y0-y1);
const pts=v.map((y,i)=>y==null?null:[P+(v.length>1?i*(W-P-10)/(v.length-1):(W-P-10)/2),Y(y)]).filter(Boolean);
return`<h4>${t}</h4><svg class="ch" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t}">${ideal?`<line x1="${P}" x2="${W-6}" y1="${Y(ideal)}" y2="${Y(ideal)}" stroke-dasharray="4 3"/><text x="${P-4}" y="${Y(ideal)+3}" text-anchor="end">${ideal}</text>`:''}<polyline points="${pts.map(p=>p.join(',')).join(' ')}"/>${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3"/>`).join('')}<text x="${W-6}" y="10" text-anchor="end">${ok[ok.length-1].toFixed(1)}</text></svg>`}
function matrix(C){const rows=Object.keys(C.s).map(k=>{const e=Object.values(C.c[k]||{}).reduce((a,b)=>a+b,0);return{k,e,r:e/C.s[k]}}).filter(r=>r.e>0).sort((a,b)=>b.r-a.r||b.e-a.e).slice(0,12);
if(!rows.length)return'';const cs={};rows.forEach(r=>{for(const y in C.c[r.k])cs[y]=(cs[y]||0)+C.c[r.k][y]});
const cl=Object.keys(cs).sort((a,b)=>cs[b]-cs[a]).slice(0,10),mx=Math.max(1,...rows.flatMap(r=>cl.map(c=>C.c[r.k][c]||0))),pr=[];
for(const x in C.c)for(const y in C.c[x])pr.push([x,y,C.c[x][y]]);pr.sort((a,b)=>b[2]-a[2]);
return`<h4>${T('pgt')}</h4><p>${pr.slice(0,6).map(p=>`${p[0]} → ${p[1]} ×${p[2]}`).join(' · ')}</p><h4>${T('pgm')}</h4><div style="overflow-x:auto"><table class="mx"><tr><th></th>${cl.map(c=>`<th>${c}</th>`).join('')}<th>%</th></tr>${rows.map(r=>`<tr><th>${r.k}</th>${cl.map(c=>{const n=C.c[r.k][c]||0;return`<td style="background:${n?`color-mix(in srgb,var(--wa) ${Math.round(20+80*n/mx)}%,transparent)`:'none'}">${n||''}</td>`}).join('')}<td>${Math.round(100*(1-r.r))}</td></tr>`).join('')}</table></div>`}
function showProg(){const H=ld(HK,[]),C=ld(CK,{c:{},s:{}}),pg=$('pg');
pg.innerHTML=(H.length||Object.keys(C.s).length?`<p>${F('pgx',{n:H.length})}</p>`+spark(T('pg1'),H.map(h=>h.acc),100,100)+spark(T('pg2'),H.map(h=>h.lg),3,6)+spark(T('pg3'),H.map(h=>h.ra),3,5)+matrix(C):`<p>${T('pgn')}</p>`)+`<div class="row"><button id="pgc">${T('pgc')}</button><button id="pgr">${T('pgr')}</button><button id="pge">${T('exp')}</button></div>`;
$('pgc').onclick=()=>pg.hidden=true;$('pge').onclick=expSum;
$('pgr').onclick=function(){if(!this.dataset.s){this.dataset.s=1;this.textContent=T('pgs');return}sv(HK,[]);sv(CK,{c:{},s:{}});showProg()};
pg.hidden=false;pg.scrollIntoView({behavior:'smooth'})}
