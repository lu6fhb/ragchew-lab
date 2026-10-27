// ---- Idioma y botones
function padL(){const s=mode()=='s',d=shk(KEYS.d),a=shk(KEYS.a),h=s?`${d} · ${a} · Space`:null;$('pd').innerHTML=(s?T('pk'):T('pd'))+'<small>'+(h||d)+'</small>';$('pa').innerHTML=(s?T('pk'):T('pa'))+'<small>'+(h||a)+'</small>'}
function applyLang(){li=Math.max(0,['es','en'].indexOf($('lang').value));document.documentElement.lang=$('lang').value;
document.querySelectorAll('[data-i]').forEach(e=>e.innerHTML=T(e.dataset.i));$('tcopy').placeholder=T('tph');$('call').placeholder=T('call');$('tr').dataset.e=T('emp');padL();kl();modeUI();nbRender();status(T('ready'))}
$('lang').onchange=applyLang;
$('btr').onclick=startTrainer;$('tnext').onclick=tNext;$('trep').onclick=tRep;$('tpau').onclick=tPause;$('tcmp').onclick=()=>cmpd?tNext():tCmp();$('tdn').onclick=()=>tSpeed(-1);$('tup').onclick=()=>tSpeed(1);
$('tcopy').addEventListener('keydown',e=>{if(e.key=='Enter'){e.preventDefault();cmpd?tNext():tCmp()}});
nbF.forEach(i=>$(i).addEventListener('keydown',e=>{if(e.key=='Enter'){e.preventDefault();nbAdd()}}));$('nbadd').onclick=nbAdd;$('nbcsv').onclick=nbCopy;$('nbl').onclick=e=>{const b=e.target.closest('button[data-d]');if(b){const L=ld(NBK,[]);L.splice(+b.dataset.d,1);sv(NBK,L);nbRender()}};nbRender();
$('bset').onclick=()=>$('dlg').showModal();$('dclose').onclick=()=>$('dlg').close();$('dlg').addEventListener('click',e=>{if(e.target==$('dlg'))$('dlg').close()});
$('kd').onclick=()=>{capK='d';kl()};$('ka').onclick=()=>{capK='a';kl()};$('kre').onclick=()=>{KEYS={d:'z',a:'x'};try{localStorage.removeItem('cwb_keys')}catch(e){}capK=null;kl();padL()};
try{if(!localStorage.getItem('cwb_seen')){localStorage.setItem('cwb_seen','1');setTimeout(()=>$('dlg').showModal(),500)}}catch(e){}$('bcq').onclick=newCq;$('bfree').onclick=startFree;$('bev').onclick=evalFree;$('bpause').onclick=pauseQso;$('bstop').onclick=stopQso;
const mp=()=>$('mp').checked,mb={0:'.',2:'-'},mcap=e=>mp()&&!e.target.closest('button:not(#pd):not(#pa),input,select,textarea,summary,a,label');
function autoMp(e){if(!mp()&&e.button==2&&!(e.target.closest&&e.target.closest('input,select,textarea'))){$('mp').checked=true;$('mp').onchange();status(T('mpon'))}}
addEventListener('mousedown',e=>{autoMp(e);if(mcap(e)&&e.button in mb){e.preventDefault();e.stopPropagation();kp(mb[e.button],1)}},true);
addEventListener('mouseup',e=>{if(mp()&&e.button in mb){e.preventDefault();kp(mb[e.button],0)}},true);
addEventListener('contextmenu',e=>{if(mcap(e))e.preventDefault()},true);
try{const c=JSON.parse(localStorage.getItem('cwb_chk')||'{}');$('mp').checked=!!c.mp;$('only').checked=!!c.only}catch(e){}
[$('mp'),$('only')].forEach(x=>x.onchange=()=>{try{localStorage.setItem('cwb_chk',JSON.stringify({mp:$('mp').checked,only:$('only').checked}))}catch(e){}if(x.id=='mp'&&x.checked)status(T('mph'))});
function expSum(){const H=ld(HK,[]),C=ld(CK,{c:{},s:{}}),a=H.filter(h=>h.acc!=null).map(h=>h.acc),g=H.filter(h=>h.lg!=null).map(h=>h.lg),pr=[],L=li?['Callsign','Sessions','Avg copy accuracy','Avg letter spacing (ideal 3)','Confusions']:['Indicativo','Sesiones','Precisión de copia media','Espacio entre letras medio (ideal 3)','Confusiones'];
for(const x in C.c)for(const y in C.c[x])pr.push([x,y,C.c[x][y]]);pr.sort((p,q)=>q[2]-p[2]);
const t=['RagChew+ Lab',`${L[0]}: ${$('call').value||'-'}`,`${L[1]}: ${H.length}`,`${L[2]}: ${a.length?mean(a).toFixed(0)+'%':'-'}`,`${L[3]}: ${g.length?mean(g).toFixed(1):'-'}`,`${L[4]}: ${pr.slice(0,6).map(p=>p[0]+'>'+p[1]+' x'+p[2]).join(', ')||'-'}`].join('\n');
let b=$('pgt2');if(!b){b=document.createElement('textarea');b.id='pgt2';b.readOnly=true;b.rows=6;$('pg').appendChild(b)}b.value=t;b.select();try{navigator.clipboard.writeText(t).catch(()=>{})}catch(e){}}$('md').onchange=modeUI;$('bpg').onclick=showProg;
function spec(){const now=ac?ac.currentTime:0,s=sh();let h=`<rect class="pb" x="${-num('bw')/2}" y="2" width="${num('bw')}" height="20"/><line x1="0" x2="0" y1="0" y2="24"/>`;
sgl.forEach(([o,f,e])=>{const x=f-s;if(e>now&&x>-600&&x<600)h+=`<circle cx="${x}" cy="12" r="9"/>`});$('sp').innerHTML=h}
$('shf').oninput=()=>{$('shv').textContent=sh()+' Hz';if(ac){const t=ac.currentTime;sgl.forEach(([o,f])=>o.frequency.setTargetAtTime(fq(f),t,.02))}spec()};
$('shv').onclick=()=>{$('shf').value=0;$('shf').oninput()};setInterval(()=>{if(md()=='r')spec()},150);
addEventListener('keydown',e=>{if(md()=='r'&&(e.code=='ArrowLeft'||e.code=='ArrowRight')&&!/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)){e.preventDefault();$('shf').value=sh()+(e.code=='ArrowLeft'?-10:10);$('shf').oninput()}});
$('km').onchange=padL;

$('brev').onclick=reveal;$('bnew').onclick=newQso;$('bend').onclick=finish;
$('bshare').onclick=async()=>{const d={title:'RagChew+ Lab · LU6FHB',text:'RagChew+ Lab - LU6FHB',url:location.href};
try{if(navigator.share){await navigator.share(d);return}await navigator.clipboard.writeText(d.url);status(T('link'))}catch(e){status(T('nolink'))}};
applyLang();
addEventListener('error',e=>{try{status('⚠ '+(e.message||'error'));line('mu','⚠',(e.message||'')+' ('+String(e.filename||'').split('/').pop()+':'+e.lineno+')')}catch(_){}});
