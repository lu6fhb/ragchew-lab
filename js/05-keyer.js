// ---- Keyer: iámbico A/B, bug y recto + decodificador adaptativo
const K={en:0,p:{'.':0,'-':0},mem:{'.':0,'-':0},ph:'idle',cur:null,last:null,until:0,sym:'',lastEnd:null,pw:0,mt:0,ue:80,lg:[],wg:[],bad:0,dt:[],dh:[]};
const mode=()=>$('km').value,opp=x=>x=='.'?'-':'.',wants=x=>K.p[x]||K.mem[x],dit=()=>mode()=='s'?K.ue:1.2/num('wpm')*1000;
function manual(d){const now=performance.now();if(d){if(K.mt)return;audio();K.mt=now;note(now);gate(1)}
else{if(!K.mt)return;const du=now-K.mt,dah=du>2*dit();K.mt=0;gate(0);(dah?K.dh:K.dt).push(du);K.sym+=dah?'-':'.';K.last=dah?'-':'.';K.lastEnd=now;
if(mode()=='s')K.ue=Math.min(240,Math.max(30,dah?.8*K.ue+.2*du/3:.7*K.ue+.3*du))}}
function press(x,d){const el=$(x=='.'?'pd':'pa'),m=mode();
if(!K.en){K.p={'.':0,'-':0};if(K.mt)manual(0);el.classList.remove('on');return}
el.classList.toggle('on',!!d);if(m=='s'||(m=='g'&&x=='-'))return manual(d);
K.p[x]=d?1:0;if(d){K.mem[x]=1;audio()}else if(m=='a'&&K.ph!='idle'&&x!=K.cur)K.mem[x]=0}
function emit(){const c=/^\.{6,}$/.test(K.sym)?'<ERR>':(REV[K.sym]||'¿');if(c=='¿')K.bad++;if(c=='<ERR>')K.cor=(K.cor||0)+1;K.sym='';K.pw=1;onChar(c)}
function note(now){if(K.lastEnd==null)return;const r=(now-K.lastEnd)/dit();if(r>=2){if(K.sym)emit();if(r>=5){if(K.pw){K.pw=0;onWord()}K.wg.push(r)}else K.lg.push(r)}}
function start(x,now){note(now);K.mem[x]=0;K.cur=x;K.ph='on';K.until=now+dit()*(x=='.'?1:3);gate(1)}
function tick(){const now=performance.now();
if(K.ph!='idle'){const o=opp(K.cur);if(K.p[o]&&mode()=='b')K.mem[o]=1;
if(now>=K.until){if(K.ph=='on'){gate(0);K.sym+=K.cur;K.last=K.cur;K.lastEnd=now;K.ph='gap';K.until=now+dit()}
else if(K.en&&K.mem[o])start(o,now);else if(K.en&&(K.mem[K.cur]||K.p[K.cur]))start(K.cur,now);else K.ph='idle'}return}
if(K.en&&(wants('.')||wants('-'))){start(wants('.')&&wants('-')?(K.last=='.'?'-':'.'):wants('.')?'.':'-',now);return}
if(K.lastEnd!=null&&!K.mt){const r=(now-K.lastEnd)/dit();if(K.sym&&r>=2)emit();if(K.pw&&r>=5){K.pw=0;onWord()}}}
setInterval(tick,2);
function newTurn(){K.sym='';K.lastEnd=null;K.pw=0;K.mt=0;K.ue=1.2/num('wpm')*1000;K.p={'.':0,'-':0};K.mem={'.':0,'-':0};K.en=1}
const sw=x=>$('swap').checked?opp(x):x,kp=(x,d)=>press(mode()=='s'?x:sw(x),d);
const pad=(el,x)=>{el.addEventListener('pointerdown',e=>{if(e.pointerType=='mouse'&&mp())return;e.preventDefault();el.setPointerCapture(e.pointerId);kp(x,1)});['pointerup','pointercancel'].forEach(t=>el.addEventListener(t,e=>{if(e.pointerType=='mouse'&&mp())return;kp(x,0)}))};
pad($('pd'),'.');pad($('pa'),'-');
let KEYS={d:'z',a:'x'},capK=null;try{Object.assign(KEYS,JSON.parse(localStorage.getItem('cwb_keys')||'{}'))}catch(e){}
const shk=k=>k==' '?'Space':k.length==1?k.toUpperCase():k,pk=e=>{const k=(e.key||'').toLowerCase();return k==KEYS.d?'.':k==KEYS.a?'-':(k==' '&&mode()=='s')?'.':null};
function kl(){$('kd').textContent=capK=='d'?T('kcap'):T('kdt')+': '+shk(KEYS.d);$('ka').textContent=capK=='a'?T('kcap'):T('kat')+': '+shk(KEYS.a)}
addEventListener('keydown',e=>{if(!capK)return;e.preventDefault();e.stopPropagation();const k=(e.key||'').toLowerCase();
if(k=='escape'){capK=null;return kl()}if([' ','tab','enter','shift','control','alt','meta','capslock'].includes(k)||k==KEYS[capK=='d'?'a':'d']){status(T('kbad'));return}
KEYS[capK]=k;capK=null;try{localStorage.setItem('cwb_keys',JSON.stringify(KEYS))}catch(e){}kl();padL()},true);
addEventListener('keydown',e=>{if(capK||$('dlg').open)return;const x=pk(e);if(!x||(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)&&e.target.type!='checkbox'))return;e.preventDefault();if(!e.repeat)kp(x,1)});
addEventListener('keyup',e=>{if(capK)return;const x=pk(e);if(x)kp(x,0)});
addEventListener('blur',()=>{K.p={'.':0,'-':0};K.mem={'.':0,'-':0};if(K.mt)manual(0)});
