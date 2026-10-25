// ---- Motor de respuesta v3: tipos de QSO, personalidades, temas, preguntas del usuario y CQ propio (sin IA, 100% offline)
const J=[['INGENIERO','JUBILADO','DOCENTE','MECANICO','ELECTRICISTA','ESTUDIANTE'],['ENGINEER','RETIRED','TEACHER','MECHANIC','ELECTRICIAN','STUDENT']];
const CMT={qth:[['BUEN QTH {x}','CONOZCO {x}','LINDO LUGAR {x}'],['FB QTH {x}','NICE PLACE {x}','I KNOW {x}']],rig:[['BUEN EQUIPO {x}','LINDO {x}'],['FB RIG {x}','NICE {x}']],ant:[['BUENA ANT {x}','{x} ANDA BIEN'],['FB ANT {x}','{x} WORKS FB']],
wx:[['ACA TAMBIEN {x}','ENTENDIDO'],['HR TOO {x}','COPY WX']],job:[['BUENA PROFESION','MUY BIEN {x}'],['FB JOB','NICE {x}']],age:[['BUENA EDAD','MUY BIEN'],['FB AGE','VY NICE']],
hb:[['MUY BUEN HOBBY','ME GUSTA {x}'],['FB HOBBY','I LIKE {x}']],yr:[['MUCHOS ANOS EN LA RADIO','FB'],['LONG TIME FB','VY FB']]};
const TQ={rig:['SU EQUIPO?','UR RIG?'],ant:['SU ANT?','UR ANT?'],wx:['SU CLIMA?','UR WX?'],job:['SU TRABAJO?','UR JOB?'],age:['SU EDAD?','UR AGE?'],hb:['SU HOBBY?','UR HOBBY?'],yr:['DESDE CUANDO TIENE LICENCIA?','LIC SINCE?'],bd:['COMO ESTA LA BANDA?','HW BAND?']};
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
function initSt(){const q=$('qt').value;st.said={};Object.assign(st.p,{j:pick(J[li]),g:30+Math.random()*45|0,h:pick(HB[li]),y:1975+Math.random()*45|0,bd:pick(BD[li])});st.ty=q=='a'?pick(['b','r','r','x']):q;st.pe=pick(['t','n','c','v']);
st.mt=st.ty=='r'?{t:1,n:3,c:5,v:2}[st.pe]:0;if(st.pe=='v')st.slow=1;st.tp=['rig','ant','wx','job','age','hb','yr','bd'].sort(()=>Math.random()-.5)}
const cqText=()=>{const c=st.p.c;return pick([`CQ CQ CQ DE ${c} ${c} ${c} K`,`CQ CQ DE ${c} ${c} PSE K`,`CQ DX DE ${c} ${c} K`,`CQ CQ CQ DE ${c} K`])};
function learn(t){let m;const g=(re,k)=>{if(m=t.match(re))st.u[k]=m[1]};g(/\b(?:NAME|NOMBRE)\s+(?:IS\s+)?([A-ZÑÇ]+)/,'name');g(/\bQTH\s+([A-ZÑÇ]+)/,'qth');g(/\b([1-5][1-9][1-9]|[1-5]NN)\b/,'rst');
g(/\bRIG\s+(?:IS\s+)?([A-Z0-9]+)/,'rig');g(/\bANT\s+(?:IS\s+)?([A-Z0-9]+)/,'ant');g(/\b(?:WX|CLIMA)\s+([A-Z]+)/,'wx');g(/\b(?:JOB|TRABAJO)\s+([A-ZÑ]+)/,'job');g(/\b(?:AGE|EDAD)\s+(\d+)/,'age');g(/\bHOBBY\s+([A-Z]+)/,'hb');g(/\b(?:SINCE|DESDE)\s+(\d{4})/,'yr')}
// ¿el usuario está preguntando? (QTH? / QTH K / PSE QTH / QTH AGN ...)
const KW={RIG:'RIG',ANT:'ANT',WX:'WX',CLIMA:'WX',PWR:'PWR',POT:'PWR',NAME:'NAME',NOMBRE:'NAME',QTH:'QTH',AGE:'AGE',EDAD:'AGE',JOB:'JOB',TRABAJO:'JOB',HOBBY:'HOBBY',RST:'RST',CALL:'CALL',QRZ:'CALL'},QN=['K','KN','AR','AGN','RPT','PSE','HW','BK'];
function asking(t,tk){const o=[];tk.forEach((x,i)=>{const k=KW[x];if(!k)return;const nx=tk[i+1],pv=tk[i-1];
if(new RegExp('\\b'+x+'\\s*[?¿]').test(t)||!nx||QN.includes(nx)||(['AGN','RPT','WAT','WOT','PSE','UR','SU'].includes(pv)&&QN.includes(nx||'K')))o.push(k)});return[...new Set(o)]}
function talk(who,b,t){const p=st.p,out=[pick(['R R','R','OK','R FB'])+' '+who],cm=REP.find(r=>r[0].test(t)),nw=['qth','rig','ant','wx','job','age','hb','yr'].find(k=>st.u[k]&&!b[k]);
if(cm)out.push(pick(cm[1][li]));else if(nw&&(st.pe!='t'||Math.random()<.5))out.push(pick(CMT[nw][li]).replace('{x}',st.u[nw]));
const T=TI(p);let last;for(let i=0;i<(st.pe=='c'?2:1)&&st.tp.length;i++){last=st.tp.shift();out.push(T[last])}
if(last&&!st.u[last])out.push(TQ[last][li]);
if(!st.u.wx&&!st.wxq&&last!='wx'&&Math.random()<.4){st.wxq=1;out.push(TQ.wx[li])}
else if(!out.some(x=>x.endsWith('?')))out.push(w('how'));
return out.join('. ').replace(/\?\./g,'?')+' '+eot()}
function fin(u){st.s='DONE';const who=st.u.name||'OM';st.last=u?w('fin').replace('{who}',who):`${pick(FN[li]).replace('{who}',who)} ${tail()} <SK>`;return{t:st.last,done:true}}
function afterId(say){const p=st.p;if(st.ty=='x'){st.s='DX';return say(`${st.uc||call()} 5NN`)}st.s='RPT';const n=st.pe=='t'?1:2,rep=x=>Array(n).fill(x).join(' ');
return say(`${tail()} ${greet()} ${w('thx')} ${w('ur')} ${rep(st.rst)} ${w('name')} ${rep(p.n)} QTH ${rep(p.q)}${Math.random()<.3?' '+TQ.wx[li]:''} ${w('how')} ${eot()}`)}
function respond(text){if(st.s=='DONE')return null;const t=text.toUpperCase(),tk=t.match(/[A-Z0-9ÑÇ\/<>]+/g)||[],has=x=>tk.includes(x);
if(has('QRS'))st.slow=1;const b={...st.u};learn(t);const p=st.p,wxs=`${WK[p.x][li]} ${p.t}C`,say=(x,d)=>{st.last=x;return{t:x,done:!!d}},ask=asking(t,tk);
if(st.s=='TALK'&&tk.some(x=>CL.includes(x)))return fin(1);
if((has('AGN')||has('RPT'))&&st.last&&!ask.length)return{t:st.last,done:false};
if(st.pe=='v'&&(st.s=='RPT'||st.s=='TALK')&&Math.random()<.25)return say(`PSE AGN? QRS PSE ${eot()}`);
if(st.s=='WCQ'){if(!(has('CQ')||has('QRZ')))return null;const i=tk.indexOf('DE'),c=i>=0?tk[i+1]:null,ex=$('call').value.trim().toUpperCase();
if(ex)st.uc=ex;else if(c&&isCall(c)){st.uc=c;$('call').value=c}st.s='CALLED';st.dl=Math.random()*2500;if(md()=='r'&&num('pile')>0)st.pq=1;
return say(pick([`${p.c} ${p.c}`,`${p.c} ${p.c} K`,`${st.uc||call()} DE ${p.c} ${p.c} K`]))}
if(st.s=='CALLED'){if(!tk.some(x=>x.length>=3&&cdist(x,p.c)<=1.2))return say(`${p.c} ${p.c} ${eos(.3)}`);return afterId(say)}
if(st.s=='CQ'){const hr=heardCall(tk);if(hr.say)return say(hr.say);
if(md()=='r'&&num('pile')>0&&st.pt<(num('pile')>3?2:1)){st.pt++;st.pq=1;return say(`${pick(CALLS)} 5NN`)}
return afterId(say)}
if(st.s=='DX'){st.s='DONE';return say(`${pick(['TU 73','R TU','TU 73 QRZ?'])} DE ${p.c}`,1)}
if(ask.length){const A={RIG:`RIG ${p.r}`,ANT:`ANT ${p.a}`,WX:`${w('wx')} ${wxs}`,PWR:`${w('pwr')} ${p.w}W`,NAME:`${w('name')} ${p.n} ${p.n}`,QTH:`QTH ${p.q} ${p.q}`,JOB:`${li?'JOB':'TRABAJO'} ${p.j}`,AGE:`${li?'AGE':'EDAD'} ${p.g}`,HOBBY:`HOBBY ${p.h}`,RST:`${w('ur')} ${st.rst} ${st.rst}`,CALL:`${p.c} ${p.c}`};
return say(`R ${ask.map(k=>A[k]).join(' ')} ${eot()}`)}
if(/[?¿]/.test(t)&&!/\bHW\s*[?¿]/.test(t)&&Object.keys(st.u).every(k=>st.u[k]==b[k]))return say(`${pick(SRY[li])} ${eot()}`);
if(st.s=='RPT'){if(!st.u.name&&!st.an){st.an=1;return say(`R R ${w('pse')} ${eot()}`)}if(!st.mt)return fin(0);st.s='TALK';st.ct=0;return say(talk(st.u.name||'OM',b,t))}
st.ct++;if(st.ct>st.mt||!st.tp.length)return fin(0);return say(talk(st.u.name||'OM',b,t))}
