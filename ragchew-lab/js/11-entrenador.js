// ---- Entrenador de copia
let tm=0,tt='',trn_=0,trp=0,trt=0,tacc=[],tpz=0,tplay=0,cmpd=1,tsty='p',tcf={},hid=[];
const WD=[['HOLA','GRACIAS','NOMBRE','CASA','RADIO','ANTENA','CLIMA','LLUVIA','SOL','VIENTO','BUENO','TARDE','NOCHE','FAMILIA','TRABAJO','CIUDAD','BANDA','SENAL','ONDA','TIERRA','CIELO','MESA','LLAVE','TIEMPO','AMIGO','CAMINO','ARBOL','AGUA','FUEGO','MUSICA'],['HELLO','THANKS','NAME','HOUSE','RADIO','ANTENNA','WEATHER','RAIN','SUN','WIND','GOOD','EVENING','NIGHT','FAMILY','WORK','CITY','BAND','SIGNAL','WAVE','EARTH','SKY','TABLE','KEY','TIME','FRIEND','ROAD','TREE','WATER','FIRE','MUSIC']];
const QA=['QTH','QSL','QRM','QRN','QSB','QRZ','QRS','QRQ','QRT','QSY','QRP','QRO','AGN','ANT','BK','CUL','DX','ES','FB','GA','GE','GM','HW','HR','NR','OM','OP','PSE','RIG','RPT','SK','SRI','TNX','TU','UR','VY','WX','XYL','YL','73','88','R','K','KN','AR'];
const PF=['LU','LW','LU','CX','CE','PY','EA','W','K','N','G','DL','JA','VK','ZS','F','I','OK','SP','HB','ON','PA','OH','SM','LA','VE','XE','HK','CO','YV','OA','CP','ZP','TI','HP'];
const rn=n=>Math.floor(Math.random()*n),rl=()=>String.fromCharCode(65+rn(26)),gCall=()=>pick(PF)+(1+rn(9))+Array.from({length:1+rn(3)},rl).join('');
function genQso(){const keep=st;let t;try{newSt();initSt();st.uc=$('call').value.trim().toUpperCase()||'LU6FHB';t=Math.random()<.5?afterId(x=>({t:x})).t:talk(st.u.name||'OM',{},'')}finally{st=keep}return t}
function genText(kind,n){const g={c:gCall,w:()=>pick(WD[li]),l:()=>Array.from({length:5},rl).join(''),n:()=>Array.from({length:3+rn(3)},()=>rn(10)).join(''),a:()=>pick(QA)};
if(kind=='q')return genQso();if(kind=='x'){const ks=['c','w','l','n','a'];return Array.from({length:n},()=>g[pick(ks)]()).join(' ')}return Array.from({length:n},g[kind]).join(' ')}
function setM(m){tm=m=='tr';fm=m=='free';document.body.dataset.m=m;$('tz').hidden=m!='tr';$('nb').hidden=m!='qso';$('bev').hidden=m!='free'}
const tw=()=>{$('tw').textContent=num('swpm')},tinfo=()=>{$('tinfo').textContent=F('tinf',{r:trn_,p:trp,a:tacc.length?mean(tacc).toFixed(0):'-'})};
function startTrainer(){stopPlay();clearTimeout(sil);K.en=0;busy=1;sess=0;paused=0;pend=null;curSt=null;st=null;setM('tr');rx=[];tacc=[];tcf={};trn_=0;trp=0;trt=0;tt='';cmpd=1;tplay=0;K.lg=[];K.wg=[];K.bad=0;K.dt=[];K.dh=[];
$('tr').innerHTML='';$('fb').hidden=true;$('tcopy').value='';tw();tinfo();audio();status(T('tstart'))}
function tPlay(){stopPlay();audio();tpz=0;$('tpau').textContent=T('pau');$('lrx').classList.add('on');tplay=1;sstyle=tsty;(md()=='r'?playR:play)(tt,num('swpm'),()=>{tplay=0;$('lrx').classList.remove('on')})}
function tNext(){stopPlay();const v=$('sm').value;tsty=v=='r'?pick(['p','i','b','s']):v;tt=genText($('tc').value,Math.max(1,Math.min(20,num('tlen')||6)));trn_++;trp=0;cmpd=0;$('tcopy').value='';$('tcopy').focus();tinfo();tPlay()}
function tRep(){if(!tt)return;trp++;trt++;tinfo();tPlay()}
function tPause(){if(!tt)return;if(!tpz){tpz=1;tplay=0;stopPlay();$('lrx').classList.remove('on');$('tpau').textContent=T('res')}else tPlay()}
function tSpeed(d){$('swpm').value=Math.max(5,Math.min(40,num('swpm')+d));tw();if(tt&&tplay)tPlay()}
function tCmp(){if(!tt||cmpd)return;cmpd=1;stopPlay();$('lrx').classList.remove('on');tplay=0;const nz=x=>x.toUpperCase().replace(/\s+/g,' ').trim(),a=nz(tt),b=nz($('tcopy').value),ops=align(a,b),
q=c=>({'&':'&amp;','<':'&lt;','>':'&gt;',' ':'&nbsp;'}[c]||c);let e='',g='',ok=0;
ops.forEach(([x,y])=>{if(x&&y&&x==y){ok++;e+=`<span class="ok">${q(x)}</span>`;g+=`<span class="ok">${q(y)}</span>`}else if(x&&y){e+=`<span class="bad">${q(x)}</span>`;g+=`<span class="bad">${q(y)}</span>`}else if(x){e+=`<span class="bad">${q(x)}</span>`;g+='<span class="gap">·</span>'}else{e+='<span class="gap">·</span>';g+=`<span class="bad">${q(y)}</span>`}
if(x&&x!=y){const k=x+'>'+(y||'·');tcf[k]=(tcf[k]||0)+1}});
const acc=100*ok/Math.max(a.length,1);tacc.push(acc);rx.push({acc,miss:[]});recConf(a,b);lineH('st',T('ws'),e);lineH('cp',T('wc'),g+` <small>${acc.toFixed(0)}%</small>`);tinfo();status(acc>=95?'✓ '+acc.toFixed(0)+'%':acc.toFixed(0)+'%')}
function evalTrainer(){stopPlay();$('lrx').classList.remove('on');const L=[T('teh'),''];
if(!tacc.length)L.push(T('tnone'));else{const cf=Object.entries(tcf).sort((x,y)=>y[1]-x[1]).slice(0,6).map(([k,v])=>k.replace('>',' → ')+' ×'+v).join(' · ');
L.push(F('trd',{r:tacc.length,p:trt,a:mean(tacc).toFixed(0)}));if(cf)L.push(F('tcf',{l:cf}));recSession();rx=[];tacc=[];tcf={};trt=0;trn_=0;tinfo()}
$('fb').textContent=L.join('\n');$('fb').hidden=false;$('fb').scrollIntoView({behavior:'smooth'})}
