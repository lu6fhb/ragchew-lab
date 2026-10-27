// ---- Modo realista: filtro CW, ruido, QSB, QRM, pileup y errores
const md=()=>$('md').value,sh=()=>+$('shf').value||0,fq=f=>Math.max(50,num('tone')+f-sh()),modeUI=()=>{$('rp').hidden=md()!='r';$('sh').hidden=md()!='r'};let bp,ng,rt=[],sgl=[];
const QR=['CQ CQ DE DL1ABC K','CQ TEST DE W1XYZ','QRZ? DE JA1QQ','CQ DX DE EA3GGG K','5NN TU DE OK1AB','VK2XX DE N4ZZ 599'],CALLS=['DL1ABC','JA1XYZ','OK1AB','SP9XX','K1ZZ','W3AB','VK2XX','EA3GGG','F5ABC','I2XYZ','PY2XX','ZS6AA'];
function chain(){audio();if(bp)return;bp=ac.createBiquadFilter();bp.type='bandpass';bp.connect(ac.destination);ng=ac.createGain();ng.gain.value=0;
const b=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
const s=ac.createBufferSource();s.buffer=b;s.loop=true;s.connect(ng).connect(bp);s.start()}
function sig(text,wpm,sty,f,amp,t0,qd,qs){const o=ac.createOscillator(),e=ac.createGain(),q=ac.createGain();
o.frequency.value=fq(f);e.gain.value=0;q.gain.value=1;o.connect(e);e.connect(q);q.connect(bp);
let t=t0;const el=enc(text,wpm,sty,num('fw')),tot=el.reduce((s,x)=>s+x[1],0);el.forEach(([on,d])=>{e.gain.setTargetAtTime(on?amp:0,t,.003);t+=d});e.gain.setTargetAtTime(0,t,.003);
for(let x=t0,mx=qd*45,s;qd>0&&x<t0+tot+qs;x+=s){s=Math.max(.3,Math.random()*qs);q.gain.setTargetAtTime(Math.pow(10,-(Math.pow(Math.random(),.6)*mx)/20),x,s*.4)}
o.start();o.stop(t+.3);rt.push(o);sgl.push([o,f,t+.3]);return t}
function playR(text,wpm,done){chain();const v=num('vol')/100,tn=num('tone'),qd=num('qsb')/100,qs=num('qr');bp.frequency.value=tn;bp.Q.value=tn/Math.max(50,num('bw'));ng.gain.value=num('nz')/100*.3;
const t0=ac.currentTime+.15,end=sig(text,wpm,sstyle,st?st.off:50,v,t0,qd,qs);
for(let i=0;i<num('qrm');i++)sig(pick(QR),10+Math.random()*14,pick(['i','b','s']),(Math.random()<.5?-1:1)*(120+Math.random()*350),v*.7,t0+Math.random()*3,qd,qs*1.3);
playT=setTimeout(done,(end-ac.currentTime)*1000+150)}
function pileBG(n){chain();const v=num('vol')/100,t0=ac.currentTime+.4,used=[st?st.off:0];for(let i=0;i<n;i++){const c=pick(CALLS);let o,k=0;do o=Math.round(Math.random()*800-400);while(k++<30&&used.some(u=>Math.abs(u-o)<70));used.push(o);sig(c+' '+c,12+Math.random()*14,pick(['i','b','s']),o,v*(.5+Math.random()*.5),t0+Math.random()*1.5,num('qsb')/100,num('qr')*(.7+Math.random()*.6))}}
const mut=c=>{const i=Math.random()*c.length|0,a='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';let x;do x=a[Math.random()*36|0];while(x==c[i]);return c.slice(0,i)+x+c.slice(i+1)},say2=x=>({t:(st.last=x),done:false});
// Modo realista: la estación puede perder PARTE de lo que dijiste (QSB) y pide justo eso, en vez de repetir todo
function realResp(t){const e=num('err')/100,U=t.toUpperCase();
if(st.fx&&/(\bNO\b|\bAGN\b|\bCALL\b|\?)/.test(U)){st.fx=0;const c=st.uc||call();return say2(`R R ${c} ${c} ${eot()}`)}
const snap=JSON.parse(JSON.stringify({s:st.s,ct:st.ct,tp:st.tp,told:st.told,asked:st.asked,u:st.u,pending:st.pending,hist:st.hist,last:st.last,slow:st.slow,uc:st.uc,said:st.said}));
const r=respond(t);if(!r||r.done||st.ty=='x')return r;
if(st.s=='RPT'&&!st.fx&&!st.fx2&&r.t.includes('RST')&&Math.random()<e){st.fx=1;st.fx2=1;const cu=st.uc||call();r.t=r.t.split(cu).join(mut(cu));st.last=r.t;return r}
const nw=['qth','name','rig','ant','wx','job'].filter(k=>st.u[k]&&st.u[k]!==snap.u[k]);
if(nw.length&&st.turn-(st.lastLoss||-9)>=3&&Math.random()<e){const k=pick(nw),after={...st.u};Object.assign(st,snap);const keep={...snap.u};for(const x in after)if(after[x]!==snap.u[x]&&x!==k)keep[x]=after[x];
st.u=keep;st.pending=k;st.asked[k]=1;st.lastLoss=st.turn;const kw={name:li?'NAME':'NOMBRE',qth:'QTH',rig:'RIG',ant:'ANT',wx:li?'WX':'CLIMA',job:li?'JOB':'TRABAJO'}[k];
return say2(`${pick(['R R','R'])} ${pick(['PSE','PSE UR'])} ${kw} AGN? ${eot()}`)}
return r}
function play(text,wpm,done){audio();osc.frequency.value=num('tone')+50;const v=num('vol')/100;let t=ac.currentTime+0.1;
enc(text,wpm,sstyle,num('fw')).forEach(([on,d])=>{g.gain.setTargetAtTime(on?v:0,t,0.003);t+=d});g.gain.setTargetAtTime(0,t,0.003);
playT=setTimeout(()=>{osc.frequency.value=num('tone');done()},(t-ac.currentTime)*1000+150)}
