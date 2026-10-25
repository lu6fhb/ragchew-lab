// ---- Flujo del QSO
let busy=1,tx='',sil=null,rx=[],lastSt='',revealed=1,sstyle='p',fm=0,ft0=0,ft1=0,fbuf='',sess=0,paused=0,pend=null,pwas=0,curSt=null;
const status=t=>$('status').textContent=t;
function line(cls,who,t){const p=document.createElement('p');p.className=cls;const b=document.createElement('b'),sp=document.createElement('span');b.textContent=who;sp.textContent=t;p.append(b,sp);$('tr').appendChild(p);$('tr').scrollTop=1e6;return p}
function lineH(cls,who,h){const p=line(cls,who,'');p.lastChild.innerHTML=h;return p}
function newQso(){setM('qso');nbClr();fm=0;paused=0;pend=null;curSt=null;sess=1;$('bev').hidden=true;$('bpause').textContent=T('pau');stopPlay();clearTimeout(sil);K.en=0;K.lg=[];K.wg=[];K.bad=0;K.dt=[];K.dh=[];$('shf').value=0;$('shv').textContent='0 Hz';newSt();initSt();rx=[];$('tr').innerHTML='';$('fb').hidden=true;$('live').textContent='';
const v=$('sm').value;sstyle=v=='r'?pick(['p','i','b','s']):v;audio();station(cqText(),false)}
function station(text,done,re){if(!sess)return;if(paused){pend={t:text,d:done,re};return}busy=1;K.en=0;lastSt=text;
if(!re){noteSaid(text.toUpperCase());if($('pm').value=='1'){revealed=0;hid.push([line('mu',T('ws'),T('lis')),text])}else{revealed=1;line('st',T('ws'),text)}}
status(T('rxs'));$('lrx').classList.add('on');curSt={t:text,d:done};
(md()=='r'?playR:play)(text,num('swpm')*(st.slow?.75:1),()=>{curSt=null;$('lrx').classList.remove('on');if(done){busy=1;status(T('over'));setTimeout(finish,500)}else{tx='';newTurn();busy=0;status(T('turn'));if(st.pq){st.pq=0;pileBG(num('pile'))}}})}
function onChar(c){if(busy)return;if(fm){if(!ft0)ft0=performance.now();ft1=performance.now()}tx+=c;$('live').textContent=tx;clearTimeout(sil);sil=setTimeout(endTurn,fm?4000:5000)}
function onWord(){if(busy||!tx)return;tx+=' ';const x=tx.trim().split(/\s+/);if(!fm&&END.includes(x[x.length-1]))endTurn()}
function endTurn(){clearTimeout(sil);if(fm){commitFree();return}if(busy)return;const t=tx.trim();if(!t)return;busy=1;K.en=0;tx='';$('live').textContent='';
line('me',T('wy'),t);const r=md()=='r'?realResp(t):respond(t);if(r){const d=1200+(st.dl||0);st.dl=0;setTimeout(()=>station(r.t,r.done),d)}else if(st.s!='DONE'){tx='';newTurn();busy=0;status(T(st.s=='WCQ'?'nores':'turn'))}}
function cmp(a,b){a=a.toUpperCase().split(/\s+/).join(' ').trim();b=b.toUpperCase().split(/\s+/).join(' ').trim();const n=a.length,m=b.length,D=Array.from({length:n+1},()=>new Array(m+1).fill(0));
for(let i=1;i<=n;i++)for(let j=1;j<=m;j++)D[i][j]=a[i-1]==b[j-1]?D[i-1][j-1]+1:Math.max(D[i-1][j],D[i][j-1]);
const bw=b.split(' ');return{acc:100*D[n][m]/Math.max(n,1),miss:a.split(' ').filter(x=>!bw.includes(x))}}
const cd=r=>r.self?T('self'):r.miss.length?T('cm')+' '+r.miss.slice(0,6).join(' '):T('cpf');
function reveal(){hid.forEach(([p,t])=>{p.className='st';p.lastChild.textContent=t});hid=[]}
const mean=a=>a.reduce((s,x)=>s+x,0)/a.length,sd=a=>Math.sqrt(mean(a.map(x=>(x-mean(a))**2)));
function finish(){if(tm){evalTrainer();return}if(fm){evalFree();return}stopPlay();clearTimeout(sil);K.en=0;busy=1;sess=0;paused=0;pend=null;reveal();if(!st)return;
if(!st.rec){st.rec=1;st.nbL=nbCheck();recSession()}
const L=[T('fh'),'',T('ftx'),F('fsp',{k:$('km').selectedOptions[0].textContent,w:num('wpm')})];
if(K.lg.length){const m=mean(K.lg),t=K.lg.filter(x=>x<2.5).length/K.lg.length*100,l=K.lg.filter(x=>x>4.5).length/K.lg.length*100;
L.push(F('fl',{m:m.toFixed(1),s:sd(K.lg).toFixed(1)}));if(t>20)L.push(F('ft',{p:t.toFixed(0)}));if(l>20)L.push(F('fo',{p:l.toFixed(0)}))}else L.push(T('fnl'));
if(K.wg.length)L.push(F('fw',{m:mean(K.wg).toFixed(1)}));L.push(F('fb',{n:K.bad}),'',T('nbh'));
if(st.nbL&&st.nbL.length)L.push(...st.nbL,F('fav',{n:mean(rx.map(r=>r.acc)).toFixed(0)}));else L.push(T('fnr'));
const u=st.u,got=['rst','name','qth'].filter(k=>u[k]),mi=['rst','name','qth'].filter(k=>!u[k]);
L.push('',T('fcv'),F('fgot',{l:got.join(', ')||T('fno')}));if(mi.length)L.push(F('fmis',{l:mi.join(', ')}));L.push(F('fst',{l:T('s'+sstyle)}),'',T('fnx'));
if(K.bad)L.push(T('fn1'));if(K.lg.length&&mean(K.lg)<2.5)L.push(T('fn2'));if(rx.length&&mean(rx.map(r=>r.acc))<90)L.push(T('fn3'));L.push(T('fn4'));
$('fb').textContent=L.join('\n');$('fb').hidden=false;$('fb').scrollIntoView({behavior:'smooth'})}
