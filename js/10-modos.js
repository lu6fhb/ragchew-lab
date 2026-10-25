// ---- Pausa, parada, CQ propio y práctica libre
function pauseQso(){if(tm){tPause();return}if(!sess)return;
if(!paused){paused=1;pwas=!busy;clearTimeout(sil);K.en=0;K.p={'.':0,'-':0};K.mem={'.':0,'-':0};if(K.mt)manual(0);if(curSt){pend={t:curSt.t,d:curSt.d,re:1};curSt=null}stopPlay();status(T('paused'));$('bpause').textContent=T('res')}
else{paused=0;$('bpause').textContent=T('pau');if(pend){const q=pend;pend=null;station(q.t,q.d,q.re)}else if(pwas){K.en=1;busy=0;status(T('turn'))}}}
function stopQso(){if(tm){stopPlay();$('lrx').classList.remove('on');tplay=0;return}stopPlay();clearTimeout(sil);K.en=0;K.p={'.':0,'-':0};K.mem={'.':0,'-':0};if(K.mt)manual(0);busy=1;paused=0;pend=null;curSt=null;fm=0;tx='';$('live').textContent='';$('bpause').textContent=T('pau');$('bev').hidden=true;
if(sess)line('mu','·',T('stopped'));sess=0;status(T('stopped'))}
function newCq(){setM('qso');nbClr();stopPlay();clearTimeout(sil);K.lg=[];K.wg=[];K.bad=0;K.dt=[];K.dh=[];$('shf').value=0;$('shv').textContent='0 Hz';newSt();initSt();st.s='WCQ';rx=[];fm=0;paused=0;pend=null;curSt=null;sess=1;
$('tr').innerHTML='';$('fb').hidden=true;$('live').textContent='';$('bev').hidden=true;const v=$('sm').value;sstyle=v=='r'?pick(['p','i','b','s']):v;audio();tx='';newTurn();busy=0;status(T('cqon'))}
function startFree(){setM('free');stopPlay();clearTimeout(sil);K.lg=[];K.wg=[];K.bad=0;K.dt=[];K.dh=[];st=null;fm=1;paused=0;pend=null;curSt=null;sess=1;rx=[];
$('tr').innerHTML='';$('fb').hidden=true;$('live').textContent='';tx='';fbuf='';ft0=0;ft1=0;audio();newTurn();busy=0;$('bev').hidden=false;status(T('freeon'))}
function commitFree(){const t=tx.trim();tx='';$('live').textContent='';if(t){line('me',T('wy'),t);fbuf+=t+' '}}
function evalFree(){commitFree();const el=ft0?(ft1-ft0)/1000:0,n=fbuf.trim().length,m=mode(),dt=K.dt.length?mean(K.dt):0,dh=K.dh.length?mean(K.dh):0,lg=K.lg.filter(x=>x<=6),wg=K.wg.filter(x=>x<=15);
const ew=(m=='s'||m=='g')&&(dt||dh)?(dt?1200/dt:3600/dh):num('wpm');
const L=[T('eh'),'',F('etx',{t:fbuf.trim()||'-'}),F('efs',{n,s:el.toFixed(0),w:el>3?(n/5/(el/60)).toFixed(1):'-'}),F('eel',{w:ew.toFixed(1)})];
if(lg.length){const mn=mean(lg),tt=lg.filter(x=>x<2.5).length/lg.length*100,ll=lg.filter(x=>x>4.5).length/lg.length*100;L.push(F('fl',{m:mn.toFixed(1),s:sd(lg).toFixed(1)}));if(tt>20)L.push(F('ft',{p:tt.toFixed(0)}));if(ll>20)L.push(F('fo',{p:ll.toFixed(0)}))}else L.push(T('fnl'));
if(wg.length)L.push(F('fw',{m:mean(wg).toFixed(1)}));
if(K.dt.length>2&&K.dh.length>2)L.push(F('erd',{r:(dh/dt).toFixed(1),c:(sd(K.dh)/dh*100).toFixed(0)}));
L.push(F('fb',{n:K.bad}),'',T('fnx'));if(K.bad)L.push(T('fn1'));if(lg.length&&mean(lg)<2.5)L.push(T('fn2'));L.push(T('fn4'));
$('fb').textContent=L.join('\n');$('fb').hidden=false;$('fb').scrollIntoView({behavior:'smooth'})}
