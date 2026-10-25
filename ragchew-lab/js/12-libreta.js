// ---- Libreta del QSO
const NBK='cwb_logbook',nbF=['nbc','nbn','nbq','nbr','nbx'],esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function nbAdd(){const v=nbF.map(i=>$(i).value.trim().toUpperCase());if(!v.some(Boolean))return;const L=ld(NBK,[]);
L.push({t:new Date().toISOString().slice(0,16).replace('T',' ')+'Z',c:v[0],n:v[1],q:v[2],r:v[3],x:v[4]});sv(NBK,L.slice(-200));
if(st)st.nbReg={nbc:v[0],nbn:v[1],nbq:v[2],nbr:v[3]};nbClr();nbRender();status(T('nbok'));if(document.activeElement)document.activeElement.blur()}
function nbRender(){const L=ld(NBK,[]),rows=[];for(let i=L.length-1;i>=0&&rows.length<30;i--){const e=L[i];rows.push(`<tr><td>${esc(e.t)}</td><td>${esc(e.c)}</td><td>${esc(e.n)}</td><td>${esc(e.q)}</td><td>${esc(e.r)}</td><td>${esc(e.x)}</td><td><button data-d="${i}" aria-label="x">✕</button></td></tr>`)}
$('nbl').innerHTML=rows.length?`<table class="mx nbt"><tr><th>UTC</th><th>${T('nbc')}</th><th>${T('nbn')}</th><th>QTH</th><th>RST</th><th>${T('nbx')}</th><th></th></tr>${rows.join('')}</table>`:''}
function nbCopy(){const L=ld(NBK,[]),q=x=>'"'+String(x||'').replace(/"/g,'""')+'"',t=['UTC,CALL,NAME,QTH,RST,NOTES',...L.map(e=>[e.t,e.c,e.n,e.q,e.r,e.x].map(q).join(','))].join('\n');
let b=$('nbt2');if(!b){b=document.createElement('textarea');b.id='nbt2';b.readOnly=true;b.rows=5;$('nbl').after(b)}b.value=t;b.select();try{navigator.clipboard.writeText(t).catch(()=>{})}catch(e){}}
function nbClr(){['nbc','nbn','nbq','nbr','nbx'].forEach(i=>$(i).value='')}
function noteSaid(t){const p=st.p,s=st.said||(st.said={}),m=t.match(/\b([1-5][1-9][1-9]|[1-5]NN)\b/);if(t.includes(p.c))s.c=p.c;if(t.includes(p.n))s.n=p.n;if(t.includes(p.q))s.q=p.q;if(m&&!s.r)s.r=m[1]}
function nbCheck(){const S=st.said||{},nm=(x,r)=>{x=(x||'').toUpperCase().trim();return r?x.replace(/N/g,'9'):x},L=[],bad=[];let sc=0,n=0;
[['nbc',S.c,0],['nbn',S.n,0],['nbq',S.q,0],['nbr',S.r,1]].forEach(([id,tru,r])=>{if(!tru)return;n++;const lb=T(id),v=nm($(id).value||(st.nbReg&&st.nbReg[id])||'',r),t=nm(tru,r);let m='—',pt=0;
if(v){const d=cdist(v,t);if(d==0){m='✓';pt=1}else if(d<=1.2){m='≈';pt=.5;bad.push(lb)}else{m='✗';bad.push(lb)}recConf(t,v)}else bad.push(lb);
sc+=pt;L.push(F('nbf',{f:lb,m,t:tru,u:v?(v==t?'':F('nbu',{v})):' ('+T('nbe')+')'}))});
if(n)rx.push({acc:100*sc/n,miss:bad});return L}
