// ---- Motor de respuesta v4: comprensión tolerante, memoria del QSO, preguntas y respuestas contextuales (sin IA, 100% offline)
const J=[['INGENIERO','JUBILADO','DOCENTE','MECANICO','ELECTRICISTA','ESTUDIANTE'],['ENGINEER','RETIRED','TEACHER','MECHANIC','ELECTRICIAN','STUDENT']];
const CMT={qth:[['BUEN QTH {x}','CONOZCO {x}','LINDO LUGAR {x}'],['FB QTH {x}','NICE PLACE {x}','I KNOW {x}']],rig:[['BUEN EQUIPO {x}','LINDO {x}'],['FB RIG {x}','NICE {x}']],ant:[['BUENA ANT {x}','{x} ANDA BIEN'],['FB ANT {x}','{x} WORKS FB']],
wx:[['ACA TAMBIEN {x}','ENTENDIDO'],['HR TOO {x}','COPY WX']],job:[['BUENA PROFESION','MUY BIEN {x}'],['FB JOB','NICE {x}']],age:[['BUENA EDAD','MUY BIEN'],['FB AGE','VY NICE']],
hb:[['MUY BUEN HOBBY','ME GUSTA {x}'],['FB HOBBY','I LIKE {x}']],yr:[['MUCHOS ANOS EN LA RADIO','QUE BUENA TRAYECTORIA'],['LONG TIME FB','GREAT HISTORY']]};
const TQ={rig:['SU EQUIPO?','UR RIG?'],ant:['SU ANT?','UR ANT?'],wx:['SU CLIMA?','UR WX?'],job:['SU TRABAJO?','UR JOB?'],age:['SU EDAD?','UR AGE?'],hb:['SU HOBBY?','UR HOBBY?'],yr:['SU LICENCIA DESDE CUANDO?','UR LIC SINCE?'],bd:['COMO ESTA LA BANDA?','HW BAND?']};
const FN=[['R GRACIAS POR EL QSO {who} 73 Y HASTA LUEGO','R MUY BUEN QSO {who} QSL POR LOTW 73','OK {who} GRACIAS POR LA CHARLA 73 Y BUENA SUERTE','R FB {who} QSL VIA BURO OK? 73 HASTA PRONTO'],
['R TNX FER FB QSO {who} 73 ES HPE CU AGN','R TNX FER NICE QSO {who} PSE QSL VIA LOTW 73','OK {who} TNX FER CHAT 73 ES GL','R FB {who} QSL VIA BURO OK? 73 ES CUL']];
const REP=[[/\b(FB|NICE|GOOD|GREAT|BUENO|BUEN|LINDO)\b/,[['GRACIAS IGUAL','MUY AMABLE'],['TNX FB TOO','VY KIND']]],[/\b(QSB|QRM|QRN|NOISE|RUIDO)\b/,[['ENTIENDO RUIDO ACA TAMBIEN','R QRM ACA'],['R QRM HR TOO','COPY NOISE HR']]],[/\b(SRI|SORRY|PERDON)\b/,[['SIN PROBLEMA','NO HAY PROBLEMA'],['NO PRB','NP']]]];
const SRY=[['NO ENTENDI PSE AGN','QRM PSE AGN?','SIN COPIA PSE AGN'],['SRI NIL COPY PSE AGN','QRM PSE AGN?','WOT? PSE AGN SLOWLY']];
const TI=p=>({rig:`${w('myrig')} ${p.r} ${w('pwr')} ${p.w}W`,ant:`ANT ${p.a}`,wx:`${w('wx')} ${WK[p.x][li]} ${p.t}C`,job:`${li?'JOB':'TRABAJO'} ${p.j}`,age:`${li?'AGE':'EDAD'} ${p.g}`,hb:`HOBBY ${p.h}`,yr:`${li?'LIC SINCE':'LICENCIA DESDE'} ${p.y}`,bd:`${li?'BAND':'BANDA'} ${p.bd}`});
const myList=()=>($('mine').value||'').split('\n').map(l=>l.split(/[,;\t]+/).map(x=>x.trim().toUpperCase())).filter(a=>/^[A-Z0-9\/]{3,10}$/.test(a[0])&&/\d/.test(a[0])).map(a=>({l:li,c:a[0],n:a[1]||'OM',q:a[2]||'QTH',r:a[3]||pick(['IC7300','FT991','K3','TS590']),w:'100',a:a[4]||pick(['DIPOLE','VERTICAL','YAGI']),x:pick(['s','c','k','r','h']),t:10+Math.random()*25|0})),
pool=()=>{const m=myList(),b=PR.filter(p=>p.l==li);return $('only').checked&&m.length?m:b.concat(m)};
const HB=[['PESCA','FUTBOL','MUSICA','CICLISMO','COCINA','JARDIN'],['FISHING','SOCCER','MUSIC','CYCLING','COOKING','GARDEN']],BD=[['ABIERTA','CON QSB','CON RUIDO','MUY BUENA'],['OPEN','QSB','NOISY','VY GOOD']];
// el "DE indicativo" no va en todos los mensajes: a veces solo K, KN o BK
const eot=(p=.3)=>Math.random()<p?`${tail()} K`:pick(['K','K','KN','BK']),eos=(p=.4)=>Math.random()<p?`DE ${st.p.c} K`:pick(['K','KN']);
function initSt(){const q=$('qt').value;st.said={};st.hist=[];st.asked={};st.told={};st.pending=null;st.nvc=0;st.turn=0;st.ct2=0;st.bad2=0;st.agn=0;st.askc=0;st.preQ='';
Object.assign(st.p,{j:pick(J[li]),g:30+Math.random()*45|0,h:pick(HB[li]),y:1975+Math.random()*45|0,bd:pick(BD[li])});st.ty=q=='a'?pick(['b','r','r','x']):q;st.pe=pick(['t','n','c','v']);
st.mt=st.ty=='r'?{t:1,n:3,c:5,v:2}[st.pe]:0;if(st.pe=='v')st.slow=1;st.tp=['rig','ant','wx','job','age','hb','yr','bd'].filter(k=>k!='age'||st.pe=='c').sort(()=>Math.random()-.5)}
const cqText=()=>{const c=st.p.c;return pick([`CQ CQ CQ DE ${c} ${c} ${c} K`,`CQ CQ DE ${c} ${c} PSE K`,`CQ DX DE ${c} ${c} K`,`CQ CQ CQ DE ${c} K`])};

// ---------- comprensión del texto que decodificamos (tolera errores de manipulación)
const CANON=['CQ','DE','K','KN','BK','AR','SK','R','TNX','TU','FB','UR','SU','MY','HR','IS','PSE','AGN','RPT','QRZ','QRS','QRQ','QRM','QRN','QSB','QSL','QTH','NAME','NOMBRE','RST','RIG','ANT','WX','CLIMA','PWR','POT','AGE','EDAD','JOB','TRABAJO','HOBBY','HW','OP','OM','ES','NIL','SRI','GM','GA','GE','GL','CUL','73','88','WAT','WOT','QRU','QRT','QSY','CALL','SINCE','DESDE','OK','NO','YES','SI'];
const FILLER=['IS','ES','HR','HERE','AQUI','MY','MI','THE','LA','EL','UR','SU','OF'],STOP=new Set([...CANON,...FILLER,'TNX','GRACIAS','OBRIGADO','FB','HI','NOW','AHORA','HOY','VY','MUY','Y','AND','OK']);
['CUAL','QUE','COMO','DONDE','QUIEN','WHAT','WHERE','HOW','WHICH','WHO','WAT','WOT','CPY','COPY','PLS','PLEASE','FAVOR','FER','FOR','TO','HOLA','HELLO','BUENAS'].forEach(x=>STOP.add(x));
['CHAU','ADIOS','CIAO','BYE','SALUDOS','GL'].forEach(x=>{if(!CL.includes(x))CL.push(x)});
const VK={NAME:'name',NOMBRE:'name',OP:'name',QTH:'qth',RIG:'rig',ANT:'ant',WX:'wx',CLIMA:'wx',JOB:'job',TRABAJO:'job',AGE:'age',EDAD:'age',HOBBY:'hb',SINCE:'yr',DESDE:'yr',SOY:'name',PWR:'pwr',POT:'pwr'};
const QK={RIG:'RIG',ANT:'ANT',WX:'WX',CLIMA:'WX',PWR:'PWR',POT:'PWR',NAME:'NAME',NOMBRE:'NAME',OP:'NAME',QTH:'QTH',AGE:'AGE',EDAD:'AGE',JOB:'JOB',TRABAJO:'JOB',HOBBY:'HOBBY',RST:'RST',CALL:'CALL',QRZ:'CALL',SINCE:'YR',DESDE:'YR'},QN=['K','KN','AR','AGN','RPT','PSE','HW','BK'];
function canon(x,prev){if(CANON.includes(x)||x.length<2||x.length>6||isCall(x)||(/\d/.test(x)&&x!='73'&&x!='88')||VK[prev])return x;
const wild=x.includes('¿');let b=x,bd=wild?.45:.3;for(const c of CANON){if(wild?Math.abs(c.length-x.length)>0:c.length!=x.length)continue;const d=cdist(x,c);if(d<bd){bd=d;b=c}}return b}
const isStCall=x=>st&&st.p&&x.length>=3&&x!==st.p.c&&/\d/.test(st.p.c)&&cdist(x,st.p.c)<=(x.includes('¿')?1:.5);
function nlu(text){const up=text.toUpperCase(),raw=up.match(/[A-Z0-9ÑÇ\/<>¿]+\??/g)||[],known=[$('call').value.trim().toUpperCase(),st&&st.uc,st&&st.p.c].filter(Boolean),w=[],q=[];
raw.forEach(x=>{const qm=x.endsWith('?');if(qm)x=x.slice(0,-1);if(!x)return;let pre=false,post=null;
if(x.length>4&&x.startsWith('DE')&&(isCall(x.slice(2))||known.some(k=>cdist(x.slice(2),k)<=1.2))){pre=true;x=x.slice(2)}
for(const k of known)for(const e of ['KN','K'])if(x==k+e&&!post){post=e;x=k}
if(pre){w.push('DE');q.push(false)}if(isStCall(x))x=st.p.c;w.push(canon(x,w[w.length-1]));q.push(qm&&!post);if(post){w.push(post);q.push(qm)}});
return{w,q,t:w.map((x,i)=>x+(q[i]?'?':'')).join(' '),hasQ:/[?]/.test(up),garb:(up.match(/¿/g)||[]).length/Math.max(1,up.replace(/[^A-Z0-9ÑÇ¿]/g,'').length)}}
function learn(n){const w=n.w,u=st.u,got=[],bad=[],used=new Set();
w.forEach((x,i)=>{const k=VK[x];if(!k||n.q[i])return;let j=i+1;while(w[j]&&FILLER.includes(w[j]))j++;const v=[],max=(k=='qth'||k=='wx')?2:1;let g=false;
while(w[j]&&!STOP.has(w[j])&&v.length<max&&!(v.length&&VK[w[j]])){if(w[j].includes('¿')){g=true;used.add(j);j++;break}v.push(w[j]);used.add(j);j++}
if(g){bad.push(k);return}if(!v.length)return;const val=v.filter((y,a)=>y!=v[a-1]).join(' ');
if(k=='age'&&!/^\d{1,3}$/.test(val))return;if(k=='yr'&&!/^\d{4}$/.test(val))return;if(u[k]!==val){u[k]=val;got.push(k)}});
const ri=w.findIndex(x=>/^([1-5][1-9][1-9]|[1-5]NN)$/.test(x));if(ri>=0){used.add(ri);if(u.rst!==w[ri]){u.rst=w[ri];got.push('rst')}}
return{got,used,bad}}
// Datos sueltos: se reconocen por su forma ("22C", "DIPOLE", "IC705", "2008") y, si no, se toman como respuesta a la última pregunta
const SHAPE=[['wx',/^(\d{1,2}C|SUNNY|RAIN|RAINY|CLOUDY|CLEAR|HOT|COLD|WINDY|FOG|SNOW|SOLEADO|LLUVIA|LLUVIOSO|NUBLADO|DESPEJADO|CALOR|FRIO|VIENTO|NIEBLA)$/],['yr',/^(19|20)\d\d$/],['rig',/^(IC|FT|TS|KX|K|FTDX|YAESU|ICOM|KENWOOD)\d{1,5}[A-Z]{0,2}$/],
['ant',/^(DIPOLE|DIPOLO|YAGI|VERTICAL|LONGWIRE|HEXBEAM|QUAD|BEAM|ENDFED|EFHW|WIRE|ALAMBRE)$/],['job',/^(ENGINEER|RETIRED|TEACHER|MECHANIC|ELECTRICIAN|STUDENT|INGENIERO|JUBILADO|DOCENTE|MECANICO|ELECTRICISTA|ESTUDIANTE|DOCTOR|MEDICO|NURSE|ENFERMERO|ABOGADO|LAWYER|PROGRAMADOR|PROGRAMMER)$/],['pwr',/^\d{1,4}W$/],['hb',/^(FISHING|SOCCER|MUSIC|CYCLING|COOKING|GARDEN|PESCA|FUTBOL|MUSICA|CICLISMO|COCINA|JARDIN|READING|LECTURA|PHOTOGRAPHY|FOTOGRAFIA|HIKING|SENDERISMO|DX|CONTESTING)$/]];
function pendAns(n,L,noLeft){const w=n.w,u=st.u,rest=[];
w.forEach((x,i)=>{if(x.includes('¿')&&!L.used.has(i)&&st.pending&&!VK[x]){L.bad.push(st.pending);L.used.add(i);return}
if(!L.used.has(i)&&!n.q[i]&&!STOP.has(x)&&!VK[x]&&!isCall(x)&&x!=st.p.c&&!/^[1-5]([1-9][1-9]|NN)$/.test(x))rest.push([x,i])});
const sh={},left=[];rest.forEach(([x,i])=>{const s=SHAPE.find(([,r])=>r.test(x));if(s){(sh[s[0]]=sh[s[0]]||[]).push(x);L.used.add(i)}else left.push(x)});
for(const k in sh){const v=sh[k].join(' ');if(u[k]!==v){u[k]=v;L.got.push(k)}if(st.pending==k)st.pending=null}
const k=st.pending;if(!k||noLeft||L.got.includes(k)||L.bad.includes(k))return;
if(w.includes('NIL')||w.includes('NO')){u[k]='NIL';L.got.push(k);st.pending=null;return}
if(!left.length)return;const need={age:/^\d{1,3}$/,yr:/^\d{4}$/,pwr:/^\d{1,4}W?$/}[k]||(['name','qth','rig','ant','wx','job','hb'].includes(k)?/^\D/:null);if(need&&!need.test(left[0]))return;
u[k]=need?left[0]:left.slice(0,(k=='qth'||k=='wx')?2:1).join(' ');L.got.push(k);st.pending=null}
const QP=['AGN','RPT','WAT','WOT','PSE','UR','SU','CUAL','QUE','WHAT','WHICH','WHERE','DONDE'];
function asking(n){const o=[],w=n.w;w.forEach((x,i)=>{const k=QK[x];if(!k)return;let j=i+1,qf=n.q[i];while(w[j]&&FILLER.includes(w[j])){qf=qf||n.q[j];j++}const nx=w[j],pv=w[i-1];
if(qf||!nx||QN.includes(nx)||(QP.includes(pv)&&QN.includes(nx||'K')))o.push(k)});return[...new Set(o)]}

// ---------- qué dice la estación
function pickU(a,k){const u=st.used||(st.used={});let x,i=0;do x=pick(a);while(x==u[k]&&a.length>1&&i++<8);u[k]=x;return x}
const NEWK=['qth','rig','ant','pwr','wx','job','age','hb','yr'];
function cmtFor(k,v){if(k=='pwr'){const m=parseInt(v);return m&&m<=5?(li?`${v} QRP FB`:`${v} QRP MUY BIEN`):m&&m<=20?(li?'NICE QRP':'BUEN QRP'):(li?'FB PWR':'BUENA POTENCIA')}return pick(CMT[k][li]).replace('{x}',v)}
function ackNew(L,t,force){const g=(L&&L.got)||[],nw=NEWK.find(k=>g.includes(k)),cm=REP.find(r=>r[0].test(t||''));return nw&&(force||st.pe!='t'||Math.random()<.6)?cmtFor(nw,st.u[nw]):(cm?pick(cm[1][li]):'')}
function talk(who,b,t,L){const p=st.p,T=TI(p),out=[pickU(['R R','R','OK','R FB','FB'],'ack')+' '+who],got=(L&&L.got)||[];
if(got.includes('rst')&&!st.told.rst){st.told.rst=1;out.push(li?'TNX RPT':'GRACIAS POR EL REPORTE')}
const c1=ackNew(L,t);if(c1)out.push(c1);
let last,cnt=st.pe=='c'?2:1;const shared=[];while(cnt>0&&st.tp.length){const k=st.tp.shift();if(st.told[k])continue;st.told[k]=1;last=k;shared.push(k);out.push(T[k]);cnt--}
let ask=null;if(shared.includes('wx')&&!st.u.wx&&!st.asked.wx)ask='wx';else if(last&&!st.u[last]&&!st.asked[last])ask=last;else if(!st.u.wx&&!st.asked.wx&&Math.random()<.4)ask='wx';
if(ask){st.asked[ask]=1;st.pending=ask;out.push(TQ[ask][li])}else if(!out.some(x=>x.endsWith('?')))out.push(w('how'));
return out.join('. ').replace(/\?\./g,'?')+' '+eot()}
function fin(u,pre){st.s='DONE';const who=st.u.name||'OM';st.last=(pre?pre+'. ':'')+(u?w('fin').replace('{who}',who):`${pick(FN[li]).replace('{who}',who)} ${tail()} <SK>`);return{t:st.last,done:true}}
function afterId(say){const p=st.p;if(st.ty=='x'){st.s='DX';return say(`${st.uc||call()} 5NN`)}st.s='RPT';const n=st.pe=='t'?1:2,rep=x=>Array(n).fill(x).join(' '),qw=Math.random()<.3;if(qw){st.asked.wx=1;st.pending='wx'}
return say(`${tail()} ${greet()} ${w('thx')} ${w('ur')} ${rep(st.rst)} ${w('name')} ${rep(p.n)} QTH ${rep(p.q)} ${qw?TQ.wx[li]:w('how')} ${eot()}`)}
const TOPIC={RIG:'rig',ANT:'ant',WX:'wx',JOB:'job',AGE:'age',HOBBY:'hb',YR:'yr'};
function respond(text){if(st.s=='DONE')return null;const n=nlu(text),tk=n.w,t=n.t,has=x=>tk.includes(x),b={...st.u},p=st.p,wxs=`${WK[p.x][li]} ${p.t}C`,
say=(x,d)=>{if(st.preQ){x=st.preQ+'. '+x;st.preQ=''}st.last=x;st.hist.push(x);return{t:x,done:!!d}};st.turn++;
if(has('QRS'))st.slow=1;if(has('QRQ'))st.slow=0;st.preQ=has('QRS')?'R QRS':has('QRQ')?'R QRQ':'';
const L=learn(n),ask=asking(n);if(has('HW')&&(has('CPY')||has('COPY'))&&!ask.includes('RST'))ask.push('RST');pendAns(n,L,ask.length>0||n.hasQ);
if((st.s=='TALK'||st.s=='RPT')&&tk.some(x=>CL.includes(x))&&!L.got.length)return fin(1);
if((has('AGN')||has('RPT'))&&st.last&&!ask.length&&!L.got.length)return{t:st.last,done:false};
if(st.s=='RPT'||st.s=='TALK'){if(L.bad.length&&st.bad2<2){st.bad2++;const nm={name:li?'NAME':'NOMBRE',qth:'QTH',rig:'RIG',ant:'ANT',wx:li?'WX':'CLIMA',job:li?'JOB':'TRABAJO',age:li?'AGE':'EDAD',hb:'HOBBY',pwr:'PWR',yr:li?'SINCE':'DESDE'};
return say(`${li?'PSE AGN':'POR FAVOR REPITA'} ${[...new Set(L.bad)].map(k=>nm[k]||k).join(li?' ES ':' Y ')}? ${eot()}`)}
if(n.garb>.3&&!L.got.length&&!ask.length&&st.agn<2){st.agn++;return say(`${pick(SRY[li])} ${eot()}`)}}
if(L.got.length||ask.length)st.agn=0;
if(st.pe=='v'&&md()=='r'&&(st.s=='RPT'||st.s=='TALK')&&st.nvc<2&&Math.random()<.12){st.nvc++;return say(`PSE AGN? QRS PSE ${eot()}`)}
if(st.s=='WCQ'){if(!(has('CQ')||has('QRZ')))return null;const i=tk.indexOf('DE'),c=i>=0?tk[i+1]:null,ex=$('call').value.trim().toUpperCase();
if(ex)st.uc=ex;else if(c&&isCall(c)){st.uc=c;$('call').value=c}st.s='CALLED';st.dl=Math.random()*2500;if(md()=='r'&&num('pile')>0)st.pq=1;
return say(pick([`${p.c} ${p.c}`,`${p.c} ${p.c} K`,`${st.uc||call()} DE ${p.c} ${p.c} K`]))}
if(st.s=='CALLED'){if(!tk.some(x=>x.length>=3&&cdist(x,p.c)<=1.2)){st.ct2++;return say(st.ct2>2?`QRZ? ${eos()}`:`${p.c} ${p.c} ${eos(.3)}`)}return afterId(say)}
if(st.s=='CQ'){const hr=heardCall(tk);if(hr.say)return say(hr.say);
if(md()=='r'&&num('pile')>0&&st.pt<(num('pile')>3?2:1)){st.pt++;st.pq=1;return say(`${pick(CALLS)} 5NN`)}
return afterId(say)}
if(st.s=='DX'){st.s='DONE';return say(`${pick(['TU 73','R TU','TU 73 QRZ?'])} DE ${p.c}`,1)}
if(ask.length){const A={RIG:`RIG ${p.r}`,ANT:`ANT ${p.a}`,WX:`${w('wx')} ${wxs}`,PWR:`${w('pwr')} ${p.w}W`,NAME:`${w('name')} ${p.n} ${p.n}`,QTH:`QTH ${p.q} ${p.q}`,JOB:`${li?'JOB':'TRABAJO'} ${p.j}`,AGE:`${li?'AGE':'EDAD'} ${p.g}`,HOBBY:`HOBBY ${p.h}`,YR:`${li?'LIC SINCE':'LICENCIA DESDE'} ${p.y}`,RST:`${w('ur')} ${st.rst} ${st.rst}`,CALL:`${p.c} ${p.c}`};
ask.forEach(k=>{if(TOPIC[k])st.told[TOPIC[k]]=1});const out=['R'];
const nwk=['qth','rig','ant','wx','job','age','hb','yr'].find(k=>L.got.includes(k));if(nwk&&Math.random()<.5)out.push(pick(CMT[nwk][li]).replace('{x}',st.u[nwk]));
out.push(ask.map(k=>A[k]).join(' '));
const back=ask.map(k=>TOPIC[k]).find(k=>k&&!st.u[k]&&!st.asked[k]&&Math.random()<.5);if(back){st.asked[back]=1;st.pending=back;out.push(TQ[back][li])}
return say(`${out.join('. ').replace(/\?\./g,'?')} ${eot()}`)}
if(n.hasQ&&!/\bHW\b/.test(t)&&!L.got.length&&!has('AGN'))return say(`${pick(SRY[li])} ${eot()}`);
if(st.s=='RPT'){const ms=[];if(!st.u.name)ms.push(li?'NAME':'NOMBRE');if(!st.u.qth)ms.push('QTH');
if(ms.length&&st.askc<2){st.askc++;st.asked.name=1;st.pending=!st.u.name?'name':'qth';return say(`R R ${st.askc>1?(li?'PSE AGN':'OTRA VEZ'):(li?'PSE':'POR FAVOR')} ${li?'UR':'SU'} ${ms.join(li?' ES ':' Y ')}? ${eot()}`)}
if(!st.mt)return fin(0,ackNew(L,t,1));st.s='TALK';st.ct=0;return say(talk(st.u.name||'OM',b,t,L))}
st.ct++;if(st.ct>st.mt||!st.tp.length)return fin(0,ackNew(L,t,1));return say(talk(st.u.name||'OM',b,t,L))}
